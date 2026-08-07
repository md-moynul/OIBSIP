import { getCart } from '@/lib/api/cart';
import { getServerSession } from '@/lib/sessions/serverSession';
import CheckoutClient from './CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | PizzaPoint',
  description: 'Complete your order delivery details and payment',
};

export default async function CheckoutPage() {
  const user = await getServerSession();
  const cart = user?.id ? await getCart(user.id).catch(() => null) : null;

  return <CheckoutClient initialCart={cart} user={user} />;
}