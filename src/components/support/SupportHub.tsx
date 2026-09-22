import React, { useState } from 'react';
import { SupportTicket } from '../../types';
import { orderService } from '../../services/orderService';
import {
  MessageSquare,
  Phone,
  Mail,
  Wrench,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Send,
  Plus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';
import { CreateTicketModal } from './CreateTicketModal';
import { useToast } from '../../context/ToastContext';

interface SupportHubProps {
  onNavigateOrders?: () => void;
  onNavigateReturns?: () => void;
  onNavigateWarranties?: () => void;
}

const FAQS = [
  {
    q: 'How does the 100% Fitment Guarantee protect my purchase?',
    a: 'When you select your vehicle (Make, Model, Year, Fuel Type), all parts marked "Guaranteed Fit" are verified against OEM technical catalogs. If a cataloged part does not fit your vehicle during mechanic installation, we provide a 100% free return pickup and a full refund or replacement.'
  },
  {
    q: 'Why did my order arrive in separate packages with different couriers?',
    a: 'AutoPartsHub connects you directly to specialized tier-1 distributors and OEM merchants across India. Because parts are shipped directly from certified regional distribution hubs (e.g. Mumbai, Coimbatore, Bengaluru), each seller package is dispatched independently for maximum speed.'
  },
  {
    q: 'How do I claim a manufacturer warranty for a defective spare part?',
    a: 'Navigate to "My Orders" or "Warranty Claims", locate the delivered item, and click "Claim Warranty". You will need your Order ID, part number, vehicle details, a brief description of the defect, and clear photos or diagnostic test video.'
  },
  {
    q: 'What is the doorstep pickup timeline for return packages?',
    a: 'Once your return request is logged and verified, our reverse courier partner (Delhivery / Blue Dart) will arrange doorstep pickup within 24–48 business hours. Ensure the part is repackaged in its original protective box with all shims and hardware.'
  }
];

export const SupportHub: React.FC<SupportHubProps> = ({
  onNavigateOrders,
  onNavigateReturns,
  onNavigateWarranties
}) => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>(() => orderService.getSupportTickets());
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [newReply, setNewReply] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !activeTicketId) return;

    orderService.addTicketMessage(activeTicketId, newReply.trim());
    setNewReply('');
    setTickets(orderService.getSupportTickets());
    showToast('Reply Sent', 'Your message has been added to the ticket.', 'info');

    // Re-fetch after short delay to show mock support agent reply
    setTimeout(() => {
      setTickets(orderService.getSupportTickets());
    }, 1200);
  };

  const handleTicketCreated = (id: string) => {
    setTickets(orderService.getSupportTickets());
    setActiveTicketId(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#071530] via-blue-900 to-[#071530] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-[#FFBA00] uppercase tracking-wider">
            Customer Care & Technical Fitment Center
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            How Can We Assist Your Workshop Today?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Direct access to dedicated automotive engineers, warranty specialists, and logistics coordinators across India.
          </p>
        </div>
      </div>

      {/* 6 Direct Support Channels */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* WhatsApp */}
        <a
          href="https://wa.me/919820144556?text=Hi%20AutoPartsHub%20Support,%20I%20have%20an%20inquiry%20regarding%20spare%20parts%20fitment"
          target="_blank"
          rel="noreferrer"
          className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-emerald-950">WhatsApp</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Instant Response</span>
        </a>

        {/* Toll-Free Phone */}
        <a
          href="tel:18004192886"
          className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B56D0] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <Phone className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-blue-950">1800-419-AUTO</div>
          <span className="text-[10px] text-blue-700 font-semibold">9 AM – 9 PM Toll-Free</span>
        </a>

        {/* Email Support */}
        <a
          href="mailto:support@autopartshub.in"
          className="p-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-gray-900">Email Desk</div>
          <span className="text-[10px] text-gray-500 font-mono">support@hub.in</span>
        </a>

        {/* Create Ticket */}
        <button
          type="button"
          onClick={() => setIsTicketModalOpen(true)}
          className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFBA00] text-gray-950 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs font-bold">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-amber-950">Support Ticket</div>
          <span className="text-[10px] text-amber-800 font-semibold">Tracked Resolution</span>
        </button>

        {/* Return Support */}
        <button
          type="button"
          onClick={onNavigateReturns}
          className="p-4 rounded-2xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-purple-950">Return Support</div>
          <span className="text-[10px] text-purple-700 font-semibold">10-Day Fitment</span>
        </button>

        {/* Warranty Support */}
        <button
          type="button"
          onClick={onNavigateWarranties}
          className="p-4 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 transition-all text-center flex flex-col items-center justify-center gap-2 group shadow-2xs cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#071530] text-[#FFBA00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-gray-950">Warranty Claim</div>
          <span className="text-[10px] text-blue-700 font-semibold">OEM Protection</span>
        </button>
      </div>

      {/* Interactive Support Tickets Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Active Support Inquiries & Tickets
            </h3>
            <p className="text-xs text-gray-500">
              Select a ticket to view technician responses or send additional questions
            </p>
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsTicketModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            New Ticket
          </Button>
        </div>

        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Tickets List (Left) */}
            <div className="md:col-span-4 space-y-2 max-h-96 overflow-y-auto pr-1">
              {tickets.map(t => (
                <div
                  key={t.id}
                  onClick={() => setActiveTicketId(t.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    activeTicketId === t.id
                      ? 'border-[#0B56D0] bg-blue-50/70 shadow-xs'
                      : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-gray-500">
                      #{t.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-gray-900 truncate">
                    {t.subject}
                  </h5>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                    <span>{t.category}</span>
                    <span>{t.lastUpdate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ticket Thread Detail (Right) */}
            <div className="md:col-span-8 bg-gray-50/50 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between h-96">
              {activeTicket ? (
                <>
                  <div className="pb-2 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">
                        {activeTicket.subject}
                      </h4>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Category: {activeTicket.category} {activeTicket.orderId && `• Order: #${activeTicket.orderId}`}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400">
                      Opened {activeTicket.createdAt}
                    </span>
                  </div>

                  {/* Messages Bubble List */}
                  <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                    {activeTicket.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          m.sender === 'customer' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            m.sender === 'customer'
                              ? 'bg-[#0B56D0] text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs'
                          }`}
                        >
                          <div className="text-[9px] font-bold opacity-75 mb-0.5">
                            {m.sender === 'customer' ? 'You' : 'AutoPartsHub Support Engineer'}
                          </div>
                          {m.text}
                        </div>
                        <span className="text-[9px] text-gray-400 font-mono mt-0.5 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-2 border-t border-gray-200 flex gap-2">
                    <input
                      type="text"
                      value={newReply}
                      onChange={e => setNewReply(e.target.value)}
                      placeholder="Type a follow-up reply..."
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0]"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Send
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-20 text-gray-400 text-xs">
                  Select a ticket on the left to view message history
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500">No open tickets at this time.</p>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6 space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 pb-2 border-b border-gray-100">
          Frequently Answered Automotive Questions
        </h3>

        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs font-bold text-gray-900 hover:text-[#0B56D0] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-gray-600 leading-relaxed mt-2 pt-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSuccess={handleTicketCreated}
      />
    </div>
  );
};
