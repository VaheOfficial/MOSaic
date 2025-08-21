'use client';
import { useState } from 'react';
import Guard from '@/app/guard';
import Section from '@/components/Section';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SurfUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [resp, setResp] = useState<any>(null);

  async function upload() {
    if (!file) return;
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(base + '/ingest/surf', { method: 'POST', body: form });
    const json = await res.json();
    setResp(json);
  }

  return (
    <Guard allow={["member", "supervisor", "commander"]}>
      <Section title="SURF Upload" description="Upload your SURF HTML file to auto-populate skills and experience.">
        <div className="flex items-center gap-3">
          <Input type="file" accept=".html,text/html" onChange={e=>setFile((e.target as HTMLInputElement).files?.[0] || null)}/>
          <Button onClick={upload}>Upload</Button>
        </div>
        {resp && <pre className="mt-4 bg-slate-900 text-green-300 p-3 rounded-md overflow-auto">{JSON.stringify(resp, null, 2)}</pre>}
      </Section>
    </Guard>
  );
}
