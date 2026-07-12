import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

function cleanImages(raw: string[]): string[] {
  return (raw ?? [])
    .flatMap((entry) => {
      if (!entry) return [];
      const s = entry.trim();
      if (s.startsWith('[') && s.endsWith(']')) {
        try {
          const parsed = JSON.parse(s);
          return Array.isArray(parsed) ? parsed : [s];
        } catch {
          return [s.replace(/^\["?/, '').replace(/"?\]$/, '')];
        }
      }
      return [s];
    })
    .filter((s) => s.startsWith('http'));
}

async function main() {
  console.log('→ Fetching Furniture products from Platzi (category id 3)…');
  const res = await fetch('https://api.escuelajs.co/api/v1/categories/3/products?offset=0&limit=50');
  const products = (await res.json()) as Array<{
    id: number;
    title: string;
    description: string;
    price: number;
    images: string[];
  }>;

  let seeded = 0;
  for (const p of products) {
    if (!p?.title || p.title.trim().length < 4) continue;
    const images = cleanImages(p.images);
    if (!images.length) continue;

    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        category: 'Furniture',
        thumbnail: images[0],
        images,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: Number(rand(5, 40).toFixed(2)),
        rating: Number(rand(3, 5).toFixed(1)),
        stock: randInt(10, 100),
        brand: null,
        category: 'Furniture',
        thumbnail: images[0],
        images,
      },
    });
    seeded++;
  }
  console.log(`✓ Upserted ${seeded} Furniture products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
