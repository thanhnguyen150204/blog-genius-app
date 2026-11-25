import dns from "node:dns";
import { GENERATE_OUTLINE_PROMPT } from "../../graphql/constants/prompts/outlinePrompts.js";

dns.setDefaultResultOrder("ipv4first");

/**
 * Generate structured blog outline using Gemini API
 */
export async function generateOutlineService(brief = {}) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend environment variables.");
  }

  const prompt = GENERATE_OUTLINE_PROMPT(brief);
  const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest"];
  let lastError = null;

  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          }),
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${response.status}`;
          if ([503, 429].includes(response.status) && attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }
          throw new Error(errMsg);
        }

        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        let outlineArray = [];
        try {
          const parsed = JSON.parse(rawContent);
          outlineArray = Array.isArray(parsed)
            ? parsed
            : (parsed.outline || parsed.sections || Object.values(parsed)[0] || []);
        } catch (parseErr) {
          throw new Error("Failed to parse outline JSON: " + parseErr.message);
        }

        return outlineArray.map((item, idx) => ({
          id: item.id || `sec-${idx + 1}-${Date.now()}`,
          level: ["h1", "h2", "h3"].includes(item.level?.toLowerCase())
            ? item.level.toLowerCase()
            : "h2",
          title: item.title || `Section ${idx + 1}`,
          description: item.description || "",
        }));
      } catch (err) {
        lastError = err;
        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate outline from Gemini API.");
}