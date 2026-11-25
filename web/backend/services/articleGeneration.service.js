// web/backend/services/articleGeneration.service.js

import dns from "node:dns";
import { GENERATE_SECTION_PROMPT } from "../../graphql/constants/prompts/sectionPrompts.js";

// Force IPv4 first to prevent network delay
dns.setDefaultResultOrder("ipv4first");

/**
 * Service to execute sequential Section Chaining with rolling context
 */
export async function generateArticleService({ brief = {}, outline = [], onProgress = null }) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in backend environment variables.");
    }

    if (!outline || outline.length === 0) {
        throw new Error("Article outline is required to generate content.");
    }

    const candidateModels = ["gemini-flash-lite-latest", "gemini-flash-latest"];
    const generatedBlocks = [];
    let previousSummary = "";
    let blockCounter = 1;

    for (let i = 0; i < outline.length; i++) {
        const section = outline[i];
        const prompt = GENERATE_SECTION_PROMPT(section, previousSummary, brief);

        // 1. Add heading block to canvas
        generatedBlocks.push({
            id: `b-${blockCounter++}`,
            type: "heading",
            level: section.level ? section.level.toLowerCase() : "h2",
            text: section.title,
        });

        // 2. Call Gemini with retry mechanism
        let sectionHtml = "";
        for (const model of candidateModels) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
            let success = false;

            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0.7 },
                        }),
                        signal: AbortSignal.timeout(20000),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sectionHtml = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        // Strip markdown wrappers if any
                        sectionHtml = sectionHtml.replace(/^```html\s*/i, "").replace(/```$/g, "").trim();
                        success = true;
                        break;
                    }

                    if ([503, 429].includes(response.status) && attempt < 2) {
                        await new Promise((r) => setTimeout(r, 800));
                    }
                } catch (e) {
                    if (attempt < 2) await new Promise((r) => setTimeout(r, 800));
                }
            }

            if (success) break;
        }

        // 3. Fallback text if network drops
        if (!sectionHtml) {
            sectionHtml = `<p>Comprehensive analysis and practical insights regarding ${section.title}.</p>`;
        }

        // 4. Convert section HTML into Canvas paragraph blocks
        const paragraphs = sectionHtml
            .split(/<\/p>/i)
            .map((p) => p.replace(/<p[^>]*>/i, "").trim())
            .filter(Boolean);

        paragraphs.forEach((pText) => {
            generatedBlocks.push({
                id: `b-${blockCounter++}`,
                type: "paragraph",
                text: pText,
            });
        });

        // 5. Update rolling summary for next section (first 250 characters)
        previousSummary = sectionHtml.replace(/<[^>]*>/g, " ").slice(0, 250).trim();

        if (onProgress) {
            onProgress(i + 1, outline.length, section.title);
        }
    }

    return {
        blocks: generatedBlocks,
        totalSections: outline.length,
    };
}