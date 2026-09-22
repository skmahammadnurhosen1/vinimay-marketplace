import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  ManufacturerDealer,
} from '../../types/manufacturer';

interface ManufacturerDealersPageProps {
  dealers: ManufacturerDealer[];
}

export const ManufacturerDealersPage: React.FC<ManufacturerDealersPageProps> = ({
  dealers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDealers = useMemo(() => {
    return dealers.filter(d => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        d.dealerName.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.contactPerson.toLowerCase().includes(q);

      const matchesTier = tierFilter === 'all' || d.dealerType === tierFilter;
      const matchesStatus = statusFilter === 'all' || d.contractStatus === statusFilter;

      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [dealers, searchTerm, tierFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#0284C7]" />
            <span>Dealer & Seller Network Performance</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Audit channel sales velocity, return rates, warranty frequencies, and commercial authorized dealer SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Channel Quality Compliance Active</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dealer Name, City, State, Contact Person..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Dealer Tiers</option>
              <option value="Authorized Distributor">Authorized Distributor</option>
              <option value="OEM Partner">OEM Partner</option>
              <option value="Certified Wholesaler">Certified Wholesaler</option>
              <option value="Verified Retailer">Verified Retailer</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl bg-white border border-gray-300 text-gray-800 focus:outline-none focus:border-[#0284C7]"
            >
              <option value="all">All Contract Statuses</option>
              <option value="Active Authorized">Active Authorized</option>
              <option value="Under Audit">Under Audit</option>
              <option value="Renewal Pending">Renewal Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Displaying <strong className="text-gray-900">{filteredDealers.length}</strong> certified channel partners</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-[#0284C7] hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table / List */}
      {filteredDealers.length === 0 ? (
        <div className="p-12 rounded-2xl bg-white border border-gray-200 shadow-xs text-center space-y-2">
          <Users className="w-8 h-8 text-gray-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-900">No Dealers Found</h3>
          <p className="text-xs text-gray-500">Try changing your search or tier filter.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Dealer Name & Tier</th>
                    <th className="py-3 px-4">Territory / Location</th>
                    <th className="py-3 px-4">Brand SKUs</th>
                    <th className="py-3 px-4">Units Sold</th>
                    <th className="py-3 px-4">Revenue Generated</th>
                    <th className="py-3 px-4">Return Rate</th>
                    <th className="py-3 px-4">Warranty Activity</th>
                    <th className="py-3 px-4">Rating / Trend</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDealers.map(d => {
                    const isHighReturn = d.returnRate > 2.0;

                    return (
                      <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Dealer Name */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900 text-xs">{d.dealerName}</div>
                          <span className="text-[10px] text-[#0284C7] font-semibold block">{d.dealerType}</span>
                          <span className="text-[10px] text-gray-500">POC: {d.contactPerson}</span>
                        </td>

                        {/* Location */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-medium text-gray-900">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{d.city}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 block">{d.state}</span>
                        </td>

                        {/* SKUs */}
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900">{d.productsSold}</span>
                          <span className="text-[10px] text-gray-500 block">active parts</span>
                        </td>

                        {/* Units Sold */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-gray-900">{d.unitsSold.toLocaleString('en-IN')}</div>
                          <span className="text-[10px] text-gray-500">{d.ordersCount} orders</span>
                        </td>

                        {/* Revenue */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-extrabold text-gray-900 text-xs">
                            ₹{(d.revenue / 100000).toFixed(2)} Lakhs
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold">100% Settled</span>
                        </td>

                        {/* Return Rate */}
                        <td className="py-3 px-4 font-mono">
                          <div className={`font-bold ${isHighReturn ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {d.returnRate.toFixed(1)}%
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {isHighReturn ? 'Exceeds 2% SLA' : 'Compliant'}
                          </span>
                        </td>

                        {/* Warranty */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-gray-900">{d.warrantyClaimsCount}</span>
                          <span className="text-[10px] text-gray-500 block">claims filed</span>
                        </td>

                        {/* Rating & Trend */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-gray-900">{d.performanceRating}</span>
                            {d.trend === 'up' ? (
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                            ) : d.trend === 'down' ? (
                              <TrendingDown className="w-3.5 h-3.5 text-rose-600 ml-1" />
                            ) : (
                              <Minus className="w-3.5 h-3.5 text-gray-400 ml-1" />
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              d.contractStatus === 'Active Authorized'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {d.contractStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredDealers.map(d => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-xs text-gray-900">{d.dealerName}</h3>
                    <span className="text-[10px] text-[#0284C7] font-semibold block">{d.dealerType}</span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {d.city}, {d.state}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      d.contractStatus === 'Active Authorized'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {d.contractStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Revenue Generated</span>
                    <span className="font-bold text-gray-900 font-mono">₹{(d.revenue / 100000).toFixed(2)}L</span>
                    <span className="text-[10px] text-gray-500 block">{d.unitsSold} units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block">Return & Warranty</span>
                    <span className={`font-bold font-mono ${d.returnRate > 2.0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {d.returnRate.toFixed(1)}% Return
                    </span>
                    <span className="text-[10px] text-gray-500 block">{d.warrantyClaimsCount} claims filed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                  <span>POC: {d.contactPerson} ({d.phone})</span>
                  <div className="flex items-center gap-1 font-bold text-gray-900">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{d.performanceRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
