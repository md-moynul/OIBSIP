'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, TrashBin, ArrowRight, ShoppingCart } from '@gravity-ui/icons';
import { getPizzaById } from "@/lib/api/pizza";
import { clearCart, deleteCartItem, updateCartItemQuantity } from '@/lib/action/cart';
import { AlertDialog, Button } from "@heroui/react"; // HeroUI components
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
  createdAt: string;
  updatedAt: string;
}

interface Pizza {
  _id: string;
  name: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  price?: number;
}

interface CartClientProps {
  initialCart: CartData;
  userId: string;
  freeDeliveryThreshold?: number;
  deliveryFee?: number;
}

const lineKey = (item: CartItem) => `${item.pizzaId}-${item.size}`;

const CartClient = ({ initialCart, userId, freeDeliveryThreshold = 1500, deliveryFee = 60 }: CartClientProps) => {
  const [cart, setCart] = useState<CartData>(initialCart);
  const [pizzas, setPizzas] = useState<Record<string, Pizza>>({});
  const [loading, setLoading] = useState(true);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal state control
  const [isClearCartOpen, setIsClearCartOpen] = useState(false);

  // Fetch pizza details
  useEffect(() => {
    const fetchPizzaDetails = async () => {
      if (!cart?.items?.length) {
        setLoading(false);
        return;
      }

      try {
        const uniqueIds = Array.from(new Set(cart.items.map((i) => i.pizzaId)));
        const fetchedPizzas: Record<string, Pizza> = {};
        for (const id of uniqueIds) {
          try {
            const pizza = await getPizzaById(id);
            if (pizza) {
              fetchedPizzas[id] = pizza;
            }
          } catch (e) {
            console.error(`Failed to fetch pizza ${id}:`, e);
          }
        }

        setPizzas((prev) => ({ ...prev, ...fetchedPizzas }));
      } catch (err) {
        console.error('Error fetching pizza details:', err);
        setError('Failed to load pizza details');
      } finally {
        setLoading(false);
      }
    };

    fetchPizzaDetails();
  }, [cart]);

  const subtotal = useMemo(
    () => cart?.items?.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) ?? 0,
    [cart]
  );

  const freeDelivery = subtotal > 0 && subtotal >= freeDeliveryThreshold;
  const effectiveDeliveryFee = freeDelivery ? 0 : deliveryFee;
  const total = subtotal + (cart?.items?.length ? effectiveDeliveryFee : 0);
  const itemCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) ?? 0;

  const updateQuantity = async (item: CartItem, delta: number) => {
    if (!cart) return;
    const nextQuantity = item.quantity + delta;
    const key = lineKey(item);
    const action = delta === 1 ? "increase" : "decrease";

    // Prevent quantity from dropping below 1
    if (nextQuantity < 1) return;

    // Set UI loading state for this specific item
    setPendingKey(key);

    // Optimistic UI Update: Immediately reflect the new quantity on screen
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((i) =>
        lineKey(i) === key ? { ...i, quantity: nextQuantity } : i
      );
      return { ...prev, items };
    });

    try {
      // Calling the Server Action instead of standard fetch
      const data = await updateCartItemQuantity(userId, item.pizzaId, item.size, action);

      if (data?.success && data?.updatedTotalPrice !== undefined) {
        // Sync the final calculated data received from backend database
        setCart((prev) => prev ? {
          ...prev,
          items: data.items,
          totalPrice: data.updatedTotalPrice
        } : prev);

        toast.success(`Quantity updated successfully`);
        window.dispatchEvent(new Event("cart-updated"));
      } else {
        throw new Error(data?.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Could not update item quantity");

      // Revert back to original state if Server Action fails
      setCart((prev) => {
        if (!prev) return prev;
        const items = prev.items.map((i) =>
          lineKey(i) === key ? { ...i, quantity: item.quantity } : i
        );
        return { ...prev, items };
      });
    } finally {
      // Turn off item loader
      setPendingKey(null);
    }
  };

  const removeItem = async (item: CartItem) => {
    const key = lineKey(item);
    setPendingKey(key);

    const removedItem = { ...item };
    setCart((prev) =>
      prev ? { ...prev, items: prev.items.filter((i) => lineKey(i) !== key) } : prev
    );

    try {
      const data = await deleteCartItem(userId, item.pizzaId, item.size);
      if (!data?.success) {
        toast.error("Failed to remove item from cart")
      } else {
        toast.success("Item removed from cart successfully")
        setCart(prev => prev ? { ...prev, totalPrice: prev.totalPrice - (removedItem.unitPrice * removedItem.quantity) } : prev);
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setCart((prev) => {
        if (!prev) return prev;
        return { ...prev, items: [...prev.items, removedItem] };
      });
    } finally {
      setPendingKey(null);
    }
  };

  // actual Clear Cart logic after confirmation
  const handleClearCartConfirm = async () => {
    setIsClearCartOpen(false); // Close modal first
    setLoading(true);
    try {
      const result = await clearCart(userId);
      if (!result?.success) {
        throw new Error("Failed to clear cart");
      }

      setCart(prev => prev ? { ...prev, items: [], totalPrice: 0 } : prev);
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-red-500 text-4xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingCart width={28} height={28} />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-gray-500">
          Looks like you haven&apos;t added any pizzas yet. Browse our menu and find your favorite!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Browse the menu
          <ArrowRight width={16} height={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
          <p className="text-sm text-gray-500 mt-1">{itemCount} items in your cart</p>
        </div>

        {/* Clear All Button triggers HeroUI AlertDialog State */}
        <button
          onClick={() => setIsClearCartOpen(true)}
          className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <TrashBin width={16} height={16} />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {cart.items.map((item) => {
            const pizza = pizzas[item.pizzaId];
            const key = lineKey(item);
            const isPending = pendingKey === key;
            const pizzaName = pizza?.name || `Pizza ${item.pizzaId.slice(-6)}`;

            return (
              <div
                key={key}
                className={`bg-white rounded-2xl border border-gray-200 p-4 transition-all ${isPending ? "opacity-60" : ""
                  }`}
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {pizza?.imageUrl ? (
                      <Image
                        src={pizza.imageUrl}
                        alt={pizzaName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <ShoppingCart width={20} height={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {pizzaName}
                        </p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                            {item.size} · {item.inches}&quot;
                          </span>
                          {pizza?.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                              {pizza.category}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                            ৳{item.unitPrice} each
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <TrashBin width={18} height={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, -1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
                          aria-label="Decrease quantity"
                          disabled={item.quantity <= 1}
                        >
                          <Minus width={14} height={14} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus width={14} height={14} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-primary">
                        ৳{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span className="text-gray-900">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className={freeDelivery ? "text-green-600 font-semibold" : "text-gray-900"}>
                  {freeDelivery ? 'FREE 🎉' : `৳${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {freeDelivery && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>🎉 Free delivery on orders ৳{freeDeliveryThreshold}+</span>
                  <span>You saved ৳{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {!freeDelivery && subtotal > 0 && (
                <div className="flex justify-between text-orange-500 text-xs">
                  <span>Add ৳{(freeDeliveryThreshold - subtotal).toFixed(2)} more for free delivery</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 my-4 pt-4">
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span className="text-primary">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-2"
            >
              Proceed to checkout
              <ArrowRight width={16} height={16} />
            </Link>

            <div className="mt-4 flex justify-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">🔒 Secure</span>
              <span className="flex items-center gap-1">🚚 Fast delivery</span>
              <span className="flex items-center gap-1">💳 Stripe / Card</span>
            </div>
          </div>
        </div>
      </div>

      {/* HeroUI AlertDialog implementation */}
      <AlertDialog isOpen={isClearCartOpen} onOpenChange={setIsClearCartOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-100">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Clear Cart permanently?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p>
                  Are you sure you want to clear your cart? All <strong>{itemCount} pizzas</strong> will be removed. This action cannot be undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" variant="tertiary" onClick={() => setIsClearCartOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleClearCartConfirm}>
                  Clear Cart
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
};

export default CartClient;