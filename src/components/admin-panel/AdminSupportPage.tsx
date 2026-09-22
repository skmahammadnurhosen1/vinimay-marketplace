import React, { useState } from 'react';
import {
  Headphones,
  Search,
  Filter,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  ShieldCheck,
} from 'lucide-react';
import { AdminSupportTicket } from '../../types/admin';

interface AdminSupportPageProps {
  tickets: AdminSupportTicket[];
  onSendReply: (
    ticketId: string,
    replyText: string,
    newStatus?: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  ) => void;
}

export const AdminSupportPage: React.FC<AdminSupportPageProps> = ({
  tickets,
  onSendReply,
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyInput, setReplyInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const filteredTickets = tickets.filter((t) => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedTicket) return;
    onSendReply(selectedTicket.id, replyInput.trim(), 'In Progress');
    setReplyInput('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Headphones className="w-6 h-6 text-[#C59B27]" />
            <span>Customer Support Desk & Fitment Resolution</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
            Resolve buyer inquiries, dispatch tracking escalations, and technical vehicle fitment inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-700">Open Tickets:</span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-xs">
            {tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length} Active
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets by number, customer, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Support Categories</option>
            <option value="Order">Order Inquiries</option>
            <option value="Shipping">Shipping & Tracking</option>
            <option value="Return">Return / RMA</option>
            <option value="Warranty">Warranty Claims</option>
            <option value="Technical Fitment">Technical Fitment</option>
            <option value="Payment">Payment & Refunds</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#C59B27]"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Left List, Right Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Ticket List */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden max-h-[600px] overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-xs text-gray-700">
            Support Queue ({filteredTickets.length})
          </div>
          <div className="divide-y divide-gray-100">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-amber-50/70 border-l-4 border-[#C59B27]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-gray-900 text-[11px]">
                      {t.ticketNumber}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        t.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : t.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 truncate">{t.subject}</p>
                  <p className="text-[11px] text-gray-700 mt-0.5">
                    {t.customerName} • <span className="text-[#C59B27] font-semibold">{t.category}</span>
                  </p>

                  <div className="flex items-center justify-between mt-2 text-[10px] text-gray-700">
                    <span>{t.createdAt}</span>
                    <span className={`font-bold ${
                      t.status === 'Resolved' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threaded Messages View */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <>
              {/* Ticket Top Meta */}
              <div className="p-4 sm:p-5 bg-[#16181D] text-white flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-mono text-[#E5C158] font-bold">{selectedTicket.ticketNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold text-[10px]">
                      {selectedTicket.category}
                    </span>
                    <span className="text-gray-400">• Created {selectedTicket.createdAt}</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                    {selectedTicket.subject}
                  </h2>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Customer: <strong className="text-white">{selectedTicket.customerName}</strong> ({selectedTicket.customerPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTicket.status}
                  </span>

                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => onSendReply(selectedTicket.id, 'Issue verified and marked resolved.', 'Resolved')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Message History List */}
              <div className="p-4 sm:p-5 space-y-4 max-h-[380px] overflow-y-auto bg-gray-50/50 flex-1">
                {selectedTicket.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender === 'admin' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-700 mb-1">
                      <span className="font-bold text-gray-800">{msg.senderName}</span>
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'admin'
                          ? 'bg-[#16181D] text-gray-100 rounded-tr-none'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type official response to buyer / workshop..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#C59B27]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#C59B27] hover:bg-[#b08920] text-gray-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-10 text-center text-xs text-gray-700">
              Select a support ticket to inspect conversation thread.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
