import React, { useState, useEffect } from 'react';
import {
  Package,
  FileText,
  RefreshCw,
  Eye,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Filter,
  Check,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { B2BOrder } from '../../types/b2b';
import { b2bService } from '../../services/b2bService';

interface B2BPurchaseHistoryPageProps {
  onViewOrder: (order: B2BOrder) => void;
  onViewInvoice: (invoiceNumber: string) => void;
  onReorder: (order: B2BOrder) => void;
  onGoToProducts: () => void;
}

export const B2BPurchaseHistoryPage: React.FC<B2BPurchaseHistoryPageProps> = ({
  onViewOrder,
  onViewInvoice,
  onReorder,
  onGoToProducts,
}) => {
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setOrders(b2bService.getOrders());
    update();
    const unsub = b2bService.subscribe(update);
    return unsub;
  }, []);

  const handleReorderClick = (order: B2BOrder) => {
    onReorder(order);
    setReorderedId(order.orderId);
    setTimeout(() => setReorderedId(null), 2500);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.consignments.some((c) =>
        c.items.some(
          (i) =>
            i.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            i.product.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

    const matchesStatus =
      statusFilter === 'all' ||
      order.orderStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalSpent = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const totalUnits = orders.reduce((sum, o) => sum + o.totalUnits, 0);

  const getStatusBadge = (status: B2BOrder['orderStatus']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Delivered
          </span>
        );
      case 'Shipped':
      case 'Partially Shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Truck className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'Processing':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Purchase Orders & History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track multi-vendor dispatches, download GST invoices, and 1-click reorder recurring stock.
          </p>
        </div>
        <button
          onClick={onGoToProducts}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm self-start sm:self-auto text-sm"
        >
          <Package className="w-4 h-4" />
          Browse Wholesale Catalog
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Purchase Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
          <span className="text-[11px] text-slate-400">All lifetime orders</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cumulative Spend</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Inclusive of 18% GST ITC</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Units Procured</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalUnits.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-slate-400">Verified OEM & Genuine parts</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Invoices Generated</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{orders.length}</p>
          <span className="text-[11px] text-slate-400">HSN 8708 compliant</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by PO number, invoice #, part name or part number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {(['all', 'processing', 'shipped', 'delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap capitalize ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No purchase orders found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try changing your search keywords or filter settings.'
              : 'You have not placed any B2B wholesale orders yet.'}
          </p>
          <button
            onClick={onGoToProducts}
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Start Ordering
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isReordered = reorderedId === order.orderId;
            return (
              <div
                key={order.orderId}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:px-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-slate-900 text-base">
                      {order.orderId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200 text-slate-700">
                      <Building2 className="w-3 h-3" />
                      {order.businessName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {getStatusBadge(order.orderStatus)}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Left: Decomposed Consignments Overview & Parts */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        <strong className="text-slate-800">{order.consignments.length}</strong> Seller{' '}
                        {order.consignments.length === 1 ? 'Consignment' : 'Consignments'} •{' '}
                        <strong className="text-slate-800">{order.totalUnits}</strong> Total Pieces
                      </span>
                    </div>

                    {/* Consignments summary tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {order.consignments.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                        >
                          <Truck className="w-3 h-3 text-slate-400" />
                          <span className="font-medium">{c.sellerName}</span>
                          <span className="text-slate-400 font-mono">({c.items.length} SKUs)</span>
                        </span>
                      ))}
                    </div>

                    {/* Item Thumbnails & Titles */}
                    <div className="space-y-1.5 pt-1">
                      {order.consignments.flatMap((c) => c.items).slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs text-slate-700">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-9 h-9 object-cover rounded border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-slate-800 truncate">{item.product.title}</p>
                            <p className="text-[11px] text-slate-500 font-mono">
                              Part: {item.product.partNumber} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.totalUnits > 2 && (
                        <p className="text-[11px] text-blue-600 font-medium">
                          + more items in order details
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle: Financials */}
                  <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400">Grand Total</p>
                      <p className="text-xl font-bold text-slate-900">
                        ₹{order.grandTotal.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Taxable: ₹{order.subtotal.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        GST: ₹{order.gstTotal.toLocaleString('en-IN')} (ITC)
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-stretch justify-end gap-2 border-t lg:border-t-0 border-slate-100 pt-3 lg:pt-0">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      View Consignments
                    </button>

                    <button
                      onClick={() => onViewInvoice(order.invoiceNumber)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      GST Invoice
                    </button>

                    <button
                      onClick={() => handleReorderClick(order)}
                      disabled={isReordered}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isReordered
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {isReordered ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          1-Click Reorder
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
