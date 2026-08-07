'use client';

import { useState } from 'react';
import { updateSettings } from '@/lib/action/settings';
import { toast } from 'react-toastify';
import { Gear, CircleCheckFill } from '@gravity-ui/icons';

interface StoreSettings {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  [key: string]: unknown;
}

export default function AdminSettingsClient({ settings }: { settings: StoreSettings }) {
  const [threshold, setThreshold] = useState(settings.freeDeliveryThreshold ?? 1500);
  const [deliveryFee, setDeliveryFee] = useState(settings.deliveryFee ?? 60);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSettings({ freeDeliveryThreshold: threshold, deliveryFee });
      if (res?.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings.');
      }
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Gear width={20} height={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="mt-0.5 text-sm text-gray-500">Configure delivery fees and free delivery threshold</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-base font-semibold text-gray-800 border-b border-gray-100 pb-4">
          Delivery Configuration
        </h2>

        <div className="flex flex-col gap-6">
          {/* Free Delivery Threshold */}
          <div>
            <label
              htmlFor="freeDeliveryThreshold"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Free Delivery Threshold (৳)
            </label>
            <p className="mb-2 text-xs text-gray-400">
              Orders above this amount get free delivery. Currently set to ৳{threshold}.
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                ৳
              </span>
              <input
                id="freeDeliveryThreshold"
                type="number"
                min={0}
                step={50}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-sm font-medium text-gray-900 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Standard Delivery Fee */}
          <div>
            <label
              htmlFor="deliveryFee"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Standard Delivery Fee (৳)
            </label>
            <p className="mb-2 text-xs text-gray-400">
              Delivery fee charged when order total is below the free delivery threshold.
            </p>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                ৳
              </span>
              <input
                id="deliveryFee"
                type="number"
                min={0}
                step={5}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-sm font-medium text-gray-900 transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">Live Preview</p>
            <p className="text-sm text-gray-700">
              Orders under <span className="font-bold text-gray-900">৳{threshold}</span> → delivery fee{' '}
              <span className="font-bold text-gray-900">৳{deliveryFee}</span>
            </p>
            <p className="text-sm text-gray-700">
              Orders <span className="font-bold text-green-600">৳{threshold}+</span> → delivery is{' '}
              <span className="font-bold text-green-600">FREE 🎉</span>
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <CircleCheckFill width={16} height={16} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
