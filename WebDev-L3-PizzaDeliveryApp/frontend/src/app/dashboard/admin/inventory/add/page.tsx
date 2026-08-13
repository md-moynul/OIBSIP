import { constructMetadata } from '@/lib/metadata';
import AddInventoryClient from './AddInventoryClient';

export const metadata = constructMetadata({
  title: 'Dashboard | Admin | Inventory | Add | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <AddInventoryClient />;
}
