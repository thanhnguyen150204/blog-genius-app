// AI Prompt constants cho Blog Generation
export const BLOG_GENERATION_PROMPT = `
You are an expert SEO/GEO content writer. Generate a high-quality blog post that:
1. Is optimized for traditional SEO (Google, Bing)
2. Is optimized for GEO (Generative Engine Optimization - AI search engines like ChatGPT, Perplexity, SGE)
3. Includes proper heading structure (H1, H2, H3)
4. Has clear, authoritative content with citations
5. Targets the specified keywords naturally
`;

export const SEO_ANALYSIS_PROMPT = `
Analyze the following blog post for SEO quality and provide:
1. SEO score (0-100)
2. Missing keywords
3. Meta description suggestions
4. Content improvement recommendations
`;

export const GEO_ANALYSIS_PROMPT = `
Analyze the following blog post for GEO (Generative Engine Optimization):
1. Check if content is structured for AI citation
2. Check factual accuracy markers
3. Check direct answer formats (for featured snippets)
4. Suggest improvements for AI search visibility
`;
