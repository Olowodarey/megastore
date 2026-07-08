import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

async function main() {
  console.log('→ Fetching products from DummyJSON…');
  const res = await fetch('https://dummyjson.com/products?limit=100');
  if (!res.ok) throw new Error(`DummyJSON responded ${res.status}`);
  const data = (await res.json()) as DummyProductsResponse;
  console.log(`  got ${data.products.length} products`);

  console.log('→ Upserting into Postgres…');
  for (const p of data.products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand ?? null,
        category: p.category,
        thumbnail: p.thumbnail,
        images: p.images,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand ?? null,
        category: p.category,
        thumbnail: p.thumbnail,
        images: p.images,
      },
    });
  }
  console.log(`✓ Seeded ${data.products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
