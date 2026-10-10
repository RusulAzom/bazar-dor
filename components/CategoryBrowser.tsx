"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Product, BN_DIGITS, formatBnNumber, formatBnPercent } from "@/lib/products";

/** Converts Bengali digits (or ASCII) into a JS number. */
function parseBn(value: string | number): number {
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

type SortKey = "default" | "price-asc" | "price-desc";

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

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
      <div className="flex items-start justify-between gap-2">
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
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate an initial fetch so the skeleton state is visible (spec requirement).
  // The state is cleared by the timer below rather than by a synchronous set.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  // Re-show the skeleton briefly whenever the sort changes.
  useEffect(() => {
    if (sort === "default") return;
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [sort]);

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

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") {
      // Numeric sort on the Bengali price label, proving parseBn handles Bengali digits.
      list.sort((a, b) => parseBn(formatBnNumber(a.avg)) - parseBn(formatBnNumber(b.avg)));
    } else if (sort === "price-desc") {
      list.sort((a, b) => parseBn(formatBnNumber(b.avg)) - parseBn(formatBnNumber(a.avg)));
    }
    return list;
  }, [products, sort]);

  const activeLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "ডিফল্ট";

  function handleSelect(value: SortKey) {
    if (value === sort) {
      setOpen(false);
      return;
    }
    // Set pending state here (event handler) rather than inside an effect.
    setLoading(true);
    setSort(value);
    setOpen(false);
    const label = SORT_OPTIONS.find((o) => o.value === value)?.label;
    if (value !== "default") toast.success(`সাজানো হয়েছে: ${label}`);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-zinc-900">{categoryLabel} তালিকা</h2>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">সাজান</span>
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              {activeLabel}
              <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && (
              <ul
                role="listbox"
                className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
              >
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value} role="option" aria-selected={sort === opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-amber-50 ${
                        sort === opt.value ? "font-semibold text-amber-700" : "text-zinc-700"
                      }`}
                    >
                      {opt.label}
                      {sort === opt.value && (
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
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

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: Math.max(products.length, 4) }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((item) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}