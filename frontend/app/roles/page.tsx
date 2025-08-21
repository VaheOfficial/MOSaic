'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Guard from '@/app/guard';
import RequirementsEditor, { Requirement } from '@/components/RequirementsEditor';
import { Briefcase, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export default function Roles() {
  const [unit, setUnit] = useState('Delta6Det4');
  const [title, setTitle] = useState('Red Team Member');
  const [requirements, setRequirements] = useState<Requirement[]>([{ skill:'red teaming', min_level:1, weight:1, mandatory:true }]);

  const [roles, setRoles] = useState<any[]>([]);
  async function create() {
    await api('/catalog/roles', { method:'POST', body: JSON.stringify({ unit, title, requirements }) });
    window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Role created', variant: 'success' } }));
    await refresh();
  }
  async function refresh() {
    setRoles(await api('/catalog/roles'));
  }
  useEffect(()=>{ refresh(); }, []);

  return (
    <Guard allow={["supervisor", "commander"]}>
      <div className="grid gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase size={18}/> Create a role</h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={refresh}><RefreshCw size={16} className="mr-1"/> Refresh</Button>
              <Button onClick={create}>Create role</Button>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">Define requirements and context. Roles are visible to commanders for matching.</p>
          <div className="grid gap-4">
            <Label>Unit <Input value={unit} onChange={e=>setUnit(e.target.value)} /></Label>
            <Label>Title <Input value={title} onChange={e=>setTitle(e.target.value)} /></Label>
            <RequirementsEditor value={requirements} onChange={setRequirements} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Existing roles</h3>
            <Button variant="secondary" onClick={refresh}><RefreshCw size={16} className="mr-1"/> Refresh</Button>
          </div>
          {Array.isArray(roles) && roles.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {roles.map((r, idx) => {
                const title = r?.title || r?.data?.role_title || r?.role_title || 'Untitled role';
                const unit = r?.unit || r?.data?.unit || '—';
                const reqs = r?.requirements || r?.data?.requirements || r?.must_have || [];
                const reqCount = Array.isArray(reqs) ? reqs.length : 0;
                return (
                  <div key={idx} className="rounded-lg border border-slate-200 p-4">
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-slate-600">Unit: {unit}</div>
                    <div className="text-sm text-slate-600">Requirements: {reqCount}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <pre className="mt-2 bg-slate-900 text-green-300 p-3 rounded-md overflow-auto">{JSON.stringify(roles, null, 2)}</pre>
          )}
        </div>
      </div>
    </Guard>
  );
}
