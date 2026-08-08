import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'calm' | 'danger';
type Size = 'md' | 'lg' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary text-white active:bg-primary-dark',
  secondary: 'bg-surface-soft text-ink border border-border active:bg-primary-soft',
  ghost: 'bg-transparent text-ink-soft active:bg-surface-soft',
  calm: 'bg-calm text-white active:bg-calm-dark',
  danger: 'bg-alert text-white active:brightness-95',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-xl',
  md: 'text-base px-4 py-2.5 rounded-2xl',
  lg: 'text-lg px-6 py-3.5 rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`font-bold shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
