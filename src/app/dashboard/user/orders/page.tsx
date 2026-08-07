import { getOrdersByUserId } from '@/lib/api/orders';
import { getServerSession } from '@/lib/sessions/serverSession';
import UserOrdersClient from './UserOrdersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders & Delivery Status | PizzaPoint',
  description: 'Track the live delivery status of your pizza orders',
};

export default async function UserOrdersPage() {
  const user = await getServerSession();
  const ordersRes = user?.id ? await getOrdersByUserId(user.id).catch(() => ({ data: [] })) : { data: [] };
  const orders = ordersRes?.data || [];

  return <UserOrdersClient initialOrders={orders} userId={user?.id || ''} />;
}
