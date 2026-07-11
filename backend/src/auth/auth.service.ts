import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed, name: dto.name },
    });

    return this.sign(user.id, user.email, user.name);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) {
      throw new UnauthorizedException('This account uses Google sign-in. Please continue with Google instead.');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.sign(user.id, user.email, user.name);
  }

  async loginWithGoogle(idToken: string) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('Google sign-in is not configured');
    }

    let payload: { sub: string; email?: string; email_verified?: boolean; name?: string };
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload() as typeof payload;
    } catch {
      throw new UnauthorizedException('Invalid Google credential');
    }

    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified');
    }

    let user = await this.prisma.user.findUnique({ where: { googleId: payload.sub } });

    if (!user) {
      const existingByEmail = await this.prisma.user.findUnique({ where: { email: payload.email } });
      if (existingByEmail) {
        // Email already verified by Google, so linking is safe.
        user = await this.prisma.user.update({
          where: { id: existingByEmail.id },
          data: { googleId: payload.sub },
        });
      } else {
        user = await this.prisma.user.create({
          data: { email: payload.email, googleId: payload.sub, name: payload.name },
        });
      }
    }

    return this.sign(user.id, user.email, user.name);
  }

  private sign(userId: string, email: string, name: string | null) {
    const token = this.jwt.sign({ sub: userId, email });
    return { token, user: { id: userId, email, name } };
  }
}
