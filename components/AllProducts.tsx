import { ALL_ITEMS, PriceItem, formatBnPrice, formatBnPercent } from "@/lib/products";
import { toBnNumber } from "@/lib/products";

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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-sm transition hover:border-amber-200 hover:shadow-md">
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

export default function AllProducts() {
  return (
    <section id="সব-পণ্য" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">সব পণ্য</h2>
          <p className="mt-1 text-sm text-zinc-500">
            মোট {toBnNumber(ALL_ITEMS.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50">
            সব দেখুন
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ALL_ITEMS.map((item) => (
          <ItemCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}