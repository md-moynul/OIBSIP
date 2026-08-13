import { constructMetadata } from '@/lib/metadata';
import { getAllInventoryItems } from '@/lib/api/inventory';
import InventoryClient from './InventoryClient';
import { Metadata } from 'next';

export const metadata = constructMetadata({
  title: 'Pizza Making Items (Inventory) | PizzaPoint Admin',
  description: 'Manage raw pizza ingredients and making stock levels',
});

export default async function AdminInventoryPage() {
  const itemsRes = await getAllInventoryItems().catch(() => ({ data: [] }));
  const items = itemsRes?.data || [];

  return <InventoryClient initialItems={items} />;
}