import { constructMetadata } from '@/lib/metadata';
import BuildPizzaClient from './BuildPizzaClient';

export const metadata = constructMetadata({
  title: 'Dashboard | User | Build | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});

export default function Page() {
  return <BuildPizzaClient />;
}
