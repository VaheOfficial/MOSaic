export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function api(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as any||{}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${base}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
