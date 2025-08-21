'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export type Requirement = { skill: string; min_level: number; weight: number; mandatory: boolean };

type Props = {
  value: Requirement[];
  onChange: (next: Requirement[]) => void;
};

export default function RequirementsEditor({ value, onChange }: Props) {
  const [skill, setSkill] = useState('');
  const [minLevel, setMinLevel] = useState<number|''>('' as any);
  const [weight, setWeight] = useState<number|''>('' as any);
  const [mandatory, setMandatory] = useState(false);

  function add() {
    const s = skill.trim();
    if (!s) return;
    onChange([...(value||[]), { skill: s, min_level: Number(minLevel || 1), weight: Number(weight || 1), mandatory }]);
    setSkill(''); setMinLevel('' as any); setWeight('' as any); setMandatory(false);
  }

  function remove(idx: number) {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  }

  function update(idx: number, patch: Partial<Requirement>) {
    const next = value.map((r, i) => i === idx ? { ...r, ...patch } : r);
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <Label>Skill</Label>
          <Input value={skill} onChange={e=>setSkill(e.target.value)} placeholder="e.g., red teaming" />
        </div>
        <div>
          <Label>Min level</Label>
          <Input className="w-24" type="number" min={1} value={minLevel as any} onChange={e=>setMinLevel(Number(e.target.value))} />
        </div>
        <div>
          <Label>Weight</Label>
          <Input className="w-24" type="number" min={0} step="0.5" value={weight as any} onChange={e=>setWeight(Number(e.target.value))} />
        </div>
        <Label className="inline-flex items-center gap-2 mt-5"><input type="checkbox" checked={mandatory} onChange={e=>setMandatory(e.target.checked)} /> Mandatory</Label>
        <Button type="button" onClick={add}>Add</Button>
      </div>
      <div className="grid gap-2">
        {value?.map((r, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
            <div className="flex items-center gap-3">
              <div className="font-medium">{r.skill}</div>
              <div className="text-sm text-slate-600">min {r.min_level}</div>
              <div className="text-sm text-slate-600">w {r.weight}</div>
              {r.mandatory && <span className="text-xs text-red-600">mandatory</span>}
            </div>
            <div className="flex items-center gap-2">
              <Input className="w-24" type="number" min={1} value={r.min_level} onChange={e=>update(idx, { min_level: Number(e.target.value) })} />
              <Input className="w-24" type="number" min={0} step="0.5" value={r.weight} onChange={e=>update(idx, { weight: Number(e.target.value) })} />
              <Label className="inline-flex items-center gap-2"><input type="checkbox" checked={!!r.mandatory} onChange={e=>update(idx, { mandatory: e.target.checked })} /> Mandatory</Label>
              <Button type="button" onClick={()=>remove(idx)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


