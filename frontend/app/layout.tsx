export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ maxWidth: 900, margin: '0 auto', padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 24 }}>
          <h1>MOSaic — POC</h1>
          <nav style={{ display:'flex', gap:12 }}>
            <a href="/">Home</a>
            <a href="/member-survey">Member Survey</a>
            <a href="/supervisor-survey">Supervisor Survey</a>
            <a href="/surf-upload">SURF Upload</a>
            <a href="/roles">Roles</a>
            <a href="/match">Match</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
