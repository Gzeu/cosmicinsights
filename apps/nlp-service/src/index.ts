import "dotenv/config";
import fetch from "node-fetch";
import { InstructionSchema } from "./schema.js";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const system = `You convert natural language into one JSON instruction (GrantRole | RevokeRole | ExecuteAction).
- For MultiversX addresses, keep as provided (erd1...).
- role is a short lowercase token (e.g., "trader", "admin").
Return ONLY compact JSON, no markdown.`;

async function callOllama(prompt: string) {
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "llama3.1",
      prompt: `${system}\nUser: ${prompt}\nJSON:`,
      stream: false
    })
  });
  if (!res.ok) throw new Error(`ollama ${res.status}`);
  const data = await res.json();
  return data.response?.trim();
}

async function callOpenAI(prompt: string) {
  if (!OPENAI_KEY) throw new Error("OPENAI_API_KEY missing");
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      temperature: 0
    })
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim();
}

function heuristic(prompt: string) {
  // Very rough fallback extractor
  const user = (prompt.match(/(erd1[0-9a-z]+)/) || [])[1] || "erd1placeholder";
  if (/revoke/i.test(prompt)) {
    const role = (prompt.match(/role\s+(\w+)/i) || [])[1] || "trader";
    return JSON.stringify({ type: "RevokeRole", user, role });
  }
  if (/grant|allow|authorize/i.test(prompt)) {
    const role = (prompt.match(/role\s+(\w+)/i) || [])[1] || "trader";
    return JSON.stringify({ type: "GrantRole", user, role });
  }
  const action = prompt;
  const roleRequired = (prompt.match(/as\s+(\w+)/i) || [])[1] || "trader";
  return JSON.stringify({ type: "ExecuteAction", roleRequired, action });
}

export async function parseInstruction(nl: string) {
  let raw: string | undefined;
  try { raw = await callOllama(nl); } catch {}
  if (!raw) {
    try { raw = await callOpenAI(nl); } catch {}
  }
  if (!raw) raw = heuristic(nl);
  // Strip possible code fences
  raw = raw.replace(/^```json|```$/g, "").trim();
  const parsed = JSON.parse(raw);
  const validated = InstructionSchema.parse(parsed);
  return validated;
}

// Simple CLI usage
if (process.argv.length > 2) {
  parseInstruction(process.argv.slice(2).join(" ")).then(console.log).catch(e => {
    console.error(e.message);
    process.exit(1);
  });
}