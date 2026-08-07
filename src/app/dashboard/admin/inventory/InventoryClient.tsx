'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, TrashBin, Pencil, Box, Check } from '@gravity-ui/icons';
import { deleteInventoryItem, updateInventoryItem } from '@/lib/action/inventory';
import { toast } from 'react-toastify';

export interface InventoryItem {
  _id: string;
  name: string;
  category?: string;
  quantity: number;
  unit: string;
  minThreshold: number;
}

export default function InventoryClient({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [bulkIncreaseAmount, setBulkIncreaseAmount] = useState<number>(10);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i._id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkIncrease = async () => {
    if (selectedIds.length === 0) return;
    if (bulkIncreaseAmount <= 0) {
      toast.error('Please enter a valid quantity to add');
      return;
    }

    setIsBulkUpdating(true);
    let successCount = 0;

    for (const id of selectedIds) {
      const item = items.find((i) => i._id === id);
      if (!item) continue;
      const newQty = item.quantity + bulkIncreaseAmount;

      try {
        const res = await updateInventoryItem(id, { quantity: newQty });
        if (res?.success) {
          successCount++;
        }
      } catch (e) {
        console.error(`Failed to update ${id}:`, e);
      }
    }

    if (successCount > 0) {
      toast.success(`Increased stock by +${bulkIncreaseAmount} for ${successCount} item(s)!`);
      setItems((prev) =>
        prev.map((item) =>
          selectedIds.includes(item._id)
            ? { ...item, quantity: item.quantity + bulkIncreaseAmount }
            : item
        )
      );
      setSelectedIds([]);
    } else {
      toast.error('Failed to update selected items');
    }

    setIsBulkUpdating(false);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected ingredient(s)?`)) return;

    setIsBulkUpdating(true);
    let deletedCount = 0;

    for (const id of selectedIds) {
      try {
        const res = await deleteInventoryItem(id);
        if (res?.success) {
          deletedCount++;
        }
      } catch (e) {
        console.error(`Failed to delete ${id}:`, e);
      }
    }

    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} ingredient(s)`);
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item._id)));
      setSelectedIds([]);
    } else {
      toast.error('Failed to delete selected items');
    }

    setIsBulkUpdating(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;
    setDeletingId(id);

    try {
      const res = await deleteInventoryItem(id);
      if (res?.success) {
        toast.success(`Deleted ${name} successfully`);
        setItems((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error('Failed to delete item');
      }
    } catch (e) {
      toast.error('Error deleting item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateQty = async (id: string) => {
    try {
      const res = await updateInventoryItem(id, { quantity: editQty });
      if (res?.success) {
        toast.success('Stock quantity updated');
        setItems((prev) =>
          prev.map((i) => (i._id === id ? { ...i, quantity: editQty } : i))
        );
        setEditingItem(null);
      } else {
        toast.error('Failed to update quantity');
      }
    } catch (e) {
      toast.error('Error updating item');
    }
  };

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pizza Making Items & Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Select items to bulk increase stock quantity / weight or manage individual ingredients.
          </p>
        </div>
        <Link
          href="/dashboard/admin/inventory/add"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-xs"
        >
          <Plus width={18} height={18} />
          Add Making Item
        </Link>
      </div>

      {/* Bulk Action Controls Banner */}
      {selectedIds.length > 0 && (
        <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/20 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
              {selectedIds.length}
            </span>
            <span>Items Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200">
              <span className="text-xs text-gray-600 font-medium">Add Stock:</span>
              <input
                type="number"
                min="1"
                value={bulkIncreaseAmount}
                onChange={(e) => setBulkIncreaseAmount(Number(e.target.value))}
                className="w-16 text-center text-xs font-bold text-gray-900 border-none outline-hidden"
              />
            </div>

            <button
              onClick={handleBulkIncrease}
              disabled={isBulkUpdating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors cursor-pointer"
            >
              <Plus width={14} height={14} />
              {isBulkUpdating ? 'Updating...' : `Increase Stock (+${bulkIncreaseAmount})`}
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={isBulkUpdating}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors cursor-pointer"
            >
              <TrashBin width={14} height={14} />
              Delete Selected ({selectedIds.length})
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Box width={24} height={24} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No pizza making items added yet</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm">
            Add ingredients like Mozzarella Cheese, Flour, Tomato Sauce, and Toppings to track stock.
          </p>
          <Link
            href="/dashboard/admin/inventory/add"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white"
          >
            <Plus width={16} height={16} />
            Add First Ingredient
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-6 py-3.5">Ingredient Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Current Stock</th>
                <th className="px-6 py-3.5">Min Alert Level</th>
                <th className="px-6 py-3.5">Stock Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const isSelected = selectedIds.includes(item._id);
                const isLow = item.quantity <= item.minThreshold;

                return (
                  <tr
                    key={item._id}
                    className={`transition-colors ${
                      isSelected ? 'bg-primary/5' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectItem(item._id)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 capitalize">
                      {item.category || 'General'}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-gray-900">
                      {editingItem?._id === item._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-xs"
                          />
                          <button
                            onClick={() => handleUpdateQty(item._id)}
                            className="rounded-lg bg-green-600 px-2 py-1 text-xs font-semibold text-white cursor-pointer"
                          >
                            <Check width={14} height={14} />
                          </button>
                        </div>
                      ) : (
                        <span>
                          {item.quantity} {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      {isLow ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                          ✓ In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setEditQty(item.quantity);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
                          title="Edit Stock"
                        >
                          <Pencil width={16} height={16} />
                        </button>
                        <button
                          disabled={deletingId === item._id}
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Ingredient"
                        >
                          <TrashBin width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
