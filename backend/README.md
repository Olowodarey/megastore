# Megastore Backend API

NestJS backend API for the Megastore e-commerce platform.

## Tech Stack

- **NestJS** - Backend framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run Prisma migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

4. Seed the database (optional):

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run start:dev
```

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time (e.g., "7d")
- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `WEB_ORIGIN` - Frontend URL for CORS

## API Endpoints

Base URL: `/api/v1`

### Auth

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Products

- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID

### Orders

- `GET /orders` - Get user orders (authenticated)
- `POST /orders` - Create new order (authenticated)

## Deployment

This backend is configured for Railway deployment with the included `nixpacks.toml` file.
