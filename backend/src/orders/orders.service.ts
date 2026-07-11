import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string;
    amount: number;
    currency: string;
    reference: string;
  };
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

  async verifyPayment(userId: string, orderId: string, reference: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();

    if (order.paymentStatus === 'PAID') {
      return this.findOne(userId, orderId);
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new BadRequestException('Payment verification is not configured');
    }

    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const body = (await res.json()) as PaystackVerifyResponse;

    const paidKobo = body.data?.amount ?? 0;
    const expectedKobo = Math.round(order.total * 100);
    const verified = res.ok && body.status && body.data?.status === 'success' && paidKobo === expectedKobo;

    if (!verified) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED', paymentReference: reference },
      });
      throw new BadRequestException(body.message || 'Payment verification failed');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        paymentReference: reference,
        paidAt: new Date(),
        status: 'PROCESSING',
      },
    });

    return this.findOne(userId, orderId);
  }
}
