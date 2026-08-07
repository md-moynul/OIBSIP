import { getAllOrders } from '@/lib/api/orders';
import AdminOrdersClient from './AdminOrdersClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Orders & Delivery Control | PizzaPoint',
  description: 'Manage and update delivery status of customer orders',
};

export default async function AdminOrdersPage() {
  const ordersRes = await getAllOrders().catch(() => ({ data: [] }));
  const orders = ordersRes?.data || [];

  return <AdminOrdersClient initialOrders={orders} />;
}