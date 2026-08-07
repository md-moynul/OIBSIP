import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import SuccessClient from './SuccessClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed | PizzaPoint',
  description: 'Your pizza order has been placed successfully!',
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }> | { session_id?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const session_id = resolvedParams?.session_id;

  if (!session_id) {
    redirect('/');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'payment_intent'],
    });

    if (session.status === 'open') {
      redirect('/checkout');
    }

    const lineItems = session.line_items?.data || [];
    const items = lineItems.map((item) => ({
      description: item.description || 'Pizza Item',
      quantity: item.quantity || 1,
      amount: (item.amount_total || 0) / 100,
    }));

    const metadata = session.metadata || {};

    const summary = {
      sessionId: session.id,
      customerEmail: session.customer_details?.email || metadata.customerEmail || '',
      customerName: session.customer_details?.name || metadata.customerName || '',
      customerPhone: session.customer_details?.phone || metadata.customerPhone || '',
      customerAddress: metadata.customerAddress || '',
      notes: metadata.notes || '',
      totalAmount: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      items,
      userId: metadata.userId || undefined,
    };

    return <SuccessClient summary={summary} />;
  } catch (err) {
    console.error('Error verifying Stripe session:', err);
    redirect('/');
  }
}
