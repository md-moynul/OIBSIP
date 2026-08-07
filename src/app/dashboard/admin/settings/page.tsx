import { Metadata } from 'next';
import { getSettings } from '@/lib/api/settings';
import AdminSettingsClient from './AdminSettingsClient';

export const metadata: Metadata = {
  title: 'Store Settings | PizzaPoint Admin',
  description: 'Configure store settings including free delivery threshold',
};

export default async function AdminSettingsPage() {
  const res = await getSettings();
  const settings = res?.data || { freeDeliveryThreshold: 1500, deliveryFee: 60 };
  return <AdminSettingsClient settings={settings} />;
}
