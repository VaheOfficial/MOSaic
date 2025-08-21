'use client';
import { useState } from 'react';

export type Skill = { name: string; years?: number; weight?: number; mandatory?: boolean };
type Props = {
  value: Skill[];
  onChange: (next: Skill[]) => void;
  title?: string;
  withYears?: boolean;
  withWeight?: boolean;
  withMandatory?: boolean;
  placeholder?: string;
};

export default function SkillEditor({ value, onChange, title, withYears = true, withWeight = false, withMandatory = false, placeholder }: Props) {
  const [name, setName] = useState('');
  const [years, setYears] = useState<number|''>('' as any);
  const [weight, setWeight] = useState<number|''>('' as any);
  const [mandatory, setMandatory] = useState(false);

  function add() {
    const nm = name.trim();
    if (!nm) return;
    const next: Skill = { name: nm } as Skill;
    if (withYears) next.years = Number(years || 0);
    if (withWeight) next.weight = Number(weight || 1);
    if (withMandatory) next.mandatory = Boolean(mandatory);
    onChange([...(value||[]), next]);
    setName(''); setYears('' as any); setWeight('' as any); setMandatory(false);
  }

  function remove(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  function update(idx: number, patch: Partial<Skill>) {
    const next = value.map((s, i) => i === idx ? { ...s, ...patch } : s);
    onChange(next);
  }

  return (
    <div className="grid gap-2">
      {title && <div className="font-medium text-slate-800">{title}</div>}
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <div className="label">Skill</div>
          <input className="input" placeholder={placeholder || 'e.g., red teaming'} value={name} onChange={e=>setName(e.target.value)} />
        </div>
        {withYears && (
          <div>
            <div className="label">Years</div>
            <input className="input w-24" type="number" min={0} value={years as any} onChange={e=>setYears(Number(e.target.value))} />
          </div>
        )}
        {withWeight && (
          <div>
            <div className="label">Weight</div>
            <input className="input w-24" type="number" min={0} step="0.5" value={weight as any} onChange={e=>setWeight(Number(e.target.value))} />
          </div>
        )}
        {withMandatory && (
          <label className="label inline-flex items-center gap-2 mt-5"><input type="checkbox" checked={mandatory} onChange={e=>setMandatory(e.target.checked)} /> Mandatory</label>
        )}
        <button type="button" className="btn" onClick={add}>Add</button>
      </div>

      <div className="grid gap-2">
        {value?.map((s, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <div className="font-medium">{s.name}</div>
              {withYears && <div className="text-sm text-slate-600">{s.years || 0} yrs</div>}
              {withWeight && <div className="text-sm text-slate-600">w {s.weight || 1}</div>}
              {withMandatory && s.mandatory && <span className="text-xs text-red-600">mandatory</span>}
            </div>
            <div className="flex items-center gap-2">
              {withYears && <input className="input w-24" type="number" min={0} value={s.years || 0} onChange={e=>update(idx, { years: Number(e.target.value) })} />}
              {withWeight && <input className="input w-24" type="number" min={0} step="0.5" value={s.weight || 1} onChange={e=>update(idx, { weight: Number(e.target.value) })} />}
              {withMandatory && <label className="label inline-flex items-center gap-2"><input type="checkbox" checked={!!s.mandatory} onChange={e=>update(idx, { mandatory: e.target.checked })} /> Mandatory</label>}
              <button type="button" className="btn" onClick={()=>remove(idx)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


