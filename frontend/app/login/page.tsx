'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Shield, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

export default function LoginPage() {
  const [username, setUsername] = useState('member1');
  const [password, setPassword] = useState('member');
  const [error, setError] = useState<string|null>(null);

  async function login() {
    setError(null);
    try {
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.access_token);
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Welcome back!', variant: 'success' } }));
        location.href = '/';
      }
    } catch (e: any) {
      setError(e.message || 'Login failed');
      window.dispatchEvent(new CustomEvent('toast', { detail: { message: 'Login failed', variant: 'error' } }));
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2 gap-0">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative flex flex-col justify-center px-12 lg:px-16 space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30 px-4 py-2 text-sm font-medium">
              <Shield size={16}/> Secure Access
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Welcome back to 
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  MOSaic
                </span>
              </h1>
              <p className="text-xl text-white/90 mt-4 leading-relaxed">
                Continue your mission-focused talent alignment journey. Sign in to access your personalized dashboard and matching recommendations.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="space-y-2">
              <div className="text-3xl font-black">99%</div>
              <div className="text-white/80 text-sm">Match Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-black">12</div>
              <div className="text-white/80 text-sm">Active Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2">
              <LogIn size={16} className="text-violet-600"/>
              <span className="text-sm font-medium text-violet-700">Member Access</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold gradient-text">Sign in</h2>
              <p className="text-slate-600 mt-2">Welcome back! Please sign in to your account.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input 
                  value={username} 
                  onChange={e=>setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button onClick={login} className="w-full" size="lg">
              Sign in to MOSaic
            </Button>

            <div className="text-center">
              <span className="text-slate-600">Don't have an account? </span>
              <a className="font-medium text-violet-700 hover:text-violet-800 transition-colors" href="/register">
                Create one
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


