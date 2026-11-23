
/**
 * Section Chaining Prompt Generator
 * Generates structured content for a single section with rolling context
 */
export const GENERATE_SECTION_PROMPT = (section, previousSummary = "", brief = {}) => {
    const isIntro = section.level === "h1" || section.id === "sec-1";
    const isFaq = section.title.toLowerCase().includes("faq") || section.title.toLowerCase().includes("frequently");
    const isComparison = section.title.toLowerCase().includes("matrix") ||
        section.title.toLowerCase().includes("comparison") ||
        section.title.toLowerCase().includes("versus");

    return `
You are an expert SEO/GEO content writer crafting an authoritative blog post.
Write the in-depth content for the following specific section of the article.

=== 1. CURRENT SECTION TO WRITE ===
- Heading Level: ${section.level ? section.level.toUpperCase() : "H2"}
- Section Title: "${section.title}"
- Goal/Description: "${section.description || "In-depth explanation and analysis"}"

=== 2. GLOBAL ARTICLE BRIEF ===
- Primary Keyword: "${brief.keyword || brief.title || "general topic"}"
- Target Audience: "${brief.target_audience || "General Readers"}"
- Tone of Voice: "${brief.tone_of_voice || "Professional & Informative"}"

=== 3. ROLLING CONTEXT (PREVIOUS SECTION SUMMARY) ===
${previousSummary ? `Previous section covered: "${previousSummary}"\nEnsure smooth transition and avoid repeating facts from above.` : "This is the opening section of the article. Start strong."}

=== 4. MANDATORY GEO REQUIREMENTS FOR THIS SECTION ===
${isIntro ? `
1. [Princeton GEO Answer Block]: Start immediately with a bold, concise 40-60 word direct answer to the core topic before expanding into introduction paragraphs.
` : isComparison ? `
1. [GEO Structured Data]: You MUST include a structured comparison HTML <table> with 3-4 columns comparing key criteria, pros/cons, or pricing.
` : isFaq ? `
1. [Schema.org FAQ]: Provide 3-4 distinct questions as subheadings or bold queries with direct, concise 2-sentence answers.
` : `
1. Provide 2-3 substantive, well-structured paragraphs with concrete data, expert insights, and bulleted takeaways.
`}

=== 5. OUTPUT FORMAT RULES ===
- Output clean, valid HTML fragments only (<p>, <ul>, <li>, <table>, <strong>).
- Do NOT output markdown code blocks (\`\`\`html).
- Do NOT repeat the main heading tag (it will be injected automatically).
`;
};