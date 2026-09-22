import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, Ticket, ArrowRight, CheckCircle2, Headphones } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SupportSection: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Subscribed Successfully', 'You have been enrolled for technical service bulletins & discount drops.', 'success');
      setEmail('');
    }
  };

  const handleRaiseTicket = () => {
    showToast('Support Ticket Portal', 'Opening AutoPartsHub technical resolution desk (Mock demo).', 'info');
  };

  return (
    <section className="py-16 bg-white border-b border-[#ECE7DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Multi-Channel Customer Support */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4E6] border border-[#E8D7B0] text-xs font-bold uppercase tracking-wider text-[#8A6611]">
              <Headphones className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Dedicated Concierge & Support</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16181D]">
              Need Assistance With Part Fitment or Bulk Procurement?
            </h2>

            <p className="text-sm text-stone-500 leading-relaxed max-w-xl">
              Our in-house automotive engineers and commercial vehicle specialists are available across phone, WhatsApp, and support ticketing to assist workshops, fleet operators, and car enthusiasts.
            </p>

            {/* 4 Support Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#FAFAF8] hover:bg-emerald-50/50 border border-stone-200 hover:border-emerald-300 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-emerald-900">
                    WhatsApp Chat Support
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">+91 98765 43210</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href="tel:18002097278"
                className="p-4 rounded-2xl bg-[#FAFAF8] hover:bg-amber-50/50 border border-stone-200 hover:border-amber-300 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-amber-900">
                    Toll-Free Helpline
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono">1800-209-PARTS (9am-9pm)</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@autopartshub.in"
                className="p-4 rounded-2xl bg-[#FAFAF8] hover:bg-blue-50/50 border border-stone-200 hover:border-blue-300 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 group-hover:text-blue-900">
                    Email Technical Desk
                  </div>
                  <div className="text-[11px] text-stone-500">support@autopartshub.in</div>
                </div>
              </a>

              {/* Support Ticket */}
              <button
                type="button"
                onClick={handleRaiseTicket}
                className="p-4 rounded-2xl bg-[#FAFAF8] hover:bg-stone-100 border border-stone-200 hover:border-stone-400 transition-all flex items-center gap-3.5 group cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center shrink-0">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900">Raise a Support Ticket</div>
                  <div className="text-[11px] text-stone-500">Track claim & return status</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Newsletter & Service Bulletins */}
          <div className="lg:col-span-5">
            <div className="p-7 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#E5DFD1] shadow-md space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
                Automotive Newsletter
              </span>
              <h3 className="text-xl font-bold text-stone-900">
                Get OEM Service Bulletins & Fleet Price Drops
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Stay updated with manufacturer recalls, technical service advisories, and seasonal distributor wholesale discounts.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-xs text-stone-900 placeholder-stone-400 rounded-xl border border-stone-300 focus:outline-none focus:border-[#C59B27] shadow-2xs"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#16181D] hover:bg-[#252830] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Subscribe to Marketplace Insights</span>
                  <ArrowRight className="w-4 h-4 text-[#C59B27]" />
                </button>
              </form>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam. Unsubscribe anytime with 1 click.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
