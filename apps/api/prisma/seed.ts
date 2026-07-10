import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Platzi Fake Store ────────────────────────────────────────────────────────

const PLATZI_BASE = 'https://api.escuelajs.co/api/v1';

const ALLOWED_CATEGORIES: Record<string, string> = {
  clothes: 'Clothes',
  clothing: 'Clothes',
  electronics: 'Electronics',
  furniture: 'Furniture',
  shoes: 'Shoes',
  miscellaneous: 'Miscellaneous',
};

interface PlatziCategory {
  id: number;
  name: string;
  image: string;
}

interface PlatziProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: PlatziCategory;
  images: string[];
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));

function fabricate() {
  return {
    discountPercentage: Number(rand(5, 40).toFixed(2)),
    rating: Number(rand(3, 5).toFixed(1)),
    stock: randInt(10, 100),
  };
}

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

async function fetchPlatziPage(offset: number, limit: number): Promise<PlatziProduct[]> {
  const url = `${PLATZI_BASE}/products?offset=${offset}&limit=${limit}`;
  let lastError: unknown;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Platzi API responded ${res.status}`);
      return (await res.json()) as PlatziProduct[];
    } catch (err) {
      lastError = err;
      console.warn(`  attempt ${attempt} failed: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, attempt * 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function seedPlatziProducts() {
  console.log('\n→ Fetching products from Platzi Fake Store…');
  const raw: PlatziProduct[] = [];
  const pageSize = 40;
  for (let offset = 0; offset < 200; offset += pageSize) {
    const page = await fetchPlatziPage(offset, pageSize);
    console.log(`  page @offset=${offset}: got ${page.length}`);
    raw.push(...page);
    if (page.length < pageSize) break;
  }

  const placeholderTitle =
    /^(top|test|prod|new product|updated?|probe|trial|hp)\s*\d*\.?\d*$/i;
  const products = raw.filter((p) => {
    if (!p?.title || !p?.category?.name || !p?.images?.length) return false;
    if (placeholderTitle.test(p.title.trim())) return false;
    if (p.title.trim().length < 4) return false;
    const catKey = p.category.name.trim().toLowerCase();
    return catKey in ALLOWED_CATEGORIES;
  });
  console.log(`  got ${products.length} usable products (of ${raw.length})`);

  for (const p of products) {
    const images = cleanImages(p.images);
    if (!images.length) continue;
    const fab = fabricate();
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: fab.discountPercentage,
        rating: fab.rating,
        stock: fab.stock,
        brand: null,
        category: ALLOWED_CATEGORIES[p.category.name.trim().toLowerCase()],
        thumbnail: images[0],
        images,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: fab.discountPercentage,
        rating: fab.rating,
        stock: fab.stock,
        brand: null,
        category: ALLOWED_CATEGORIES[p.category.name.trim().toLowerCase()],
        thumbnail: images[0],
        images,
      },
    });
  }
  console.log(`  ✓ Platzi products seeded.`);
}

// ─── DummyJSON Smartphones ────────────────────────────────────────────────────

// DummyJSON IDs are offset by 5000 to avoid any collision with Platzi IDs.
const DUMMYJSON_ID_OFFSET = 5000;

interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
}

async function fetchDummyJsonSmartphones(): Promise<DummyJsonProduct[]> {
  const url = 'https://dummyjson.com/products/category/smartphones?limit=100';
  console.log('\n→ Fetching smartphones from DummyJSON…');
  let lastError: unknown;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60_000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`DummyJSON responded ${res.status}`);
      const data = (await res.json()) as DummyJsonResponse;
      console.log(`  got ${data.products.length} smartphones`);
      return data.products;
    } catch (err) {
      lastError = err;
      console.warn(`  attempt ${attempt} failed: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, attempt * 2000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function seedSmartphones() {
  const phones = await fetchDummyJsonSmartphones();

  for (const p of phones) {
    const id = p.id + DUMMYJSON_ID_OFFSET;
    const images = (p.images ?? []).filter((s) => s.startsWith('http'));
    const thumbnail = p.thumbnail?.startsWith('http') ? p.thumbnail : images[0];
    if (!thumbnail) continue;

    await prisma.product.upsert({
      where: { id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand ?? null,
        category: 'Smartphones',
        thumbnail,
        images: images.length ? images : [thumbnail],
      },
      create: {
        id,
        title: p.title,
        description: p.description,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        brand: p.brand ?? null,
        category: 'Smartphones',
        thumbnail,
        images: images.length ? images : [thumbnail],
      },
    });
  }
  console.log(`  ✓ Smartphones seeded (IDs offset by ${DUMMYJSON_ID_OFFSET}).`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('→ Clearing old products…');
  await prisma.product.deleteMany({});

  await seedPlatziProducts();
  await seedSmartphones();

  const total = await prisma.product.count();
  console.log(`\n✓ Product table now has ${total} rows.`);

  const byCategory = await prisma.product.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { category: 'asc' },
  });
  console.log('\nBreakdown by category:');
  byCategory.forEach((c) => console.log(`  ${c.category}: ${c._count.id}`));
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
