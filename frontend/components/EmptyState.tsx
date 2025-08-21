import { ReactNode } from 'react';

type Props = { icon?: ReactNode; title: string; description?: string; action?: ReactNode };

export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="text-center py-12">
      {icon && <div className="mx-auto mb-3 h-12 w-12 rounded-xl grid place-content-center bg-slate-100 text-slate-700">{icon}</div>}
      <h4 className="text-base font-semibold">{title}</h4>
      {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}


