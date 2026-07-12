import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

function fetchJson(body: unknown, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(body) } as Response);
}

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    product: { findMany: jest.Mock };
    order: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    prisma = {
      product: { findMany: jest.fn() },
      order: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    };
    service = new OrdersService(prisma as unknown as PrismaService);
    fetchSpy = jest.spyOn(global, 'fetch' as never);
    process.env.PAYSTACK_SECRET_KEY = 'sk_test_xxx';
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe('create', () => {
    it('computes the total from current product prices, not client input', async () => {
      prisma.product.findMany.mockResolvedValue([
        { id: 1, price: 10 },
        { id: 2, price: 25 },
      ]);
      prisma.order.create.mockImplementation(({ data }) => Promise.resolve({ id: 'order-1', ...data }));

      const order = await service.create('user-1', [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ]);

      expect(order.total).toBe(45); // 10*2 + 25*1
    });

    it('throws NotFoundException when a product no longer exists', async () => {
      prisma.product.findMany.mockResolvedValue([{ id: 1, price: 10 }]);

      await expect(
        service.create('user-1', [
          { productId: 1, quantity: 1 },
          { productId: 999, quantity: 1 },
        ]),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException for a missing order', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it("throws ForbiddenException when the order belongs to someone else", async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'someone-else' });

      await expect(service.findOne('user-1', 'order-1')).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('initializePayment', () => {
    it('converts the USD total to NGN kobo using the live rate', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'user-1', total: 100 });
      prisma.order.update.mockResolvedValue({});
      fetchSpy.mockReturnValue(fetchJson({ rates: { NGN: 1500 } }));

      const result = await service.initializePayment('user-1', 'order-1');

      expect(result).toEqual({ amountKobo: 100 * 1500 * 100, rate: 1500, currency: 'NGN' });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { expectedPaymentKobo: result.amountKobo },
      });
    });

    it('falls back to the fixed rate when the exchange-rate API is unreachable', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', userId: 'user-1', total: 50 });
      prisma.order.update.mockResolvedValue({});
      fetchSpy.mockRejectedValue(new Error('network down'));

      const result = await service.initializePayment('user-1', 'order-1');

      expect(result.rate).toBe(Number(process.env.USD_TO_NGN_FALLBACK_RATE ?? '1600'));
    });
  });

  describe('verifyPayment', () => {
    const baseOrder = { id: 'order-1', userId: 'user-1', total: 10, paymentStatus: 'PENDING', expectedPaymentKobo: 15_000_00 };

    it('marks the order PAID when Paystack confirms a matching successful payment', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrder);
      prisma.order.update.mockResolvedValue({});
      fetchSpy.mockReturnValue(
        fetchJson({ status: true, message: 'ok', data: { status: 'success', amount: 15_000_00, currency: 'NGN', reference: 'ref-1' } }),
      );

      await service.verifyPayment('user-1', 'order-1', 'ref-1');

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: expect.objectContaining({ paymentStatus: 'PAID', paymentReference: 'ref-1', status: 'PROCESSING' }),
      });
    });

    it('marks the order FAILED and throws when the paid amount does not match', async () => {
      prisma.order.findUnique.mockResolvedValue(baseOrder);
      prisma.order.update.mockResolvedValue({});
      fetchSpy.mockReturnValue(
        fetchJson({ status: true, message: 'ok', data: { status: 'success', amount: 1, currency: 'NGN', reference: 'ref-1' } }),
      );

      await expect(service.verifyPayment('user-1', 'order-1', 'ref-1')).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { paymentStatus: 'FAILED', paymentReference: 'ref-1' },
      });
    });

    it('is idempotent — an already-PAID order is returned without calling Paystack again', async () => {
      prisma.order.findUnique.mockResolvedValue({ ...baseOrder, paymentStatus: 'PAID' });

      await service.verifyPayment('user-1', 'order-1', 'ref-1');

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('throws when PAYSTACK_SECRET_KEY is not configured', async () => {
      delete process.env.PAYSTACK_SECRET_KEY;
      prisma.order.findUnique.mockResolvedValue(baseOrder);

      await expect(service.verifyPayment('user-1', 'order-1', 'ref-1')).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
