import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService, CreateOrderItem } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { IsArray, ValidateNested, IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  reference: string;
}

interface AuthRequest {
  user: { id: string; email: string };
}

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.orders.create(req.user.id, dto.items);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.orders.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.orders.findOne(req.user.id, id);
  }

  @Post(':id/payment-init')
  initializePayment(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.orders.initializePayment(req.user.id, id);
  }

  @Post(':id/verify-payment')
  verifyPayment(@Request() req: AuthRequest, @Param('id') id: string, @Body() dto: VerifyPaymentDto) {
    return this.orders.verifyPayment(req.user.id, id, dto.reference);
  }
}
