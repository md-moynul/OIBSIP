import { constructMetadata } from '@/lib/metadata';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';


export const metadata = constructMetadata({
  title: 'Dashboard | User | PizzaPoint',
  description: 'PizzaPoint - Fresh and Delicious Pizza',
});


export default function UserOverviewPage() {
  redirect('/dashboard/user/orders');
}