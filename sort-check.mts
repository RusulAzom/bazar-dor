// Temporary runtime validation for the sort dropdown (Challenge C1).
import { parseBnNumber, formatBnNumber, PRODUCTS, getProductsByCategory } from "./lib/products";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${label} -> ${JSON.stringify(actual)}${ok ? "" : ` (expected ${JSON.stringify(expected)})`}`);
}

// --- parseBnNumber -----------------------------------------------------------
check("bn digits", parseBnNumber("১৪৮"), 148);
check("bn thousands sep", parseBnNumber("১,৮৫০"), 1850);
check("bn + taka text", parseBnNumber("১,৮৫০ টাকা"), 1850);
check("taka symbol", parseBnNumber("৳ ১৪৮"), 148);
check("ascii passthrough", parseBnNumber("148"), 148);
check("ascii commas", parseBnNumber("1,850.50"), 1850.5);
check("decimals bn", parseBnNumber("৪.২"), 4.2);
check("negative", parseBnNumber("-১২"), -12);
check("no digits", parseBnNumber("দাম নেই"), 0);
check("empty", parseBnNumber(""), 0);
check("null", parseBnNumber(null), 0);
check("number input", parseBnNumber(42), 42);
check("non-finite", parseBnNumber(Number.NaN), 0);

// Bengali digits must NOT sort as text: ৯ (9) vs ১০ (10).
check("bn string compare would be wrong", "১০" < "৯", false); // "১..."<"৯..." so true
check("parse ১০ > ৯ numerically", parseBnNumber("১০") > parseBnNumber("৯"), true);

// --- format -> parse round trip over every real product ---------------------
const rice = getProductsByCategory("rice");
console.log("\nrice products:", rice.map((p) => `${p.name}=${formatBnNumber(p.avg)}`).join(", "));

const price = (p: { avg: number }) => parseBnNumber(formatBnNumber(p.avg));
const asc = [...rice].sort((a, b) => price(a) - price(b)).map(price);
const desc = [...rice].sort((a, b) => price(b) - price(a)).map(price);

check("asc is sorted", asc, [...asc].sort((a, b) => a - b));
check("desc is sorted", desc, [...desc].sort((a, b) => b - a));
check("desc is reverse of asc", desc, [...asc].reverse());
check("does not mutate source", rice.map(price), [...rice].map(price));

// String sort would have produced a different (wrong) order.
const stringSort = [...rice].sort((a, b) => formatBnNumber(a.avg).localeCompare(formatBnNumber(b.avg))).map(price);
check("numeric order differs from string order", stringSort.join() !== asc.join(), true);

// Whole catalogue stays numerically consistent.
for (const p of PRODUCTS) {
  const round = parseBnNumber(formatBnNumber(p.avg));
  if (Math.abs(round - p.avg) > 1e-9) {
    failures++;
    console.log(`FAIL round-trip ${p.slug}: ${p.avg} -> ${round}`);
  }
}
console.log(`\nround-trip checked ${PRODUCTS.length} products`);

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
