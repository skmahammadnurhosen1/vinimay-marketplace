import React, { useState } from 'react';
import {
  Headphones,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Zap,
  ArrowRight,
  UserCheck,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  priority: 'Critical' | 'High' | 'Normal';
  status: 'Open' | 'Investigating' | 'Resolved';
  createdAt: string;
  responsePreview: string;
}

export const B2BSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-B2B-8910',
      category: 'Fitment & VIN Verification',
      subject: 'Clutch plate spline count for BharatBenz 2823R (OM926)',
      priority: 'Critical',
      status: 'Investigating',
      createdAt: 'Today, 11:20 AM',
      responsePreview: 'Technical engineer assigned: Verified 10-spline 430mm disc compatibility.',
    },
    {
      id: 'TCK-B2B-8742',
      category: 'Consignment Dispatch',
      subject: 'Expedited dispatch for consignment #CNS-5501 (Wabco Relay Valves)',
      priority: 'High',
      status: 'Resolved',
      createdAt: 'Yesterday',
      responsePreview: 'Dispatched via Blue Dart Air Cargo AWB #889211029. Reaching hub by 6 PM.',
    },
  ]);

  const [category, setCategory] = useState('Fitment & VIN Verification');
  const [priority, setPriority] = useState<'Critical' | 'High' | 'Normal'>('High');
  const [orderRef, setOrderRef] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: `TCK-B2B-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject: orderRef ? `[${orderRef}] ${subject}` : subject,
      priority,
      status: 'Open',
      createdAt: 'Just now',
      responsePreview: 'Ticket received by Priority B2B Technical Desk. Assigned to account manager.',
    };

    setTickets([newTicket, ...tickets]);
    setSubmitted(true);
    setSubject('');
    setMessage('');
    setOrderRef('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Priority Business Support Desk
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Direct access to automotive engineers, fitment specialists, and dedicated dispatch coordinators.
        </p>
      </div>

      {/* Account Manager Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#071530] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Rajesh Sharma</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                  Dedicated Key Account Manager
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Senior Automotive Parts Specialist • 12+ Yrs CV & PV Workshop Experience
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  +91 98200 44122 (Direct Line)
                </span>
                <span className="flex items-center gap-1.5 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  b2b-desk@autopartshub.com
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Avg Response: &lt; 15 mins
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919820044122"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Direct WhatsApp Desk
            </a>
          </div>
        </div>
      </div>

      {/* Grid: Create Ticket vs Tickets History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Create Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <Headphones className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Open a Priority Support Request</h3>
          </div>

          {submitted && (
            <div className="mb-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Ticket submitted successfully! Your account manager has been alerted.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Nature
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Fitment & VIN Verification">Fitment & VIN Verification</option>
                  <option value="Consignment Dispatch">Consignment Dispatch Escalation</option>
                  <option value="Bulk Order Quotation / RFQ">Bulk Order Quotation / RFQ</option>
                  <option value="GST Invoice Amendment">GST Invoice / ITC Amendment</option>
                  <option value="Part Core Exchange">Part Core Exchange / Warranty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                >
                  <option value="Critical">🔴 Critical (Vehicle Down / Bay Blocked)</option>
                  <option value="High">🟡 High (Urgent Delivery Needed)</option>
                  <option value="Normal">🟢 Normal (Technical / Billing Inquiry)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reference Order ID or Part # (Optional)
              </label>
              <input
                type="text"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                placeholder="e.g. B2B-PO-904123 or Part # BP-MB-E350-01"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue or requirement"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description & Vehicle Specs
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify chassis VIN number, engine code, exact symptom, or urgent dispatch timeline..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Priority Ticket
            </button>
          </form>
        </div>

        {/* Right: Active Ticket History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-bold text-slate-900 text-sm mb-3">
              Your Support History ({tickets.length})
            </h3>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-700">{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'Investigating'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <p className="font-medium text-slate-900 text-xs">{t.subject}</p>

                  <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-600">
                    <strong className="text-slate-800">Support Desk: </strong>
                    {t.responsePreview}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{t.category}</span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Business Support SLAs */}
          <div className="bg-blue-50/70 rounded-2xl border border-blue-200/80 p-5 space-y-2.5">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              B2B SLA Guarantees
            </h4>
            <ul className="text-xs text-blue-900/80 space-y-1.5">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>15-Minute Guaranteed SLA for Critical vehicle-down inquiries</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>OEM Part Number & VIN cross-referencing by certified engineers</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct escalation with multi-vendor distribution nodes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
