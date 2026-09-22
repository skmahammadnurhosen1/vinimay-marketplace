import React from 'react';
import { ShieldCheck, Check, Sparkles, Award } from 'lucide-react';
import { PartType } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'genuine' | 'oem' | 'aftermarket' | 'compatible' | 'incompatible' | 'verified' | 'neutral' | 'discount';
  size?: 'sm' | 'md';
  className?: string;
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon = true
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-0.5 font-medium' : 'text-xs px-3 py-1 font-semibold';

  const variantStyles = {
    genuine: 'bg-emerald-50 text-emerald-800 border border-emerald-300/80',
    oem: 'bg-blue-50 text-blue-800 border border-blue-300/80',
    aftermarket: 'bg-amber-50 text-amber-900 border border-amber-300/80',
    compatible: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    incompatible: 'bg-rose-50 text-rose-800 border border-rose-200',
    verified: 'bg-stone-900 text-[#EBD7A7] border border-[#C59B27]/40 shadow-xs',
    neutral: 'bg-stone-100 text-stone-700 border border-stone-200',
    discount: 'bg-[#C59B27] text-white font-bold tracking-tight'
  };

  const getIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'genuine':
        return <ShieldCheck className="w-3 h-3 text-emerald-600 inline mr-1 -mt-0.5" />;
      case 'oem':
        return <Award className="w-3 h-3 text-blue-600 inline mr-1 -mt-0.5" />;
      case 'aftermarket':
        return <Sparkles className="w-3 h-3 text-amber-600 inline mr-1 -mt-0.5" />;
      case 'compatible':
        return <Check className="w-3 h-3 text-emerald-600 inline mr-1 -mt-0.5" strokeWidth={3} />;
      case 'verified':
        return <ShieldCheck className="w-3 h-3 text-[#EBD7A7] inline mr-1 -mt-0.5" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full tracking-wide uppercase transition-colors ${sizeClasses} ${variantStyles[variant]} ${className}`}>
      {getIcon()}
      {children}
    </span>
  );
};

export const PartTypeBadge: React.FC<{ type: PartType; className?: string }> = ({ type, className = '' }) => {
  const variantMap: Record<PartType, 'genuine' | 'oem' | 'aftermarket'> = {
    Genuine: 'genuine',
    OEM: 'oem',
    Aftermarket: 'aftermarket'
  };

  return (
    <Badge variant={variantMap[type]} className={className}>
      {type}
    </Badge>
  );
};
