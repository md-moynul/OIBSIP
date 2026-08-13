import { constructMetadata } from '@/lib/metadata';
import { getCart } from '@/lib/api/cart';
import { getServerSession } from '@/lib/sessions/serverSession';
import { getSettings } from '@/lib/api/settings';
import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata = constructMetadata({
  title: 'Checkout | PizzaPoint',
  description: 'Complete your order delivery details and payment',
});

export default async function CheckoutPage() {
  const user = await getServerSession();
  const [cart, settingsRes] = await Promise.all([
    user?.id ? getCart(user.id).catch(() => null) : Promise.resolve(null),
    getSettings(),
  ]);
  const settings = settingsRes?.data || { freeDeliveryThreshold: 1500, deliveryFee: 60 };

  return (
    <CheckoutClient
      initialCart={cart}
      user={user}
      freeDeliveryThreshold={settings.freeDeliveryThreshold ?? 1500}
      deliveryFee={settings.deliveryFee ?? 60}
    />
  );
}