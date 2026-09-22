import React, { useState } from 'react';
import { Settings, Clock, Bell, Shield, MapPin, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SellerSettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [dispatchCutoff, setDispatchCutoff] = useState('04:00 PM');
  const [isHolidayMode, setIsHolidayMode] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoPackSlip, setAutoPackSlip] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Merchant store settings updated successfully.', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
        <h2 className="text-base font-bold text-stone-900">Store & Warehouse Settings</h2>
        <p className="text-xs text-stone-500">
          Configure warehouse logistics cutoffs, holiday mode, and notification channels
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* Logistics & Dispatch Cutoff */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C59B27]" />
            <span>Warehouse Logistics & Cutoff Times</span>
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Same-Day Dispatch Cutoff Time</label>
              <select
                value={dispatchCutoff}
                onChange={e => setDispatchCutoff(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-stone-200 rounded-xl font-semibold text-stone-900 cursor-pointer"
              >
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM (Recommended)</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                Orders received before this cutoff must be packed on the same business day to preserve merchant dispatch SLA rating.
              </p>
            </div>

            {/* Holiday Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <span className="font-bold text-stone-900 block">Holiday / Vacation Mode</span>
                <span className="text-[11px] text-stone-500">
                  Temporarily pause order intake when warehouse is closed for inventory audit or regional holidays.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsHolidayMode(!isHolidayMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  isHolidayMode ? 'bg-[#C59B27]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isHolidayMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C59B27]" />
            <span>Alerts & Notifications</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <span className="font-semibold text-stone-800">
                Instant SMS Dispatch Requisition Alerts
              </span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={e => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#C59B27] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <span className="font-semibold text-stone-800">
                Email Notifications for Customer Returns & Warranties
              </span>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={e => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#C59B27] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
              <span className="font-semibold text-stone-800">
                Auto-generate PDF Packing Slips with GST Invoices
              </span>
              <input
                type="checkbox"
                checked={autoPackSlip}
                onChange={e => setAutoPackSlip(e.target.checked)}
                className="w-4 h-4 accent-[#C59B27] rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#16181D] hover:bg-stone-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
