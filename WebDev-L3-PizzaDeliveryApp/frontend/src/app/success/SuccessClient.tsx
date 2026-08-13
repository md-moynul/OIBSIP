'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CircleCheck, ArrowRight, ShoppingBag, House } from '@gravity-ui/icons';
import { clearCart } from '@/lib/action/cart';
import { createOrder } from '@/lib/action/orders';

interface OrderSummary {
  sessionId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  totalAmount: number; // BDT
  totalAmountUSD?: number;
  currency: string; // BDT
  paidCurrency?: string; // USD
  items: Array<{
    description: string;
    quantity: number;
    amount: number;
  }>;
  userId?: string;
}

export default function SuccessClient({ summary }: { summary: OrderSummary }) {
  useEffect(() => {
    if (summary.userId) {
      // Post order record to database
      createOrder({
        userId: summary.userId,
        stripeSessionId: summary.sessionId,
        customerName: summary.customerName,
        customerEmail: summary.customerEmail,
        customerPhone: summary.customerPhone,
        customerAddress: summary.customerAddress,
        notes: summary.notes,
        totalPrice: summary.totalAmount, // This remains BDT
        totalPriceUSD: summary.totalAmountUSD,
        currency: summary.currency,
        paidCurrency: summary.paidCurrency,
        items: summary.items,
        status: 'Paid',
      })
      .then(() => {
        window.dispatchEvent(new Event('cart-updated'));
      })
      .catch((err) => console.error('Error saving order:', err));
    }
  }, [summary]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 shadow-sm text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
          <CircleCheck width={48} height={48} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">Payment Successful!</h1>
        <p className="mt-2 text-base text-gray-600">
          Thank you for your order, <span className="font-semibold text-gray-900">{summary.customerName || 'Valued Customer'}</span>!
          Your pizza is being prepared.
        </p>

        {/* Receipt Box */}
        <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-6 text-left space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-4 gap-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Session Ref</p>
              <p className="text-xs font-mono font-medium text-gray-800 break-all">{summary.sessionId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                ✓ Paid via Stripe
              </span>
            </div>
          </div>

          {/* Delivery Target */}
          {summary.customerAddress && (
            <div className="border-b border-gray-200 pb-4 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-900 text-sm">Delivery Address</p>
              <p>{summary.customerAddress}</p>
              {summary.customerPhone && <p>📞 Phone: {summary.customerPhone}</p>}
              {summary.customerEmail && <p>✉️ Email: {summary.customerEmail}</p>}
            </div>
          )}

          {/* Purchased Items */}
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-3">Order Details</p>
            <div className="space-y-2 text-sm">
              {summary.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-gray-700">
                  <span>
                    {item.description} <span className="text-xs text-gray-500 font-medium">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900">
                    ৳{item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center font-bold text-base text-gray-900">
              <span>Total Paid</span>
              <span className="text-primary text-xl">৳{summary.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 transition-colors"
          >
            <House width={18} height={18} />
            Return Home
          </Link>
          <Link
            href="/menu"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag width={18} height={18} />
            Order More Pizzas
            <ArrowRight width={16} height={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
