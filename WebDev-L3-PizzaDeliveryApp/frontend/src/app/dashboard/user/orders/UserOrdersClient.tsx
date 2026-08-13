'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from '@gravity-ui/icons';

interface OrderItem {
  description?: string;
  name?: string;
  size?: string;
  quantity: number;
  amount?: number;
  price?: number;
}

interface Order {
  _id: string;
  stripeSessionId?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  totalPrice: number;
  deliveryStatus?: 'Cooking' | 'On Delivery' | 'Delivered' | string;
  status?: string;
  createdAt?: string;
  items?: OrderItem[];
}

interface UserOrdersClientProps {
  initialOrders: Order[];
  userId: string;
}

const STEPS = [
  { key: 'Cooking', label: 'Cooking & Preparing', icon: '👨‍🍳', description: 'Our chef is preparing your pizza' },
  { key: 'On Delivery', label: 'On Delivery', icon: '🛵', description: 'Rider is on the way to your address' },
  { key: 'Delivered', label: 'Delivered', icon: '🎉', description: 'Enjoy your warm pizza!' },
];

function getStepIndex(status?: string) {
  if (status === 'On Delivery') return 1;
  if (status === 'Delivered') return 2;
  return 0; // Default to Cooking
}

export default function UserOrdersClient({ initialOrders }: UserOrdersClientProps) {
  const [orders] = useState<Order[]>(initialOrders);

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag width={28} height={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">No active orders found</h1>
        <p className="text-sm text-gray-500 max-w-sm">
          You haven&apos;t placed any orders yet. Explore our delicious menu and order your favorite pizza!
        </p>
        <Link
          href="/menu"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          Browse Menu
          <ArrowRight width={16} height={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders & Delivery Status</h1>
        <p className="text-sm text-gray-500 mt-1">Track the live preparation and delivery stage of your pizzas.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.deliveryStatus);
          const isCompleted = order.deliveryStatus === 'Delivered';

          return (
            <div key={order._id || order.stripeSessionId} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-4 gap-3">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Order ID #{String(order._id || order.stripeSessionId).slice(-8)}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {isCompleted ? '✓ Delivered' : `⏳ ${order.deliveryStatus || 'Cooking'}`}
                  </span>
                  <span className="text-base font-bold text-primary">
                    ৳{Number(order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Progress Bar Tracker */}
              <div className="py-6 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6">Delivery Progress</p>

                <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
                  {/* Background Track Bar */}
                  <div className="absolute left-10 right-10 top-5 h-1 bg-gray-200 -z-0" />
                  {/* Active Progress Fill */}
                  <div
                    className="absolute left-10 top-5 h-1 bg-primary transition-all duration-500 -z-0"
                    style={{
                      width: `${(currentStep / (STEPS.length - 1)) * 85}%`,
                    }}
                  />

                  {STEPS.map((step, idx) => {
                    const isDone = currentStep >= idx;
                    const isCurrent = currentStep === idx;

                    return (
                      <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg transition-all ${
                            isCurrent
                              ? 'border-primary bg-primary text-white scale-110 shadow-md ring-4 ring-primary/20'
                              : isDone
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 bg-white text-gray-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`mt-2 text-xs font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-gray-400 max-w-[100px] hidden sm:block">
                          {step.description}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details & Address */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                {/* Items */}
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm mb-2">Ordered Pizzas</p>
                  <div className="space-y-1.5">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-gray-700">
                          <span>
                            {item.description || item.name || 'Pizza'}{' '}
                            <span className="font-semibold text-gray-900">× {item.quantity}</span>
                          </span>
                          <span className="font-semibold text-gray-800">
                            ৳{((item.amount || item.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">Standard Pizza Order</p>
                    )}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-1">
                  <p className="font-semibold text-gray-900 text-sm mb-2">Delivery Destination</p>
                  {order.customerName && <p><strong className="text-gray-800">Customer:</strong> {order.customerName}</p>}
                  {order.customerPhone && <p><strong className="text-gray-800">Phone:</strong> {order.customerPhone}</p>}
                  {order.customerAddress && <p><strong className="text-gray-800">Address:</strong> {order.customerAddress}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
