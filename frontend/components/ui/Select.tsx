'use client';

import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

type Props = SelectHTMLAttributes<HTMLSelectElement>;

const Select = forwardRef<HTMLSelectElement, Props>(function Select({ className, ...props }, ref) {
  return (
    <select ref={ref} className={cn('rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white', className)} {...props} />
  );
});

export default Select;


