import { constructMetadata } from '@/lib/metadata';
// app/dashboard/admin/items/page.tsx
import { getAllPizzas } from "@/lib/api/pizza";
import ItemsTable from "@/components/dashboard/ItemsTable";
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | Admintems | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


const AllItemsPage = async () => {
  const pizza = await getAllPizzas();
  const pizzas = pizza.data || [];

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">
          Manage items
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Edit or remove pizzas from the menu.
        </p>
      </div>

      <div className="mt-8">
        <ItemsTable initialPizzas={pizzas} />
      </div>
    </div>
  );
};

export default AllItemsPage;