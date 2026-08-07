import { constructMetadata } from '@/lib/metadata';
import { getAllPizzas } from "@/lib/api/pizza";
import MenuBrowser from "@/components/menu/MenuBrowser";
import PizzaCard, { type Pizza } from "@/components/menu/PizzaCard";
import PizzaPagination from "@/components/home/Pagination";
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Menu | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});



interface MenuPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string; // পেজ নাম্বার রিসিভ করার জন্য
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { q, category, minPrice, maxPrice, page } = await searchParams;

  // বর্তমান পেজ নাম্বার বের করা (ডিফল্ট ১)
  const currentPage = parseInt(page || "1", 10);
  const limit = 8; // প্রতি পেজে ৮টি পিজ্জা দেখাবে

  // এপিআই কল করা
  const response = await getAllPizzas({
    q,
    category,
    minPrice,
    maxPrice,
    page: currentPage,
    limit,
  });

  // ডাটা এবং প্যাগিনেশন অবজেক্ট আলাদা করা
  const pizzas: Pizza[] = response.data || [];
  const totalPages = response.pagination?.totalPages || 1;

  // বর্তমান সার্চ বা অন্যান্য ফিল্টার প্যারামিটারগুলো ধরে রাখার জন্য স্ট্রিং তৈরি করা
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  if (minPrice) sp.set("minPrice", minPrice);
  if (maxPrice) sp.set("maxPrice", maxPrice);
  const paramsStr = sp.toString();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Menu</h1>
        <p className="mt-1 text-sm text-text-muted">
          Every pizza we make, ready to order.
        </p>
      </div>

      <MenuBrowser
        initialSearch={q ?? ""}
        initialCategory={category ?? "all"}
        initialMinPrice={minPrice ? Number(minPrice) : 0}
        initialMaxPrice={maxPrice ? Number(maxPrice) : 1000}
      />

      {pizzas.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">
          No pizzas match your filters.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pizzas.map((pizza) => (
              <PizzaCard key={pizza._id} pizza={pizza} />
            ))}
          </div>

         
          <PizzaPagination
            page={currentPage}
            totalPages={totalPages}
            paramsStr={paramsStr} 
            link="/menu"
          />
        </>
      )}
    </div>
  );
}