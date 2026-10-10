import Link from "next/link";
import { PRODUCTS, formatBnNumber, formatBnPercent, toBnNumber } from "@/lib/products";

function ChangeBadge({ change }: { change: number }) {
  const { text, color } = formatBnPercent(change);
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${color} ${
        change >= 0 ? "bg-emerald-50" : "bg-red-50"
      }`}
    >
      {text}
    </span>
  );
}

function ItemCard({ slug, emoji, name, avg, unit, change }: {
  slug: string;
  emoji: string;
  name: string;
  avg: number;
  unit: string;
  change: number;
}) {
  return (
    <Link
      href={`/product/${slug}`}
      className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 shadow-sm transition hover:border-amber-200 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-lg leading-none">
          {emoji}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">{name}</p>
          <p className="text-xs text-zinc-500">গড় {formatBnNumber(avg)}/{unit}</p>
        </div>
      </div>
      <ChangeBadge change={change} />
    </Link>
  );
}

export default function AllProducts() {
  return (
    <section id="সব-পণ্য" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">সব পণ্য</h2>
          <p className="mt-1 text-sm text-zinc-500">
            মোট {toBnNumber(PRODUCTS.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-800">
            বাজারভিত্তিক হালনাল দাম
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRODUCTS.map((item) => (
          <ItemCard
            key={item.slug}
            slug={item.slug}
            emoji={item.emoji}
            name={item.name}
            avg={item.avg}
            unit={item.unit}
            change={item.change}
          />
        ))}
      </div>
    </section>
  );
}