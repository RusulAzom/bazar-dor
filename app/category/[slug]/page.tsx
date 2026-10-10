import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";
import CategoryBrowser from "@/components/CategoryBrowser";
import {
  getCategoryBySlug,
  getProductsByCategory,
  formatBnPercent,
  toBnNumber,
  getCategories,
} from "@/lib/products";

// Prerender every category page at build time.
export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.key }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const category = getCategoryBySlug(slug);
    return {
      title: category
        ? `${category.label} — আজকের বাজারের দাম | বাজার দর`
        : "ক্যাটাগরি পাওয়া যায়নি | বাজার দর",
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const products = category ? getProductsByCategory(slug) : [];

  // Invalid slug, or a valid category with no items -> friendly 404 (not-found.tsx
  // provides the "হোম পেজে ফিরে যান" CTA).
  if (!category || products.length === 0) {
    notFound();
  }

  const risers = products.filter((p) => p.change > 0).length;
  const fallers = products.filter((p) => p.change < 0).length;
  const overallChange =
    products.reduce((sum, p) => sum + p.change, 0) / products.length;
  const overall = formatBnPercent(overallChange);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <Ticker />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
          <nav aria-label="ব্রেডক্রাম্ব" className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-amber-600">
              হোম
            </Link>
            <span aria-hidden>/</span>
            <span className="text-zinc-900">{category.label}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
              {category.icon}
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-zinc-900">
                {category.label} — আজকের বাজারের দাম
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500">
                <span>মোট {toBnNumber(products.length)}টি পণ্য</span>
                <span aria-hidden>•</span>
                <span>
                  গড় পরিবর্তন{" "}
                  <span className={`font-semibold ${overall.color}`}>{overall.text}</span>
                </span>
                <span aria-hidden>•</span>
                <span>
                  বেড়েছে <span className="font-semibold text-emerald-600">{toBnNumber(risers)}</span>
                </span>
                <span aria-hidden>•</span>
                <span>
                  কমেছে <span className="font-semibold text-red-500">{toBnNumber(fallers)}</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        <CategoryBrowser products={products} categoryLabel={category.label} />
      </main>

      <footer className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-zinc-400 sm:px-6">
          © ২০২৬ বাজার দর — বাংলাদেশের প্রতিদিনের বাজারের দাম।
        </div>
      </footer>
    </div>
  );
}