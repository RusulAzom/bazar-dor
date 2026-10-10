import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import { auth } from "@/lib/auth";
import { getProductBySlug, formatBnNumber, formatBnPercent, Product, getAllProducts } from "@/lib/products";

export const metadata = {
  title: "পণ্যের বিস্তারিত — বাজার দর",
};

// The route renders per-request (auth-gated), but we still list the known
// slugs so Next can generate a static shell around the Suspense boundary.
export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-zinc-100" />
          <div className="flex-1">
            <div className="h-7 w-48 rounded bg-zinc-100" />
            <div className="mt-3 h-4 w-full max-w-xl rounded bg-zinc-100" />
            <div className="mt-3 h-4 w-40 rounded bg-zinc-100" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-zinc-100" />
          <div className="h-28 rounded-2xl bg-zinc-100" />
          <div className="h-28 rounded-2xl bg-zinc-100" />
        </div>
        <div className="mt-8 h-5 w-44 rounded bg-zinc-100" />
        <div className="mt-4 h-56 rounded-2xl bg-zinc-100" />
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar reads usePathname(), so it needs a Suspense boundary too. */}
      <Suspense fallback={<div className="h-[84px] bg-white" />}>
        <Navbar />
      </Suspense>
      <Ticker />
      <main className="flex-1">
        {/* The auth check reads request headers, so it stays inside Suspense. */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductDetail params={params} />
        </Suspense>
      </main>
      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-zinc-400 sm:px-6">
          © ২০২৬ বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম।
        </div>
      </footer>
    </div>
  );
}

async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  // --- Protected route: verify the Better Auth session ----------------------
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    // A toast cannot fire during a server redirect, so the sign-in page shows
    // the warning on mount based on this query param instead.
    redirect("/signin?error=auth_required");
  }

  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}

function ProductView({ product }: { product: Product }) {
  const change = formatBnPercent(product.change);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <nav aria-label="ব্রেডক্রাম্ব" className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-amber-600">হোম</Link>
          <span aria-hidden>/</span>
          <Link href={`/category/${product.categorySlug}`} className="hover:text-amber-600">
            ক্যাটাগরি
          </Link>
          <span aria-hidden>/</span>
          <span className="text-zinc-900">{product.name}</span>
        </nav>
      </div>

      {/* Summary layout */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
            {product.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">{product.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              {product.summary}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Link
                href={`/category/${product.categorySlug}`}
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-200"
              >
                ক্যাটাগরি: {product.categorySlug}
              </Link>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                একক: {product.unit}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${change.color} ${
                  product.change >= 0 ? "bg-emerald-50" : "bg-red-50"
                }`}
              >
                {change.text} গতকালের তুলনায়
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Price statistics */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="সর্বনিম্ন দাম" value={product.min} icon="↓" tone="emerald" unit={product.unit} />
          <StatCard label="সর্বোচ্চ দাম" value={product.max} icon="↑" tone="red" unit={product.unit} />
          <StatCard label="গড় দাম" value={product.avg} icon="≈" tone="amber" unit={product.unit} />
        </div>
      </section>

      {/* Market-by-market breakdown */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto rounded-2xl border border-zinc-100 shadow-sm">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-zinc-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">বাজার</th>
                <th className="px-4 py-3 font-medium text-zinc-600">দাম (টাকা)</th>
                <th className="px-4 py-3 font-medium text-zinc-600">একক</th>
                <th className="px-4 py-3 font-medium text-zinc-600">গড়ের তুলনায়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {product.markets.map((m) => {
                const diff = m.price - product.avg;
                const pct = product.avg > 0 ? Math.abs(Math.round((diff / product.avg) * 1000) / 10) : 0;
                const up = diff >= 0;
                return (
                  <tr key={m.market} className="bg-white">
                    <td className="px-4 py-3 font-medium text-zinc-900">{m.market}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">{formatBnNumber(m.price)}</td>
                    <td className="px-4 py-3 text-zinc-500">প্রতি {m.unit}</td>
                    <td className={`px-4 py-3 font-medium ${up ? "text-emerald-600" : "text-red-500"}`}>
                      {up ? "▲" : "▼"} {formatBnNumber(pct)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  tone,
  unit,
}: {
  label: string;
  value: number;
  icon: string;
  tone: "emerald" | "red" | "amber";
  unit: string;
}) {
  const tones: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${tones[tone]}`}>
        {icon}
      </div>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">
        {formatBnNumber(value)}{" "}
        <span className="text-sm font-normal text-zinc-500">টাকা / {unit}</span>
      </p>
    </div>
  );
}