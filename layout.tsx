import "./globals.css";

export const metadata = {
  title: "Incident Response AI Agent",
  description: "AI-assisted incident triage with Groq and Hindsight memory."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}