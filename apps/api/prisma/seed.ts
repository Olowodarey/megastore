import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const API_BASE = 'https://api.escuelajs.co/api/v1';

// Only these categories (case-insensitive) survive the filter. Platzi's API is
// user-writable and other devs pollute the shared demo constantly, so we
// hard-whitelist the ones we know are real.
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

// Fabricate the fields Platzi doesn't provide so the UI stays lively.
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) =>
  Math.floor(rand(min, max + 1));

function fabricate() {
  return {
    discountPercentage: Number(rand(5, 40).toFixed(2)),
    rating: Number(rand(3, 5).toFixed(1)),
    stock: randInt(10, 100),
  };
}

// Platzi returns Cloudinary URLs sometimes wrapped in ["url"] literal strings.
// Normalize into a clean string[].
function cleanImages(raw: string[]): string[] {
  return (raw ?? [])
    .flatMap((entry) => {
      if (!entry) return [];
      const s = entry.trim();
      // Sometimes API returns literal e.g. `["https://..."]` as a single string.
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

async function fetchPage(offset: number, limit: number): Promise<PlatziProduct[]> {
  const url = `${API_BASE}/products?offset=${offset}&limit=${limit}`;
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

async function main() {
  console.log('→ Fetching products from Platzi Fake Store…');
  const raw: PlatziProduct[] = [];
  const pageSize = 40;
  for (let offset = 0; offset < 200; offset += pageSize) {
    const page = await fetchPage(offset, pageSize);
    console.log(`  page @offset=${offset}: got ${page.length}`);
    raw.push(...page);
    if (page.length < pageSize) break;
  }

  // Filter placeholder titles and off-whitelist categories.
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

  console.log('→ Clearing old products…');
  await prisma.product.deleteMany({});

  console.log('→ Upserting into Postgres…');
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
  const total = await prisma.product.count();
  console.log(`✓ Product table now has ${total} rows.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
