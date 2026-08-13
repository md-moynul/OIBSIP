import { constructMetadata } from '@/lib/metadata';
// app/menu/[id]/page.tsx
import PurchasePanel from "@/components/menu/PurchasePanel";
import { getPizzaById } from "@/lib/api/pizza";
import { getServerSession } from "@/lib/sessions/serverSession";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from 'next';


export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ id: string }> | { id: string } }>): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  
  if (!id) {
    return constructMetadata({
      title: 'Pizza Not Found | PizzaPoint',
    });
  }

  const pizza = await getPizzaById(id);
  
  if (!pizza) {
    return constructMetadata({
      title: 'Pizza Not Found | PizzaPoint',
      description: 'The requested pizza could not be found.',
    });
  }
  
  return constructMetadata({
    title: `${pizza.name} | PizzaPoint`,
    description: pizza.shortDescription || 'PizzaPoint - Fresh and Delicious Pizza',
  });
}


const PizzaDetailsPage = async ({
  params,
}: Readonly<{ params: { id: string } }>) => {
  const { id } = await params;
  const pizza = await getPizzaById(id);
const user = await getServerSession();
  if (!pizza) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image */}
        <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-surface md:h-full md:min-h-105 md:max-h-120">
          <Image
            src={pizza.imageUrl}
            alt={pizza.name}
            fill
            priority
            className="object-cover max"
          />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
              pizza.category === "veg"
                ? "bg-accent text-text"
                : "bg-primary text-white"
            }`}
          >
            {pizza.category === "veg" ? "Veg" : "Non-Veg"}
          </span>
        </div>

        {/* Details + purchase */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl font-bold text-text">
              {pizza.name}
            </h1>
            <span className="flex shrink-0 items-center gap-1 font-mono text-sm font-semibold text-text">
              ★ {pizza.rating}
            </span>
          </div>

          <p className="mt-2 text-sm text-text-muted">
            {pizza.shortDescription}
          </p>

          {pizza.cheeses?.length > 0 && (
            <div className="mt-4">
              <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                Cheese
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pizza.cheeses.map((cheese: string) => (
                  <span
                    key={cheese}
                    className="rounded-full bg-surface px-3 py-1 text-xs text-text-muted"
                  >
                    {cheese}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
              Description
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text">
              {pizza.fullDescription}
            </p>
          </div>

          <PurchasePanel pizza={pizza}  userId={user?.id || ""} />
        </div>
      </div>
    </div>
  );
};

export default PizzaDetailsPage;