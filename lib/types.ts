export type Category = {
  key: string;
  label: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  { key: "rice", label: "চাল", icon: "🍚" },
  { key: "dal", label: "ডাল", icon: "🫘" },
  { key: "oil", label: "তেল", icon: "🛢️" },
  { key: "veg", label: "সবজি", icon: "🥬" },
  { key: "fish", label: "মাছ", icon: "🐟" },
  { key: "meat", label: "মাংস", icon: "🍗" },
  { key: "dairy", label: "ডিম-দুধ", icon: "🥛" },
  { key: "spice", label: "মসলা", icon: "🌶️" },
];