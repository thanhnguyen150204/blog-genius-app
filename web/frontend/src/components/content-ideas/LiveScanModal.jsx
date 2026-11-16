import { useState, useEffect } from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  ProgressBar,
  Box,
  Divider,
  Icon,
} from "@shopify/polaris";
import {
  MagicIcon,
  CheckCircleIcon,
  SearchIcon,
  DatabaseIcon,
  ChartHistogramGrowthIcon,
} from "@shopify/polaris-icons";

export function LiveScanModal({ isOpen, onClose, onApplyNewIdeas }) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setProgress(15);
      setIsDone(false);
      return;
    }

    // Step 1: Catalog Scan
    const t1 = setTimeout(() => {
      setStep(2);
      setProgress(45);
    }, 700);

    // Step 2: Live AI queries
    const t2 = setTimeout(() => {
      setStep(3);
      setProgress(80);
    }, 1500);

    // Step 3: Filtering & GEO Scoring
    const t3 = setTimeout(() => {
      setStep(4);
      setProgress(100);
      setIsDone(true);
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen]);

  const newDiscoveredIdeas = [
    {
      id: `discovered-${Date.now()}-1`,
      type: "topic",
      title: "Newborn Sleep Safety: The Complete Bedtime Checklist 2026",
      query: "newborn sleep safety checklist",
      category: "Baby Care",
      volume: "6.8K/mo",
      volumeNum: 6800,
      growth: "+195%",
      growthNum: 195,
      isBreakout: true,
      buyerIntent: "Transactional",
      funnelStage: "BOFU",
      aiEngine: "Perplexity",
      geoScore: 96,
      difficulty: "Easy",
      matchedProduct: "Newborn 100% GOTS Certified Onesie 3-Pack",
      matchedCollection: "Organic Newborn Essentials",
      isSaved: false,
      aiSnippet: "Perplexity highlights breathable organic sleepwear as the top safety factor.",
      contentGap: "Provide a quick downloadable nursery temperature & swaddling guide.",
      suggestedOutline: [
        "1. Sudden Infant Sleep Guidelines 2026 Update",
        "2. Ideal nursery room temperature & breathable sleepwear",
        "3. Swaddle vs sleep sack: Which prevents startle reflex?",
        "4. Top tested organic newborn sleep sets",
      ],
    },
    {
      id: `discovered-${Date.now()}-2`,
      type: "keyword",
      title: "non toxic ceramic pan seasoning",
      query: "non toxic ceramic pan seasoning guide",
      category: "Kitchen",
      volume: "4.5K/mo",
      volumeNum: 4500,
      growth: "+160%",
      growthNum: 160,
      isBreakout: true,
      buyerIntent: "Commercial",
      funnelStage: "MOFU",
      aiEngine: "Google SGE",
      geoScore: 92,
      difficulty: "Easy",
      matchedProduct: "Ceramic Coated 5-Ply Induction Skillet",
      matchedCollection: "Non-Toxic Kitchen Essentials",
      isSaved: false,
      aiSnippet: "Google AI SGE emphasizes low smoke-point oils to preserve natural ceramic glaze.",
      contentGap: "Most guides only discuss cast iron. Ceramic seasoning requires a distinct no-high-heat technique.",
      suggestedOutline: [
        "1. Do ceramic non-stick pans actually need seasoning?",
        "2. Step-by-step low heat oil restoration method",
        "3. Top 3 oils safe for ceramic glaze (Avocado vs Grapeseed)",
        "4. Skillet longevity comparison: Ceramic 5-Ply care guide",
      ],
    },
    {
      id: `discovered-${Date.now()}-3`,
      type: "question",
      title: "What is the best sustainable alternative to synthetic fleece jackets?",
      query: "sustainable alternative synthetic fleece jacket",
      category: "Fashion",
      volume: "5.2K/mo",
      volumeNum: 5200,
      growth: "+210%",
      growthNum: 210,
      isBreakout: true,
      buyerIntent: "Transactional",
      funnelStage: "BOFU",
      aiEngine: "ChatGPT",
      geoScore: 95,
      difficulty: "Easy",
      matchedProduct: "Wool Blend Oversized Trench Coat",
      matchedCollection: "Autumn/Winter 2026 Collection",
      isSaved: false,
      aiSnippet: "ChatGPT actively redirects microplastic-conscious buyers toward boiled wool and recycled organic cotton.",
      contentGap: "Compare microplastic shedding in washing machines vs wool longevity.",
      suggestedOutline: [
        "1. Why outdoor consumers are moving away from polyester fleece",
        "2. 3 Natural warm layer fabrics: Boiled wool, sherpa cotton & hemp",
        "3. Durability & thermal insulation ratings in freezing weather",
        "4. Featured eco outerwear: Wool Blend Trench Coat breakdown",
      ],
    },
  ];

  const handleApply = () => {
    onApplyNewIdeas(newDiscoveredIdeas);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Live AI & Buyer Radar Scan"
      size="medium"
      primaryAction={
        isDone
          ? {
              content: `Add ${newDiscoveredIdeas.length} New Opportunities to Feed`,
              icon: MagicIcon,
              onAction: handleApply,
            }
          : {
              content: "Scanning In Progress...",
              loading: true,
              disabled: true,
            }
      }
      secondaryActions={
        isDone
          ? [
              {
                content: "Close",
                onAction: onClose,
              },
            ]
          : []
      }
    >
      <Modal.Section>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <Text variant="bodyMd" fontWeight="semibold">
                {isDone ? "Scan Complete!" : "Running Real-Time Scraping Engine"}
              </Text>
              <Text variant="bodyXs" tone="subdued">
                {isDone
                  ? `Discovered ${newDiscoveredIdeas.length} breakout opportunities tailored to your catalog.`
                  : "Syncing store catalog, querying AI search engines & filtering volume..."}
              </Text>
            </BlockStack>
            <Badge tone={isDone ? "success" : "magic"}>
              {isDone ? "3 New Found" : "Live Processing"}
            </Badge>
          </InlineStack>

          <ProgressBar
            progress={progress}
            tone={isDone ? "success" : "primary"}
            size="small"
          />

          {/* Stepper Checklist */}
          <BlockStack gap="200">
            {/* Step 1 */}
            <Box
              background={step >= 1 ? "bg-surface-secondary" : "bg-surface"}
              padding="250"
              borderRadius="150"
            >
              <InlineStack gap="200" blockAlign="center">
                <Icon
                  source={step > 1 ? CheckCircleIcon : DatabaseIcon}
                  tone={step > 1 ? "success" : "base"}
                />
                <BlockStack gap="025">
                  <Text variant="bodySm" fontWeight={step === 1 ? "bold" : "regular"}>
                    1. Scanning Shopify Store Catalog
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    {step > 1
                      ? "Scanned 7 collections & 48 active products successfully"
                      : "Connecting to active products & collections..."}
                  </Text>
                </BlockStack>
              </InlineStack>
            </Box>

            {/* Step 2 */}
            <Box
              background={step >= 2 ? "bg-surface-secondary" : "bg-surface"}
              padding="250"
              borderRadius="150"
            >
              <InlineStack gap="200" blockAlign="center">
                <Icon
                  source={step > 2 ? CheckCircleIcon : SearchIcon}
                  tone={step > 2 ? "success" : step === 2 ? "magic" : "subdued"}
                />
                <BlockStack gap="025">
                  <Text variant="bodySm" fontWeight={step === 2 ? "bold" : "regular"}>
                    2. Querying Live Buyer Signals
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    {step > 2
                      ? "Fetched fresh breakout queries from ChatGPT, Perplexity & Google SGE"
                      : step === 2
                      ? "Querying search trends & customer prompts..."
                      : "Pending catalog synchronization"}
                  </Text>
                </BlockStack>
              </InlineStack>
            </Box>

            {/* Step 3 */}
            <Box
              background={step >= 3 ? "bg-surface-secondary" : "bg-surface"}
              padding="250"
              borderRadius="150"
            >
              <InlineStack gap="200" blockAlign="center">
                <Icon
                  source={isDone ? CheckCircleIcon : ChartHistogramGrowthIcon}
                  tone={isDone ? "success" : step === 3 ? "magic" : "subdued"}
                />
                <BlockStack gap="025">
                  <Text variant="bodySm" fontWeight={step === 3 ? "bold" : "regular"}>
                    3. Filtering by Quality &amp; GEO Score Matrix
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    {isDone
                      ? "Applied Min Volume (>1,000/mo), Min Growth (+50%) & GEO Citation criteria"
                      : step === 3
                      ? "Filtering results and scoring ranking probability..."
                      : "Waiting for buyer signals"}
                  </Text>
                </BlockStack>
              </InlineStack>
            </Box>
          </BlockStack>

          {/* Discovered Items Preview when done */}
          {isDone && (
            <>
              <Divider />
              <BlockStack gap="200">
                <Text variant="bodySm" fontWeight="semibold">
                  Newly Curated Breakout Opportunities:
                </Text>

                <BlockStack gap="150">
                  {newDiscoveredIdeas.map((idea) => (
                    <Box
                      key={idea.id}
                      background="bg-surface-magic"
                      padding="200"
                      borderRadius="150"
                    >
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="025">
                          <Text variant="bodySm" fontWeight="bold">
                            {idea.title}
                          </Text>
                          <InlineStack gap="100" blockAlign="center">
                            <Badge tone="info" size="small">{idea.category}</Badge>
                            <Text variant="bodyXs" tone="subdued">Vol: {idea.volume}</Text>
                          </InlineStack>
                        </BlockStack>

                        <Badge tone="success" size="small">{idea.growth}</Badge>
                      </InlineStack>
                    </Box>
                  ))}
                </BlockStack>
              </BlockStack>
            </>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default LiveScanModal;
