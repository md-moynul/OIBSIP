import { constructMetadata } from '@/lib/metadata';
// app/dashboard/admin/page.tsx
import OverviewBarChart from "@/components/dashboard/OverviewBarChart";
import { getAllPizzaWithoutPagination } from "@/lib/api/pizza";
import { getUser } from "@/lib/api/user";
import { Person, ShoppingCart, CircleDollar, Circle } from "@gravity-ui/icons";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon width={18} height={18} className="text-primary" />
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-text">
        {value ?? 0}
      </p>
      <p className="mt-1 text-sm text-text-muted">{label}</p>
    </div>
  );
}

import { getAllOrders } from "@/lib/api/orders";
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | Admin | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


const AdminOverviewPage = async () => {
  // Fetching existing APIs safely
  const users = await getUser().catch(() => []);
  const pizzas = await getAllPizzaWithoutPagination().catch(() => []);
  const ordersRes = await getAllOrders().catch(() => ({ totalOrders: 0, totalRevenue: 0 }));

  const totalOrders = ordersRes?.totalOrders ?? 0;
  const totalRevenue = ordersRes?.totalRevenue ?? 0;

  const cards = [
    {
      icon: Person,
      label: "Total Users",
      value: users?.length ?? 0,
    },
    {
      icon: Circle,
      label: "Total Pizzas",
      value: pizzas?.length ?? 0,
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: totalOrders,
    },
    {
      icon: CircleDollar,
      label: "Total Revenue",
      value: `৳${totalRevenue}`,
    },
  ];

  // Reshape the same numbers into chart-friendly rows (revenue excluded — different scale)
  const chartData = cards
    .filter((c) => c.label !== "Total Revenue")
    .map((c) => ({
      label: c.label.replace("Total ", ""),
      value: typeof c.value === "number" ? c.value : 0,
    }));

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">
          Overview
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          A snapshot of what&apos;s happening on PizzaPoint.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <OverviewBarChart data={chartData} />
    </div>
  );
};

export default AdminOverviewPage;