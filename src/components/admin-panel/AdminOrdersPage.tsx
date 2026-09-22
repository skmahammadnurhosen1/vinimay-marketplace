import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AdminMasterOrder } from '../../types/admin';
import { AdminOrderDetailsModal } from './AdminOrderDetailsModal';

interface AdminOrdersPageProps {
  orders: AdminMasterOrder[];
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<AdminMasterOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      order.orderId.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.phone.includes(q) ||
      order.subOrders.some((s) => s.sellerName.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#C59B27]" />
            <span>Master Marketplace Orders & Routing</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Oversee multi-seller order dispatches, sub-order splits, and consignment deliveries across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Platform Orders:</span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-900 text-xs">
            {orders.length} Active in View
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Master Order ID, customer, seller, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Order Stages</option>
            <option value="Processing">Processing</option>
            <option value="Partially Shipped">Partially Shipped</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Master Order Ref</th>
                <th className="p-3.5">Customer & Destination</th>
                <th className="p-3.5">Fulfillment Packages</th>
                <th className="p-3.5">Order Total</th>
                <th className="p-3.5">Commission</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Overall Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/70 transition">
                  {/* Master Order */}
                  <td className="p-3.5 pl-4">
                    <span className="font-mono font-bold text-gray-900 block text-xs">
                      {order.orderId}
                    </span>
                    <span className="text-[11px] text-gray-700">{order.orderDate}</span>
                  </td>

                  {/* Customer */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">{order.customer.name}</span>
                    <span className="text-[11px] text-gray-700">
                      {order.customer.city}, {order.customer.state}
                    </span>
                  </td>

                  {/* Split Fulfillment */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-bold text-[10px]">
                        {order.subOrders.length} Seller Consignments
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-700 block mt-0.5 truncate max-w-xs">
                      {order.subOrders.map((s) => s.sellerName.split(' ')[0]).join(', ')}
                    </span>
                  </td>

                  {/* Order Total */}
                  <td className="p-3.5 font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  {/* Commission */}
                  <td className="p-3.5 font-bold text-amber-700 bg-amber-50/30">
                    {formatCurrency(order.platformCommissionTotal)}
                  </td>

                  {/* Payment */}
                  <td className="p-3.5">
                    <span className="font-semibold text-gray-800 block">{order.paymentMethod}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Decompose</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hierarchical Order Details Modal */}
      {selectedOrder && (
        <AdminOrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
