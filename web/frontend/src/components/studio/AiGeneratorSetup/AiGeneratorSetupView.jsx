import { useState } from "react";
import {
  Page,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Card,
  Button,
  Modal,
  List,
} from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { AiStyleToneSettings } from "./AiStyleToneSettings";
import { BusinessContextCard } from "./BusinessContextCard";
import { TypeSpecificSettingsCard } from "./TypeSpecificSettingsCard";
import { KeywordAndScheduleSettings } from "./KeywordAndScheduleSettings";
import { PostTitleAndOutlineSettings } from "./PostTitleAndOutlineSettings";

export function AiGeneratorSetupView({ onBack, onCompleteGeneration }) {
  // Form states
  const [language, setLanguage] = useState("English(US)");
  const [writingStyle, setWritingStyle] = useState("Default");
  const [voiceTone, setVoiceTone] = useState("Default");
  const [complexity, setComplexity] = useState("Default");

  const [businessDesc, setBusinessDesc] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");

  const [insertSectionSummary, setInsertSectionSummary] = useState(true);

  const [keywords, setKeywords] = useState([]);
  const [publishDate, setPublishDate] = useState("05 Oct 2026");
  const [refreshReminder, setRefreshReminder] = useState("30 days");

  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState([]);
  const [generateFeaturedImage, setGenerateFeaturedImage] = useState(false);

  // Modals & helpers state
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Validation errors state
  const [errors, setErrors] = useState({ keywords: false, title: false });

  // Handle keyword changes and clear validation error
  const handleKeywordsChange = (newKeywords) => {
    setKeywords(newKeywords);
    const hasKw = Array.isArray(newKeywords)
      ? newKeywords.length > 0
      : Boolean(newKeywords && newKeywords.trim());
    if (hasKw) {
      setErrors((prev) => ({ ...prev, keywords: false }));
    }
  };

  // Handle title changes and clear validation error
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (newTitle && newTitle.trim()) {
      setErrors((prev) => ({ ...prev, title: false }));
    }
  };

  // Suggested titles generator
  const handleGenerateTitle = () => {
    const kwStr = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "");
    const kw = kwStr.trim() || "Shopify Ecommerce";
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

  // Keyword suggestions list
  const suggestedKeywords = [
    { kw: "shopify seo guide 2026", volume: "4.5K/mo", kd: "Low" },
    { kw: "generative engine optimization shopify", volume: "2.8K/mo", kd: "Medium" },
    { kw: "how to write ai blog posts", volume: "6.2K/mo", kd: "Low" },
    { kw: "best ecommerce blogging strategies", volume: "3.1K/mo", kd: "Low" },
    { kw: "shopify answer block schema", volume: "1.2K/mo", kd: "Low" },
  ];

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

  const handleAddOutlineSection = (newSec) => {
    setOutline((prev) => [...prev, newSec]);
  };

  const handleRemoveOutlineSection = (index) => {
    setOutline((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit and launch generation with validation check
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

    setTimeout(() => {
      const generatedPostTitle = title.trim();
      const kwString = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "shopify geo seo");
      const newPost = {
        id: `post-${Date.now()}`,
        title: generatedPostTitle,
        intent: "Informational",
        type: "Informational",
        author: "Thành Nguyễn",
        lastModified: "Just now",
        seoScore: 92,
        geoScore: 96,
        status: "Published",
        keyword: kwString,
        hasAnswerBlock: insertSectionSummary,
        hasFaqSchema: true,
        outline:
          typeof outline === "string" && outline.trim()
            ? outline
                .replace(/<p><br><\/p>/g, "")
                .split(/<\/(?:h2|h3|h4|p|li)>/i)
                .map((seg) => seg.replace(/<[^>]*>/g, "").trim())
                .filter(Boolean)
                .map((line, idx) => ({
                  id: String(idx + 1),
                  level: "h2",
                  title: line.replace(/^(Heading \d:\s*|•\s*)/i, "").trim(),
                  description: "Custom section",
                }))
            : Array.isArray(outline) && outline.length > 0
            ? outline
            : [
                { id: "1", level: "h1", title: generatedPostTitle, description: "Overview & Direct Answer Block" },
                { id: "2", level: "h2", title: "1. Core Principles and Fundamentals", description: "In-depth insights" },
                { id: "3", level: "h2", title: "2. Strategic Implementation Checklist", description: "Actionable roadmap" },
                { id: "4", level: "h2", title: "3. Frequently Asked Questions", description: "FAQ Schema block" },
              ],
        bodyHtml:
          typeof outline === "string" && outline.trim().startsWith("<")
            ? `
              <div class="geo-answer-block">
                <p><strong>Direct Summary:</strong> ${generatedPostTitle} provides an authoritative framework engineered for Google AI Overviews and Perplexity citations with structured FAQ Schema and Answer Blocks.</p>
              </div>
              ${outline}
            `
            : `
              <div class="geo-answer-block">
                <p><strong>Direct Summary:</strong> ${generatedPostTitle} provides an authoritative framework engineered for Google AI Overviews and Perplexity citations with structured FAQ Schema and Answer Blocks.</p>
              </div>
              <h2>1. Core Principles and Fundamentals</h2>
              <p>This article explores comprehensive methodologies tailored to maximize both conventional search CTR and generative citation rate.</p>
              <h2>2. Strategic Implementation Checklist</h2>
              <p>Follow these proven steps to streamline your ecommerce content production and audit readiness.</p>
            `,
      };

      setIsGenerating(false);
      onCompleteGeneration(newPost);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", width: "100%", paddingBottom: "40px" }}>
      <BlockStack gap="400">
        {/* Top bar with back button and credits badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

        {/* Main AI Generate Card */}
        <Card>
          <BlockStack gap="500">
            <Text variant="headingMd" as="h2" fontWeight="bold">
              AI Generate
            </Text>

            {/* Row 1: Language, Writing Style, Voice Tone, Complexity */}
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

            {/* Row 2: Business description & Target customer */}
            <BusinessContextCard
              businessDesc={businessDesc}
              onBusinessDescChange={setBusinessDesc}
              targetCustomer={targetCustomer}
              onTargetCustomerChange={setTargetCustomer}
              onInsertProduct={() => setShowProductModal(true)}
              onInsertCollection={() => setShowCollectionModal(true)}
            />

            {/* Row 3: Type-specific settings */}
            <TypeSpecificSettingsCard
              insertSectionSummary={insertSectionSummary}
              onToggleSectionSummary={() => setInsertSectionSummary(!insertSectionSummary)}
            />

            {/* Row 4: Keywords & Publishing Schedule */}
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

            {/* Row 5: Title, Outline, Featured Image, Generate Button */}
            <PostTitleAndOutlineSettings
              title={title}
              onTitleChange={handleTitleChange}
              onGenerateTitle={handleGenerateTitle}
              outline={outline}
              onOutlineChange={setOutline}
              keywords={keywords}
              generateFeaturedImage={generateFeaturedImage}
              onToggleGenerateFeaturedImage={() => setGenerateFeaturedImage(!generateFeaturedImage)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={errors.title}
            />
          </BlockStack>
        </Card>
      </BlockStack>

      {/* Keyword suggestions modal */}
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

      {/* Product picker modal placeholder */}
      <Modal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Insert Product Link into Blog"
        primaryAction={{
          content: "Insert Selected Product",
          onAction: () => {
            setBusinessDesc((prev) => `${prev ? prev + " " : ""}Featured Product: Snowboard Pro Series 2026.`);
            setShowProductModal(false);
          },
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowProductModal(false) }]}
      >
        <Modal.Section>
          <Text variant="bodySm">
            Select a Shopify store product to automatically embed product cards, price metadata, and structured buy buttons.
          </Text>
        </Modal.Section>
      </Modal>

      {/* Collection picker modal placeholder */}
      <Modal
        open={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        title="Insert Collection Link into Blog"
        primaryAction={{
          content: "Insert Selected Collection",
          onAction: () => {
            setBusinessDesc((prev) => `${prev ? prev + " " : ""}Featured Collection: Winter Gear & Outdoor Accessories.`);
            setShowCollectionModal(false);
          },
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setShowCollectionModal(false) }]}
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
