import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Building2,
  FileCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AdminSeller,
  AdminSellerType,
  AdminSellerStatus,
  AdminDocumentVerificationStatus,
} from '../../types/admin';
import { AdminSellerReviewModal } from './AdminSellerReviewModal';

interface AdminSellersPageProps {
  sellers: AdminSeller[];
  onUpdateStatus: (sellerId: string, status: AdminSellerStatus) => void;
  onUpdateCommission: (sellerId: string, rate: number) => void;
  onUpdateDocumentStatus: (
    sellerId: string,
    docId: string,
    status: AdminDocumentVerificationStatus,
    notes?: string
  ) => void;
}

export const AdminSellersPage: React.FC<AdminSellersPageProps> = ({
  sellers,
  onUpdateStatus,
  onUpdateCommission,
  onUpdateDocumentStatus,
}) => {
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesType =
      selectedTypeFilter === 'all' || seller.sellerType === selectedTypeFilter;
    const matchesStatus =
      selectedStatusFilter === 'all' || seller.accountStatus === selectedStatusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      seller.businessName.toLowerCase().includes(query) ||
      seller.ownerName.toLowerCase().includes(query) ||
      seller.gstin.toLowerCase().includes(query) ||
      seller.city.toLowerCase().includes(query);
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C59B27]" />
            <span>Seller Operations & KYC Governance</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Classify and verify Manufacturers, Authorized Distributors, Certified Wholesalers, and Retailers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Total Registered:</span>
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 font-bold text-gray-900 text-xs">
            {sellers.length} Merchants
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business name, owner, GSTIN, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Seller Classifications</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Authorized Distributor">Authorized Distributor</option>
            <option value="Certified Wholesaler">Certified Wholesaler</option>
            <option value="Verified Retailer">Verified Retailer</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Account Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-4">Merchant Entity</th>
                <th className="p-3.5">Classification</th>
                <th className="p-3.5">Tax Identifiers</th>
                <th className="p-3.5">City / State</th>
                <th className="p-3.5">Orders & GMV</th>
                <th className="p-3.5">Take Rate</th>
                <th className="p-3.5">KYC Status</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50/70 transition">
                  {/* Entity */}
                  <td className="p-3.5 pl-4">
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">
                        {seller.businessName}
                      </span>
                      <span className="text-[11px] text-gray-700">
                        {seller.ownerName} • {seller.mobile}
                      </span>
                    </div>
                  </td>

                  {/* Classification */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        seller.sellerType === 'Manufacturer'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : seller.sellerType === 'Authorized Distributor'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : seller.sellerType === 'Certified Wholesaler'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}
                    >
                      {seller.sellerType}
                    </span>
                  </td>

                  {/* Tax Identifiers */}
                  <td className="p-3.5 font-mono text-[11px] text-gray-600">
                    <div>GST: {seller.gstin}</div>
                    <div>PAN: {seller.pan}</div>
                  </td>

                  {/* Location */}
                  <td className="p-3.5 text-gray-700">
                    {seller.city}, {seller.state}
                  </td>

                  {/* GMV */}
                  <td className="p-3.5">
                    <span className="font-bold text-gray-900 block">
                      {formatCurrency(seller.totalSales)}
                    </span>
                    <span className="text-[11px] text-gray-700">
                      {seller.totalOrders} completed
                    </span>
                  </td>

                  {/* Take Rate */}
                  <td className="p-3.5">
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {seller.commissionRate}%
                    </span>
                  </td>

                  {/* KYC Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        seller.kycStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : seller.kycStatus === 'Requires Action'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {seller.kycStatus === 'Verified' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{seller.kycStatus}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        seller.accountStatus === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : seller.accountStatus === 'Under Review'
                          ? 'bg-blue-100 text-blue-800'
                          : seller.accountStatus === 'Suspended'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {seller.accountStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setSelectedSeller(seller)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Review KYC</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedSeller && (
        <AdminSellerReviewModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
          onUpdateStatus={(id, status) => {
            onUpdateStatus(id, status);
            setSelectedSeller((prev) => (prev ? { ...prev, accountStatus: status } : null));
          }}
          onUpdateCommission={(id, rate) => {
            onUpdateCommission(id, rate);
            setSelectedSeller((prev) => (prev ? { ...prev, commissionRate: rate } : null));
          }}
          onUpdateDocumentStatus={(sellerId, docId, status, notes) => {
            onUpdateDocumentStatus(sellerId, docId, status, notes);
            setSelectedSeller((prev) => {
              if (!prev) return null;
              const updatedDocs = prev.documents.map((d) =>
                d.id === docId ? { ...d, status, notes: notes || d.notes } : d
              );
              return { ...prev, documents: updatedDocs };
            });
          }}
        />
      )}
    </div>
  );
};
