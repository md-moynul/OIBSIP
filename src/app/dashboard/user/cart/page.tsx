// app/cart/page.tsx
import { getCart } from '@/lib/api/cart';
import { getServerSession } from '@/lib/sessions/serverSession';
import { getSettings } from '@/lib/api/settings';
import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Your Cart | PizzaPoint',
  description: 'Review your pizza orders and proceed to checkout',
};

interface CartItem {
  pizzaId: string;
  size: string;
  inches: number;
  unitPrice: number;
  quantity: number;
}

interface CartData {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const CartPage = async () => {
  const user = await getServerSession();
  const [cart, settingsRes] = await Promise.all([
    getCart(user?.id || ''),
    getSettings(),
  ]);
  const settings = settingsRes?.data || { freeDeliveryThreshold: 1500, deliveryFee: 60 };

  return (
    <CartClient
      initialCart={cart as CartData}
      userId={user?.id || ''}
      freeDeliveryThreshold={settings.freeDeliveryThreshold ?? 1500}
      deliveryFee={settings.deliveryFee ?? 60}
    />
  );
};

export default CartPage;