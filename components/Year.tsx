"use client";

import { useState } from "react";

// Stable fallback text rendered during SSR and the first client render pass.
// Rendering the same text content avoids any hydration mismatch from new Date().
const FALLBACK = "২০২৬";

export default function Year() {
  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    return <span suppressHydrationWarning>{FALLBACK}</span>;
  }

  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}