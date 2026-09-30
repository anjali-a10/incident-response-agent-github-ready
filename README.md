# Incident Response AI Agent

A cybersecurity incident-triage dashboard inspired by the provided app screenshots.

## Features

- Dashboard with total, critical, open and resolved incident counts
- Incident history and search/filter UI
- Incident creation form
- Groq-powered AI triage
- Hindsight long-term memory: recall relevant past incidents before analysis and retain the new incident after analysis
- AI summary, possible cause, immediate actions and recommended response
- Related past incidents shown as memory context

## Stack

- Next.js + React + TypeScript
- Groq API (`groq-sdk`)
- Hindsight (`@vectorize-io/hindsight-client`)
- Vercel-compatible API routes
- CSS (no UI framework required)

## 1. Install

```bash
npm install
```

## 2. Environment variables

Copy `.env.example` to `.env.local` and add:

```env
GROQ_API_KEY=...
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=...
HINDSIGHT_BANK_ID=incident-response-demo
```

Never commit `.env.local` or API keys.

## 3. Run

```bash
npm run dev
```

Open http://localhost:3000

## 4. Test the memory workflow

1. Create an incident about a suspicious login.
2. The server recalls related memories from Hindsight.
3. Groq receives the incident plus relevant memory context.
4. The AI returns severity, confidence, summary and response actions.
5. The incident is retained into the same Hindsight bank.
6. Create a second related incident and inspect the returned related-memory context.

Hindsight supports retain/recall/reflect operations and isolated memory banks. See the official Hindsight quickstart for the current SDK usage.

## 5. Deploy to Vercel

Push the repository to GitHub, import it into Vercel, then add the same environment variables in Vercel Project Settings.

## Important

This repository is a clean recreation based on the screenshots supplied for the project. It is not a copy of the original deployed source code. Replace the seeded UI/data and styling as needed if your original repository has additional functionality.
