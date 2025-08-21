import { LabelHTMLAttributes } from 'react';
import { cn } from './utils';

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className, ...props }: Props) {
  return <label className={cn('text-sm font-medium text-slate-700', className)} {...props} />;
}


