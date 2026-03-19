import { IsString } from 'class-validator';

export class CreatePaymentDto {
  /** The course combination ID the user wants to pay for */
  @IsString()
  combinationId: string;
}
