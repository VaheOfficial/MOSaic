'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { UserPlus, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'member'|'supervisor'|'commander'>('member');
  const [error, setError] = useState<string|null>(null);

  async function register() {
    setError(null);
    try {
      const res = await api('/auth/register', { method: 'POST', body: JSON.stringify({ username, password, full_name: fullName, role }) });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.access_token);
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Welcome! Account created', variant: 'success' } }));
        location.href = '/';
      }
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Registration failed', variant: 'error' } }));
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 gap-0">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative flex flex-col justify-center px-12 lg:px-16 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30 px-4 py-2 text-sm font-medium">
              <UserPlus size={16}/> Join the Team
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Start your 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  mission
                </span>
                with MOSaic
              </h1>
              <p className="text-xl text-white/90 mt-4 leading-relaxed">
                Join a platform designed to align your unique skills with meaningful missions. Create your profile and discover opportunities that match your expertise.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="space-y-2">
              <div className="text-2xl font-black">Members</div>
              <div className="text-white/80 text-sm">Showcase Skills</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-black">Supervisors</div>
              <div className="text-white/80 text-sm">Define Needs</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-black">Commanders</div>
              <div className="text-white/80 text-sm">Strategic Oversight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
              <Shield size={16} className="text-emerald-600"/>
              <span className="text-sm font-medium text-emerald-700">New Account</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
              <p className="text-slate-600 mt-2">Join MOSaic and unlock your potential.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={fullName} 
                  onChange={e=>setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input 
                  value={username} 
                  onChange={e=>setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={role} onChange={e=>setRole(e.target.value as any)} className="w-full">
                  <option value="member">Member - Showcase skills and get matched</option>
                  <option value="supervisor">Supervisor - Define role requirements</option>
                  <option value="commander">Commander - Strategic oversight</option>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button onClick={register} className="w-full" size="lg">
              Create MOSaic Account
            </Button>

            <div className="text-center">
              <span className="text-slate-600">Already have an account? </span>
              <a className="font-medium text-violet-700 hover:text-violet-800 transition-colors" href="/login">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


