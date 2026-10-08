import { useState } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Card,
  Button,
  Modal,
  Banner,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { AiStyleToneSettings } from "./AiStyleToneSettings";
import { BusinessContextCard } from "./BusinessContextCard";
import { TypeSpecificSettingsCard } from "./TypeSpecificSettingsCard";
import { KeywordAndScheduleSettings } from "./KeywordAndScheduleSettings";
import { PostTitleAndOutlineSettings } from "./PostTitleAndOutlineSettings";
import { getSavedKeywords } from "../../../utils/savedKeywordsStorage";

export function AiGeneratorSetupView({ onBack, onCompleteGeneration }) {
  const [language, setLanguage] = useState("English(US)");
  const [writingStyle, setWritingStyle] = useState("Default");
  const [voiceTone, setVoiceTone] = useState("Default");
  const [complexity, setComplexity] = useState("Default");

  const [businessDesc, setBusinessDesc] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");

  const [insertSectionSummary, setInsertSectionSummary] = useState(false);

  const [keywords, setKeywords] = useState([]);
  const [publishDate, setPublishDate] = useState("05 Oct 2026");
  const [refreshReminder, setRefreshReminder] = useState("30 days");

  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState([]);
  const [generateFeaturedImage, setGenerateFeaturedImage] = useState(true);
  const [productImage, setProductImage] = useState(null);
  const [featuredImagePrompt, setFeaturedImagePrompt] = useState(
    "Place the product on a dark slate stone surface against a moody charcoal background, dramatic side lighting casting soft shadows, luxury aesthetic, high-end commercial photo."
  );
  const [featuredImageQuality, setFeaturedImageQuality] = useState("Medium");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const [errors, setErrors] = useState({ keywords: false, title: false });

  const handleKeywordsChange = (newKeywords) => {
    setKeywords(newKeywords);
    const hasKw = Array.isArray(newKeywords)
      ? newKeywords.length > 0
      : Boolean(newKeywords && newKeywords.trim());
    if (hasKw) {
      setErrors((prev) => ({ ...prev, keywords: false }));
    }
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (newTitle && newTitle.trim()) {
      setErrors((prev) => ({ ...prev, title: false }));
    }
  };

  const handleGenerateTitle = () => {
    const kwStr = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "");
    const kw = kwStr.trim();
    if (!kw) {
      setErrors((prev) => ({ ...prev, keywords: true }));
      return;
    }
    const sampleTitles = [
      `10 Actionable Strategies to Master ${kw} in 2026`,
      `The Complete Guide to ${kw}: Trends, Best Practices & GEO Optimization`,
      `How to Accelerate Store Conversions Using ${kw}`,
      `Why ${kw} is Essential for AI Search Engines & Google AI Overviews`,
    ];
    const picked = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    setTitle(picked);
    setErrors((prev) => ({ ...prev, title: false }));
  };

  const savedPool = getSavedKeywords();
  const suggestedKeywords = [
    ...savedPool.map((kw) => ({
      kw,
      volume: "3.5K/mo",
      kd: "Low",
    })),
    { kw: "Mother and baby care", volume: "8.2K/mo", kd: "Low" },
    { kw: "organic baby clothes online", volume: "5.4K/mo", kd: "Low" },
    { kw: "safe baby skincare products", volume: "4.1K/mo", kd: "Medium" },
    { kw: "postpartum essentials for moms", volume: "6.8K/mo", kd: "Low" },
    { kw: "maternity fashion trends 2026", volume: "3.9K/mo", kd: "Low" },
    { kw: "shopify seo guide 2026", volume: "4.5K/mo", kd: "Low" },
  ].filter((item, index, self) => index === self.findIndex((t) => t.kw.toLowerCase() === item.kw.toLowerCase()));

  const handleSelectSuggestedKeyword = (kw) => {
    setKeywords((prev) => {
      const arr = Array.isArray(prev)
        ? prev
        : prev
        ? prev.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      return arr.includes(kw) ? arr : [...arr, kw];
    });
    setErrors((prev) => ({ ...prev, keywords: false }));
    setShowKeywordModal(false);
  };

  const [generatingProgress, setGeneratingProgress] = useState(20);
  const [generatingStep, setGeneratingStep] = useState("Step 1/3: Analyzing topic & outline...");

  const handleGenerate = () => {
    const hasKw = Array.isArray(keywords)
      ? keywords.length > 0
      : Boolean(keywords && keywords.trim());
    const hasTitle = Boolean(title && title.trim());

    if (!hasKw || !hasTitle) {
      setErrors({
        keywords: !hasKw,
        title: !hasTitle,
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingProgress(20);
    setGeneratingStep("Step 1/3: Analyzing topic & outline...");

    const generatedPostTitle = title.trim();
    const kwString = Array.isArray(keywords)
      ? keywords.join(", ")
      : keywords || "Chat GPT is very good";

    const featuredImgUrl = generateFeaturedImage
      ? productImage ||
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
      : null;

    const isChatGPT = /chat\s*gpt|ai|gpt|llm|openai|claude|gemini/i.test(generatedPostTitle);

    const parseOutlineStringToBlocks = (outlineInput, postTitle, kwStr, withSummary) => {
      let rawBlocks = [];
      let bIdx = 1;

      const formatCombinedParagraph = (lines) => {
        if (!lines || lines.length === 0) return "";
        return lines
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`))
          .join(" ");
      };

      const generateRichParagraphs = (headingText, bullets = [], level = "h2") => {
        const cleanTitle = headingText
          .replace(/^\d+[\.\)]\s*/, "")
          .replace(/^(heading \d:\s*|#+\s*)/i, "")
          .trim();
        const validBullets = (bullets || [])
          .map((b) => b.replace(/^[•\-\*]\s*/, "").trim())
          .filter(Boolean);

        const paragraphs = [];

        if (level === "h1") {
          paragraphs.push(
            `In today's fast-evolving digital commerce landscape, understanding the core principles behind ${cleanTitle.toLowerCase()} is essential for sustained brand growth and customer engagement. As consumer expectations shift toward higher transparency and personalized experiences, forward-thinking merchants must adopt modern strategies that deliver measurable, lasting value.`
          );
          paragraphs.push(
            `This comprehensive guide breaks down the strategic frameworks, practical execution steps, and industry best practices you need to succeed. Whether you are scaling an established store or launching a new initiative, the insights below will help you navigate complex decisions with clarity and confidence.`
          );
          return paragraphs;
        }

        // Paragraph 1: Strategic context + bullets
        if (validBullets.length > 0) {
          const bulletsNarrative = validBullets
            .map((b) => (/[.!?]$/.test(b) ? b : `${b}.`))
            .join(" ");
          paragraphs.push(
            `A successful strategy for ${cleanTitle.toLowerCase()} begins with clear operational priorities and rigorous planning. Specifically, ${bulletsNarrative} By systematically addressing each of these key aspects, teams can eliminate workflow friction and build a resilient foundation for long-term scalability.`
          );
        } else {
          paragraphs.push(
            `Effectively implementing ${cleanTitle.toLowerCase()} requires analyzing both current market benchmarks and audience behavioral patterns. High-performing ecommerce teams avoid one-size-fits-all tactics, instead focusing on tailored methodologies that directly align with verified search intent and customer lifecycle needs.`
          );
        }

        // Paragraph 2: Tactical execution and deep-dive insights
        paragraphs.push(
          `From an execution perspective, achieving consistent excellence in this area demands rigorous quality standards and iterative testing. Implementing structured workflows, automated verification checks, and clear cross-functional guidelines helps reduce turnaround times by up to 40% while preserving brand authority across every published touchpoint.`
        );

        // Paragraph 3: Measurable KPIs & actionable takeaway for H2
        if (level === "h2") {
          paragraphs.push(
            `To ensure sustainable success, track key performance indicators such as engagement depth, organic visibility, and conversion lift. Regularly reviewing these metrics allows you to fine-tune your approach in real time, staying ahead of competitive shifts and maximizing overall return on investment.`
          );
        }

        return paragraphs;
      };

      if (typeof outlineInput === "string" && outlineInput.trim()) {
        const outlineStr = outlineInput.trim();
        if (outlineStr.includes("<")) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(outlineStr, "text/html");
          const elements = Array.from(doc.body.childNodes);
          let currentHeading = null;
          let currentBullets = [];

          const flushCurrentSection = () => {
            if (currentHeading) {
              rawBlocks.push({
                id: `b-${bIdx++}`,
                type: "heading",
                level: currentHeading.level,
                text: currentHeading.text,
              });
              const paragraphs = generateRichParagraphs(
                currentHeading.text,
                currentBullets,
                currentHeading.level
              );
              paragraphs.forEach((pText) => {
                rawBlocks.push({
                  id: `b-${bIdx++}`,
                  type: "paragraph",
                  text: pText,
                });
              });
            }
            currentHeading = null;
            currentBullets = [];
          };

          elements.forEach((node) => {
            const tag = node.nodeName?.toLowerCase();
            const text = (node.textContent || "").trim();
            if (!text) return;
            if (tag === "h1" || tag === "h2" || tag === "h3") {
              flushCurrentSection();
              currentHeading = { level: tag, text };
            } else if (tag === "ul" || tag === "ol") {
              node.querySelectorAll("li").forEach((li) => {
                const liText = (li.textContent || "").trim();
                if (liText) currentBullets.push(liText);
              });
            } else if (tag === "li" || tag === "p") {
              currentBullets.push(text);
            }
          });
          flushCurrentSection();
        } else {
          const lines = outlineStr.split("\n");
          let currentHeading = null;
          let currentBullets = [];

          const flushCurrentSection = () => {
            if (currentHeading) {
              rawBlocks.push({
                id: `b-${bIdx++}`,
                type: "heading",
                level: currentHeading.level,
                text: currentHeading.text,
              });
              const paragraphs = generateRichParagraphs(
                currentHeading.text,
                currentBullets,
                currentHeading.level
              );
              paragraphs.forEach((pText) => {
                rawBlocks.push({
                  id: `b-${bIdx++}`,
                  type: "paragraph",
                  text: pText,
                });
              });
            }
            currentHeading = null;
            currentBullets = [];
          };

          lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.toLowerCase().startsWith("heading 1:") || trimmed.startsWith("# ")) {
              flushCurrentSection();
              currentHeading = {
                level: "h1",
                text: trimmed.replace(/^(heading 1:\s*|#\s*)/i, "").trim(),
              };
            } else if (trimmed.toLowerCase().startsWith("heading 2:") || trimmed.startsWith("## ")) {
              flushCurrentSection();
              currentHeading = {
                level: "h2",
                text: trimmed.replace(/^(heading 2:\s*|##\s*)/i, "").trim(),
              };
            } else if (trimmed.toLowerCase().startsWith("heading 3:") || trimmed.startsWith("### ")) {
              flushCurrentSection();
              currentHeading = {
                level: "h3",
                text: trimmed.replace(/^(heading 3:\s*|###\s*)/i, "").trim(),
              };
            } else {
              currentBullets.push(trimmed.replace(/^[•\-\*]\s*/, "").trim());
            }
          });
          flushCurrentSection();
        }
      } else if (Array.isArray(outlineInput) && outlineInput.length > 0) {
        outlineInput.forEach((item) => {
          const headingText = item.title || item.text || "Heading";
          const level = item.level || "h2";
          rawBlocks.push({
            id: `b-${bIdx++}`,
            type: "heading",
            level,
            text: headingText,
          });
          const bullets = item.description ? [item.description] : item.bullets || [];
          const paragraphs = generateRichParagraphs(headingText, bullets, level);
          paragraphs.forEach((pText) => {
            rawBlocks.push({
              id: `b-${bIdx++}`,
              type: "paragraph",
              text: pText,
            });
          });
        });
      }

      if (rawBlocks.length > 0) {
        const hasH1 = rawBlocks.some((b) => b.type === "heading" && b.level === "h1");
        if (!hasH1 && postTitle) {
          rawBlocks.unshift({
            id: `b-h1-main`,
            type: "heading",
            level: "h1",
            text: postTitle,
          });
        }

        return rawBlocks;
      }

      if (isChatGPT) {
        return [
          {
            id: "b-1",
            type: "heading",
            level: "h1",
            text: postTitle || "The Case for Chat GPT: A Pragmatic Claim Worth Testing",
          },
          {
            id: "b-2",
            type: "heading",
            level: "h2",
            text: 'What "Very Good" Means in Practical Terms: Accuracy, Speed, Breadth, Cost',
          },
          {
            id: "b-3",
            type: "paragraph",
            text: 'When you say Chat GPT is "very good," you\'re not making a vague marketing claim—you\'re describing measurable performance across four dimensions that matter in real work. Accuracy means the output matches your intent closely enough that revision time drops by half or more. Speed means seconds instead of hours for first drafts, research summaries, or code snippets. Breadth means one tool handles customer emails, technical documentation, brainstorming sessions, and data analysis without switching platforms. Cost means you pay pennies per task compared to hiring specialists or subscribing to niche software for every job.',
          },
          {
            id: "b-4",
            type: "paragraph",
            text: "Consider a content marketer drafting ten social posts. Chat GPT delivers all ten in under two minutes, each tailored to platform character limits and tone guidelines. That speed-cost combination is observable ROI compounding weekly across publishing workflows.",
          },
          {
            id: "b-5",
            type: "heading",
            level: "h2",
            text: "Where Chat GPT Reliably Excels Today: Patterns and Task Archetypes",
          },
          {
            id: "b-6",
            type: "paragraph",
            text: "Chat GPT consistently outperforms alternatives in pattern-heavy, high-repetition workflows: transforming raw notes into clean meeting summaries, generating boilerplate API wrappers, and scaffolding test cases across complex codebases.",
          },
          {
            id: "b-7",
            type: "heading",
            level: "h2",
            text: "How to Measure Value: Outcome-Based Benchmarks Over Hype",
          },
          {
            id: "b-8",
            type: "paragraph",
            text: "Measure outcomes rather than hype: hours saved, revision iterations, and baseline cost reduction. Setting a structured evaluation pilot clarifies where generative tools provide definitive competitive advantage.",
          },
        ];
      }

      return [
        {
          id: "b-1",
          type: "heading",
          level: "h1",
          text: postTitle || "2026’s Big Shift: Practical, Planet-First Fashion for Mother and Baby",
        },
        {
          id: "b-2",
          type: "heading",
          level: "h2",
          text: "Data-backed drivers: climate volatility, stricter safety standards, and time-poor parenting",
        },
        {
          id: "b-3",
          type: "paragraph",
          text: "Modern families in 2026 demand apparel that balances sustainable ethics with ruthless daily practicality. As climate patterns fluctuate and safety certifications become non-negotiable, aesthetics now firmly follow function in Mother and Baby wear.",
        },
        {
          id: "b-4",
          type: "heading",
          level: "h2",
          text: "Skin-Safe, Sustainable Materials That Dominate 2026 Collections",
        },
        {
          id: "b-5",
          type: "paragraph",
          text: "Bio-based fibers including TENCEL Lyocell, certified organic cotton, and refined hemp lead the market. Coupled with plant-derived, low-tox dyes, these fabrics protect delicate infant skin without harsh chemical residues.",
        },
        {
          id: "b-6",
          type: "heading",
          level: "h2",
          text: "Smart Textiles Enter Daily Wear: Sensible Upgrades, Not Gimmicks",
        },
        {
          id: "b-7",
          type: "paragraph",
          text: "Temperature-regulating micro-knits and UPF 50+ stroller textiles shield newborns during heatwaves. Parents increasingly prioritize washable smart components verified with strict privacy safeguards.",
        },
        {
          id: "b-8",
          type: "heading",
          level: "h2",
          text: "Postpartum-Ready Fits and Nursing-First Design That Look Polished",
        },
        {
          id: "b-9",
          type: "paragraph",
          text: "Invisible nursing access—powered by whisper-quiet magnetic clasps, low-profile hidden zippers, and crossover wrap fronts—allows mothers to feel chic and work-ready without feeling confined to traditional maternity wear.",
        },
      ];
    };

    const generatedBlocks = parseOutlineStringToBlocks(
      outline,
      generatedPostTitle,
      kwString,
      insertSectionSummary
    );

    const generatedPost = {
      id: `post-${Date.now()}`,
      title: generatedPostTitle,
      mode: "ai",
      isAiGenerated: true,
      creationMode: "ai",
      intent: "Informational",
      type: "Informational",
      author: "AI Assistant",
      lastModified: "Oct 7, 2026, 08:57 PM",
      isNew: true,
      seoScore: 78,
      geoScore: 70,
      status: "Draft",
      keyword: kwString,
      tags: "AI, Technology, Generative AI",
      hasAnswerBlock: insertSectionSummary,
      hasFaqSchema: true,
      featuredImage: featuredImgUrl,
      imageAlt: generatedPostTitle,
      imageScope: "All devices",
      imageSize: "original",
      excerpt: `A pragmatic, in-depth evaluation of ${generatedPostTitle} exploring real-world performance, speed, cost, and workflow benchmarks.`,
      seoTitle: generatedPostTitle,
      metaDescription: `Discover why ${generatedPostTitle} with measurable benchmarks on speed, accuracy, cost-efficiency, and outcome-driven results.`,
      handle: generatedPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      tableOfContents: {
        enabled: true,
        title: "Table of Contents",
        textColor: "#2563eb",
        listStyle: "none",
        indentation: "hierarchical",
        layout: "1-col",
        collapsible: false,
        excludedHeadingTypes: [],
      },
      blocks: generatedBlocks,
      outline: generatedBlocks
        .filter((b) => b.type === "heading")
        .map((b, idx) => ({
          id: String(idx + 1),
          level: b.level || "h2",
          title: b.text,
          description: "Section",
        })),
    };

    setTimeout(() => {
      setIsGenerating(false);
      onCompleteGeneration(generatedPost);
    }, 1800);
  };

  const handleOutlineValidationError = () => {
    const hasKw = Array.isArray(keywords)
      ? keywords.length > 0
      : Boolean(keywords && keywords.trim());
    const hasTitle = Boolean(title && title.trim());
    setErrors({
      keywords: !hasKw,
      title: !hasTitle,
    });
  };

  return (
    <div
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        width: "100%",
        paddingBottom: "40px",
      }}
    >
      <BlockStack gap="400">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <InlineStack gap="200" align="center">
            <Button
              icon={ArrowLeftIcon}
              variant="tertiary"
              onClick={onBack}
              accessibilityLabel="Back to Content Studio"
            />
            <Text variant="headingLg" as="h1" fontWeight="bold">
              Create blog post
            </Text>
            <Badge tone="info">305 AI credits</Badge>
          </InlineStack>
        </div>

        <Card>
          <BlockStack gap="500">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              AI Generate
            </Text>

            <AiStyleToneSettings
              language={language}
              onLanguageChange={setLanguage}
              writingStyle={writingStyle}
              onWritingStyleChange={setWritingStyle}
              voiceTone={voiceTone}
              onVoiceToneChange={setVoiceTone}
              complexity={complexity}
              onComplexityChange={setComplexity}
            />

            <BusinessContextCard
              businessDesc={businessDesc}
              onBusinessDescChange={setBusinessDesc}
              targetCustomer={targetCustomer}
              onTargetCustomerChange={setTargetCustomer}
              onInsertProduct={() => setShowProductModal(true)}
              onInsertCollection={() => setShowCollectionModal(true)}
            />

            <TypeSpecificSettingsCard
              insertSectionSummary={insertSectionSummary}
              onToggleSectionSummary={() =>
                setInsertSectionSummary(!insertSectionSummary)
              }
            />

            <KeywordAndScheduleSettings
              keywords={keywords}
              onKeywordsChange={handleKeywordsChange}
              publishDate={publishDate}
              onPublishDateChange={setPublishDate}
              refreshReminder={refreshReminder}
              onRefreshReminderChange={setRefreshReminder}
              onOpenKeywordSuggestions={() => setShowKeywordModal(true)}
              error={errors.keywords}
            />

            <PostTitleAndOutlineSettings
              title={title}
              onTitleChange={handleTitleChange}
              onGenerateTitle={handleGenerateTitle}
              outline={outline}
              onOutlineChange={setOutline}
              keywords={keywords}
              generateFeaturedImage={generateFeaturedImage}
              onToggleGenerateFeaturedImage={() =>
                setGenerateFeaturedImage(!generateFeaturedImage)
              }
              productImage={productImage}
              onProductImageChange={setProductImage}
              featuredImagePrompt={featuredImagePrompt}
              onFeaturedImagePromptChange={setFeaturedImagePrompt}
              featuredImageQuality={featuredImageQuality}
              onFeaturedImageQualityChange={setFeaturedImageQuality}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              generatingProgress={generatingProgress}
              generatingStep={generatingStep}
              error={errors.title}
              onOutlineValidationError={handleOutlineValidationError}
            />
          </BlockStack>
        </Card>
      </BlockStack>

      <Modal
        open={showKeywordModal}
        onClose={() => setShowKeywordModal(false)}
        title="AI Keyword Suggestions"
        primaryAction={{
          content: "Done",
          onAction: () => setShowKeywordModal(false),
        }}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text variant="bodySm" tone="subdued">
              Click on high-opportunity keyword sets discovered by our GEO &amp; SEO intelligence engine:
            </Text>
            <BlockStack gap="150">
              {suggestedKeywords.map((item) => (
                <div
                  key={item.kw}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    backgroundColor: "#fafafa",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectSuggestedKeyword(item.kw)}
                >
                  <Text variant="bodySm" fontWeight="semibold">
                    {item.kw}
                  </Text>
                  <InlineStack gap="200" align="center">
                    <Text variant="bodyXs" tone="subdued">
                      Vol: {item.volume}
                    </Text>
                    <Badge tone="success">{item.kd} KD</Badge>
                  </InlineStack>
                </div>
              ))}
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>

      <Modal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Insert Product Link into Blog"
        primaryAction={{
          content: "Insert Selected Product",
          onAction: () => {
            setBusinessDesc((prev) =>
              `${prev ? prev + " " : ""}Featured Product: Snowboard Pro Series 2026.`
            );
            setShowProductModal(false);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowProductModal(false),
          },
        ]}
      >
        <Modal.Section>
          <Text variant="bodySm">
            Select a Shopify store product to automatically embed product cards, price metadata, and structured buy buttons.
          </Text>
        </Modal.Section>
      </Modal>

      <Modal
        open={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        title="Insert Collection Link into Blog"
        primaryAction={{
          content: "Insert Selected Collection",
          onAction: () => {
            setBusinessDesc((prev) =>
              `${prev ? prev + " " : ""}Featured Collection: Winter Gear & Outdoor Accessories.`
            );
            setShowCollectionModal(false);
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowCollectionModal(false),
          },
        ]}
      >
        <Modal.Section>
          <Text variant="bodySm">
            Select a Shopify collection to dynamically embed category spotlights and recommendation carousels.
          </Text>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default AiGeneratorSetupView;
