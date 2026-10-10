import { CATEGORIES, Category } from "./types";

export type PriceItem = {
  name: string;
  emoji: string;
  price: number;
  unit: string;
  change: number; // percent
};

export type MarketPrice = {
  market: string;
  price: number;
  unit: string;
};

export type Product = {
  slug: string;
  name: string;
  emoji: string;
  categorySlug: Category["key"];
  summary: string;
  unit: string;
  change: number;
  markets: MarketPrice[];
  min: number;
  max: number;
  avg: number;
};

export const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatBnNumber(n: number): string {
  const [intPart, decPart] = String(n).split(".");
  const bnInt = String(intPart)
    .split("")
    .map((d) => (/[0-9]/.test(d) ? BN_DIGITS[Number(d)] : d))
    .join("");
  if (decPart === undefined) return bnInt;
  const bnDec = decPart
    .split("")
    .map((d) => (/[0-9]/.test(d) ? BN_DIGITS[Number(d)] : d))
    .join("");
  return `${bnInt}.${bnDec}`;
}

export function formatBnPrice(price: number): string {
  return formatBnNumber(price);
}

export function toBnNumber(n: number): string {
  return formatBnNumber(n);
}

export function formatBnPercent(n: number): { text: string; color: string } {
  const bnAbs = formatBnNumber(Math.abs(n));
  const sign = n >= 0 ? "▲" : "▼";
  const color = n >= 0 ? "text-emerald-600" : "text-red-500";
  return { text: `${sign} ${bnAbs}%`, color };
}

/** Parses a value that may contain Bengali digits (or ASCII) into a number. */
export function parseNumeric(value: string | number): number {
  if (typeof value === "number") return value;
  const normalized = value
    .split("")
    .map((ch) => {
      const idx = BN_DIGITS.indexOf(ch);
      return idx >= 0 ? String(idx) : ch;
    })
    .join("");
  return Number.parseFloat(normalized) || 0;
}

// ---------------------------------------------------------------------------
// Product data (market-by-market breakdown)
// ---------------------------------------------------------------------------

type RawProduct = Omit<Product, "min" | "max" | "avg">;

function buildProduct(p: RawProduct): Product {
  const prices = p.markets.map((m) => m.price);
  return {
    ...p,
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 10) / 10,
  };
}

