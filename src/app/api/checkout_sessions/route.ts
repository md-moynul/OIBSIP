import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, deliveryInfo, userId, deliveryFee = 60 } = body;

    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const EXCHANGE_RATE = 110;

    // Build line items for Stripe Checkout
    const lineItems = items.map((item: any) => {
      const bdtAmount = Number(item.unitPrice);
      const usdAmount = bdtAmount / EXCHANGE_RATE;
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.name || 'Pizza'} (${item.size} - ${item.inches}")`,
            description: `Size: ${item.size} (${item.inches} inch)`,
            ...(item.imageUrl ? { images: [item.imageUrl] } : {}),
          },
          unit_amount: Math.round(usdAmount * 100), // Amount in cents
        },
        quantity: item.quantity,
      };
    });

    // Add delivery fee line item if applicable
    if (deliveryFee > 0) {
      const usdFee = Number(deliveryFee) / EXCHANGE_RATE;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
            description: 'Standard pizza delivery',
          },
          unit_amount: Math.round(usdFee * 100),
        },
        quantity: 1,
      });
    }

    // Prepare session metadata
    const metadata = {
      userId: userId || '',
      customerName: deliveryInfo?.name || '',
      customerEmail: deliveryInfo?.email || '',
      customerPhone: deliveryInfo?.phone || '',
      customerAddress: `${deliveryInfo?.address || ''}, ${deliveryInfo?.city || ''}`,
      notes: deliveryInfo?.notes || '',
      itemsSummary: JSON.stringify(items.map((i: any) => ({
        pizzaId: i.pizzaId,
        name: i.name || `Pizza ${i.pizzaId.slice(-6)}`,
        size: i.size,
        quantity: i.quantity,
        price: i.unitPrice
      }))),
      totalBdtAmount: String(items.reduce((acc: number, item: any) => acc + (Number(item.unitPrice) * item.quantity), 0) + Number(deliveryFee)),
      deliveryFeeBdt: String(deliveryFee),
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: deliveryInfo?.email || undefined,
      metadata: metadata,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe Checkout API Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to create checkout session' },
      { status: err?.statusCode || 500 }
    );
  }
}
