import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class WebhookDto {
  @IsString()
  merchant_id: string;

  @IsString()
  order_id: string;

  @IsNumberString()
  payhere_amount: string;

  @IsString()
  payhere_currency: string;

  @IsNumberString()
  status_code: string;

  @IsString()
  md5sig: string;

  @IsString()
  @IsOptional()
  payment_id?: string;
}
