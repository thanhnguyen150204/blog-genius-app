import { useState } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  Card,
  Divider,
  Select,
  TextField,
  Checkbox,
  ProgressBar,
  Banner,
  Icon,
  Tabs,
} from "@shopify/polaris";
import {
  XIcon,
  SettingsIcon,
  MagicIcon,
  SaveIcon,
  RefreshIcon,
  CheckIcon,
  ChartHistogramGrowthIcon,
  DatabaseIcon,
  GlobeIcon,
  ClockIcon,
  SearchIcon,
} from "@shopify/polaris-icons";

export function ContentIdeasSettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetSettings,
  onSaveAndScan,
  telemetry,
}) {
  const [activeTab, setActiveTab] = useState("rules"); // "rules" | "usage"

  // Local state for editable settings
  const [formSettings, setFormSettings] = useState(settings);

  // Sync with prop changes
  const handleFieldChange = (field, value) => {
    setFormSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSourceToggle = (sourceKey) => {
    setFormSettings((prev) => ({
      ...prev,
      sources: {
        ...prev.sources,
        [sourceKey]: !prev.sources[sourceKey],
      },
    }));
  };

  const handleSave = () => {
    onSaveSettings(formSettings);
    onClose();
  };

  const handleReset = () => {
    onResetSettings();
    setFormSettings(settings);
  };

  const volumeOptions = [
    { label: "500+ / mo (Niche / Long-tail)", value: "500" },
    { label: "1,000+ / mo (Balanced - Default)", value: "1000" },
    { label: "2,500+ / mo (High Volume Only)", value: "2500" },
    { label: "5,000+ / mo (Mass Demand Only)", value: "5000" },
  ];

  const growthOptions = [
    { label: "Any Growth (>0%)", value: "0" },
    { label: "+50% Trending Up (Default)", value: "50" },
    { label: "+100% Breakout Only", value: "100" },
    { label: "+150% Viral & Seasonal Spikes", value: "150" },
  ];

  const geoScoreOptions = [
    { label: "60%+ (All Opportunities)", value: "60" },
    { label: "75%+ (Moderate Citation)", value: "75" },
    { label: "85%+ (High AI Odds - Recommended)", value: "85" },
    { label: "90%+ (Top Tier Citations Only)", value: "90" },
  ];

  const collectionOptions = [
    { label: "All Store Collections", value: "all" },
    { label: "Autumn/Winter 2026", value: "autumn-winter" },
    { label: "Baby Essentials", value: "baby" },
    { label: "Sensitive Skincare", value: "skincare" },
    { label: "Sustainable Living", value: "eco" },
    { label: "Kitchen Cookware", value: "kitchen" },
    { label: "Workwear & Suiting", value: "workwear" },
  ];

  const regionOptions = [
    { label: "United States (US - English)", value: "US" },
    { label: "United Kingdom (UK - English)", value: "UK" },
    { label: "Canada (CA - English/French)", value: "CA" },
    { label: "Australia (AU - English)", value: "AU" },
    { label: "Vietnam (VN - Vietnamese)", value: "VN" },
  ];

  const scheduleOptions = [
    { label: "Daily at 02:00 AM (Recommended)", value: "daily" },
    { label: "Every 3 Days", value: "3days" },
    { label: "Weekly on Monday", value: "weekly" },
    { label: "Manual Scan Only", value: "manual" },
  ];

  const drawerTabs = [
    {
      id: "rules",
      content: "Scraping Rules",
      icon: SettingsIcon,
    },
    {
      id: "usage",
      content: "AI Model & Usage",
      icon: MagicIcon,
    },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`content-ideas-drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className={`content-ideas-right-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Radar Settings & AI Telemetry"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <InlineStack align="space-between" blockAlign="center">
            <BlockStack gap="050">
              <InlineStack gap="150" blockAlign="center">
                <Text variant="headingMd" as="h2">
                  Radar Settings & AI
                </Text>
                <Badge tone="magic">Control Panel</Badge>
              </InlineStack>
              <Text variant="bodyXs" tone="subdued">
                Fine-tune idea scraping criteria & monitor AI model consumption
              </Text>
            </BlockStack>

            <Button
              variant="plain"
              icon={XIcon}
              onClick={onClose}
              accessibilityLabel="Close settings drawer"
            />
          </InlineStack>

          {/* Sub Navigation Switcher using Polaris Tabs */}
          <Box paddingBlockStart="300">
            <Tabs
              tabs={drawerTabs}
              selected={activeTab === "rules" ? 0 : 1}
              onSelect={(idx) => setActiveTab(drawerTabs[idx].id)}
              fitted
            />
          </Box>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="drawer-body">
          {activeTab === "rules" ? (
            /* TAB 1: SCRAPING ENGINE RULES */
            <BlockStack gap="400">
              {/* Group A: Quality Thresholds */}
              <Card padding="400">
                <BlockStack gap="300">
                  <InlineStack gap="150" blockAlign="center">
                    <Icon source={ChartHistogramGrowthIcon} tone="base" />
                    <Text variant="headingSm" as="h3">
                      Quality & Volume Thresholds
                    </Text>
                  </InlineStack>
                  <Text variant="bodyXs" tone="subdued">
                    Filter out low-value keywords before they enter your idea feed.
                  </Text>

                  <Select
                    label="Minimum Monthly Search Volume"
                    options={volumeOptions}
                    value={formSettings.minVolume}
                    onChange={(val) => handleFieldChange("minVolume", val)}
                    helpText="Ignores queries with volume below this threshold."
                  />

                  <Select
                    label="Minimum Growth Rate %"
                    options={growthOptions}
                    value={formSettings.minGrowth}
                    onChange={(val) => handleFieldChange("minGrowth", val)}
                    helpText="Focuses your radar on breakout trends."
                  />

                  <Select
                    label="Minimum GEO / AI Citation Score"
                    options={geoScoreOptions}
                    value={formSettings.minGeoScore}
                    onChange={(val) => handleFieldChange("minGeoScore", val)}
                    helpText="Prioritizes topics that AI answer engines love citing."
                  />
                </BlockStack>
              </Card>

              {/* Group B: Target Data Sources */}
              <Card padding="400">
                <BlockStack gap="250">
                  <InlineStack gap="150" blockAlign="center">
                    <Icon source={DatabaseIcon} tone="base" />
                    <Text variant="headingSm" as="h3">
                      Scraping Channels & Sources
                    </Text>
                  </InlineStack>
                  <Text variant="bodyXs" tone="subdued">
                    Choose which data streams feed your content radar.
                  </Text>

                  <Checkbox
                    label="Shopify Buyer Search Queries"
                    helpText="Real shopper intent queries & internal store searches"
                    checked={formSettings.sources.shopifyShoppers}
                    onChange={() => handleSourceToggle("shopifyShoppers")}
                  />

                  <Checkbox
                    label="ChatGPT Shopper Prompts"
                    helpText="Pre-purchase questions asked directly to ChatGPT"
                    checked={formSettings.sources.chatGptPrompts}
                    onChange={() => handleSourceToggle("chatGptPrompts")}
                  />

                  <Checkbox
                    label="Perplexity AI Research Citations"
                    helpText="High-trust comparison and product review citations"
                    checked={formSettings.sources.perplexityCitations}
                    onChange={() => handleSourceToggle("perplexityCitations")}
                  />

                  <Checkbox
                    label="Google Search Trends"
                    helpText="Organic search surges and long-tail breakout queries"
                    checked={formSettings.sources.googleTrends}
                    onChange={() => handleSourceToggle("googleTrends")}
                  />

                  <Checkbox
                    label="Amazon Buyer Reviews & FAQs"
                    helpText="Common customer complaints, pain points, and product doubts"
                    checked={formSettings.sources.amazonFaqs}
                    onChange={() => handleSourceToggle("amazonFaqs")}
                  />
                </BlockStack>
              </Card>

              {/* Group C: Store Catalog & Negative Keywords */}
              <Card padding="400">
                <BlockStack gap="300">
                  <InlineStack gap="150" blockAlign="center">
                    <Icon source={GlobeIcon} tone="base" />
                    <Text variant="headingSm" as="h3">
                      Catalog Focus & Exclusions
                    </Text>
                  </InlineStack>

                  <Select
                    label="Priority Store Collection"
                    options={collectionOptions}
                    value={formSettings.priorityCollection}
                    onChange={(val) => handleFieldChange("priorityCollection", val)}
                    helpText="Steer ideas toward products you want to sell more of."
                  />

                  <Checkbox
                    label="Auto-Match Store Products in Outlines"
                    helpText="Automatically binds top catalog products into the generated article outline"
                    checked={formSettings.autoMatchProducts}
                    onChange={(val) => handleFieldChange("autoMatchProducts", val)}
                  />

                  <TextField
                    label="Negative Keywords (Exclude)"
                    value={formSettings.negativeKeywords}
                    onChange={(val) => handleFieldChange("negativeKeywords", val)}
                    placeholder="e.g. cheap, free, fake, replica"
                    multiline={2}
                    autoComplete="off"
                    helpText="Comma-separated terms that should never appear in suggestions."
                  />
                </BlockStack>
              </Card>

              {/* Group D: Target Region & Schedule */}
              <Card padding="400">
                <BlockStack gap="300">
                  <InlineStack gap="150" blockAlign="center">
                    <Icon source={ClockIcon} tone="base" />
                    <Text variant="headingSm" as="h3">
                      Market & Scan Frequency
                    </Text>
                  </InlineStack>

                  <Select
                    label="Target Market & Language"
                    options={regionOptions}
                    value={formSettings.targetRegion}
                    onChange={(val) => handleFieldChange("targetRegion", val)}
                  />

                  <Select
                    label="Automated Radar Scan Schedule"
                    options={scheduleOptions}
                    value={formSettings.refreshSchedule}
                    onChange={(val) => handleFieldChange("refreshSchedule", val)}
                    helpText="Background worker automatically updates trending metrics."
                  />
                </BlockStack>
              </Card>
            </BlockStack>
          ) : (
            /* TAB 2: AI MODEL & USAGE TELEMETRY */
            <BlockStack gap="400">
              {/* Quota & Credits Tracker */}
              <Card padding="400">
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingSm" as="h3">
                      Monthly AI Credits Quota
                    </Text>
                    <Badge tone="success">
                      {telemetry.monthlyQuota.used} / {telemetry.monthlyQuota.total} Credits
                    </Badge>
                  </InlineStack>

                  <ProgressBar
                    progress={telemetry.monthlyQuota.percentage}
                    tone="primary"
                    size="small"
                  />

                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="bodyXs" tone="subdued">
                      {telemetry.monthlyQuota.percentage}% consumed
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      Renews on {telemetry.monthlyQuota.renewalDate}
                    </Text>
                  </InlineStack>

                  <Divider />

                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text variant="headingSm" as="p">
                        {telemetry.monthlyQuota.ideasCurated}
                      </Text>
                      <Text variant="bodyXs" tone="subdued">
                        Ideas Curated
                      </Text>
                    </BlockStack>

                    <BlockStack gap="050">
                      <Text variant="headingSm" as="p">
                        {telemetry.monthlyQuota.customEvaluated}
                      </Text>
                      <Text variant="bodyXs" tone="subdued">
                        Custom Validated
                      </Text>
                    </BlockStack>

                    <BlockStack gap="050">
                      <Text variant="headingSm" as="p">
                        {telemetry.monthlyQuota.studioDrafts}
                      </Text>
                      <Text variant="bodyXs" tone="subdued">
                        Drafts Created
                      </Text>
                    </BlockStack>
                  </InlineStack>
                </BlockStack>
              </Card>

              {/* Multi-AI Model Allocation Breakdown */}
              <Card padding="400">
                <BlockStack gap="300">
                  <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingSm" as="h3">
                      AI Model Allocation
                    </Text>
                    <Badge tone="magic">Multi-Model Engine</Badge>
                  </InlineStack>
                  <Text variant="bodyXs" tone="subdued">
                    BlogGenius dynamically routes tasks to the best-suited foundation model.
                  </Text>

                  {telemetry.models.map((model, idx) => (
                    <Box
                      key={idx}
                      background="bg-surface-secondary"
                      padding="300"
                      borderRadius="200"
                    >
                      <BlockStack gap="150">
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="bodySm" fontWeight="bold">
                            {model.name}
                          </Text>
                          <Badge tone={model.badgeTone} size="small">
                            {model.badge}
                          </Badge>
                        </InlineStack>

                        <Text variant="bodyXs" tone="subdued">
                          {model.role}
                        </Text>

                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="bodyXs" tone="subdued">
                            {model.requests} requests ({model.share}% share)
                          </Text>
                          <Text variant="bodyXs" tone="subdued">
                            Avg: {model.avgLatency}
                          </Text>
                        </InlineStack>
                        <ProgressBar progress={model.share} size="small" />
                      </BlockStack>
                    </Box>
                  ))}
                </BlockStack>
              </Card>

              {/* GEO Engine Platform Citations */}
              <Card padding="400">
                <BlockStack gap="300">
                  <Text variant="headingSm" as="h3">
                    Target AI Citation Engines
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    Where your audience searches and discovers product answers.
                  </Text>

                  <BlockStack gap="200">
                    {telemetry.geoEngines.map((engine, idx) => (
                      <Box key={idx}>
                        <InlineStack align="space-between" blockAlign="center">
                          <Text variant="bodySm" fontWeight="medium">
                            {engine.name}
                          </Text>
                          <InlineStack gap="100" blockAlign="center">
                            <Text variant="bodySm" fontWeight="bold">
                              {engine.percentage}%
                            </Text>
                            <Badge tone="info" size="small">
                              {engine.status}
                            </Badge>
                          </InlineStack>
                        </InlineStack>
                        <Box paddingBlockStart="100">
                          <ProgressBar progress={engine.percentage} size="small" />
                        </Box>
                      </Box>
                    ))}
                  </BlockStack>
                </BlockStack>
              </Card>

              {/* Cache Efficiency Banner */}
              <Banner tone="success">
                <Text variant="bodySm" as="p">
                  <strong>{telemetry.cacheStats.hitRate} Cache Hit Rate:</strong> Intelligent trend caching saved{" "}
                  <strong>{telemetry.cacheStats.savedCredits} API credits</strong> this month by reusing verified SERP snippets.
                </Text>
              </Banner>
            </BlockStack>
          )}
        </div>

        {/* Drawer Sticky Footer */}
        <div className="drawer-footer">
          <InlineStack align="space-between" blockAlign="center">
            <Button variant="plain" onClick={handleReset}>
              Reset Defaults
            </Button>

            <InlineStack gap="200" blockAlign="center">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                variant="secondary"
                icon={SearchIcon}
                onClick={() => {
                  if (onSaveAndScan) {
                    onSaveAndScan(formSettings);
                  }
                  onClose();
                }}
              >
                Save &amp; Run Scan
              </Button>
              <Button
                variant="primary"
                icon={SaveIcon}
                onClick={handleSave}
              >
                Save Settings
              </Button>
            </InlineStack>
          </InlineStack>
        </div>
      </aside>
    </>
  );
}

export default ContentIdeasSettingsDrawer;
