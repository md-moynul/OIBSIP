import { constructMetadata } from '@/lib/metadata';
import AddPizzaClient from './AddPizzaClient';

export const metadata = constructMetadata({
  title: 'Dashboard | Admin | Items | Add | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <AddPizzaClient />;
}
