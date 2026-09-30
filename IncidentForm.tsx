"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IncidentForm() {
  const router = useRouter();
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [type,setType]=useState("Malware");
  const [system,setSystem]=useState("");
  const [timestamp,setTimestamp]=useState(new Date().toISOString().slice(0,16));
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,description,type,system,timestamp})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      const incident = {
        id: data.id,
        title,
        description,
        type,
        system,
        timestamp,
        severity: data.analysis.severity,
        status: "Open",
        analysis: data.analysis,
        memories: data.memories || []
      };
      const existing = JSON.parse(localStorage.getItem("incidents") || "[]");
      localStorage.setItem("incidents", JSON.stringify([incident, ...existing]));
      router.push(`/incidents/${data.id}`);
    } catch(err:any) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <label>Incident title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Suspicious outbound traffic from database host" required /></label>
      <label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe what happened, what was observed, and any relevant context." required /></label>
      <div className="form-grid">
        <label>Incident type
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option>Malware</option><option>Unauthorized Access</option><option>Ransomware</option><option>Phishing</option><option>Data Breach</option><option>Service Outage</option><option>Other</option>
          </select>
        </label>
        <label>Affected system<input value={system} onChange={e=>setSystem(e.target.value)} placeholder="e.g. Production API" required /></label>
      </div>
      <label>Timestamp<input type="datetime-local" value={timestamp} onChange={e=>setTimestamp(e.target.value)} /></label>
      {error && <div className="error">{error}</div>}
      <button className="analyze" disabled={loading}>{loading ? "Analyzing..." : "✣  Analyze Incident"}</button>
    </form>
  );
}