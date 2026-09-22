import React, { useState, useMemo } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SellerOrder, SellerShipmentState } from '../../types/seller';
import { SellerOrderDetailsModal } from './SellerOrderDetailsModal';

interface SellerOrdersPageProps {
  orders: SellerOrder[];
  onUpdateShipment: (
    orderId: string,
    newStatus: SellerShipmentState,
    courier?: string,
    trackingNum?: string
  ) => void;
}

export const SellerOrdersPage: React.FC<SellerOrdersPageProps> = ({
  orders,
  onUpdateShipment
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Consignments', count: orders.length },
    {
      id: 'ordered',
      label: 'Pending Pack',
      count: orders.filter(o => o.shipmentState === 'ordered').length
    },
    {
      id: 'packed',
      label: 'Ready for Dispatch',
      count: orders.filter(o => o.shipmentState === 'packed').length
    },
    {
      id: 'shipped',
      label: 'In Transit',
      count: orders.filter(o => o.shipmentState === 'shipped').length
    },
    {
      id: 'delivered',
      label: 'Delivered',
      count: orders.filter(o => o.shipmentState === 'delivered').length
    }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchFilter = selectedFilter === 'all' || o.shipmentState === selectedFilter;
      const matchSearch =
        !searchQuery.trim() ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.marketplaceOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        o.customerSummary.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchFilter && matchSearch;
    });
  }, [orders, selectedFilter, searchQuery]);

  const getStatusBadge = (state: SellerShipmentState) => {
    switch (state) {
      case 'ordered':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'packed':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-900 border-purple-200';
      case 'out_for_delivery':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      default:
        return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Search */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Merchant Consignments ({filteredOrders.length})
            </h2>
            <p className="text-xs text-stone-500">
              Each order package dispatches independently under your store's logistics manifest
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search Package, Order ID, or City..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#C59B27]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-stone-100 pt-3">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tab.id
                  ? 'bg-[#16181D] text-white font-bold shadow-xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedFilter === tab.id ? 'bg-[#C59B27] text-stone-950 font-bold' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs hover:border-stone-300 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-stone-950">
                    {order.id}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    (Marketplace Order: <strong>{order.marketplaceOrderId}</strong>)
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{order.orderDate}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(
                      order.shipmentState
                    )}`}
                  >
                    {order.shipmentState.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-stone-600 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                    {order.paymentState}
                  </span>
                </div>
              </div>

              {/* Items & Details Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Product details (7 cols) */}
                <div className="lg:col-span-7 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-contain bg-stone-50 border border-stone-200 p-1 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[11px] text-stone-500 font-mono mt-0.5">
                          <span>PN: {item.partNumber}</span>
                          <span>• Qty: <strong>{item.quantity}</strong></span>
                          <span>• ₹{item.unitPrice} each</span>
                        </div>
                        {item.vehicleSummary && (
                          <span className="text-[10px] text-emerald-700 font-semibold block">
                            Fitment: {item.vehicleSummary}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer destination (2 cols) */}
                <div className="lg:col-span-2 text-xs text-stone-600 border-l border-stone-100 pl-3">
                  <span className="text-stone-400 text-[10px] block">Customer Delivery</span>
                  <span className="font-semibold text-stone-900 block">
                    {order.customerSummary.maskedName}
                  </span>
                  <span className="text-stone-500 text-[11px] block">
                    {order.customerSummary.city}, {order.customerSummary.state} ({order.customerSummary.pincode})
                  </span>
                </div>

                {/* Financials & Action (3 cols) */}
                <div className="lg:col-span-3 flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-stone-100 pt-2 sm:pt-0 sm:pl-4 text-right space-y-1">
                  <div>
                    <span className="text-stone-400 text-[10px] block">Package Value</span>
                    <span className="text-base font-extrabold text-stone-950 font-mono">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      Net Payout: ₹{order.netPayout.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="px-3.5 py-1.5 bg-[#16181D] hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Consignment</span>
                      <ArrowRight className="w-3 h-3 text-[#C59B27]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Courier Status Strip */}
              <div className="flex items-center justify-between text-[11px] bg-stone-50 px-3 py-2 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-600">
                  <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>
                    Carrier: <strong>{order.courierName}</strong>
                  </span>
                  <span>• Tracking AWB: <strong className="font-mono">{order.trackingNumber}</strong></span>
                </div>
                <span className="text-stone-500">
                  Est. Delivery: <strong>{order.estimatedDelivery}</strong>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <Package className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="text-sm font-bold text-stone-900">No consignments in this status</h3>
            <p className="text-xs text-stone-500">
              Orders matching "{selectedFilter}" will appear here when customers place an order.
            </p>
          </div>
        )}
      </div>

      {/* Details & Shipment Management Modal */}
      <SellerOrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, courier, tracking) => {
          onUpdateShipment(id, status, courier, tracking);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};
