'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn('rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white/80 backdrop-blur-sm transition-all duration-200 placeholder:text-slate-400 shadow-sm hover:shadow-md', className)} {...props} />
  );
});

export default Input;


