import { NextResponse } from "next/server";
import { analyzeIncident } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const input = await req.json();
    if (!input.title || !input.description || !input.type || !input.system) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    const result = await analyzeIncident(input);
    const id = `INC-${Math.floor(1000 + Math.random() * 8999)}`;
    return NextResponse.json({ id, ...result });
  } catch (error:any) {
    console.error(error);
    return NextResponse.json(
      { error: error?.message || "Unable to analyze incident. Check your API keys." },
      { status: 500 }
    );
  }
}