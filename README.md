# MegaMart

A full-stack e-commerce platform built as a portfolio project. Features a NestJS REST API with PostgreSQL, a Next.js 15 storefront, JWT authentication, and a complete order flow from browsing to checkout.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 18, TypeScript, Tailwind CSS |
| State | Redux Toolkit, RTK Query |
| Backend | NestJS, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT (bcryptjs + Passport) |

---

## Features

- **Product catalogue** — 69 products across 6 categories seeded from Platzi Fake Store and DummyJSON APIs
- **Search** — full-text search across product titles and descriptions
- **Category pages** — Electronics, Smartphones, Furniture, Shoes, Miscellaneous
- **Product detail** — image gallery with clickable thumbnails, ratings, stock, discount pricing
- **Shopping cart** — add/remove/adjust quantity, persisted to localStorage
- **Auth** — register, login, JWT session persisted across page refreshes
- **Orders** — checkout places a real order via the API; order history with visual tracking progress bar (Pending → Processing → Shipped → Delivered)
- **Hero banner** — auto-playing carousel of top-rated products with themed slides
- **Responsive** — fully mobile and desktop compatible

---

## Project Structure

```
megastore/
├── apps/
│   ├── api/                  # NestJS backend — port 4000
│   │   ├── src/
│   │   │   ├── auth/         # JWT register / login / me
│   │   │   ├── orders/       # Create & retrieve orders
│   │   │   ├── products/     # List, search, category, detail
│   │   │   └── prisma/       # Database service
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts       # Seeds from Platzi + DummyJSON
│   └── web/                  # Next.js 15 frontend — port 3000
│       ├── app/
│       │   ├── _components/  # Header, Footer, Cards, Banner
│       │   ├── _lib/         # Redux slices (cart, auth)
│       │   ├── _services/    # RTK Query API endpoints
│       │   ├── account/      # Order history & detail
│       │   ├── category/     # Category listing
│       │   ├── products/     # Product detail
│       │   ├── cart/         # Cart & checkout
│       │   ├── login/
│       │   ├── register/
│       │   └── search/
│       └── redux/            # Store configuration
└── packages/
    └── shared/               # Shared TypeScript types
```

---

## Getting Started

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL

```bash
# Install dependencies
pnpm install

# Set up environment
cp apps/api/.env.example apps/api/.env
# Fill in DATABASE_URL and JWT_SECRET

# Run migrations and seed
cd apps/api
npx prisma migrate dev
npm run db:seed

# Start API (Terminal 1)
npm run start:dev

# Start frontend (Terminal 2)
cd ../web && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Reference

```
POST  /api/v1/auth/register
POST  /api/v1/auth/login
GET   /api/v1/auth/me                          (protected)

GET   /api/v1/products                         ?search= ?category= ?page= ?pageSize=
GET   /api/v1/products/categories
GET   /api/v1/products/category/:name
GET   /api/v1/products/:id

GET   /api/v1/orders                           (protected)
POST  /api/v1/orders                           (protected)
GET   /api/v1/orders/:id                       (protected)
```

---

## Author

Built by **Darey Olowo** — [08142293610](tel:08142293610)
