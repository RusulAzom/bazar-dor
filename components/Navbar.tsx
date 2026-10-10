"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/types";
import BnDate from "@/components/BnDate";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top row */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <Image
              src="/img/logo-icon.png"
              alt="বাজার দর লোগো"
              width={22}
              height={22}
              priority
            />
          </span>
          <span className="text-xl font-bold tracking-tight text-zinc-900">
            বাজার দর
          </span>
        </Link>

        <div className="ml-auto hidden text-right sm:block">
          <p className="text-xs font-medium text-zinc-500">
            <BnDate />
          </p>
        </div>

        <nav className="hidden items-center gap-2 sm:flex">
          {loggedIn ? (
            <>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                ই
              </span>
              <button
                onClick={() => setLoggedIn(false)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                সাইন আউট
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                সাইন আপ
              </Link>
            </>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-700 sm:hidden"
          aria-label="মেনু টুলগ"
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t border-zinc-100 bg-white px-4 py-3 sm:hidden">
          <p className="mb-3 text-xs font-medium text-zinc-500">
            <BnDate />
          </p>
          <div className="flex flex-col gap-2">
            {loggedIn ? (
              <>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                  ই
                </span>
                <button
                  onClick={() => setLoggedIn(false)}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Category row */}
      <div className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav
            aria-label="ক্যাটাগরি"
            className="-mx-1 flex gap-1 overflow-x-auto py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none [scrollbar-width:none] [&>a]:shrink-0"
          >
            {CATEGORIES.map((c) => {
              const active = pathname === `/category/${c.key}`;
              return (
                <Link
                  key={c.key}
                  href={`/category/${c.key}`}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-amber-100 text-amber-800"
                      : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  <span aria-hidden className="text-base leading-none">
                    {c.icon}
                  </span>
                  {c.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}