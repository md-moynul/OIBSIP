'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/react';
import {
  ArrowLeft,
  ArrowRight,
  CircleCheckFill,
  ShoppingCart,
  Plus,
  Minus,
  TriangleExclamation,
  Lock,
  ArrowsRotateLeft,
} from '@gravity-ui/icons';
import { addToCart } from '@/lib/action/cart';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

// ========================
// Types
// ========================
type BuilderItem = {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  inStock: boolean;
  price?: number;
};

type BuilderData = {
  base?: BuilderItem[];
  sauce?: BuilderItem[];
  cheese?: BuilderItem[];
  topping?: BuilderItem[];
  vegetable?: BuilderItem[];
  [key: string]: BuilderItem[] | undefined;
};

const SIZES: { id: string; label: string; inches: number; multiplier: number }[] = [
  { id: 'Small', label: 'Small', inches: 6, multiplier: 1 },
  { id: 'Medium', label: 'Medium', inches: 8, multiplier: 1.25 },
  { id: 'Large', label: 'Large', inches: 12, multiplier: 1.5 },
];

const BASE_PRICE = 250;
const STEPS = ['Base', 'Sauce', 'Cheese', 'Toppings', 'Review'] as const;

// Category keyword mapping (handles flexible naming by admin)
function pickCategory(data: BuilderData, ...keys: string[]): BuilderItem[] {
  for (const key of keys) {
    // exact match
    if (data[key]) return data[key]!;
    // substring match
    const found = Object.keys(data).find((k) => k.includes(key) || key.includes(k));
    if (found && data[found]) return data[found]!;
  }
  return [];
}

