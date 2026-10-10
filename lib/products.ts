export type PriceItem = {
  name: string;
  emoji: string;
  price: number;
  unit: string;
  change: number; // percent
};

// Sample data for the price ticker. In production these would come from an API.
export const TICKER_ITEMS: PriceItem[] = [
  { name: "স্বর্ণমাছি চাল", emoji: "🍚", price: 148, unit: "কেজি", change: 2.1 },
  { name: "নারিকেল তেল", emoji: "🛢️", price: 240, unit: "লিটার", change: 1.4 },
  { name: "মসুর ডাল", emoji: "🫘", price: 95, unit: "কেজি", change: -0.8 },
  { name: "বেগুন", emoji: "🥬", price: 45, unit: "কেজি", change: 3.6 },
  { name: "রুই মাছ", emoji: "🐟", price: 320, unit: "কেজি", change: -1.2 },
  { name: "হাঁসের মাংস", emoji: "🍗", price: 260, unit: "কেজি", change: 0.5 },
  { name: "দেশী ডিম", emoji: "🥚", price: 4.5, unit: "পিস", change: 2.0 },
  { name: "পেঁয়াজ মসলা", emoji: "🌶️", price: 180, unit: "কেজি", change: 4.1 },
];

// Section A: prices that rose today
export const ROSE_ITEMS: PriceItem[] = [
  { name: "পেঁয়াজ", emoji: "🧅", price: 62, unit: "কেজি", change: 8.4 },
  { name: "আদা", emoji: "🫚", price: 340, unit: "কেজি", change: 6.1 },
  { name: "বেগুন", emoji: "🥬", price: 45, unit: "কেজি", change: 3.6 },
  { name: "রুই মাছ", emoji: "🐟", price: 320, unit: "কেজি", change: 2.2 },
  { name: "দেশী ডিম", emoji: "🥚", price: 4.5, unit: "পিস", change: 2.0 },
  { name: "মাখন", emoji: "🧈", price: 540, unit: "কেজি", change: 5.7 },
];

// Section B: prices that fell today
export const FALLEN_ITEMS: PriceItem[] = [
  { name: "কাঁচামরিচ", emoji: "🌶️", price: 240, unit: "কেজি", change: -4.3 },
  { name: "রসুন", emoji: "🧄", price: 110, unit: "কেজি", change: -3.1 },
  { name: "আলু", emoji: "🥔", price: 28, unit: "কেজি", change: -5.2 },
  { name: "কাতলা মাছ", emoji: "🐟", price: 480, unit: "কেজি", change: -2.8 },
  { name: "হাঁসের মাংস", emoji: "🍗", price: 260, unit: "কেজি", change: -1.5 },
  { name: "খাসির মাংস", emoji: "🥩", price: 720, unit: "কেজি", change: -3.9 },
];

// Section C: all commodities (merged list)
export const ALL_ITEMS: PriceItem[] = [
  ...ROSE_ITEMS,
  ...FALLEN_ITEMS,
  { name: "স্বর্ণমাছি চাল", emoji: "🍚", price: 148, unit: "কেজি", change: 2.1 },
  { name: "নারিকেল তেল", emoji: "🛢️", price: 240, unit: "লিটার", change: 1.4 },
  { name: "মসুর ডাল", emoji: "🫘", price: 95, unit: "কেজি", change: -0.8 },
  { name: "পেঁয়াজ মসলা", emoji: "🌶️", price: 180, unit: "কেজি", change: 4.1 },
  { name: "গরুর মাংস", emoji: "🥩", price: 640, unit: "কেজি", change: 0.0 },
  { name: "দুধ", emoji: "🥛", price: 62, unit: "লিটার", change: 1.0 },
  { name: "কপি", emoji: "☕", price: 420, unit: "কেজি", change: 0.5 },
  { name: "টমেটো", emoji: "🍅", price: 40, unit: "কেজি", change: 1.8 },
];

export function formatBnPrice(price: number): string {
  const intPart = Math.floor(price);
  const decPart = Math.round((price - intPart) * 100);
  const bnInt = String(intPart)
    .split("")
    .map((d) => "০১২৩৪৫৬৭৮৯"[Number(d)] ?? d)
    .join("");
  const bnDec = String(decPart)
    .padStart(2, "0")
    .split("")
    .map((d) => "০১২৩৪৫৬৭৮৯"[Number(d)] ?? d)
    .join("");
  return decPart === 0 ? bnInt : `${bnInt}.${bnDec}`;
}

export function formatBnPercent(n: number): { text: string; color: string } {
  const abs = Math.abs(n);
  const bnAbs = String(abs)
    .split("")
    .map((d) => "০১২৩৪৫৬৭৮৯"[Number(d)] ?? d)
    .join("");
  const sign = n >= 0 ? "▲" : "▼";
  const color = n >= 0 ? "text-emerald-600" : "text-red-500";
  return { text: `${sign} ${bnAbs}%`, color };
}

export function toBnNumber(n: number): string {
  return String(n)
    .split("")
    .map((d) => "০১২৩৪৫৬৭৮৯"[Number(d)] ?? d)
    .join("");
}