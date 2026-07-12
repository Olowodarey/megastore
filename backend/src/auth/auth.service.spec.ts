import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
  };
  let jwt: { sign: jest.Mock };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };
    jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
    service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService);
    mockVerifyIdToken.mockReset();
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
  });

  describe('register', () => {
    it('hashes the password and creates a new user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockImplementation(({ data }) =>
        Promise.resolve({ id: 'user-1', email: data.email, name: data.name ?? null, password: data.password }),
      );

      const result = await service.register({ email: 'new@example.com', password: 'Str0ng!Pass', name: 'New User' });

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      const createdData = prisma.user.create.mock.calls[0][0].data;
      expect(createdData.password).not.toBe('Str0ng!Pass');
      await expect(bcrypt.compare('Str0ng!Pass', createdData.password)).resolves.toBe(true);
      expect(result).toEqual({
        token: 'signed.jwt.token',
        user: { id: 'user-1', email: 'new@example.com', name: 'New User' },
      });
    });

    it('rejects registration when the email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.register({ email: 'taken@example.com', password: 'Str0ng!Pass' })).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('signs in with correct credentials', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'user@example.com', name: null, password: hashed });

      const result = await service.login({ email: 'user@example.com', password: 'correct-password' });

      expect(result.token).toBe('signed.jwt.token');
      expect(result.user).toEqual({ id: 'user-1', email: 'user@example.com', name: null });
    });

    it('rejects an unknown email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'ghost@example.com', password: 'whatever' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a wrong password', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'user@example.com', name: null, password: hashed });

      await expect(service.login({ email: 'user@example.com', password: 'wrong-password' })).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects login for a Google-only account with no password set', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'oauth@example.com', name: null, password: null });

      await expect(service.login({ email: 'oauth@example.com', password: 'anything' })).rejects.toThrow(
        /Google sign-in/,
      );
    });
  });

  describe('loginWithGoogle', () => {
    it('rejects when GOOGLE_CLIENT_ID is not configured', async () => {
      delete process.env.GOOGLE_CLIENT_ID;

      await expect(service.loginWithGoogle('some-id-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects an invalid Google credential', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('bad token'));

      await expect(service.loginWithGoogle('bad-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('rejects when the Google email is not verified', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'g-1', email: 'unverified@example.com', email_verified: false }),
      });

      await expect(service.loginWithGoogle('token')).rejects.toThrow(/not verified/);
    });

    it('creates a new user on first Google sign-in', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'g-1', email: 'brandnew@example.com', email_verified: true, name: 'Brand New' }),
      });
      prisma.user.findUnique.mockResolvedValueOnce(null); // no existing googleId match
      prisma.user.findUnique.mockResolvedValueOnce(null); // no existing email match
      prisma.user.create.mockResolvedValue({ id: 'user-2', email: 'brandnew@example.com', name: 'Brand New' });

      const result = await service.loginWithGoogle('token');

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'brandnew@example.com', googleId: 'g-1', name: 'Brand New' },
      });
      expect(result.user).toEqual({ id: 'user-2', email: 'brandnew@example.com', name: 'Brand New' });
    });

    it('links an existing email/password account to Google instead of duplicating it', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'g-2', email: 'existing@example.com', email_verified: true, name: 'Existing' }),
      });
      prisma.user.findUnique.mockResolvedValueOnce(null); // no googleId match yet
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-3', email: 'existing@example.com', name: 'Existing' });
      prisma.user.update.mockResolvedValue({ id: 'user-3', email: 'existing@example.com', name: 'Existing' });

      const result = await service.loginWithGoogle('token');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-3' },
        data: { googleId: 'g-2' },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.id).toBe('user-3');
    });

    it('signs in directly when the googleId already matches an account', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ sub: 'g-3', email: 'returning@example.com', email_verified: true, name: 'Returning' }),
      });
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'user-4', email: 'returning@example.com', name: 'Returning' });

      const result = await service.loginWithGoogle('token');

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(result.user.id).toBe('user-4');
    });
  });
});
