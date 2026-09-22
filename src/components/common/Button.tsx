import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5 font-medium',
    md: 'text-sm px-5 py-2.5 gap-2 font-semibold',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const variantStyles = {
    primary: 'bg-[#16181D] hover:bg-[#252830] text-white shadow-md hover:shadow-lg focus:ring-stone-800 border border-stone-800 active:scale-[0.99]',
    secondary: 'bg-[#F2EFEB] hover:bg-[#E7E2D8] text-[#16181D] border border-[#E0DACE] focus:ring-stone-400 active:scale-[0.99]',
    gold: 'bg-gradient-to-r from-[#C59B27] to-[#B3881B] hover:from-[#B88E1F] hover:to-[#A37912] text-white shadow-md hover:shadow-gold-500/20 focus:ring-[#C59B27] border border-[#D8AE3D]/40 active:scale-[0.99]',
    outline: 'border border-[#D4CEBF] bg-transparent hover:bg-[#F6F4EE] text-[#16181D] focus:ring-stone-400',
    ghost: 'bg-transparent hover:bg-stone-100/70 text-[#2B2F38] focus:ring-stone-300',
    dark: 'bg-[#0E1013] hover:bg-[#1A1C22] text-stone-100 border border-stone-800 shadow-xl'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
