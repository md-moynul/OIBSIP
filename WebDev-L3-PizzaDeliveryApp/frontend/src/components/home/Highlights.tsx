import Link from "next/link";
import PizzaCard, { type Pizza } from "@/components/menu/PizzaCard";
import { Button } from "@heroui/react";
import { getLovedPizzas } from "@/lib/api/pizza";
import PizzaPagination from "./Pagination";

interface HighlightsProps {
  searchParams?: { page?: string; limit?: string };
}

export default async function Highlights({ searchParams }: HighlightsProps) {
  const currentPage = parseInt(searchParams?.page || "1", 10);
  const limit = 4;

  const response = await getLovedPizzas(currentPage, limit);
  
  const featuredPizzas: Pizza[] = response.data || [];
  const totalPages = response.pagination?.totalPages || 1;

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
              Highlights
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-text md:text-3xl">
              Most loved right now
            </h2>
          </div>
          <Link href="/menu">
            <Button className="rounded-full border-border text-text bg-background">
              View full menu
            </Button>
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>

        {/* Dynamic Pizza Pagination Component call */}
        <PizzaPagination 
          page={currentPage} 
          totalPages={totalPages} 
          link="/"
        />
      </div>
    </section>
  );
}