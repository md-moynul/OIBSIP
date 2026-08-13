// components/menu/PizzaCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";

export interface Pizza {
  _id: string;
  name: string;
  category: "veg" | "non-veg";
  cheeses: string[];
  shortDescription: string;
  imageUrl: string;
  price: string;
  rating: string;
}

export default function PizzaCard({ pizza }: { pizza: Pizza }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
      <div className="relative h-44 w-full overflow-hidden bg-bg">
        <Image
          src={pizza.imageUrl}
          alt={pizza.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            pizza.category === "veg"
              ? "bg-accent text-white"
              : "bg-primary text-white"
          }`}
        >
          {pizza.category === "veg" ? "Veg" : "Non-Veg"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 font-display text-base font-bold text-text">
            {pizza.name}
          </p>
          <span className="shrink-0 font-mono text-xs font-semibold text-text">
            ★ {pizza.rating}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-sm text-text-muted">
          {pizza.shortDescription}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {pizza.cheeses.map((cheese) => (
            <span
              key={cheese}
              className="rounded-full bg-bg px-2 py-0.5 text-xs text-text-muted"
            >
              {cheese}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="font-mono text-lg font-bold text-primary">
            ৳{pizza.price}
          </p>

          <Link href={`/menu/${pizza._id}`}>
            <Button
              size="sm"
              className="rounded-full bg-primary px-4 font-semibold text-white"
            >
              View details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}