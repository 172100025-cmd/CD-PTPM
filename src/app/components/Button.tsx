import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#6D4C41] text-white hover:bg-[#5D4037] active:scale-95',
    secondary: 'bg-[#D7CCC8] text-[#3E2723] hover:bg-[#BCAAA4] active:scale-95',
    outline: 'border-2 border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white active:scale-95',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
