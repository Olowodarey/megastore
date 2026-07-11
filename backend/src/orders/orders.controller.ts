import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService, CreateOrderItem } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { IsArray, ValidateNested, IsInt, IsPositive } from 'class-validator';
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
}
