import AppShell from "@/components/AppShell";
import IncidentForm from "@/components/IncidentForm";

export default function NewIncident() {
  return (
    <AppShell active="new">
      <div className="center-page">
        <div className="page-head">
          <div>
            <h1>Create Incident</h1>
            <p>Report an incident and let the AI agent triage its severity and response.</p>
          </div>
        </div>
        <IncidentForm />
      </div>
    </AppShell>
  );
}