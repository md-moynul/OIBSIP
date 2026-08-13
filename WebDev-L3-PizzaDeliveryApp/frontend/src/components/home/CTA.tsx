// components/home/CTA.tsx
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight } from "@gravity-ui/icons";

export default function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-text md:text-4xl">
          Drop a pin. Build a pizza.
          <br />
          Get it hot at your door.
        </h2>
        <p className="mt-4 text-text-muted">
          It takes less than a minute to start — pick your base, sauce,
          cheese, and veggies, and we&apos;ll handle the rest.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/build">
            <Button
              size="lg"
              className="bg-primary px-8 font-semibold text-white"
              
            >
              Start building
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/menu">
            <Button
              size="lg"
              className="border-text px-8 font-semibold text-text bg-background"
            >
              Browse menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}