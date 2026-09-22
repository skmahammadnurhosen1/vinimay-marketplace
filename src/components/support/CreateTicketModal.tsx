import React, { useState } from 'react';
import { orderService } from '../../services/orderService';
import { X, Send, Wrench, MessageSquare } from 'lucide-react';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';

interface CreateTicketModalProps {
  initialOrderId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticketId: string) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  initialOrderId = '',
  isOpen,
  onClose,
  onSuccess
}) => {
  const { showToast } = useToast();

  const [category, setCategory] = useState<
    'Order' | 'Shipping' | 'Return' | 'Warranty' | 'Technical Fitment' | 'Payment'
  >('Technical Fitment');
  const [orderId, setOrderId] = useState(initialOrderId);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('Required Fields', 'Please enter both subject and message.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticket = orderService.createSupportTicket({
        subject: subject.trim(),
        category,
        orderId: orderId.trim() || undefined,
        messages: [
          {
            sender: 'customer',
            text: message.trim(),
            timestamp: 'Just now'
          }
        ]
      });

      setIsSubmitting(false);
      showToast('Ticket Created', `Support Ticket #${ticket.id} opened.`, 'success');
      onSuccess(ticket.id);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B56D0] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Raise Technical Support Ticket
              </h3>
              <p className="text-xs text-gray-500">
                Assigned directly to automotive specialists
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Issue Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as typeof category)}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#0B56D0] cursor-pointer font-semibold"
            >
              <option value="Technical Fitment">Technical Fitment & Vehicle Verification</option>
              <option value="Order">Order Changes / Cancellations</option>
              <option value="Shipping">Shipping & Courier Logistics Delay</option>
              <option value="Return">Return / Replacement Request Help</option>
              <option value="Warranty">Manufacturer Warranty Claim</option>
              <option value="Payment">Payment & GST Invoice</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Marketplace Order ID (Optional)
            </label>
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. APH-2026-98421"
              className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono focus:outline-none focus:border-[#0B56D0]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Brief summary of your question or concern..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0B56D0]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Provide vehicle details, chassis/VIN, or specific part numbers..."
              className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0B56D0]"
              required
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs font-bold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="text-xs font-bold"
            >
              {isSubmitting ? 'Submitting...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
