import { IsString, IsEmail, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class GuestPaymentDto {
	/** The course combination ID the guest wants to pay for */
	@IsString()
	combinationId: string;

	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	phone?: string;

	/** Payment currency – GBP for international, LKR for Sri Lanka */
	@IsOptional()
	@IsIn(['GBP', 'LKR'])
	currency?: string;

	/** Amount in the selected currency (required when currency is GBP) */
	@IsOptional()
	@IsInt()
	@Min(1)
	amount?: number;
}
