'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from './utils';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea ref={ref} className={cn('rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white', className)} {...props} />
  );
});

export default Textarea;


