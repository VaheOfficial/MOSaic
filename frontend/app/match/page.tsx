'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import Guard from '@/app/guard';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Users, Shield, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export default function Match() {
  const [unit, setUnit] = useState('Delta6Det4');
  const [resp, setResp] = useState<any>(null);

  async function run() {
    setResp(await api(`/match/run?unit=${encodeURIComponent(unit)}`, { method:'POST' }));
  }

  return (
    <Guard allow={["commander"]}>
    <div className="grid gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Rocket size={18}/> Run Matching</h2>
          <div className="text-sm text-slate-500 flex items-center gap-3"><Users size={16}/> Candidates • <Shield size={16}/> Requirements</div>
        </div>
        <div className="flex items-end gap-3">
          <Label>Unit <Input value={unit} onChange={e=>setUnit(e.target.value)} /></Label>
          <Button onClick={run}>Run</Button>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-700">Results</div>
          <Button variant="secondary" onClick={()=>setResp(null)}><RefreshCw size={16} className="mr-1"/> Clear</Button>
        </div>
        <AnimatePresence>
          {resp && (
            <motion.pre
              initial={{ opacity:0, y:8 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              className="mt-2 bg-slate-900 text-green-300 p-3 rounded-md overflow-auto"
            >
              {JSON.stringify(resp, null, 2)}
            </motion.pre>
          )}
          {!resp && (
            <div className="text-sm text-slate-500">No results yet. Run matching to see suggestions.</div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </Guard>
  );
}
