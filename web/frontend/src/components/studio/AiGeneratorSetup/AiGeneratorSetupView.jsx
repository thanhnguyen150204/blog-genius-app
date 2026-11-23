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
import { ProductPicker, CollectionPicker } from "../../common";

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

  const handleGenerate = async () => {
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
    setGeneratingProgress(15);
    setGeneratingStep("Connecting to AI Section Chaining engine...");

    try {
      let parsedSections = [];
      if (outline && outline.trim()) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(outline, "text/html");
        const headings = doc.querySelectorAll("h1, h2, h3");

        headings.forEach((el, idx) => {
          let description = "";
          let next = el.nextElementSibling;
          while (next && !["H1", "H2", "H3"].includes(next.tagName)) {
            description += (next.textContent || "").trim() + " ";
            next = next.nextElementSibling;
          }

          parsedSections.push({
            id: `sec-${idx + 1}`,
            level: el.tagName.toLowerCase(),
            title: el.textContent.trim(),
            description: description.trim() || "In-depth section analysis",
          });
        });
      }


      if (parsedSections.length === 0) {
        parsedSections = [
          { id: "sec-1", level: "h1", title: title.trim(), description: "Intro & Direct Answer Block" },
          { id: "sec-2", level: "h2", title: "1. Core Fundamentals & Practical Analysis", description: "Deep dive" },
          { id: "sec-3", level: "h2", title: "2. Comparative Analysis & Decision Matrix", description: "Comparison table" },
          { id: "sec-4", level: "h2", title: "3. Frequently Asked Questions (FAQ)", description: "Top inquiries" },
        ];
      }

      setGeneratingProgress(40);
      setGeneratingStep("Writing article sections...");


      const response = await fetch("/api/ai/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: {
            keyword: title.trim(),
            secondary_keywords: Array.isArray(keywords) ? keywords : [keywords],
            target_audience: targetCustomer || "General Readers",
            tone_of_voice: voiceTone || "Professional & Informative",
          },
          outline: parsedSections,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to generate article from AI.");
      }

      setGeneratingProgress(100);
      setGeneratingStep("Article generated successfully!");

      const generatedPostTitle = title.trim();
      const kwString = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "");
      const featuredImgUrl = generateFeaturedImage
        ? productImage || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
        : null;

      const generatedPost = {
        id: `post-${Date.now()}`,
        title: generatedPostTitle,
        mode: "ai",
        isAiGenerated: true,
        creationMode: "ai",
        intent: "Informational",
        type: "Informational",
        author: "AI Assistant",
        lastModified: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        isNew: true,
        seoScore: 85,
        geoScore: 80,
        status: "Draft",
        keyword: kwString,
        tags: "AI, SEO, GEO, Blog",
        hasAnswerBlock: insertSectionSummary,
        hasFaqSchema: true,
        featuredImage: featuredImgUrl,
        imageAlt: generatedPostTitle,
        imageScope: "All devices",
        imageSize: "original",
        seoTitle: generatedPostTitle,
        metaDescription: `Comprehensive guide to ${generatedPostTitle} featuring structured comparison tables and expert FAQs.`,
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
        blocks: data.blocks,
        outline: parsedSections,
      };

      onCompleteGeneration(generatedPost);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
      setGeneratingProgress(0);
    }
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

      <ProductPicker
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelect={(selected) => {
          const item = selected[0];
          if (item) {
            setBusinessDesc((prev) =>
              `${prev ? prev + " " : ""}Featured Product: ${item.title} (${item.price || ""}).`
            );
            if (item.image) {
              setProductImage(item.image);
            }
          }
          setShowProductModal(false);
        }}
      />

      <CollectionPicker
        open={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
        onSelect={(selected) => {
          const item = selected[0];
          if (item) {
            setBusinessDesc((prev) =>
              `${prev ? prev + " " : ""}Featured Collection: ${item.title}.`
            );
          }
          setShowCollectionModal(false);
        }}
      />
    </div>
  );
}

export default AiGeneratorSetupView;
