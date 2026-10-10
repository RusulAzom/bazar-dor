"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            আজকের বাজারের দাম এক নজরে
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন- সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
            বাজার দর প্লাটформার মাধ্যমে বাংলাদেশের প্রধান বাজারগুলোর দৈনিক পণ্যের দাম সংক্রান্ত তথ্য একত্রিত করে ব্যবসায়ী, খামারি ও গৃহবাসীদের সিদ্ধান্ত গ্রহণকে সহজ করে। প্রতিদিনের হালনাল দাম, সর্বোচ্চ-সর্বনিম্ন মূল্য এবং দামের পরিবর্তনের হার এক নজরে পাওয়া যায়।
          </p>
          <div className="mt-7">
            <a
              href="#সব-পণ্য"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            >
              সব পণ্য দেখুন
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-200/60 to-orange-100/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-lg">
              <Image
                src="/img/bazar-hero.png"
                alt="বাজার প্যানেল — প্রতিদিনের পণ্যের দাম"
                width={630}
                height={526}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}