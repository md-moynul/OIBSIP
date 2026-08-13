// lib/constants/pricing.ts

export interface SizeOption {
  label: string;
  inches: number;
  multiplier: number; // 1 = base price, 1.25 = +25%, etc.
}

// 6" is the base size — its price is exactly pizza.price (no markup).
// Every other size scales up from that using a fixed multiplier.
export const SIZE_OPTIONS: SizeOption[] = [
  { label: "Small", inches: 6, multiplier: 1 },
  { label: "Medium", inches: 8, multiplier: 1.25 },
  { label: "Large", inches: 12, multiplier: 1.6 },
  { label: "X-Large", inches: 14, multiplier: 1.9 },
  { label: "XX-Large", inches: 18, multiplier: 2.4 },
];

export function getSizePrice(basePrice: number, multiplier: number): number {
  return Math.round(basePrice * multiplier);
}