const RAW_PRODUCTS: RawProduct[] = [
  {
    slug: "swarnamoyi-chal",
    name: "স্বর্ণমাছি চাল",
    emoji: "🍚",
    categorySlug: "rice",
    summary: "গতকাল সব বাজারে সীমিত শস্যের কারণে দাম কিছুটা বেড়েছে।",
    unit: "কেজি",
    change: 2.1,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 142, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 148, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 150, unit: "কেজি" },
      { market: "মিরপুর ১", price: 145, unit: "কেজি" },
    ],
  },
  {
    slug: "miniket-chal",
    name: "মিনিকেট চাল",
    emoji: "🍚",
    categorySlug: "rice",
    summary: "আমদানি স্থায়ী হওয়ায় দাম কিছুটা নীলামের মধ্যে নেমেছে।",
    unit: "কেজি",
    change: -0.6,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 52, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 55, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 54, unit: "কেজি" },
      { market: "মিরপুর ১", price: 53, unit: "কেজি" },
    ],
  },
  {
    slug: "nariyel-tel",
    name: "নারিকেল তেল",
    emoji: "🛢️",
    categorySlug: "oil",
    summary: "রপ্তানি চাহিদা বেড়েছে; দাম পুরনো আরামে আছে।",
    unit: "লিটার",
    change: 1.4,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 235, unit: "লিটার" },
      { market: "বাড্ডা হাট", price: 240, unit: "লিটার" },
      { market: "নিউমার্কেট", price: 238, unit: "লিটার" },
      { market: "মিরপুর ১", price: 236, unit: "লিটার" },
    ],
  },
  {
    slug: "soyabin-tel",
    name: "সয়াবিন তেল",
    emoji: "🛢️",
    categorySlug: "oil",
    summary: "আমদানি সারিয়ে সাজানোর পর দামসমান্য হয়েছে।",
    unit: "লিটার",
    change: -1.2,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 142, unit: "লিটার" },
      { market: "বাড্ডা হাট", price: 146, unit: "লিটার" },
      { market: "নিউমার্কেট", price: 145, unit: "লিটার" },
      { market: "মিরপুর ১", price: 143, unit: "লিটার" },
    ],
  },
  {
    slug: "musur-dal",
    name: "মসুর ডাল",
    emoji: "🫘",
    categorySlug: "dal",
    summary: "দেশীয় ফসলে পুষ্টি নেমেছে, তাই দাম কিছুটা হালকা।",
    unit: "কেজি",
    change: -0.8,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 92, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 95, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 94, unit: "কেজি" },
      { market: "মিরপুর ১", price: 93, unit: "কেজি" },
    ],
  },
  {
    slug: "mug-dal",
    name: "মুগ ডাল",
    emoji: "🫘",
    categorySlug: "dal",
    summary: "তাজা সরবরাহের কারণে দাম সামান্য বেড়েছে।",
    unit: "কেজি",
    change: 2.3,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 128, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 135, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 132, unit: "কেজি" },
      { market: "মিরপুর ১", price: 130, unit: "কেজি" },
    ],
  },
  {
    slug: "begun",
    name: "বেগুন",
    emoji: "🍆",
    categorySlug: "veg",
    summary: "শীতকালীন সরবরাহে বাজারে সরবরাহ বেড়েছে।",
    unit: "কেজি",
    change: 3.6,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 40, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 45, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 48, unit: "কেজি" },
      { market: "মিরপুর ১", price: 42, unit: "কেজি" },
    ],
  },
  {
    slug: "alu",
    name: "আলু",
    emoji: "🥔",
    categorySlug: "veg",
    summary: "তাজা ফসলের সরবরাহ বেশি বলে দাম কমেছে।",
    unit: "কেজি",
    change: -5.2,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 26, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 30, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 32, unit: "কেজি" },
      { market: "মিরপুর ১", price: 28, unit: "কেজি" },
    ],
  },
  {
    slug: "peyaj",
    name: "পেঁয়াজ",
    emoji: "🧅",
    categorySlug: "veg",
    summary: "আমদানি বন্ধ থাকায় পুরনো মজুত শেষ হয়ে দাম বেড়েছে।",
    unit: "কেজি",
    change: 8.4,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 58, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 62, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 68, unit: "কেজি" },
      { market: "মিরপুর ১", price: 64, unit: "কেজি" },
    ],
  },
  {
    slug: "rosun",
    name: "রসুন",
    emoji: "🧄",
    categorySlug: "spice",
    summary: "দেশীয় উৎপাদন বেড়েছে, তাই দাম কমেছে।",
    unit: "কেজি",
    change: -3.1,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 105, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 110, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 115, unit: "কেজি" },
      { market: "মিরপুর ১", price: 108, unit: "কেজি" },
    ],
  },
  {
    slug: "kacha-morich",
    name: "কাঁচামরিচ",
    emoji: "🌶️",
    categorySlug: "spice",
    summary: "বৃষ্টির কারণে কিছু অঞ্চলে ক্ষতি হয়েছে।",
    unit: "কেজি",
    change: -4.3,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 230, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 240, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 245, unit: "কেজি" },
      { market: "মিরপুর ১", price: 235, unit: "কেজি" },
    ],
  },
  {
    slug: "peyaj-mosla",
    name: "পেঁয়াজ মসলা",
    emoji: "🧂",
    categorySlug: "spice",
    summary: "দাম কিছুটা উঠেছে, গ্রাহকদের নজরদারি চলছে।",
    unit: "কেজি",
    change: 4.1,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 175, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 180, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 185, unit: "কেজি" },
      { market: "মিরপুর ১", price: 178, unit: "কেজি" },
    ],
  },
  {
    slug: "ada",
    name: "আদা",
    emoji: "🫚",
    categorySlug: "spice",
    summary: "আমদানি কম হওয়ায় দাম বেশ বেড়েছে।",
    unit: "কেজি",
    change: 6.1,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 325, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 340, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 350, unit: "কেজি" },
      { market: "মিরপুর ১", price: 335, unit: "কেজি" },
    ],
  },
  {
    slug: "rui-mach",
    name: "রুই মাছ",
    emoji: "🐟",
    categorySlug: "fish",
    summary: "মৌসুমের মাছের সরবহ কম, তাই দাম কিছুটা বেশি।",
    unit: "কেজি",
    change: 2.2,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 310, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 320, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 330, unit: "কেজি" },
      { market: "মিরপুর ১", price: 315, unit: "কেজি" },
    ],
  },
  {
    slug: "katla-mach",
    name: "কাতলা মাছ",
    emoji: "🐟",
    categorySlug: "fish",
    summary: "নদীর অঞ্চল থেকে সরবরাহ বেড়েছে।",
    unit: "কেজি",
    change: -2.8,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 460, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 480, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 490, unit: "কেজি" },
      { market: "মিরপুর ১", price: 470, unit: "কেজি" },
    ],
  },
  {
    slug: "hanser-mangsho",
    name: "হাঁসের মাংস",
    emoji: "🦆",
    categorySlug: "meat",
    summary: "স্থানীয় খামার থেকে সরবরাহ স্থিতিশীল।",
    unit: "কেজি",
    change: -1.5,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 255, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 260, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 265, unit: "কেজি" },
      { market: "মিরপুর ১", price: 258, unit: "কেজি" },
    ],
  },
  {
    slug: "khasir-mangsho",
    name: "খাসির মাংস",
    emoji: "🐐",
    categorySlug: "meat",
    summary: "বিদেশি চাহিদা কমে দাম কিছুটা নেমেছে।",
    unit: "কেজি",
    change: -3.9,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 690, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 720, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 730, unit: "কেজি" },
      { market: "মিরপুর ১", price: 705, unit: "কেজি" },
    ],
  },
  {
    slug: "goru-mangsho",
    name: "গরুর মাংস",
    emoji: "🐄",
    categorySlug: "meat",
    summary: "ইয়েদের আনন্দের ফলে দাম কিছুটা বেড়েছে।",
    unit: "কেজি",
    change: 1.8,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 635, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 640, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 645, unit: "কেজি" },
      { market: "মিরপুর ১", price: 640, unit: "কেজি" },
    ],
  },
  {
    slug: "deshi-dim",
    name: "দেশী ডিম",
    emoji: "🥚",
    categorySlug: "dairy",
    summary: "খামারি উৎপাদনের হার বেড়েছে।",
    unit: "পিস",
    change: 2.0,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 4.2, unit: "পিস" },
      { market: "বাড্ডা হাট", price: 4.8, unit: "পিস" },
      { market: "নিউমার্কেট", price: 4.6, unit: "পিস" },
      { market: "মিরপুর ১", price: 4.5, unit: "পিস" },
    ],
  },
  {
    slug: "farmi-dim",
    name: "ফার্মি ডিম",
    emoji: "🥚",
    categorySlug: "dairy",
    summary: "ফার্ম উৎপাদন বেড়েছে, তাই দাম নেমেছে।",
    unit: "হালি",
    change: -1.1,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 232, unit: "হালি" },
      { market: "বাড্ডা হাট", price: 236, unit: "হালি" },
      { market: "নিউমার্কেট", price: 235, unit: "হালি" },
      { market: "মিরপুর ১", price: 234, unit: "হালি" },
    ],
  },
  {
    slug: "dudh",
    name: "দুধ",
    emoji: "🥛",
    categorySlug: "dairy",
    summary: "খামার মজুত স্থায়ী হওয়ায় দাম স্থির আছে।",
    unit: "লিটার",
    change: 1.0,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 60, unit: "লিটার" },
      { market: "বাড্ডা হাট", price: 62, unit: "লিটার" },
      { market: "নিউমার্কেট", price: 62, unit: "লিটার" },
      { market: "মিরপুর ১", price: 61, unit: "লিটার" },
    ],
  },
  {
    slug: "makhon",
    name: "মাখন",
    emoji: "🧈",
    categorySlug: "dairy",
    summary: "দুধজাত পণ্যের দাম বেশ কিছুটা বেড়েছে।",
    unit: "কেজি",
    change: 5.7,
    markets: [
      { market: "করিমুল্লাহ বুড়িবাজার", price: 520, unit: "কেজি" },
      { market: "বাড্ডা হাট", price: 540, unit: "কেজি" },
      { market: "নিউমার্কেট", price: 550, unit: "কেজি" },
      { market: "মিরপুর ১", price: 530, unit: "কেজি" },
    ],
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(buildProduct);

/** Converts a full product into the lightweight ticker/list card shape. */
export function toPriceItem(p: Product): PriceItem {
  return { name: p.name, emoji: p.emoji, price: p.avg, unit: p.unit, change: p.change };
}

export const TICKER_ITEMS: PriceItem[] = PRODUCTS.slice(0, 8).map(toPriceItem);

export const ROSE_ITEMS: PriceItem[] = PRODUCTS.filter((p) => p.change > 0)
  .sort((a, b) => b.change - a.change)
  .slice(0, 6)
  .map(toPriceItem);

export const FALLEN_ITEMS: PriceItem[] = PRODUCTS.filter((p) => p.change < 0)
  .sort((a, b) => a.change - b.change)
  .slice(0, 6)
  .map(toPriceItem);

export const ALL_ITEMS: PriceItem[] = PRODUCTS.map(toPriceItem);

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.key === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
