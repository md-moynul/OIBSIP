import { constructMetadata } from '@/lib/metadata';
// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'About | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


const stats = [
  { label: "Avg delivery", value: "28 min" },
  { label: "User rating", value: "4.8" },
  { label: "Orders delivered", value: "12k+" },
  { label: "Pizzas on the menu", value: "20+" },
];

const values = [
  {
    title: "Build it your way",
    description:
      "Every pizza starts with your choice of base, sauce, cheese, and veggies. Nothing is fixed — the menu is a starting point, not a rulebook.",
  },
  {
    title: "Track every step",
    description:
      "From the kitchen to your door, you always know where your order is. No guessing, no cold surprises.",
  },
  {
    title: "Stock you can trust",
    description:
      "We manage ingredient inventory closely, so what you customize is always what we can actually make — fresh, every time.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            About PizzaPoint
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-text md:text-5xl">
            Pizza, built around your pin.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-muted">
            We started PizzaPoint on a simple idea: the best pizza is the one
            you actually wanted, delivered to exactly where you are.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-text md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-text-muted md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src="/pizza-hero.jpg"
              alt="Freshly made pizza"
              fill
              className="object-cover"
            />
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
              Our story
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
              From one kitchen in Rangpur to your doorstep
            </h2>
            <p className="mt-4 text-text-muted">
              PizzaPoint began as a small kitchen experiment: what if ordering
              pizza felt less like picking from a fixed menu, and more like
              actually building something you wanted? We kept the base,
              sauce, cheese, and topping choices open, and built our delivery
              tracking around a single idea — you should always know exactly
              where your order is.
            </p>
            <p className="mt-4 text-text-muted">
              Today, we run on real-time inventory, live order tracking, and
              a kitchen that starts cooking the moment you hit build.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
              What we care about
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-bg p-6"
              >
                <h3 className="font-display text-lg font-bold text-text">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-text md:text-3xl">
            Ready to build your pizza?
          </h2>
          <p className="mt-3 text-text-muted">
            Pick your base, sauce, cheese, and veggies — we&apos;ll take it from
            there.
          </p>
          <Link href="/build">
            <Button className="mt-6 rounded-full bg-primary px-8 font-semibold text-white">
              Start building
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}