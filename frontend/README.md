# Megastore Frontend

Next.js frontend for the Megastore e-commerce platform.

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **RTK Query** - API integration

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

3. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL

## Features

- Product browsing and search
- Shopping cart management
- User authentication
- Order management
- Responsive design
- Dark mode support

## Deployment

This frontend is configured for Vercel deployment.
