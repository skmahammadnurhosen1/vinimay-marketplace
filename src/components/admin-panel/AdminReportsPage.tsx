import React from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  Package,
  Users,
  RotateCcw,
  CheckCircle2,
  Award,
  AlertTriangle,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Platform Intelligence, Velocity & SLA Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Holistic metrics covering fast-moving part categories, vendor SLA adherence, and return frequencies.
          </p>
        </div>

        <button
          onClick={() => alert('Generating Comprehensive Marketplace Analytics PDF Report...')}
          className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Full Intelligence Pack</span>
        </button>
      </div>

      {/* Grid: 4 Core Report Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Module 1: Top Moving Replacement Parts */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#C59B27]" />
              <span>Fast-Moving SKUs & Velocity Leaders</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              30-Day Window
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { part: 'Brembo Ceramic Front Brake Pads (Hyundai/Kia)', brand: 'Brembo', qty: 340, gmv: '₹11.7L' },
              { part: 'Valeo OE 3-Piece Clutch Kit (Swift/Dzire)', brand: 'Valeo', qty: 210, gmv: '₹14.4L' },
              { part: 'Gabriel Ultra Front Gas Strut (Innova)', brand: 'Gabriel', qty: 180, gmv: '₹7.4L' },
              { part: 'Spicer Heavy-Duty CV Axle Drive Shaft', brand: 'Dana Spicer', qty: 95, gmv: '₹5.4L' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-gray-50 flex items-center justify-between border border-gray-100"
              >
                <div>
                  <span className="font-bold text-gray-900 block line-clamp-1">{item.part}</span>
                  <span className="text-[10px] text-gray-500">Brand: {item.brand}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-gray-900 block">{item.qty} units sold</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{item.gmv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 2: Vendor SLA & Dispatch Performance */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Merchant SLA & On-Time Dispatch Rankings</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-500">Target SLA: &lt; 24h</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Bosch Automotive Aftermarket India', sla: '99.2%', avgDispatch: '6.4 hrs', tier: 'Top Performer' },
              { name: 'TVS Girling & Lucas-TVS Network', sla: '98.5%', avgDispatch: '8.2 hrs', tier: 'Top Performer' },
              { name: 'Apex Drivetrain & Clutch Hub India', sla: '96.1%', avgDispatch: '14.0 hrs', tier: 'Satisfactory' },
              { name: 'Western Axles & Transmission Parts', sla: '95.4%', avgDispatch: '16.5 hrs', tier: 'Satisfactory' },
              { name: 'Royal Auto Spares & Performance Parts', sla: '91.8%', avgDispatch: '21.0 hrs', tier: 'Watchlist' },
            ].map((vendor, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-gray-50 flex items-center justify-between border border-gray-100"
              >
                <div>
                  <span className="font-bold text-gray-900 block truncate max-w-xs">{vendor.name}</span>
                  <span className="text-[10px] text-gray-500">Avg Dispatch: {vendor.avgDispatch}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-emerald-600 block">{vendor.sla} SLA</span>
                  <span className={`text-[10px] font-bold ${
                    vendor.tier === 'Watchlist' ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {vendor.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 3: Return Rate & RMA Root Cause Analysis */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>Return Rate & RMA Root Causes</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-500">Platform Avg: 2.1%</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { reason: 'Product Not Compatible (Fitment mismatch)', pct: 42, color: 'bg-amber-500' },
              { reason: 'Wrong Product Dispatched by Merchant', pct: 24, color: 'bg-blue-500' },
              { reason: 'Logistics Transit Damage (Dents/Cracks)', pct: 18, color: 'bg-rose-500' },
              { reason: 'Manufacturing Defect (Fluid/Seal failure)', pct: 11, color: 'bg-purple-500' },
              { reason: 'Customer Cancelled After Shipment', pct: 5, color: 'bg-gray-400' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{item.reason}</span>
                  <span className="font-bold text-gray-900">{item.pct}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module 4: Platform Geographic Fitment Heatmap */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>Geographic Demand Clusters</span>
            </h3>
            <span className="text-[10px] font-bold text-gray-500">State Hubs</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { state: 'Maharashtra (Mumbai, Pune, Nashik)', gmv: '₹48.2 Lakhs', share: '26%' },
              { state: 'Delhi NCR (Delhi, Gurgaon, Noida)', gmv: '₹39.8 Lakhs', share: '22%' },
              { state: 'Tamil Nadu (Chennai, Coimbatore)', gmv: '₹34.5 Lakhs', share: '19%' },
              { state: 'Karnataka (Bengaluru, Mangaluru)', gmv: '₹31.1 Lakhs', share: '17%' },
              { state: 'Gujarat (Ahmedabad, Surat, Vadodara)', gmv: '₹22.6 Lakhs', share: '12%' },
            ].map((geo, idx) => (
              <div
                key={idx}
                className="p-2 rounded-lg bg-gray-50 flex items-center justify-between border border-gray-100"
              >
                <span className="font-bold text-gray-800">{geo.state}</span>
                <div className="text-right">
                  <strong className="text-gray-900 block">{geo.gmv}</strong>
                  <span className="text-[10px] text-purple-700 font-bold">{geo.share} of GMV</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
