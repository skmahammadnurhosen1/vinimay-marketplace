import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  Truck,
  MapPin,
} from 'lucide-react';
import {
  ManufacturerOrder,
} from '../../types/manufacturer';

interface ManufacturerOrdersPageProps {
  orders: ManufacturerOrder[];
  onViewOrderDetails: (order: ManufacturerOrder) => void;
}

export const ManufacturerOrdersPage: React.FC<ManufacturerOrdersPageProps> = ({
  orders,
  onViewOrderDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dealerFilter, setDealerFilter] = useState<string>('all');

  const dealers = useMemo(() => {
    const list = new Set(orders.map(o => o.sellerConsignment.sellerName));
    return Array.from(list);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerCity.toLowerCase().includes(q) ||
        o.sellerConsignment.sellerName.toLowerCase().includes(q) ||
        o.sellerConsignment.trackingNumber.toLowerCase().includes(q) ||
        o.items.some(i => i.partNumber.toLowerCase().includes(q) || i.productTitle.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
      const matchesDealer = dealerFilter === 'all' || o.sellerConsignment.sellerName === dealerFilter;

      return matchesSearch && matchesStatus && matchesDealer;
    });
  }, [orders, searchTerm, statusFilter, dealerFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#0284C7]" />
            <span>Marketplace Orders & Consignments</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor dealer consignments, carrier tracking milestones, and fulfilled marketplace customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 font-medium">
          <Truck className="w-4 h-4 text-[#0284C7]" />
          <span>Multi-Vendor Consignment Architecture</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID, Dealer, Customer City, Tracking AWB..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Order Statuses</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Returned">Returned</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={dealerFilter}
              onChange={e => setDealerFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Sellers / Dealers</option>
              {dealers.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Showing <strong className="text-gray-900">{filteredOrders.length}</strong> orders</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-[#0284C7] hover:underline cursor-pointer"
            >
              Reset search
            </button>
          )}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-gray-200 shadow-xs text-center space-y-2">
          <ShoppingCart className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Consignment Seller</th>
                    <th className="py-3 px-4">Products & Qty</th>
                    <th className="py-3 px-4">Customer Destination</th>
                    <th className="py-3 px-4">Carrier & Tracking</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Order ID & Date */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onViewOrderDetails(o)}
                          className="font-mono font-bold text-[#0284C7] hover:underline block text-left cursor-pointer"
                        >
                          {o.id}
                        </button>
                        <span className="text-[10px] text-gray-500 block">{o.orderDate}</span>
                      </td>

                      {/* Consignment Seller */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-900 truncate max-w-[160px]">
                          {o.sellerConsignment.sellerName}
                        </div>
                        <span className="text-[10px] text-gray-500 block truncate">
                          {o.sellerConsignment.sellerLocation}
                        </span>
                      </td>

                      {/* Products */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-xs">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="truncate text-gray-800">
                              <span className="font-mono text-[#0284C7] text-[10px] font-semibold mr-1">
                                [{it.partNumber}]
                              </span>
                              <span>{it.productTitle}</span>
                              <span className="text-gray-500 text-[10px] ml-1">× {it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Customer Destination */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{o.customerName}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0 text-gray-400" />
                          <span>{o.customerCity}, {o.customerState}</span>
                        </div>
                      </td>

                      {/* Carrier & Tracking */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{o.sellerConsignment.courierPartner}</div>
                        <span className="text-[10px] font-mono text-gray-500 block">
                          AWB: {o.sellerConsignment.trackingNumber}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-gray-900">₹{o.totalAmount.toLocaleString('en-IN')}</div>
                        <span className="text-[10px] text-gray-500">{o.totalUnits} units</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.orderStatus === 'Shipped'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {o.orderStatus}
                        </span>
                        {o.returnStatus !== 'None' && (
                          <span className="block text-[10px] text-orange-600 font-semibold mt-0.5">
                            Return: {o.returnStatus}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewOrderDetails(o)}
                          className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-xs font-medium transition cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map(o => (
              <div
                key={o.id}
                className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#0284C7] text-xs">{o.id}</span>
                    <span className="text-[10px] text-gray-500 block">{o.orderDate}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.orderStatus === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {o.orderStatus}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs space-y-1">
                  <div className="text-gray-800 font-medium">Consignment via: {o.sellerConsignment.sellerName}</div>
                  <div className="text-gray-600 text-[11px]">
                    Destination: {o.customerCity}, {o.customerState} ({o.customerName})
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    Tracking: {o.sellerConsignment.courierPartner} • {o.sellerConsignment.trackingNumber}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="font-bold text-gray-900 text-sm">₹{o.totalAmount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-gray-500 block">{o.totalUnits} items</span>
                  </div>
                  <button
                    onClick={() => onViewOrderDetails(o)}
                    className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white font-semibold text-xs transition cursor-pointer"
                  >
                    View Consignment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
