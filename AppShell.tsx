import Link from "next/link";

export default function AppShell({children, active}:{children:React.ReactNode; active:string}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">◇</div>
          <div><b>Incident Response</b><span>AI Agent</span></div>
        </div>
        <nav>
          <Link className={active==="dashboard" ? "active":""} href="/dashboard">▦ <span>Dashboard</span></Link>
          <Link className={active==="incidents" ? "active":""} href="/incidents">♢ <span>Incidents</span></Link>
          <Link className={active==="new" ? "active":""} href="/incidents/new">⊕ <span>Create Incident</span></Link>
        </nav>
        <div className="powered">Powered by Groq + Hindsight</div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}