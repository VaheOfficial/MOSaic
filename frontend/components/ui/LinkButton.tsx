'use client';

import { AnchorHTMLAttributes } from 'react';
import { cn } from './utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
};

export default function LinkButton({ className, variant = 'primary', size = 'md', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95';
  const variants: Record<Variant, string> = {
    primary: 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25',
    secondary: 'bg-white/80 backdrop-blur-sm text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50 hover:ring-violet-300 shadow-md',
    ghost: 'bg-transparent text-slate-700 hover:bg-white/60 hover:backdrop-blur-sm',
  };
  const sizes: Record<Size, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}


