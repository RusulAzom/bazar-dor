"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Product, formatBnNumber, formatBnPercent, parseBnNumber } from "@/lib/products";

/** A single sort option: stable key + the label shown in the dropdown. */
type SortOption = {
  key: SortKey;
  label: string;
  /** Toast copy for this option, shown after the grid re-renders. */
  message: string;
};

type SortKey = "default" | "price-asc" | "price-desc";

/**
 * Single source of truth for the dropdown, so the trigger button, the option
 * list and the toast message can never drift apart.
 */
const SORT_OPTIONS: readonly SortOption[] = [
  { key: "default", label: "ডিফল্ট", message: "ডিফল্ট ক্রমে দেখানো হচ্ছে।" },
  { key: "price-asc", label: "দাম: কম থেকে বেশি", message: "সাজানো হয়েছে: দাম — কম থেকে বেশি।" },
  { key: "price-desc", label: "দাম: বেশি থেকে কম", message: "সাজানো হয়েছে: দাম — বেশি থেকে কম।" },
];

function optionFor(key: SortKey): SortOption {
  return SORT_OPTIONS.find((o) => o.key === key) ?? SORT_OPTIONS[0];
}

function ChangeBadge({ change }: { change: number }) {
  const { text, color } = formatBnPercent(change);
  return (
    <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${color} ${change >= 0 ? "bg-emerald-50" : "bg-red-50"}`}>
      {text}
    </span>
  );
}

function ProductCard({ item }: { item: Product }) {
  return (
    <Link
      href={`/product/${item.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-xl leading-none">
          {item.emoji}
        </span>
        <ChangeBadge change={item.change} />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-900">{item.name}</h3>
      <p className="text-xs text-zinc-500">গড় দাম / {item.unit}</p>
      <p className="mt-1 text-lg font-bold text-zinc-900">
        {formatBnNumber(item.avg)} <span className="text-xs font-normal text-zinc-500">টাকা</span>
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        বিস্তারিত দেখুন
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-full bg-zinc-100" />
        <div className="h-5 w-14 rounded-full bg-zinc-100" />
      </div>
      <div className="mt-3 h-4 w-24 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-16 rounded bg-zinc-100" />
      <div className="mt-3 h-6 w-20 rounded bg-zinc-100" />
      <div className="mt-4 h-3 w-24 rounded bg-zinc-100" />
    </div>
  );
}

export default function CategoryBrowser({
  products,
  categoryLabel,
}: {
  products: Product[];
  categoryLabel: string;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * The skeleton is shown while a "fetch" is pending. Instead of toggling a
   * boolean, we record which view (category + order) has finished loading and
   * derive `loading` from it — no setState inside the effect body, and the
   * pending state can never get stuck when the inputs change mid-flight.
   */
  const viewKey = `${categoryLabel}::${sort}`;
  const [readyKey, setReadyKey] = useState<string | null>(null);
  const loading = readyKey !== viewKey;

  // Simulated fetch so the skeleton state is visible (spec requirement).
  useEffect(() => {
    const t = setTimeout(() => setReadyKey(viewKey), 350);
    return () => clearTimeout(t);
  }, [viewKey]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Dismiss on Escape (keyboard parity with clicking outside).
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /**
   * Sorted product list. Prices are parsed from the *rendered* Bengali price
   * string (e.g. "১,৮৫০") through `parseBnNumber`, so comparison is always
   * numeric — never lexicographic, where "৯" would wrongly beat "১০".
   */
  const sorted = useMemo(() => {
    const price = (p: Product) => parseBnNumber(formatBnNumber(p.avg));
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
    if (sort === "price-desc") list.sort((a, b) => price(b) - price(a));
    return list;
  }, [products, sort]);

  function handleSelect(key: SortKey) {
    setOpen(false);
    if (key === sort) return;
    // `sort` changing also changes `viewKey`, so the skeleton returns
    // automatically — no pending flag to manage in the event handler.
    setSort(key);
    toast.success(optionFor(key).message);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900">{categoryLabel} তালিকা</h2>

        <div className="flex items-center gap-2">
          <span id="sort-label" className="text-sm text-zinc-500">
            সাজান
          </span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-labelledby="sort-label"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              {optionFor(sort).label}
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <ul
                role="listbox"
                aria-label="সাজানোর ক্রম"
                className="absolute right-0 z-20 mt-2 w-52 origin-top-right overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
              >
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.key} role="option" aria-selected={sort === opt.key}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.key)}
                      className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition hover:bg-amber-50 ${
                        sort === opt.key ? "font-semibold text-amber-700" : "text-zinc-700"
                      }`}
                    >
                      {opt.label}
                      {sort === opt.key && (
                        <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Announces the active order to screen readers whenever it changes. */}
      <p aria-live="polite" className="sr-only">
        {optionFor(sort).label}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: Math.max(products.length, 4) }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        // Remounting the grid on `sort` replays the fade-in animation, which is
        // the visual cue that the grid re-rendered in the new order.
        <div
          key={sort}
          className="grid-reveal grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {sorted.map((item) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
