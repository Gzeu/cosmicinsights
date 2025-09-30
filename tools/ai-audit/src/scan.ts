import fs from "fs";
import fetch from "node-fetch";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const FILES = process.env.TARGET_FILES?.split(",") || ["contracts/ai-policy/src/lib.rs"];

async function review(content: string) {
  const prompt = fs.readFileSync("tools/ai-audit/prompts/security.md", "utf8") + "\n\n" + content;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    })
  });
  if (!res.ok) throw new Error(`openai ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim();
}

(async () => {
  const reports = [];
  for (const f of FILES) {
    const content = fs.readFileSync(f, "utf8");
    const r = await review(content);
    reports.push({ file: f, report: r });
  }
  console.log(JSON.stringify({ reports }, null, 2));
})().catch(e => { console.error(e); process.exit(1); });