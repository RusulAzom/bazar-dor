import { TICKER_ITEMS, formatBnPrice, formatBnPercent } from "@/lib/products";

// Note: intentionally a Server Component. The marquee is driven by CSS
// (`@keyframes marquee`) with no client-side interactivity, so keeping this
// server-rendered means the price text has a single source of truth (the
// server HTML) and cannot diverge from the client bundle.
export default function Ticker() {
  // Duplicate items so the marquee loops seamlessly.
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full overflow-hidden bg-amber-50/70 py-2.5 text-zinc-800">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-amber-50/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-amber-50/90 to-transparent" />
        <div className="marquee flex items-center gap-6 whitespace-nowrap">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 text-sm shadow-sm"
            >
              <span aria-hidden className="text-base leading-none">
                {item.emoji}
              </span>
              <span className="font-medium">
                {item.name}
              </span>
              <span className="font-semibold text-zinc-900">
                {formatBnPrice(item.price)}
              </span>
              <span className="text-xs text-zinc-500">{item.unit}</span>
              <span className={`text-xs font-semibold ${formatBnPercent(item.change).color}`}>
                {formatBnPercent(item.change).text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
