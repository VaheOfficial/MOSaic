'use client';
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  label?: string;
};

export default function TagInput({ value, onChange, placeholder, label }: Props) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement|null>(null);

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setInput('');
  }

  function removeTag(tag: string) {
    onChange(value.filter(v => v !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && value.length) {
      removeTag(value[value.length - 1]);
    }
  }

  return (
    <div className="grid gap-1">
      {label && <Label>{label}</Label>}
      <div className="flex flex-wrap gap-2 rounded-md border border-slate-300 p-2">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-violet-50 ring-1 ring-violet-200 text-violet-800 px-3 py-1 text-sm">
            {tag}
            <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => removeTag(tag)}>×</button>
          </span>
        ))}
        <Input
          ref={inputRef}
          className="flex-1 min-w-[140px]"
          value={input}
          placeholder={placeholder || 'Type and press Enter'}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" onClick={() => addTag(input)}>Add</Button>
      </div>
    </div>
  );
}


