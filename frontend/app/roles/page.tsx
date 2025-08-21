'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Roles() {
  const [unit, setUnit] = useState('Delta6Det4');
  const [title, setTitle] = useState('Red Team Member');
  const [reqs, setReqs] = useState('red teaming:1:1,true; recon:1:1,false');

  const [roles, setRoles] = useState<any[]>([]);
  async function create() {
    const requirements = reqs.split(';').map(chunk => {
      const [skill, min, weight, mandatory] = chunk.split(':').map(s=>s.trim());
      return { skill, min_level: Number(min), weight: Number(weight), mandatory: mandatory==='true' };
    });
    await api('/catalog/roles', { method:'POST', body: JSON.stringify({ unit, title, requirements }) });
    await refresh();
  }
  async function refresh() {
    setRoles(await api('/catalog/roles'));
  }
  useEffect(()=>{ refresh(); }, []);

  return (
    <main>
      <h2>Roles</h2>
      <div style={{display:'grid', gap:8}}>
        <label>Unit <input value={unit} onChange={e=>setUnit(e.target.value)} /></label>
        <label>Title <input value={title} onChange={e=>setTitle(e.target.value)} /></label>
        <label>Requirements <input value={reqs} onChange={e=>setReqs(e.target.value)} /></label>
        <button onClick={create}>Create</button>
      </div>
      <h3 style={{marginTop:16}}>Existing</h3>
      <pre>{JSON.stringify(roles, null, 2)}</pre>
    </main>
  );
}
