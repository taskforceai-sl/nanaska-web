import {
	Injectable,
	NotFoundException,
	BadRequestException,
	Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GuestPaymentDto } from './dto/guest-payment.dto';
import { WebhookDto } from './dto/webhook.dto';

/**
 * PaymentsService
 *
 * Implements a PayHere-compatible IPG flow:
 *   - /payments/create  → creates an Order, builds a signed checkout payload
 *   - /payments/webhook → verifies the IPG notification and grants course access
 *
 * Replace the PayHere-specific signature logic if using a different gateway.
 */
@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	constructor(private readonly prisma: PrismaService) { }

	// ──────────────────────────────────────────────────────────────────────────
	// POST /payments/create
	// ──────────────────────────────────────────────────────────────────────────
	async createPayment(userId: string, dto: CreatePaymentDto) {
		const [combo, user] = await Promise.all([
			this.prisma.courseCombination.findUnique({
				where: { id: dto.combinationId },
				include: { items: { include: { course: true } } },
			}),
			this.prisma.user.findUnique({ where: { id: userId } }),
		]);

		if (!combo) throw new NotFoundException(`Combination ${dto.combinationId} not found`);
		if (!user) throw new NotFoundException('User not found');

		// Create a PENDING order
		const order = await this.prisma.order.create({
			data: {
				userId,
				combinationId: combo.id,
				amount: combo.price,
				status: 'PENDING',
				ipgMerchantRef: this.generateMerchantRef(),
			},
		});

		const checkoutUrl = await this.callPayCorpCheckout(order.id, order.ipgMerchantRef!, combo.price, {
			name: user.name,
			email: user.email,
			phone: (user as any).phone ?? '',
		});

		return { orderId: order.id, paymentUrl: checkoutUrl };
	}

	// ──────────────────────────────────────────────────────────────────────────
	// POST /payments/guest-create
	// ──────────────────────────────────────────────────────────────────────────
	async createGuestPayment(dto: GuestPaymentDto) {
		const combo = await this.prisma.courseCombination.findUnique({
			where: { id: dto.combinationId },
			include: { items: { include: { course: true } } },
		});

		if (!combo) throw new NotFoundException(`Combination ${dto.combinationId} not found`);

		const fullName = [dto.firstName, dto.lastName].filter(Boolean).join(' ');
		const phone = dto.phone || '';

		// Create a PENDING order (no user account required)
		const order = await this.prisma.order.create({
			data: {
				combinationId: combo.id,
				amount: combo.price,
				status: 'PENDING',
				ipgMerchantRef: this.generateMerchantRef(),
				guestName: fullName,
				guestEmail: dto.email,
				guestPhone: phone || null,
			},
		});

		const checkoutUrl = await this.callPayCorpCheckout(order.id, order.ipgMerchantRef!, combo.price, {
			name: fullName,
			email: dto.email,
			phone,
		});

		return {
			orderId: order.id,
			paymentUrl: checkoutUrl,
		};
	}

	// ──────────────────────────────────────────────────────────────────────────
	// POST /payments/webhook
	// ──────────────────────────────────────────────────────────────────────────
	async handleWebhook(body: WebhookDto) {
		this.logger.log(`Webhook received: order_id=${body.order_id} status_code=${body.status_code}`);

		const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = body;

		// 1. Verify merchant identity
		if (merchant_id !== process.env.IPG_MERCHANT_ID) {
			this.logger.warn('Webhook: merchant_id mismatch');
			throw new BadRequestException('Invalid merchant');
		}

		// 2. Verify signature (PayHere format)
		const expectedSig = this.buildWebhookSignature(
			merchant_id,
			order_id,
			payhere_amount,
			payhere_currency,
			status_code,
		);
		if (expectedSig.toUpperCase() !== (md5sig || '').toUpperCase()) {
			this.logger.warn('Webhook: signature mismatch');
			throw new BadRequestException('Invalid signature');
		}

		// 3. Fetch and validate the order
		const order = await this.prisma.order.findUnique({
			where: { id: order_id },
			include: { combination: { include: { items: { include: { course: true } } } } },
		});
		if (!order) {
			this.logger.warn(`Webhook: order ${order_id} not found`);
			throw new NotFoundException('Order not found');
		}
		if (order.status === 'PAID') {
			// Idempotent – already processed
			return { message: 'Already processed' };
		}

		// 4. Verify amount (compare as integers to avoid floating-point issues)
		const receivedAmountLkr = Math.round(parseFloat(payhere_amount));
		if (receivedAmountLkr !== order.amount) {
			this.logger.warn(
				`Webhook: amount mismatch (got ${receivedAmountLkr}, expected ${order.amount})`,
			);
			throw new BadRequestException('Amount mismatch');
		}

		// 5. Process result based on status_code
		//    PayHere: 2 = SUCCESS, 0 = PENDING, -1 = CANCELLED, -2 = FAILED, -3 = CHARGEDBACK
		if (status_code === '2') {
			await this.prisma.order.update({
				where: { id: order_id },
				data: { status: 'PAID', ipgRef: body.payment_id ?? null },
			});

			// Grant access to each subject in the combination (only for registered users)
			if (order.userId) {
				const courseIds = order.combination.items.map((i) => i.courseId);
				for (const courseId of courseIds) {
					await this.prisma.userCourse.upsert({
						where: { userId_courseId: { userId: order.userId, courseId } },
						update: {},
						create: { userId: order.userId, courseId, orderId: order.id },
					});
				}
				this.logger.log(`Order ${order_id} marked PAID, ${courseIds.length} course(s) granted to user ${order.userId}`);
			} else {
				this.logger.log(`Order ${order_id} marked PAID (guest order – no course access grants needed)`);
			}
			return { message: 'Payment successful' };
		}

		if (status_code === '-1' || status_code === '-2' || status_code === '-3') {
			await this.prisma.order.update({
				where: { id: order_id },
				data: { status: 'FAILED' },
			});
			this.logger.log(`Order ${order_id} marked FAILED (status_code=${status_code})`);
			return { message: 'Payment failed' };
		}

		// status_code 0 = still pending
		return { message: 'Pending' };
	}

	// ──────────────────────────────────────────────────────────────────────────
	// Private helpers
	// ──────────────────────────────────────────────────────────────────────────

	private generateMerchantRef(): string {
		return `NAN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
	}

	/**
	 * Step 1 of 2: PAYMENT_INIT
	 * Calls PayCorp's hosted-page API server-side and returns the paymentPageUrl
	 * that the browser should be redirected to.
	 *
	 * Auth: client_id + auth_token headers + HMAC-SHA256(rawBody, hmacSecret) as hash header.
	 * Ref: Paycenter Web 4.0 Technical Guide §6.5–6.7
	 */
	private async callPayCorpCheckout(
		orderId: string,
		merchantRef: string,
		amountLkr: number,
		user: { name: string; email: string; phone?: string },
	): Promise<string> {
		const clientId = parseInt(process.env.IPG_MERCHANT_ID!, 10);
		const authToken = process.env.IPG_AUTH_TOKEN!;
		const hmacSecret = process.env.IPG_MERCHANT_SECRET!;
		const currency = process.env.IPG_CURRENCY || 'LKR';
		const apiUrl = process.env.IPG_BASE_URL!;

		const requestBody = {
			clientId,
			type: 'PURCHASE',
			amount: {
				paymentAmount: amountLkr,
				currency,
			},
			redirect: {
				returnUrl: process.env.IPG_RETURN_URL!,
				returnMethod: 'GET',
			},
			clientRef: merchantRef,
			comment: `Nanaska CIMA – ${merchantRef}`,
		};

		const bodyJson = JSON.stringify(requestBody);

		// HMAC-SHA256 of the exact JSON body string, base64-encoded
		const hash = crypto
			.createHmac('sha256', hmacSecret)
			.update(bodyJson)
			.digest('base64');

		this.logger.log(
			`PayCorp PAYMENT_INIT → ${apiUrl}\n` +
			`  Headers: client_id=${clientId}, auth_token=*****, hash=${hash}\n` +
			`  Body: ${bodyJson}`,
		);

		const res = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'client_id': String(clientId),
				'auth_token': authToken,
				'hash': hash,
			},
			body: bodyJson,
		});

		const data: any = await res.json().catch(() => ({}));
		this.logger.log(`PayCorp PAYMENT_INIT response (${res.status}): ${JSON.stringify(data)}`);

		if (!res.ok) {
			throw new BadRequestException(
				data?.message || data?.error || `PayCorp error ${res.status}`,
			);
		}

		// Per §6.7 the URL is returned as paymentPageUrl
		const paymentPageUrl: string =
			data?.paymentPageUrl ??
			data?.redirectUrl ??
			data?.checkoutUrl ??
			data?.data?.paymentPageUrl;

		if (!paymentPageUrl) {
			this.logger.error(`PayCorp PAYMENT_INIT missing paymentPageUrl: ${JSON.stringify(data)}`);
			throw new BadRequestException('PayCorp did not return a payment page URL');
		}

		// Store the reqid on the order so PAYMENT_COMPLETE can reference it
		if (data?.reqid) {
			await this.prisma.order.updateMany({
				where: { ipgMerchantRef: merchantRef },
				data: { ipgRef: String(data.reqid) },
			});
		}

		return paymentPageUrl;
	}

	/**
	 * Step 2 of 2: PAYMENT_COMPLETE
	 * Called when PayCorp redirects the browser back to our returnUrl with ?reqid=xxx.
	 * Submits the reqid to PayCorp to finalise the transaction and updates the order.
	 * Returns { success, redirectTo } so the controller can redirect the browser.
	 * Ref: Paycenter Web 4.0 §6.9
	 */
	async completePayment(reqid: string): Promise<{ success: boolean; redirectTo: string }> {
		const clientId = parseInt(process.env.IPG_MERCHANT_ID!, 10);
		const authToken = process.env.IPG_AUTH_TOKEN!;
		const hmacSecret = process.env.IPG_MERCHANT_SECRET!;
		const apiUrl = process.env.IPG_BASE_URL!;

		const requestBody = { clientId, reqid };
		const bodyJson = JSON.stringify(requestBody);

		const hash = crypto
			.createHmac('sha256', hmacSecret)
			.update(bodyJson)
			.digest('base64');

		this.logger.log(`PayCorp PAYMENT_COMPLETE reqid=${reqid}`);

		const res = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'client_id': String(clientId),
				'auth_token': authToken,
				'hash': hash,
			},
			body: bodyJson,
		});

		const data: any = await res.json().catch(() => ({}));
		this.logger.log(`PayCorp PAYMENT_COMPLETE response (${res.status}): ${JSON.stringify(data)}`);

		const responseCode: string = data?.responseCode ?? data?.data?.responseCode ?? '';
		const txnRef: string = String(data?.txnReference ?? data?.data?.txnReference ?? '');
		const success = res.ok && responseCode === '00';

		// Find and update the order
		const order = await this.prisma.order.findFirst({
			where: { ipgRef: reqid },
			include: { combination: { include: { items: { include: { course: true } } } } },
		});

		if (order) {
			await this.prisma.order.update({
				where: { id: order.id },
				data: { status: success ? 'PAID' : 'FAILED' },
			});

			if (success && order.userId) {
				const courseIds = order.combination.items.map((i) => i.courseId);
				for (const courseId of courseIds) {
					await this.prisma.userCourse.upsert({
						where: { userId_courseId: { userId: order.userId, courseId } },
						update: {},
						create: { userId: order.userId, courseId, orderId: order.id },
					});
				}
				this.logger.log(`Order ${order.id} PAID – ${courseIds.length} course(s) granted to user ${order.userId}`);
			}
		} else {
			this.logger.warn(`PAYMENT_COMPLETE: no order found for reqid=${reqid}`);
		}

		const frontendBase = process.env.FRONTEND_URL || 'https://nanaska.com';
		const redirectTo = success
			? `${frontendBase}/payment-success?ref=${txnRef}`
			: `${frontendBase}/payment-cancel?reason=${encodeURIComponent(data?.responseText ?? 'Payment failed')}`;

		return { success, redirectTo };
	}

	/**
	 * Builds the expected MD5 signature for an incoming webhook notification.
	 * PayHere format:
	 *   MD5( merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase() ).toUpperCase()
	 */
	private buildWebhookSignature(
		merchantId: string,
		orderId: string,
		amount: string,
		currency: string,
		statusCode: string,
	): string {
		const merchantSecret = process.env.IPG_MERCHANT_SECRET!;
		const hashedSecret = crypto
			.createHash('md5')
			.update(merchantSecret)
			.digest('hex')
			.toUpperCase();

		return crypto
			.createHash('md5')
			.update(`${merchantId}${orderId}${amount}${currency}${statusCode}${hashedSecret}`)
			.digest('hex')
			.toUpperCase();
	}
}
