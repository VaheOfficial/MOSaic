type Props = { children: React.ReactNode; className?: string };

export default function Card({ children, className }: Props) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-900/5 ring-1 ring-slate-200/50 p-8 border border-white/20 hover-lift ${className || ''}`}>{children}</div>
  );
}


