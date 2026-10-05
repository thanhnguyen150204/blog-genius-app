export const CONTENT_TYPES = [
  { key: "all", label: "All content", dotColor: null },
  { key: "Informational", label: "Informational", dotColor: "#2563eb" },
  { key: "Buyer's guide", label: "Buyer's guide", dotColor: "#ea580c" },
  { key: "How-to", label: "How-to", dotColor: "#06b6d4" },
  { key: "FAQ", label: "FAQ", dotColor: "#8b5cf6" },
  { key: "Trust / About", label: "Trust / About", dotColor: "#a855f7" },
  { key: "Company Facts", label: "Company Facts", dotColor: "#ef4444" },
];

export const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "drafts", label: "Drafts" },
  { key: "scheduled", label: "Scheduled" },
];

export const initialStudioPosts = [
  {
    id: "post-1",
    title: "This is the blog post title",
    type: "Informational",
    author: "Tapita",
    lastModified: "Oct 5, 2026, 08:40 PM",
    seoScore: null,
    geoScore: 60,
    status: "Draft",
    isNew: true,
    hasAnswerBlock: false,
    hasFaqSchema: false,
    keyword: "blog post title",
    outline: [
      { id: "1", level: "h1", title: "This is the blog post title", description: "Introduction" },
      { id: "2", level: "h2", title: "Key Takeaways", description: "Core points" },
    ],
    bodyHtml: "<h2>Introduction</h2><p>This is the blog post content draft.</p>",
  },
  {
    id: "post-2",
    title: "test",
    type: "Informational",
    author: "Tapita",
    lastModified: "Oct 5, 2026, 08:31 PM",
    seoScore: 78,
    geoScore: 60,
    status: "Published",
    isNew: true,
    hasAnswerBlock: true,
    hasFaqSchema: false,
    keyword: "test post",
    outline: [
      { id: "1", level: "h1", title: "test", description: "Main overview" },
      { id: "2", level: "h2", title: "Detailed Breakdown", description: "In-depth insights" },
    ],
    bodyHtml: "<div class=\"geo-answer-block\"><p><strong>Direct Summary:</strong> Optimized informational blog post.</p></div><h2>Detailed Breakdown</h2><p>Content published on store.</p>",
  },
];
