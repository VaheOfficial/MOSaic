'use client';
import { useState } from 'react';

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
    <main>
      <h2>Upload SURF (HTML)</h2>
      <input type="file" accept=".html,text/html" onChange={e=>setFile(e.target.files?.[0] || null)}/>
      <button onClick={upload} style={{marginLeft:8}}>Upload</button>
      {resp && <pre style={{marginTop:12, background:'#111', color:'#0f0', padding:12}}>{JSON.stringify(resp, null, 2)}</pre>}
    </main>
  );
}
