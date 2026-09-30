import Groq from "groq-sdk";
import { HindsightClient } from "@vectorize-io/hindsight-client";

export type IncidentInput = {
  title: string;
  description: string;
  type: string;
  system: string;
  timestamp: string;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export function hindsight() {
  return new HindsightClient({
    baseUrl: process.env.HINDSIGHT_API_URL || "https://api.hindsight.vectorize.io",
    apiKey: process.env.HINDSIGHT_API_KEY
  });
}

export async function analyzeIncident(input: IncidentInput) {
  const bank = process.env.HINDSIGHT_BANK_ID || "incident-response-demo";
  let memories: any[] = [];

  try {
    const client = hindsight();
    const result = await client.recall(
      bank,
      `${input.title}. ${input.description}. Incident type: ${input.type}. Affected system: ${input.system}`
    );
    memories = (result as any)?.results || [];
  } catch {
    // Keep the app usable if memory is not configured yet.
  }

  const memoryText = memories
    .slice(0, 5)
    .map((m:any) => `- ${m.text || m.content || ""}`)
    .filter(Boolean)
    .join("\n");

  const prompt = `
You are an incident-response triage assistant.
Analyze the incident below and return ONLY valid JSON with these keys:
severity, confidence, summary, possibleCause, immediateActions, recommendedResponse.
severity must be one of Low, Medium, High, Critical.
confidence must be an integer from 0 to 100.
immediateActions and recommendedResponse must each be arrays of short actionable strings.

Incident:
Title: ${input.title}
Description: ${input.description}
Type: ${input.type}
Affected system: ${input.system}
Timestamp: ${input.timestamp}

Relevant Hindsight memories:
${memoryText || "No relevant previous memories were found."}

Use the previous memories only when relevant. Do not invent evidence.
`;

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are a careful cybersecurity incident triage assistant. Return JSON only." },
      { role: "user", content: prompt }
    ]
  });

  const raw = completion.choices[0]?.message?.content || "{}";
  const cleaned = raw.replace(/^```json\s*/i,"").replace(/```$/,"").trim();
  const analysis = JSON.parse(cleaned);

  try {
    const client = hindsight();
    await client.retain(
      bank,
      `Incident: ${input.title}\nDescription: ${input.description}\nType: ${input.type}\nAffected system: ${input.system}\nAI severity: ${analysis.severity}\nAI summary: ${analysis.summary}\nRecommended response: ${(analysis.recommendedResponse || []).join("; ")}`
    );
  } catch {
    // Memory retention is best-effort for the demo.
  }

  return { analysis, memories };
}