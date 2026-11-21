
export const GENERATE_OUTLINE_PROMPT = (brief) => `
You are an expert SEO and GEO (Generative Engine Optimization) content architect.
Based on the Content Brief below, design a well-structured, hierarchical blog post outline optimized for both human readers and AI Search Engines (Google AI Overviews, Perplexity).

=== 1. INPUT CONTENT BRIEF ===
- Primary Keyword: "${brief.keyword || brief.primary_keyword || "blog post"}"
- Secondary Keywords: ${(brief.secondary_keywords || []).join(", ")}
- Search Intent: ${brief.search_intent || "Informational"}
- Target Audience: ${brief.target_audience || "General Readers"}
- Tone of Voice: ${brief.tone_of_voice || "Professional & Informative"}
- Target Word Count: ${brief.target_word_count || 1800} words

=== 2. MANDATORY STRUCTURAL REQUIREMENTS (SEO & GEO STANDARDS) ===
1. [Google SEO]: Exactly one H1 tag containing the primary keyword.
2. [Princeton GEO]: The opening section MUST include an Answer Block (direct 40-60 word concise summary answering the core query).
3. [Logical Hierarchy]: Provide 4 to 6 H2 sections. Each H2 may contain 1 to 3 H3 subsections where deep-dive explanation is needed.
4. [GEO Data Formatting]: At least one H2 section must feature a structured comparison table or criteria matrix.
5. [E-E-A-T & FAQ]: The final H2 section must be "Frequently Asked Questions (FAQ)" addressing 3-4 top search inquiries.

=== 3. OUTPUT FORMAT (STRICT JSON ONLY) ===
Return ONLY a valid JSON array, without markdown \`\`\`json wrappers or extraneous conversation:
[
  {
    "id": "sec-1",
    "level": "h1",
    "title": "Full H1 Title Containing Primary Keyword",
    "description": "Introduction and direct answer block summary."
  },
  {
    "id": "sec-2",
    "level": "h2",
    "title": "1. Core Concepts and Fundamentals",
    "description": "Define key terms and explain why it matters."
  },
  {
    "id": "sec-3",
    "level": "h3",
    "title": "1.1 Key Technical Considerations",
    "description": "Detailed breakdown of specific factors."
  },
  {
    "id": "sec-4",
    "level": "h2",
    "title": "2. Comparative Analysis & Decision Matrix",
    "description": "Structured comparison table highlighting trade-offs."
  },
  {
    "id": "sec-5",
    "level": "h2",
    "title": "3. Frequently Asked Questions (FAQ)",
    "description": "Direct answers to the top 3 user queries."
  }
]
`;