// ========================
// OptionGrid component
// ========================
const OptionGrid = ({
  options,
  selected,
  onSelect,
}: {
  options: BuilderItem[];
  selected: BuilderItem | null;
  onSelect: (o: BuilderItem) => void;
}) => {
  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-700">
        <TriangleExclamation className="mx-auto mb-2 h-6 w-6" />
        No ingredients in this category yet. Ask admin to add inventory items.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const isSelected = selected?.id === o.id;
        const disabled = !o.inStock;
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect(o)}
            className={`relative flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
              disabled
                ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
                : isSelected
                ? 'cursor-pointer border-primary bg-primary/10 font-semibold'
                : 'cursor-pointer border-border hover:bg-surface'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm ${isSelected ? 'text-primary' : disabled ? 'text-gray-400' : 'text-text'}`}>
                {o.label}
              </span>
              {disabled && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  Out of stock
                </span>
              )}
              {!disabled && (
                <span className="text-[10px] text-gray-400">
                  {o.quantity} {o.unit} in stock
                </span>
              )}
            </div>
            <span className="flex items-center gap-2">
              {(o.price ?? 0) > 0 && (
                <span className="text-xs text-text-muted">+৳{o.price}</span>
              )}
              {isSelected && <CircleCheckFill width={16} height={16} className="text-primary" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ========================
// Multi-select grid for toppings
// ========================
const MultiSelectGrid = ({
  options,
  selected,
  onToggle,
}: {
  options: BuilderItem[];
  selected: BuilderItem[];
  onToggle: (o: BuilderItem) => void;
}) => {
  if (options.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-700">
        <TriangleExclamation className="mx-auto mb-2 h-6 w-6" />
        No topping ingredients found in inventory. Admin can add them under &apos;topping&apos; category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const isSelected = selected.some((v) => v.id === o.id);
        const disabled = !o.inStock;
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onToggle(o)}
            className={`relative flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
              disabled
                ? 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50'
                : isSelected
                ? 'cursor-pointer border-primary bg-primary/10 font-semibold'
                : 'cursor-pointer border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`text-sm ${isSelected ? 'text-primary' : disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                {o.label}
              </span>
              {disabled && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  Out of stock
                </span>
              )}
              {!disabled && (
                <span className="text-[10px] text-gray-400">
                  {o.quantity} {o.unit} in stock
                </span>
              )}
            </div>
            <span className="flex items-center gap-2">
              {(o.price ?? 0) > 0 && <span className="text-xs text-gray-400">+৳{o.price}</span>}
              {isSelected && <CircleCheckFill width={16} height={16} className="text-primary" />}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// ========================
// Main Page Component
// ========================
export default function BuildPizzaPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [builderData, setBuilderData] = useState<BuilderData>({});
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

  const [step, setStep] = useState(0);
  const [base, setBase] = useState<BuilderItem | null>(null);
  const [sauce, setSauce] = useState<BuilderItem | null>(null);
  const [cheese, setCheese] = useState<BuilderItem | null>(null);
  const [toppings, setToppings] = useState<BuilderItem[]>([]);
  const [size, setSize] = useState(SIZES[0]);
  const [quantity, setQuantity] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Fetch live inventory grouped by category
  useEffect(() => {
    const fetchBuilderItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/inventory/builder-items`);
        const data = await res.json();
        if (data?.success && data?.data) {
          setBuilderData(data.data);
          // Auto-select first in-stock option for each single-select step
          const bases = pickCategory(data.data, 'base', 'crust', 'dough');
          const sauces = pickCategory(data.data, 'sauce');
          const cheeses = pickCategory(data.data, 'cheese');
          setBase(bases.find((b) => b.inStock) ?? bases[0] ?? null);
          setSauce(sauces.find((s) => s.inStock) ?? sauces[0] ?? null);
          setCheese(cheeses.find((c) => c.inStock) ?? cheeses[0] ?? null);
        }
      } catch (err) {
        console.error('Error fetching builder items:', err);
        toast.error('Could not load ingredients. Please try again.');
      } finally {
        setIsLoadingIngredients(false);
      }
    };
    fetchBuilderItems();
  }, []);

  const bases = useMemo(() => pickCategory(builderData, 'base', 'crust', 'dough'), [builderData]);
  const sauces = useMemo(() => pickCategory(builderData, 'sauce'), [builderData]);
  const cheeses = useMemo(() => pickCategory(builderData, 'cheese'), [builderData]);
  const availableToppings = useMemo(
    () => pickCategory(builderData, 'topping', 'vegetable', 'veggie', 'extra'),
    [builderData]
  );

  const toppingsAddOn = useMemo(
    () => toppings.reduce((s, v) => s + (v.price ?? 0), 0),
    [toppings]
  );

  const unitPrice = useMemo(() => {
    const baseAddOn = (base?.price ?? 0) + (sauce?.price ?? 0) + (cheese?.price ?? 0);
    return Math.round((BASE_PRICE + baseAddOn + toppingsAddOn) * size.multiplier);
  }, [base, sauce, cheese, toppingsAddOn, size]);

  const totalPrice = unitPrice * quantity;

  const toggleTopping = (t: BuilderItem) => {
    setToppings((prev) =>
      prev.some((v) => v.id === t.id) ? prev.filter((v) => v.id !== t.id) : [...prev, t]
    );
  };

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Block "Next" if the current required selection is out of stock
  const currentSelectionValid = useMemo(() => {
    if (step === 0) return base?.inStock ?? false;
    if (step === 1) return sauce?.inStock ?? false;
    if (step === 2) return cheese?.inStock ?? false;
    return true; // toppings are optional
  }, [step, base, sauce, cheese]);

  const handleSaveToCart = async (directCheckout = false) => {
    if (!base || !sauce || !cheese) {
      toast.error('Please complete all required selections before proceeding.');
      return;
    }
    if (!base.inStock || !sauce.inStock || !cheese.inStock) {
      toast.error('Some selected ingredients are out of stock. Please choose alternatives.');
      return;
    }

    if (directCheckout) {
      setIsBuyingNow(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const customPizzaName = `Custom Pizza (${base.label}, ${sauce.label})`;
      const customPizzaId = `custom-${Date.now()}`;
      const userId = session?.user?.id || '';

      const cartData = {
        userId,
        items: [
          {
            pizzaId: customPizzaId,
            name: customPizzaName,
            size: size.id,
            inches: size.inches,
            unitPrice,
            quantity,
          },
        ],
        totalPrice,
      };

      const res = await addToCart(cartData);

      if (res?.success) {
        window.dispatchEvent(new Event('cart-updated'));
        if (directCheckout) {
          toast.success('Custom pizza prepared! Proceeding to checkout...');
          router.push('/checkout');
        } else {
          toast.success('Custom pizza added to cart!');
          router.push('/dashboard/user/cart');
        }
      } else {
        toast.error('Failed to add custom pizza to cart');
      }
    } catch (err) {
      console.error('Error saving custom pizza:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsBuyingNow(false);
    }
  };

  if (isLoadingIngredients) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <ArrowsRotateLeft className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading fresh ingredients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Custom Pizza Builder</h1>
      <p className="mb-8 text-sm text-gray-500">
        Craft your dream pizza — pick your base, sauce, cheese, and toppings from our live inventory.
      </p>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i < step
                  ? 'bg-primary text-white'
                  : i === step
                  ? 'border-2 border-primary text-primary font-bold'
                  : 'border border-gray-300 text-gray-400'
              }`}
            >
              {i < step ? <CircleCheckFill width={16} height={16} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500">
          Step {step + 1}: Select {STEPS[step]}
        </h2>

        {step === 0 && (
          <OptionGrid options={bases} selected={base} onSelect={setBase} />
        )}
        {step === 1 && (
          <OptionGrid options={sauces} selected={sauce} onSelect={setSauce} />
        )}
        {step === 2 && (
          <OptionGrid options={cheeses} selected={cheese} onSelect={setCheese} />
        )}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-gray-400 mb-1">
              Toppings are optional. Select any combination.
            </p>
            <MultiSelectGrid options={availableToppings} selected={toppings} onToggle={toggleTopping} />
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-6">
            {/* Recipe Summary */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Custom Pizza Recipe</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Base / Crust</span>
                <span className="font-semibold text-gray-900">{base?.label ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sauce</span>
                <span className="font-semibold text-gray-900">{sauce?.label ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cheese</span>
                <span className="font-semibold text-gray-900">{cheese?.label ?? '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Toppings</span>
                <span className="font-semibold text-gray-900 text-right">
                  {toppings.length > 0 ? toppings.map((v) => v.label).join(', ') : 'None'}
                </span>
              </div>
            </div>

            {/* Stock warning if something out of stock */}
            {(!base?.inStock || !sauce?.inStock || !cheese?.inStock) && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-start gap-2 text-sm text-red-700">
                <TriangleExclamation className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  One or more of your selected ingredients is currently out of stock. Please go back and pick
                  an available alternative.
                </span>
              </div>
            )}

            {/* Size Picker */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {SIZES.map((s) => {
                  const isSelected = s.id === size.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`flex-1 rounded-xl border px-4 py-2.5 text-center transition-colors cursor-pointer ${
                        isSelected ? 'border-primary bg-primary/10 font-bold text-primary' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-gray-400">{s.inches}&quot;</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Counter */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Quantity</p>
              <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <Minus width={14} height={14} />
                </button>
                <span className="w-5 text-center text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <Plus width={14} height={14} />
                </button>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 pt-4 gap-4">
              <div>
                <p className="text-xs text-gray-400 font-medium">Calculated Price</p>
                <p className="text-2xl font-bold text-primary">৳{totalPrice.toFixed(2)}</p>
              </div>

              <div className="flex w-full sm:w-auto items-center gap-3">
                <Button
                  variant="outline"
                  isDisabled={isSubmitting || isBuyingNow || !base?.inStock || !sauce?.inStock || !cheese?.inStock}
                  onPress={() => handleSaveToCart(false)}
                  className="flex-1 sm:flex-none border-gray-300 font-semibold"
                >
                  <ShoppingCart width={16} height={16} />
                  {isSubmitting ? 'Adding...' : 'Add to cart'}
                </Button>
                <Button
                  variant="primary"
                  isDisabled={isSubmitting || isBuyingNow || !base?.inStock || !sauce?.inStock || !cheese?.inStock}
                  onPress={() => handleSaveToCart(true)}
                  className="flex-1 sm:flex-none bg-primary text-white font-semibold shadow-md"
                >
                  <Lock width={16} height={16} />
                  {isBuyingNow ? 'Redirecting...' : 'Order Now & Pay'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step Navigation Controls */}
      {step < 4 && (
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onPress={goBack} isDisabled={step === 0}>
            <ArrowLeft width={16} height={16} />
            Back
          </Button>
          <p className="text-sm text-gray-500">
            Current Custom Pizza Price: <span className="font-bold text-primary">৳{unitPrice}</span>
          </p>
          <Button
            variant="primary"
            onPress={goNext}
            isDisabled={!currentSelectionValid && step < 3}
            className="bg-primary text-white disabled:opacity-50"
          >
            Next
            <ArrowRight width={16} height={16} />
          </Button>
        </div>
      )}
      {step === 4 && (
        <div className="mt-6">
          <Button variant="outline" onPress={goBack}>
            <ArrowLeft width={16} height={16} />
            Modify Pizza Recipe
          </Button>
        </div>
      )}
    </div>
  );
}