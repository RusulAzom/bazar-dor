"use client";

import { useState } from "react";
import { getBnDate } from "@/lib/bn-date";

// Stable fallback text rendered during SSR and the first client render pass.
// It keeps the element's text content identical between server and client so
// React never reports a hydration mismatch before the effect runs.
const FALLBACK = "তারিখ তৈরি হচ্ছে...";

export default function BnDate() {
  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    // Render the same text on the server and on the first client render so the
    // markup matches exactly. suppressHydrationWarning also guards against any
    // browser-extension-injected attributes (e.g. cz-shortcut-listen).
    return (
      <span suppressHydrationWarning className="text-xs font-medium text-zinc-500">
        {FALLBACK}
      </span>
    );
  }

  return (
    <span suppressHydrationWarning className="text-xs font-medium text-zinc-500">
      {getBnDate()}
    </span>
  );
}