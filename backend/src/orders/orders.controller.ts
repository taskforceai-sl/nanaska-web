import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** POST /orders – create a new order (authenticated) */
  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req) {
    // Ensure the order is created for the authenticated user
    dto.userId = req.user.userId;
    return this.ordersService.create(dto);
  }

  /** GET /orders/my – list current user's orders */
  @Get('my')
  myOrders(@Request() req) {
    return this.ordersService.findByUser(req.user.userId);
  }

  /** GET /orders/:id – get a specific order (owner only) */
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user.userId);
  }
}
