import React, { useState, useMemo } from 'react';
import { CustomerOrder } from '../../types';
import { OrderCard } from './OrderCard';
import { Search, Package, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '../common/Button';

interface OrdersListPageProps {
  orders: CustomerOrder[];
  onViewOrderDetails: (order: CustomerOrder) => void;
  onTrackOrder: (order: CustomerOrder) => void;
  onRequestReturn?: (order: CustomerOrder) => void;
  onBrowseShop: () => void;
}

export const OrdersListPage: React.FC<OrdersListPageProps> = ({
  orders,
  onViewOrderDetails,
  onTrackOrder,
  onRequestReturn,
  onBrowseShop
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (activeTab === 'processing' && order.overallStatus !== 'processing') return false;
      if (activeTab === 'shipped' && (order.overallStatus !== 'shipped' && order.overallStatus !== 'partially_delivered')) return false;
      if (activeTab === 'delivered' && order.overallStatus !== 'delivered') return false;
      if (activeTab === 'returned' && order.overallStatus !== 'returned') return false;
      if (activeTab === 'cancelled' && order.overallStatus !== 'cancelled') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesSeller = order.packages.some(p => p.sellerName.toLowerCase().includes(q));
        const matchesPart = order.packages.some(p =>
          p.items.some(
            it =>
              it.product.title.toLowerCase().includes(q) ||
              it.product.partNumber.toLowerCase().includes(q) ||
              it.product.brand.toLowerCase().includes(q)
          )
        );
        return matchesId || matchesSeller || matchesPart;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'shipped', label: 'In Transit / Shipped', count: orders.filter(o => o.overallStatus === 'shipped' || o.overallStatus === 'partially_delivered').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.overallStatus === 'delivered').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.overallStatus === 'processing').length },
    { id: 'returned', label: 'Returns', count: orders.filter(o => o.overallStatus === 'returned').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.overallStatus === 'cancelled').length }
  ];

  return (
    <div className="space-y-5">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
            Order History & Consignments
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Track multi-vendor dispatches, manage returns, and access warranty certificates
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Part #, Seller..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#0B56D0]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200 text-xs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#071530] text-[#FFBA00] shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.id ? 'bg-[#FFBA00]/20 text-[#FFBA00]' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={onViewOrderDetails}
              onTrackOrder={onTrackOrder}
              onRequestReturn={onRequestReturn}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center space-y-3">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h4 className="text-sm font-bold text-gray-900">No Orders Found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {searchQuery
              ? `No orders matching "${searchQuery}". Try searching by order number or part name.`
              : `You have no ${activeTab !== 'all' ? activeTab : ''} orders at this time.`}
          </p>
          <Button variant="gold" size="sm" onClick={onBrowseShop} className="mt-2">
            Browse Spare Parts
          </Button>
        </div>
      )}
    </div>
  );
};
