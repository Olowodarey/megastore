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

const FALLBACK_USD_TO_NGN_RATE = Number(process.env.USD_TO_NGN_FALLBACK_RATE ?? '1600');
const RATE_CACHE_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class OrdersService {
  private cachedRate: { value: number; fetchedAt: number } | null = null;

  constructor(private prisma: PrismaService) {}

  /** Live USD→NGN rate (cached for an hour), falling back to a fixed rate if the lookup fails. */
  private async getUsdToNgnRate(): Promise<number> {
    if (this.cachedRate && Date.now() - this.cachedRate.fetchedAt < RATE_CACHE_MS) {
      return this.cachedRate.value;
    }
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const body = (await res.json()) as { rates?: Record<string, number> };
      const rate = body.rates?.NGN;
      if (!rate) throw new Error('NGN rate missing from response');
      this.cachedRate = { value: rate, fetchedAt: Date.now() };
      return rate;
    } catch {
      return this.cachedRate?.value ?? FALLBACK_USD_TO_NGN_RATE;
    }
  }

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

  async initializePayment(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException();

    const rate = await this.getUsdToNgnRate();
    const amountKobo = Math.round(order.total * rate * 100);

    await this.prisma.order.update({
      where: { id: orderId },
      data: { expectedPaymentKobo: amountKobo },
    });

    return { amountKobo, rate, currency: 'NGN' };
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
    const expectedKobo = order.expectedPaymentKobo ?? Math.round(order.total * FALLBACK_USD_TO_NGN_RATE * 100);
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
