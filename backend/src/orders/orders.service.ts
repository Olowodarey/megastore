import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, items: CreateOrderItem[]) {
    // Fetch products to get current prices
    const products = await this.prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
      return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
    });

    const total = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    return this.prisma.order.create({
      data: {
        userId,
        total,
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, thumbnail: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, title: true, thumbnail: true, price: true, category: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();
    return order;
  }
}
