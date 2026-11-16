import { useState } from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Button,
  Badge,
  Box,
  Divider,
  ProgressBar,
  Text,
  Icon,
} from "@shopify/polaris";
import {
  MagicIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LightbulbIcon,
  StarIcon,
} from "@shopify/polaris-icons";
import { STORE_PRODUCTS_MOCK } from "./mockData";

export function CustomIdeaValidatorModal({
  isOpen,
  onClose,
  onLaunchToStudio,
  onSaveCustomIdea,
}) {
  const [title, setTitle] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [angleDescription, setAngleDescription] = useState("");
  const [targetProduct, setTargetProduct] = useState("");
  const [contentGoal, setContentGoal] = useState("bofu");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const goalOptions = [
    { label: "Direct Sales & Conversions (BOFU)", value: "bofu" },
    { label: "Product Comparison & Buyer Consideration (MOFU)", value: "mofu" },
    { label: "Brand Discovery & Problem Education (TOFU)", value: "tofu" },
  ];

  const productOptions = [
    { label: "Select a store product (Optional)", value: "" },
    ...STORE_PRODUCTS_MOCK.map((p) => ({
      label: `${p.title} (${p.collection})`,
      value: p.title,
    })),
  ];

  const handleAnalyze = () => {
    if (!title.trim() || !primaryKeyword.trim()) return;

    setIsAnalyzing(true);
    // Simulate smart AI analysis
    setTimeout(() => {
      const isSalesGoal = contentGoal === "bofu";
      const score = isSalesGoal ? 88 : 82;

      setEvaluationResult({
        viabilityScore: score,
        scoreLabel: "High Potential - Recommended to Draft",
        demand: {
          volume: "3.2K - 5.5K/mo",
          growth: "+95% MoM",
          status: "Trending Up",
        },
        seo: {
          difficulty: "Easy (Low Competition)",
          rankChance: "Top 3 within 3 weeks",
        },
        geo: {
          citationOdds: "91%",
          aiFit: "Strong fit for Perplexity & ChatGPT recommendations",
        },
        commercial: {
          fitScore: targetProduct ? "96% High Fit" : "80% Moderate",
          verdict: targetProduct
            ? `Seamless placement for "${targetProduct}"`
            : "Recommend pairing with a related catalog item",
        },
        titleAlternatives: [
          `${title.trim()} (2026 Buying Guide & Expert Review)`,
          `Best ${primaryKeyword.trim()}: 5 Crucial Factors Before You Buy`,
          `Why ${primaryKeyword.trim()} is Trending: Complete Comparison`,
        ],
        missingKeywords: [
          "long-term durability",
          "cost vs quality",
          "materials breakdown",
          "eco-friendly certification",
        ],
        contentGapWarning:
          "Competitors rank with generic specs. Adding real customer use-cases and product comparison tables will double your AI citation likelihood.",
      });
      setIsAnalyzing(false);
    }, 800);
  };

  const handleReset = () => {
    setEvaluationResult(null);
  };

  const handleUseAlternativeTitle = (altTitle) => {
    setTitle(altTitle);
  };

  const handleLaunch = () => {
    if (evaluationResult) {
      onLaunchToStudio({
        title: title,
        query: primaryKeyword,
        description: angleDescription,
        matchedProduct: targetProduct || "Custom Selected Product",
        category: "Custom Idea",
      });
      onClose();
    }
  };

  const handleSave = () => {
    if (evaluationResult) {
      onSaveCustomIdea({
        id: `custom-${Date.now()}`,
        type: "topic",
        title: title,
        query: primaryKeyword,
        category: "Custom",
        volume: evaluationResult.demand.volume,
        growth: evaluationResult.demand.growth,
        isBreakout: true,
        buyerIntent: contentGoal === "bofu" ? "Transactional" : "Commercial",
        funnelStage: contentGoal.toUpperCase(),
        aiEngine: "ChatGPT",
        geoScore: 91,
        difficulty: "Easy",
        matchedProduct: targetProduct || "Store Product",
        matchedCollection: "Custom Catalog",
        isSaved: true,
        aiSnippet: "Custom validated query with strong intent.",
        contentGap: evaluationResult.contentGapWarning,
      });
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Validate & Score Custom Content Idea"
      size="large"
      primaryAction={
        evaluationResult
          ? {
              content: "Launch to Content Studio",
              icon: MagicIcon,
              onAction: handleLaunch,
            }
          : {
              content: "Score & Evaluate Idea",
              icon: MagicIcon,
              loading: isAnalyzing,
              disabled: !title.trim() || !primaryKeyword.trim(),
              onAction: handleAnalyze,
            }
      }
      secondaryActions={
        evaluationResult
          ? [
              {
                content: "Save to Ideas List",
                icon: StarIcon,
                onAction: handleSave,
              },
              {
                content: "Edit Inputs",
                onAction: handleReset,
              },
            ]
          : [
              {
                content: "Cancel",
                onAction: onClose,
              },
            ]
      }
    >
      <Modal.Section>
        {!evaluationResult ? (
          <BlockStack gap="400">
            <Text variant="bodyMd" tone="subdued">
              Have your own blog concept in mind? Enter the basic details below. Our AI Search Radar will validate search demand, keyword difficulty, AI citation odds, and commercial conversion fit before you write.
            </Text>

            {/* 1. Working Title */}
            <TextField
              label="Working Title or Idea Topic (*)"
              value={title}
              onChange={setTitle}
              placeholder="e.g. How to Choose Between Linen and Organic Cotton Bedding"
              autoComplete="off"
              helpText="The tentative headline for your blog article."
            />

            {/* 2. Target Keyword */}
            <TextField
              label="Primary Target Search Keyword (*)"
              value={primaryKeyword}
              onChange={setPrimaryKeyword}
              placeholder="e.g. linen vs organic cotton bedding"
              autoComplete="off"
              helpText="The main query you want this blog to rank for on Google and AI search engines."
            />

            {/* 3. Description / Angle */}
            <TextField
              label="Brief Description & Content Angle (Recommended)"
              value={angleDescription}
              onChange={setAngleDescription}
              placeholder="e.g. Compare durability, breathability for hot sleepers, and recommend our French Linen set."
              multiline={3}
              autoComplete="off"
              helpText="1-2 sentences on who this is for and what problem it solves."
            />

            <InlineStack gap="300" wrap>
              {/* 4. Target Product */}
              <Box minWidth="280px">
                <Select
                  label="Link Target Store Product (Optional)"
                  options={productOptions}
                  value={targetProduct}
                  onChange={setTargetProduct}
                  helpText="Promote this product inside the post."
                />
              </Box>

              {/* 5. Content Goal */}
              <Box minWidth="260px">
                <Select
                  label="Content Goal & Funnel Stage"
                  options={goalOptions}
                  value={contentGoal}
                  onChange={setContentGoal}
                />
              </Box>
            </InlineStack>
          </BlockStack>
        ) : (
          /* Evaluation Results View */
          <BlockStack gap="400">
            {/* Top Viability Score Card */}
            <Box
              background="bg-surface-secondary"
              padding="400"
              borderRadius="200"
            >
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="150" blockAlign="center">
                    <Text variant="headingMd" as="h3">
                      Idea Viability Score
                    </Text>
                    <Badge tone="success">{evaluationResult.scoreLabel}</Badge>
                  </InlineStack>
                  <Text variant="headingXl" as="p" tone="success">
                    {evaluationResult.viabilityScore} / 100
                  </Text>
                </InlineStack>
                <ProgressBar
                  progress={evaluationResult.viabilityScore}
                  tone="success"
                  size="small"
                />
              </BlockStack>
            </Box>

            {/* 4 Pillars Breakdown */}
            <Box
              background="bg-surface-secondary"
              padding="300"
              borderRadius="200"
            >
              <InlineStack align="space-between" blockAlign="start" gap="300" wrap>
                <BlockStack gap="050">
                  <Text variant="bodyXs" tone="subdued">Estimated Demand</Text>
                  <Text variant="bodySm" fontWeight="bold">{evaluationResult.demand.volume}</Text>
                  <Badge tone="success" size="small">{evaluationResult.demand.growth}</Badge>
                </BlockStack>

                <BlockStack gap="050">
                  <Text variant="bodyXs" tone="subdued">SEO Rankability</Text>
                  <Text variant="bodySm" fontWeight="bold">{evaluationResult.seo.difficulty}</Text>
                  <Text variant="bodyXs" tone="subdued">{evaluationResult.seo.rankChance}</Text>
                </BlockStack>

                <BlockStack gap="050">
                  <Text variant="bodyXs" tone="subdued">AI Citation Odds</Text>
                  <Text variant="bodySm" fontWeight="bold" tone="magic">{evaluationResult.geo.citationOdds}</Text>
                  <Text variant="bodyXs" tone="subdued">GEO Optimized</Text>
                </BlockStack>

                <BlockStack gap="050">
                  <Text variant="bodyXs" tone="subdued">Store Conversion Fit</Text>
                  <Text variant="bodySm" fontWeight="bold">{evaluationResult.commercial.fitScore}</Text>
                  <Text variant="bodyXs" tone="subdued">{evaluationResult.commercial.verdict}</Text>
                </BlockStack>
              </InlineStack>
            </Box>

            <Divider />

            {/* Title Improvements */}
            <BlockStack gap="200">
              <InlineStack gap="150" blockAlign="center">
                <Icon source={LightbulbIcon} tone="magic" />
                <Text variant="headingSm" as="h4">
                  High-Converting Title Alternatives
                </Text>
              </InlineStack>
              <BlockStack gap="150">
                {evaluationResult.titleAlternatives.map((altTitle, idx) => (
                  <Box
                    key={idx}
                    background="bg-surface-secondary"
                    padding="200"
                    borderRadius="150"
                  >
                    <InlineStack align="space-between" blockAlign="center">
                      <Text variant="bodySm" as="p">
                        {altTitle}
                      </Text>
                      <Button
                        size="micro"
                        variant="plain"
                        onClick={() => handleUseAlternativeTitle(altTitle)}
                      >
                        Use this title
                      </Button>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </BlockStack>

            {/* Missing Keywords */}
            <BlockStack gap="200">
              <InlineStack gap="150" blockAlign="center">
                <Icon source={CheckCircleIcon} tone="success" />
                <Text variant="headingSm" as="h4">
                  Recommended Semantic Keywords to Include
                </Text>
              </InlineStack>
              <InlineStack gap="150" wrap>
                {evaluationResult.missingKeywords.map((kw, idx) => (
                  <Badge key={idx} tone="info">
                    + {kw}
                  </Badge>
                ))}
              </InlineStack>
            </BlockStack>

            {/* Content Gap Alert */}
            <BlockStack gap="200">
              <InlineStack gap="150" blockAlign="center">
                <Icon source={AlertCircleIcon} tone="caution" />
                <Text variant="headingSm" as="h4">
                  Content Gap & Outranking Strategy
                </Text>
              </InlineStack>
              <Box
                background="bg-surface-caution"
                padding="300"
                borderRadius="200"
              >
                <Text variant="bodySm" as="p">
                  {evaluationResult.contentGapWarning}
                </Text>
              </Box>
            </BlockStack>
          </BlockStack>
        )}
      </Modal.Section>
    </Modal>
  );
}

export default CustomIdeaValidatorModal;
