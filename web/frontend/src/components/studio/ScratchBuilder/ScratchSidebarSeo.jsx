import { useState, useMemo } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Select,
  Icon,
  Box,
  Divider,
} from "@shopify/polaris";
import {
  XCircleIcon,
  InfoIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LanguageIcon,
} from "@shopify/polaris-icons";

export function ScratchSidebarSeo({ postData, blocks = [] }) {
  const [activeTab, setActiveTab] = useState("seo"); // "seo" | "geo"
  const [isScanning, setIsScanning] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    common: false,
    other: true,
    good: false,
  });
  const [expandedDetails, setExpandedDetails] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleDetail = (id) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Real-time evaluation of SEO checks
  const seoAudit = useMemo(() => {
    const title = postData.title || "";
    const titleLength = title.length;
    const metaDesc = postData.metaDescription || "";
    const metaDescLength = metaDesc.length;
    const hasImage = Boolean(postData.featuredImage);
    const hasImageAlt = Boolean(postData.imageAlt);
    const hasKeyword = Boolean(postData.keyword?.trim());
    const hasTags = Boolean(postData.tags?.trim());
    const hasHandle = Boolean(postData.handle?.trim());
    const hasH1 = blocks.some((b) => b.type === "heading" && b.level === "h1") || titleLength > 0;
    const hasH2 = blocks.some((b) => b.type === "heading" && (b.level === "h2" || !b.level));
    const wordCount = blocks.reduce((acc, b) => acc + (b.text ? b.text.split(/\s+/).length : 0), 0) + (title.split(/\s+/).length || 0);
    const hasExternalLink = blocks.some((b) => b.text && (b.text.includes("http://") || b.text.includes("https://")));
    const hasInternalLinks = (postData.internalLinks && postData.internalLinks.length > 0) || false;
    const hasAnswerBlock = blocks.some((b) => b.type === "answer-block") || postData.hasAnswerBlock;
    const hasFaq = blocks.some((b) => b.type === "faq") || postData.hasFaqSchema;

    const allChecks = [
      {
        id: "favicon",
        category: "other",
        label: "Favicon",
        summary: "Missing favicon",
        passed: false, // Store level check
        detail: "Upload a favicon to your Shopify theme settings to improve mobile and Google SERP brand visibility.",
      },
      {
        id: "title_length",
        category: "other",
        label: "Title length",
        summary: titleLength >= 30 && titleLength <= 65 ? "Optimal length (30-65 chars)" : "Shorter than 30 characters",
        passed: titleLength >= 30 && titleLength <= 65,
        detail: "Search engines typically display the first 50–60 characters of a title tag. Keep it between 30 and 65 characters.",
      },
      {
        id: "meta_desc",
        category: "other",
        label: "Meta description",
        summary: metaDescLength >= 100 ? "Meta description present" : "No meta description found",
        passed: metaDescLength >= 100,
        detail: "Provide a meta description between 120 and 160 characters to optimize click-through rates from search results.",
      },
      {
        id: "h1",
        category: "other",
        label: "H1",
        summary: hasH1 ? "H1 heading present" : "No H1 found on page",
        passed: hasH1,
        detail: "An H1 tag represents the main headline of your article. Each article should have exactly one clear H1 heading.",
      },
      {
        id: "external_link",
        category: "other",
        label: "External link",
        summary: hasExternalLink ? "External citation link found" : "No external link found on page",
        passed: hasExternalLink,
        detail: "Linking to authoritative industry studies or reference sources boosts your content's credibility with Google and AI crawlers.",
      },
      {
        id: "og_tags",
        category: "other",
        label: "Open Graph meta tags",
        summary: hasImage ? "Open Graph tags configured" : "No Open Graph tags found",
        passed: hasImage,
        detail: "Open Graph meta tags control how your post appears when shared on Facebook, X, LinkedIn, and social media platforms.",
      },
      {
        id: "keyword_title",
        category: "good",
        label: "Keyword in title",
        summary: hasKeyword ? "Focus keyword detected" : "Add primary focus keyword",
        passed: hasKeyword,
        detail: "Including your target focus keyword near the beginning of your title improves keyword relevance rankings.",
      },
      {
        id: "image_alt",
        category: "good",
        label: "Image alt attributes",
        summary: hasImageAlt ? "Image alt tags populated" : "Image alt tag missing",
        passed: hasImageAlt,
        detail: "Descriptive alt text helps visually impaired readers and allows images to rank on Google Images.",
      },
      {
        id: "url_handle",
        category: "good",
        label: "URL handle structure",
        summary: hasHandle ? "Clean hyphenated URL" : "Set custom URL slug",
        passed: hasHandle,
        detail: "Short, clean URL handles containing relevant keywords perform better and are easier for users to read.",
      },
      {
        id: "heading_hierarchy",
        category: "good",
        label: "Heading structure",
        summary: hasH2 ? "Logical H2/H3 subheadings" : "Add H2 section headings",
        passed: hasH2,
        detail: "Subheadings break up long text and allow Google algorithms to parse key topics easily.",
      },
      {
        id: "word_count",
        category: "good",
        label: "Content depth",
        summary: wordCount >= 150 ? "Content length sufficient" : "Write more detailed sections",
        passed: wordCount >= 150,
        detail: "Comprehensive, in-depth articles that thoroughly answer the user query rank higher in search results.",
      },
      {
        id: "tags_present",
        category: "good",
        label: "Categorization tags",
        summary: hasTags ? "Article tags assigned" : "Add category tags",
        passed: hasTags,
        detail: "Tags help organize related content in your store and create topic clusters.",
      },
      {
        id: "internal_links",
        category: "good",
        label: "Internal linking",
        summary: hasInternalLinks ? "Cross-linked with store articles" : "Add internal links",
        passed: hasInternalLinks,
        detail: "Internal links pass link equity and guide shoppers to related products and blog posts.",
      },
      {
        id: "https_ssl",
        category: "good",
        label: "HTTPS security",
        summary: "Store SSL active",
        passed: true,
        detail: "All Shopify stores operate over secure HTTPS, which is a confirmed Google search ranking factor.",
      },
      {
        id: "mobile_friendly",
        category: "good",
        label: "Mobile responsive",
        summary: "Responsive viewport active",
        passed: true,
        detail: "Responsive styling ensures seamless reading on smartphones and tablets.",
      },
      {
        id: "structured_jsonld",
        category: "good",
        label: "BlogPosting Schema",
        summary: "JSON-LD markup ready",
        passed: true,
        detail: "Structured data enables Google rich snippets including author, publish date, and publisher logo.",
      },
    ];

    const commonErrors = allChecks.filter((c) => c.category === "common" && !c.passed);
    const otherErrors = allChecks.filter((c) => (c.category === "other" || c.category === "common") && !c.passed);
    const goodChecks = allChecks.filter((c) => c.passed);

    // Calculate score out of 100
    const totalChecks = allChecks.length;
    const passedCount = goodChecks.length;
    const calculatedScore = Math.round((passedCount / totalChecks) * 100);

    return {
      score: Math.max(55, Math.min(100, calculatedScore)),
      commonErrors,
      otherErrors,
      goodChecks,
    };
  }, [postData, blocks]);

  // GEO Specific Audit Calculation
  const geoAudit = useMemo(() => {
    const hasAnswerBlock = blocks.some((b) => b.type === "answer-block") || postData.hasAnswerBlock;
    const hasFaq = blocks.some((b) => b.type === "faq") || postData.hasFaqSchema;
    const hasProduct = blocks.some((b) => b.type === "product");
    const hasAuthor = Boolean(postData.author && postData.author !== "Default (Store Default)");
    const hasToc = Boolean(postData.tableOfContents?.enabled);

    const geoChecks = [
      {
        id: "direct_answer",
        label: "Direct Answer Summary",
        summary: hasAnswerBlock ? "AI Overview direct answer block present" : "Missing 40-word direct summary box",
        passed: hasAnswerBlock,
        detail: "Perplexity, Google AI Overviews, and ChatGPT prioritize direct 40-60 word definitive summaries.",
      },
      {
        id: "faq_schema",
        label: "Conversational FAQ",
        summary: hasFaq ? "Voice & LLM FAQ structure active" : "Add FAQ section for AI Q&A matching",
        passed: hasFaq,
        detail: "Conversational Q&A format allows LLMs to extract exact answers for conversational voice queries.",
      },
      {
        id: "author_eeat",
        label: "Author E-E-A-T Signal",
        summary: hasAuthor ? "Expert author credited" : "Set specific verified author name",
        passed: hasAuthor,
        detail: "Explicit author names and credentials build topical authority required for AI search citations.",
      },
      {
        id: "toc_scannability",
        label: "Table of Contents",
        summary: hasToc ? "Structured Table of Contents active" : "Enable Table of Contents in article",
        passed: hasToc,
        detail: "AI search engines extract headings directly from the Table of Contents as sub-entity anchor points.",
      },
      {
        id: "product_entity",
        label: "Commerce Entity Linking",
        summary: hasProduct ? "Shopify product cards embedded" : "Embed featured product card",
        passed: hasProduct,
        detail: "Connecting articles directly to Shopify product entities powers AI shopping recommendations.",
      },
    ];

    const passed = geoChecks.filter((c) => c.passed).length;
    const geoScore = Math.round((passed / geoChecks.length) * 100);

    return {
      score: Math.max(60, geoScore),
      checks: geoChecks,
    };
  }, [postData, blocks]);

  const currentScore = activeTab === "seo" ? seoAudit.score : geoAudit.score;

  // Horseshoe Gauge calculations
  // Arc angles: from 135 deg to 405 deg (total 270 deg)
  const radius = 72;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (270 / 360) * circumference;
  const progressOffset = arcLength - (currentScore / 100) * arcLength;

  const getScoreColor = (sc) => {
    if (sc >= 80) return "#16a34a"; // Green
    if (sc >= 60) return "#f59e0b"; // Orange/Amber
    return "#ef4444"; // Red
  };

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 600);
  };

  const languageOptions = [
    { label: "English (Primary)", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
    { label: "French (Français)", value: "fr" },
    { label: "German (Deutsch)", value: "de" },
    { label: "Spanish (Español)", value: "es" },
  ];

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Sticky Language Selector Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          borderBottom: "1px solid #f1f2f4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <Select
            label="Language"
            labelHidden
            options={languageOptions}
            value={postData.language || "en"}
            onChange={() => {}}
          />
        </div>

        <Button
          icon={LanguageIcon}
          variant="tertiary"
          accessibilityLabel="Translate language"
        />
      </div>

      {/* Scrollable Audit Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* SEO / GEO Segmented Sub-Nav */}
        <div
          style={{
            backgroundColor: "#f4f4f5",
            borderRadius: "8px",
            padding: "3px",
            display: "flex",
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderRadius: "6px",
              backgroundColor: activeTab === "seo" ? "#ffffff" : "transparent",
              color: activeTab === "seo" ? "#18181b" : "#71717a",
              fontWeight: activeTab === "seo" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: activeTab === "seo" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            SEO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("geo")}
            style={{
              flex: 1,
              padding: "7px 0",
              border: "none",
              borderRadius: "6px",
              backgroundColor: activeTab === "geo" ? "#ffffff" : "transparent",
              color: activeTab === "geo" ? "#18181b" : "#71717a",
              fontWeight: activeTab === "geo" ? 700 : 500,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: activeTab === "geo" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            GEO
          </button>
        </div>

        {/* Section Heading */}
        <Text variant="headingSm" as="h3" fontWeight="bold">
          {activeTab === "seo" ? "SEO Audit" : "GEO Audit"}
        </Text>

        {/* Circular Horseshoe Score Meter */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 0 12px 0",
          }}
        >
          <div style={{ position: "relative", width: "190px", height: "190px" }}>
            <svg
              width="190"
              height="190"
              viewBox="0 0 190 190"
              style={{ transform: "rotate(135deg)", overflow: "visible" }}
            >
              {/* Background Track */}
              <circle
                cx="95"
                cy="95"
                r={radius}
                fill="transparent"
                stroke="#e4e4e7"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Active Progress Track */}
              <circle
                cx="95"
                cy="95"
                r={radius}
                fill="transparent"
                stroke={getScoreColor(currentScore)}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                style={{
                  transition: "stroke-dashoffset 0.5s ease, stroke 0.3s ease",
                }}
              />
            </svg>

            {/* Centered Score Text */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#71717a",
                  marginBottom: "2px",
                }}
              >
                {activeTab === "seo" ? "SEO score" : "GEO score"}
              </span>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "#18181b",
                  lineHeight: "1",
                }}
              >
                {currentScore}
              </span>
            </div>
          </div>

          {/* Re-scan Button */}
          <div style={{ marginTop: "-8px" }}>
            <Button
              size="slim"
              loading={isScanning}
              onClick={handleRescan}
            >
              Re-scan
            </Button>
          </div>
        </div>

        {/* Audit Breakdown Accordion Sections */}
        {activeTab === "seo" ? (
          <BlockStack gap="200">
            {/* 1. Common Errors */}
            <div style={{ borderBottom: "1px solid #f1f2f4", paddingBottom: "10px" }}>
              <div
                onClick={() => toggleSection("common")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <InlineStack gap="200" blockAlign="center">
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <XCircleIcon />
                  </div>
                  <Text variant="bodySm" fontWeight="bold">
                    Common errors ({seoAudit.commonErrors.length})
                  </Text>
                </InlineStack>
                <Icon source={expandedSections.common ? ChevronUpIcon : ChevronDownIcon} tone="subdued" />
              </div>

              {expandedSections.common && (
                <div style={{ marginTop: "8px", paddingLeft: "26px" }}>
                  {seoAudit.commonErrors.length === 0 ? (
                    <Text variant="bodyXs" tone="subdued">
                      No common critical errors found.
                    </Text>
                  ) : (
                    seoAudit.commonErrors.map((err) => (
                      <div key={err.id} style={{ marginBottom: "8px" }}>
                        <Text variant="bodySm" fontWeight="medium">
                          • <strong>{err.label}</strong> {err.summary}
                        </Text>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. Other Errors */}
            <div style={{ borderBottom: "1px solid #f1f2f4", paddingBottom: "10px" }}>
              <div
                onClick={() => toggleSection("other")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <InlineStack gap="200" blockAlign="center">
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "#d97706",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <InfoIcon />
                  </div>
                  <Text variant="bodySm" fontWeight="bold">
                    Other errors ({seoAudit.otherErrors.length})
                  </Text>
                </InlineStack>
                <Icon source={expandedSections.other ? ChevronUpIcon : ChevronDownIcon} tone="subdued" />
              </div>

              {expandedSections.other && (
                <div style={{ marginTop: "12px", paddingLeft: "10px" }}>
                  {seoAudit.otherErrors.length === 0 ? (
                    <Text variant="bodyXs" tone="subdued">
                      No secondary errors found.
                    </Text>
                  ) : (
                    <BlockStack gap="200">
                      {seoAudit.otherErrors.map((err) => (
                        <div key={err.id} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <div style={{ fontSize: "13px", color: "#18181b", lineHeight: "1.4" }}>
                            <span style={{ color: "#d97706", marginRight: "6px" }}>•</span>
                            <strong>{err.label}</strong> {err.summary}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleDetail(err.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#2563eb",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                                padding: 0,
                                marginLeft: "12px",
                                textDecoration: "underline",
                              }}
                            >
                              {expandedDetails[err.id] ? "Hide details" : "Show more"}
                            </button>
                          </div>
                          {expandedDetails[err.id] && (
                            <div
                              style={{
                                marginLeft: "12px",
                                marginTop: "4px",
                                padding: "8px 10px",
                                backgroundColor: "#f8fafc",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                                color: "#475569",
                              }}
                            >
                              {err.detail}
                            </div>
                          )}
                        </div>
                      ))}
                    </BlockStack>
                  )}
                </div>
              )}
            </div>

            {/* 3. Good Checks */}
            <div style={{ paddingBottom: "10px" }}>
              <div
                onClick={() => toggleSection("good")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <InlineStack gap="200" blockAlign="center">
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "#16a34a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircleIcon />
                  </div>
                  <Text variant="bodySm" fontWeight="bold">
                    Good ({seoAudit.goodChecks.length})
                  </Text>
                </InlineStack>
                <Icon source={expandedSections.good ? ChevronUpIcon : ChevronDownIcon} tone="subdued" />
              </div>

              {expandedSections.good && (
                <div style={{ marginTop: "12px", paddingLeft: "10px" }}>
                  <BlockStack gap="150">
                    {seoAudit.goodChecks.map((item) => (
                      <div key={item.id} style={{ fontSize: "13px", color: "#18181b", lineHeight: "1.4" }}>
                        <span style={{ color: "#16a34a", marginRight: "6px" }}>•</span>
                        <strong>{item.label}:</strong> {item.summary}
                      </div>
                    ))}
                  </BlockStack>
                </div>
              )}
            </div>
          </BlockStack>
        ) : (
          /* GEO Audit Breakdown */
          <BlockStack gap="250">
            <Text variant="bodyXs" fontWeight="bold" tone="subdued">
              GEO CITATION READINESS (AI SEARCH)
            </Text>

            <BlockStack gap="200">
              {geoAudit.checks.map((check) => (
                <div
                  key={check.id}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: check.passed ? "#bbf7d0" : "#fed7aa",
                    backgroundColor: check.passed ? "#f0fdf4" : "#fff7ed",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="bodySm" fontWeight="bold">
                      {check.label}
                    </Text>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "10px",
                        backgroundColor: check.passed ? "#dcfce7" : "#ffedd5",
                        color: check.passed ? "#15803d" : "#c2410c",
                      }}
                    >
                      {check.passed ? "Optimized" : "Needed"}
                    </span>
                  </InlineStack>
                  <Text variant="bodyXs" tone="subdued">
                    {check.summary}
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    {check.detail}
                  </Text>
                </div>
              ))}
            </BlockStack>
          </BlockStack>
        )}
      </div>
    </div>
  );
}

export default ScratchSidebarSeo;
