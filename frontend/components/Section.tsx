type Props = { title?: string; description?: string; children: React.ReactNode; actions?: React.ReactNode };

export default function Section({ title, description, children, actions }: Props) {
  return (
    <section className="grid gap-3">
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}
            {description && <p className="text-slate-600 mt-1 text-sm">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      <div className="card">{children}</div>
    </section>
  );
}


