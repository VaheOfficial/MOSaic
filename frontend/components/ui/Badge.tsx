type Props = { children: React.ReactNode; tone?: 'brand' | 'slate' | 'success' | 'danger'; };

export default function Badge({ children, tone = 'brand' }: Props) {
  const tones: Record<string, string> = {
    brand: 'bg-violet-50 text-violet-800 ring-violet-300',
    slate: 'bg-slate-100 text-slate-800 ring-slate-300',
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-300',
    danger: 'bg-rose-50 text-rose-800 ring-rose-300',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ring-1 ${tones[tone]}`}>{children}</span>
  );
}


