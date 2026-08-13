'use client';

import { useState } from 'react';
import { ShoppingBag } from '@gravity-ui/icons';
import { updateOrderStatus } from '@/lib/action/orders';
import { toast } from 'react-toastify';

interface OrderItem {
  description?: string;
  name?: string;
  quantity: number;
  amount?: number;
}

interface Order {
  _id: string;
  stripeSessionId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  totalPrice: number;
  deliveryStatus?: 'Cooking' | 'On Delivery' | 'Delivered' | string;
  status?: string;
  createdAt?: string;
  items?: OrderItem[];
}

function getStatusRank(status?: string): number {
  const norm = (status || '').toLowerCase().trim();
  if (norm === 'delivered') return 3;
  if (norm === 'on delivery' || norm === 'delivering' || norm === 'delivery') return 2;
  return 1; // Default to Cooking (1)
}

export default function AdminOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const targetOrder = orders.find((o) => o._id === orderId);
    const currentRank = getStatusRank(targetOrder?.deliveryStatus);
    const newRank = getStatusRank(newStatus);

    if (newRank < currentRank) {
      toast.error(`Cannot revert delivery status backwards from "${targetOrder?.deliveryStatus || 'Cooking'}" to "${newStatus}"`);
      return;
    }

    setUpdatingId(orderId);

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, deliveryStatus: newStatus } : o))
    );

    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        toast.success(`Delivery status updated to "${newStatus}"`);
      } else {
        throw new Error(res?.error || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error(err?.message || 'Failed to update status in database');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 px-6 py-8 md:px-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders & Delivery Management</h1>
          <p className="mt-1 text-sm text-gray-500">Update customer delivery status (Cooking ➔ On Delivery ➔ Delivered).</p>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          Total Orders: {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 py-16 text-center bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
            <ShoppingBag width={24} height={24} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No orders yet</h3>
          <p className="text-xs text-gray-500 mt-1">Orders will appear here automatically when customers complete checkout.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Contact & Address</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Total Paid</th>
                <th className="px-6 py-3.5">Delivery Status</th>
                <th className="px-6 py-3.5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => {
                const isUpdating = updatingId === order._id;
                const status = order.deliveryStatus || 'Cooking';
                const currentRank = getStatusRank(status);

                return (
                  <tr key={order._id || order.stripeSessionId} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {order.customerName || 'Customer'}
                      {order.customerEmail && (
                        <p className="text-xs font-normal text-gray-500">{order.customerEmail}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium text-gray-800">{order.customerPhone || 'N/A'}</p>
                      <p className="text-gray-500 line-clamp-1 max-w-xs">{order.customerAddress || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {order.items.map((item, idx) => (
                            <span key={idx} className="text-gray-700">
                              <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.name || item.description || 'Pizza Item'}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      ৳{Number(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {/* Delivery Status Dropdown */}
                      <select
                        disabled={isUpdating || currentRank === 3}
                        value={status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold border outline-hidden transition-all ${
                          currentRank === 3
                            ? 'cursor-not-allowed bg-green-100 border-green-300 text-green-800 opacity-90'
                            : 'cursor-pointer ' + (
                                status === 'On Delivery'
                                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                                  : 'bg-amber-50 border-amber-300 text-amber-800'
                              )
                        }`}
                      >
                        <option value="Cooking" disabled={currentRank > 1}>
                          👨‍🍳 Cooking
                        </option>
                        <option value="On Delivery" disabled={currentRank > 2}>
                          🛵 On Delivery
                        </option>
                        <option value="Delivered">
                          🎉 Delivered
                        </option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
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
