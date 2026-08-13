'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Box } from '@gravity-ui/icons';
import { addInventoryItem } from '@/lib/action/inventory';
import { toast } from 'react-toastify';

export default function AddInventoryItemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'base',
    quantity: 50,
    unit: 'kg',
    minThreshold: 10,
    pricePerUse: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter ingredient name');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await addInventoryItem({
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity) || 0,
        unit: formData.unit,
        minThreshold: Number(formData.minThreshold) || 10,
        price: Number(formData.pricePerUse) || 0,
      });

      if (res?.success) {
        toast.success(`Added "${formData.name}" to pizza making inventory!`);
        router.push('/dashboard/admin/inventory');
      } else {
        toast.error('Failed to add ingredient');
      }
    } catch (err) {
      console.error('Error adding inventory item:', err);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/admin/inventory"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft width={16} height={16} />
          Back to Making Items Inventory
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">Add Pizza Making Item / Ingredient</h1>
        <p className="text-sm text-gray-500">
          Add raw ingredients used for crafting pizzas (e.g. Cheese, Sauce, Flour, Toppings).
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Ingredient Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Mozzarella Cheese, Pepperoni, Oregano, Wheat Flour"
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="base">Base / Crust (used in pizza builder Step 1)</option>
                <option value="sauce">Sauce (used in pizza builder Step 2)</option>
                <option value="cheese">Cheese (used in pizza builder Step 3)</option>
                <option value="topping">Topping / Vegetable (used in pizza builder Step 4)</option>
                <option value="meat">Meat & Poultry (internal use)</option>
                <option value="spice">Spices & Herbs (internal use)</option>
                <option value="other">Other / General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Measurement Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary bg-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="grams">Grams (g)</option>
                <option value="liters">Liters (L)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="bags">Bags / Packets</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="quantity"
                min="0"
                required
                value={formData.quantity}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Alert Threshold</label>
              <input
                type="number"
                name="minThreshold"
                min="1"
                required
                value={formData.minThreshold}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price per Use (৳) — shown in Pizza Builder
              </label>
              <input
                type="number"
                name="pricePerUse"
                min="0"
                step="5"
                value={formData.pricePerUse}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm outline-hidden focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/dashboard/admin/inventory"
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Box width={16} height={16} />
                  Save Ingredient
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
