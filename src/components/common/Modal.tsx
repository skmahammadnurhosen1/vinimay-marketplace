import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0C0E11]/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div
          className={`relative w-full ${maxWidthStyles[maxWidth]} transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-[#E7E2D5] animate-in zoom-in-95 duration-200`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          {(title || subtitle) && (
            <div className="mb-6 pr-8">
              {title && <h3 className="text-xl font-bold tracking-tight text-[#16181D]">{title}</h3>}
              {subtitle && <p className="mt-1 text-sm text-[#697488] leading-relaxed">{subtitle}</p>}
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="max-h-[78vh] overflow-y-auto pr-1">{children}</div>
        </div>
      </div>
    </div>
  );
};
