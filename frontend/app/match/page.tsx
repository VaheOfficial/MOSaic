'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function Match() {
  const [unit, setUnit] = useState('Delta6Det4');
  const [resp, setResp] = useState<any>(null);

  async function run() {
    setResp(await api(`/match/run?unit=${encodeURIComponent(unit)}`, { method:'POST' }));
  }

  return (
    <main>
      <h2>Run Matching</h2>
      <label>Unit <input value={unit} onChange={e=>setUnit(e.target.value)} /></label>
      <button onClick={run} style={{marginLeft:8}}>Run</button>
      {resp && <pre style={{marginTop:12, background:'#111', color:'#0f0', padding:12}}>{JSON.stringify(resp, null, 2)}</pre>}
    </main>
  );
}
