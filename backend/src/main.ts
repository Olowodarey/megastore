import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const webOrigin = process.env.WEB_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin: webOrigin.split(',').map((s) => s.trim()),
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api/v1`);

  // Keeps the Postgres connection pool warm so the first request after a
  // few idle minutes doesn't pay a multi-second reconnect cost.
  const prisma = app.get(PrismaService);
  setInterval(() => {
    prisma.$queryRaw`SELECT 1`.catch(() => {
      /* transient errors here are harmless — the next real request will reconnect */
    });
  }, 4 * 60 * 1000);
}
bootstrap();
