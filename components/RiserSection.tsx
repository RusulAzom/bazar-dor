import { ROSE_ITEMS, PriceItem, formatBnPrice, formatBnPercent } from "@/lib/products";

function ChangeBadge({ change }: { change: number }) {
  const { text, color } = formatBnPercent(change);
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${color} ${change >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
      {text}
    </span>
  );
}

function ItemCard({ item }: { item: PriceItem }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg leading-none">
          {item.emoji}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
          <p className="text-xs text-zinc-500">{formatBnPrice(item.price)}/{item.unit}</p>
        </div>
      </div>
      <ChangeBadge change={item.change} />
    </div>
  );
}

export default function RiserSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          ▲
        </span>
        <h2 className="text-xl font-bold text-zinc-900">আজ দাম বেড়েছে</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ROSE_ITEMS.map((item) => (
          <ItemCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}