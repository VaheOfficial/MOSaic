'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, getToken } from '@/lib/api';
import { Shield, User, LogIn, LogOut, Sparkles, Menu } from 'lucide-react';

type Me = { username: string; full_name?: string; role: 'member'|'supervisor'|'commander' };

export default function Navbar() {
  const [me, setMe] = useState<Me|null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const token = getToken();
      if (!token) { setMe(null); return; }
      try {
        const profile = await api('/auth/me');
        setMe(profile);
      } catch {
        setMe(null);
      }
    })();
  }, []);

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Signed out', variant: 'info' } }));
      location.href = '/login';
    }
  }

  const links = useMemo(() => {
    const items: { href: string; label: string }[] = [
      { href: '/', label: 'Home' },
    ];
    if (me?.role === 'member' || me?.role === 'supervisor' || me?.role === 'commander') {
      items.push({ href: '/member-survey', label: 'Member Survey' });
    }
    if (me?.role === 'supervisor' || me?.role === 'commander') {
      items.push({ href: '/supervisor-survey', label: 'Supervisor Survey' });
      items.push({ href: '/roles', label: 'Roles' });
    }
    if (me?.role === 'commander') {
      items.push({ href: '/match', label: 'Match' });
    }
    return items;
  }, [me]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg shadow-slate-900/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-white grid place-content-center shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight gradient-text">MOSaic</div>
              <div className="text-[10px] text-slate-500 leading-none font-medium">Mission-Oriented Skill Alignment</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-violet-700 hover:bg-violet-50/50 transition-all duration-200">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {me ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-2 text-sm text-slate-700">
                  <User size={16} className="text-slate-500"/>
                  <span>{me.full_name || me.username}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 text-violet-800 px-2 py-0.5 ring-1 ring-violet-200 text-[11px]">
                    <Shield size={12}/> {me.role}
                  </span>
                </span>
                <button className="btn" onClick={logout} aria-label="Sign out">
                  <LogOut size={16} className="mr-1"/> Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a href="/login" className="btn" aria-label="Sign in"><LogIn size={16} className="mr-1"/> Sign in</a>
                <a href="/register" className="hidden sm:inline-flex btn bg-white text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50" aria-label="Create account">Create account</a>
              </div>
            )}
            <button className="md:hidden p-2 rounded-md hover:bg-slate-100" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-2 grid gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href} className="px-2 py-2 rounded-md hover:bg-slate-50 text-slate-700">{l.label}</a>
            ))}
            {!me && (
              <div className="grid gap-2 px-2 py-2">
                <a href="/login" className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-6 py-3 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25">
                  Sign in
                </a>
                <a href="/register" className="w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-6 py-3 text-sm bg-white/80 backdrop-blur-sm text-violet-700 ring-1 ring-violet-200 hover:bg-violet-50 hover:ring-violet-300 shadow-md">
                  Create account
                </a>
              </div>
            )}
            {me && (
              <button onClick={logout} className="mx-2 my-1 w-full inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 px-6 py-3 text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-violet-500/25">
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


