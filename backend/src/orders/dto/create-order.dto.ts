import { IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  combinationId: string;

  // userId is injected by the controller from the authenticated JWT – not accepted from the client
  userId?: string;
}
