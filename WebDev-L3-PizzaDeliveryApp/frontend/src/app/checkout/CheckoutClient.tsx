'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, Lock, ShieldCheck, CreditCard } from '@gravity-ui/icons';
import { getPizzaById } from '@/lib/api/pizza';
import { toast } from 'react-toastify';

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
}

interface Pizza {
  _id: string;
  name: string;
  imageUrl?: string;
  category?: string;
}

interface UserSession {
  id: string;
  name?: string;
  email?: string;
  number?: string;
}

interface CheckoutClientProps {
  initialCart: CartData | null;
  user: UserSession | null;
  freeDeliveryThreshold?: number;
  deliveryFee?: number;
}

export default function CheckoutClient({ initialCart, user, freeDeliveryThreshold = 1500, deliveryFee: feeFromProps = 60 }: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCanceled = searchParams.get('canceled') === 'true';

  const [cart] = useState<CartData | null>(initialCart);
  const [pizzas, setPizzas] = useState<Record<string, Pizza>>({});
  const [loadingPizzas, setLoadingPizzas] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.number || '',
    address: '',
    city: 'Dhaka',
    notes: '',
  });

  useEffect(() => {
    if (isCanceled) {
      toast.warn('Payment was canceled. You can try again when ready.');
    }
  }, [isCanceled]);

  // Fetch details for items in cart
  useEffect(() => {
    const fetchPizzaDetails = async () => {
      if (!cart?.items?.length) {
        setLoadingPizzas(false);
        return;
      }

      try {
        const uniqueIds = Array.from(new Set(cart.items.map((i) => i.pizzaId)));
        const fetchedPizzas: Record<string, Pizza> = {};
        for (const id of uniqueIds) {
          try {
            const pizza = await getPizzaById(id);
            if (pizza) fetchedPizzas[id] = pizza;
          } catch (e) {
            console.error(`Failed to fetch pizza ${id}:`, e);
          }
        }
        setPizzas(fetchedPizzas);
      } catch (err) {
        console.error('Error fetching pizza details:', err);
      } finally {
        setLoadingPizzas(false);
      }
    };

    fetchPizzaDetails();
  }, [cart]);

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) ?? 0;
  const freeDelivery = subtotal > 0 && subtotal >= freeDeliveryThreshold;
  const deliveryFee = cart?.items?.length ? (freeDelivery ? 0 : feeFromProps) : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      toast.error('Your cart is empty');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error('Please fill in all required delivery details');
      return;
    }

    setIsSubmitting(true);

    try {
      // Enrich items with pizza name and image
      const enrichedItems = cart.items.map((item) => {
        const pizza = pizzas[item.pizzaId];
        return {
          ...item,
          name: pizza?.name || `Pizza ${item.pizzaId.slice(-6)}`,
          imageUrl: pizza?.imageUrl,
        };
      });

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: enrichedItems,
          deliveryInfo: formData,
          userId: user?.id || cart.userId,
          deliveryFee,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to create payment session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Payment initiation failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!cart?.items?.length && !loadingPizzas) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingCart width={28} height={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-gray-500">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/menu"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary/90"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header & Back Link */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/user/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            <ArrowLeft width={16} height={16} />
            Back to Cart
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
          <ShieldCheck width={16} height={16} />
          SSL Encrypted Payment
        </div>
      </div>

      {isCanceled && (
        <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 flex items-center justify-between">
          <span>⚠️ Checkout process was canceled. You can modify your information and try again.</span>
        </div>
      )}

      <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Delivery Info & Payment Selection */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Delivery Details Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📍 Delivery Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+880 1700 000000"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House/Apartment #, Road #, Area / Neighborhood"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Special Delivery Notes (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Ring the door bell twice, leave with security"
                  className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              💳 Payment Method
            </h2>

            <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <CreditCard width={20} height={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Stripe Online Checkout</p>
                  <p className="text-xs text-gray-500">Credit / Debit Card, Visa, Mastercard, AMEX</p>
                </div>
              </div>
              <span className="text-xs font-bold text-primary bg-white px-2.5 py-1 rounded-md border border-primary/20">
                Selected
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            {/* Item List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 mb-4 divide-y divide-gray-100">
              {cart?.items.map((item) => {
                const pizza = pizzas[item.pizzaId];
                const name = pizza?.name || `Pizza ${item.pizzaId.slice(-6)}`;
                return (
                  <div key={`${item.pizzaId}-${item.size}`} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                        {pizza?.imageUrl ? (
                          <Image src={pizza.imageUrl} alt={name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">🍕</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{name}</p>
                        <p className="text-xs text-gray-500">
                          {item.size} ({item.inches}&quot;) × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      ৳{(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>৳{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total Amount</span>
                <span className="text-primary text-xl">৳{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-md cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connecting to Stripe...
                </>
              ) : (
                <>
                  <Lock width={18} height={18} />
                  Pay ৳{total.toFixed(2)} with Stripe
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>🔒 You will be redirected to Stripe&apos;s secure checkout page</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
