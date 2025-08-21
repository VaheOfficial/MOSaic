export async function api(path: string, opts: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
  const res = await fetch(`${base}${path}`, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers||{}) } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
