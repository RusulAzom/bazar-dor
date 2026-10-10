import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-6xl font-bold text-amber-500">৪০৪</p>
        <h1 className="mt-4 text-2xl font-bold text-zinc-900">পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          আপনি যে পাতাটি খুঁজছেন সেটি সরানো হয়েছে, সরিয়ে ফেলা হয়েছে অথবা কখনও ছিলই না।
          হোম পেজে ফিরে গিয়ে বাজারের দাম এক নজরে দেখুন।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}