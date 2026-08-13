// components/home/Categories.tsx
import Link from "next/link";
import Image from "next/image";

interface Category {
  label: string;
  slug: "veg" | "non-veg" | "special";
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    label: "Veg",
    slug: "veg",
    description: "Fresh vegetables, real flavor, no meat.",
    image: "/pizza-hero.jpg",
  },
  {
    label: "Non-Veg",
    slug: "non-veg",
    description: "Loaded with chicken, beef, and bold toppings.",
    image: "/pizza-hero-2.jpg",
  },
  {
    label: "Special",
    slug: "special",
    description: "Chef picks and limited-time flavors.",
    image: "/pizza-hero.jpg",
  },
];

export default function Categories() {
  return (
    <section className="bg-surface px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
            Browse by category
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
            Find your kind of pizza
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/menu?category=${category.slug}`}
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border"
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-text via-text/50 to-transparent" />

              <div className="relative z-10 p-5">
                <h3 className="font-display text-xl font-bold text-bg">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-bg/80">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}