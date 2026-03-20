import { IsString, IsOptional, IsIn, IsInt, Min } from 'class-validator';

export class CreatePaymentDto {
	/** The course combination ID the user wants to pay for */
	@IsString()
	combinationId: string;

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
