'use client';
import { useEffect, useState } from 'react';
import { api, getToken } from '@/lib/api';

type Props = { allow: string[]; children: React.ReactNode };

export default function Guard({ allow, children }: Props) {
  const [ok, setOk] = useState<boolean|null>(null);
  const [role, setRole] = useState<string|null>(null);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) { setOk(false); setRole(null); return; }
      try {
        const me = await api('/auth/me');
        setRole(me.role);
        setOk(allow.includes(me.role));
      } catch {
        setOk(false);
        setRole(null);
      }
    })();
  }, [allow.join(',')]);

  if (ok === null) return (
    <div className="card">
      <div className="animate-slideUp text-sm text-slate-600">Checking access…</div>
    </div>
  );
  if (!ok) return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Access restricted</h2>
      <p className="text-slate-600 mb-4">{role ? `This area requires one of: ${allow.join(', ')}. Your role is "${role}".` : 'You must be signed in to view this page.'}</p>
      <div className="flex gap-3">
        <a href="/login" className="inline-flex items-center justify-center rounded-md font-medium transition-all px-4 py-2 text-sm bg-violet-700 text-white hover:bg-violet-800 shadow">Sign in</a>
        <a href="/register" className="inline-flex items-center justify-center rounded-md font-medium transition-all px-4 py-2 text-sm bg-white text-violet-700 ring-1 ring-violet-300 hover:bg-violet-50">Create account</a>
      </div>
    </div>
  );
  return <>{children}</>;
}


