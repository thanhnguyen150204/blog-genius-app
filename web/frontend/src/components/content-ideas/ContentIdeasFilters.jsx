import {
  Card,
  BlockStack,
  InlineStack,
  TextField,
  Select,
  Button,
  ButtonGroup,
  Badge,
  Box,
  Divider,
} from "@shopify/polaris";
import {
  SearchIcon,
  TargetIcon,
  CartIcon,
  MagicIcon,
  ChartHistogramGrowthIcon,
  XSmallIcon,
} from "@shopify/polaris-icons";
import {
  CATEGORY_OPTIONS,
  BUYER_INTENT_OPTIONS,
  FUNNEL_OPTIONS,
  AI_ENGINE_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "./mockData";

export function ContentIdeasFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  buyerIntent,
  onBuyerIntentChange,
  funnelStage,
  onFunnelStageChange,
  aiEngine,
  onAiEngineChange,
  difficulty,
  onDifficultyChange,
  activePreset,
  onApplyPreset,
  onResetFilters,
  counts,
}) {
  // Thanh 1: Category tabs using standard Polaris segmented buttons (Dark pressed state)
  const tabOptions = [
    { label: `All Opportunities (${counts.all})`, value: "all" },
    { label: `Topic Ideas (${counts.topic})`, value: "topic" },
    { label: `Hot Keywords (${counts.keyword})`, value: "keyword" },
    { label: `AI Questions (${counts.question})`, value: "question" },
    { label: `Saved (${counts.saved})`, value: "saved" },
  ];

  // Thanh 2: Presets using Polaris segmented buttons (White bg, colored text/icon when pressed)
  const presetOptions = [
    {
      value: "all",
      label: "All Presets",
      activeColor: "#202223",
    },
    {
      value: "quick-wins",
      label: "Quick Wins (Easy & Fast Rank)",
      icon: TargetIcon,
      activeColor: "#007a5c", // Green
    },
    {
      value: "high-intent",
      label: "High Buyer Intent (Ready to Buy)",
      icon: CartIcon,
      activeColor: "#005bd3", // Blue
    },
    {
      value: "ai-magnet",
      label: "AI Citation Magnet (GEO 90%+)",
      icon: MagicIcon,
      activeColor: "#7c3aed", // Magic Purple
    },
    {
      value: "breakouts",
      label: "Breakout Trends (+100% Growth)",
      icon: ChartHistogramGrowthIcon,
      activeColor: "#b24000", // Warm Brown / Amber-Red
    },
  ];

  const hasActiveFilters =
    searchQuery ||
    category !== "all" ||
    buyerIntent !== "all" ||
    funnelStage !== "all" ||
    aiEngine !== "all" ||
    difficulty !== "all" ||
    (activePreset !== null && activePreset !== "all");

  return (
    <Box paddingBlockEnd="400">
      <Card padding="400">
        <BlockStack gap="300">
          {/* Thanh 1: Main Category Tabs with Polaris ButtonGroup segmented */}
          <div
            className="content-ideas-category-segmented"
            style={{ maxWidth: "100%", overflowX: "auto" }}
          >
            <ButtonGroup variant="segmented">
              {tabOptions.map((tab) => {
                const isSelected = activeTab === tab.value;
                return (
                  <Button
                    key={tab.value}
                    size="medium"
                    pressed={isSelected}
                    onClick={() => onTabChange(tab.value)}
                  >
                    {tab.label}
                  </Button>
                );
              })}
            </ButtonGroup>
          </div>

          <Divider />

          {/* Thanh 2: Quick Filter Presets with Polaris ButtonGroup segmented */}
          <InlineStack gap="200" blockAlign="center" wrap>
            <Badge tone="info" size="small">
              Presets
            </Badge>
            <div
              className="content-ideas-presets-segmented"
              style={{ maxWidth: "100%", overflowX: "auto" }}
            >
              <ButtonGroup variant="segmented">
                {presetOptions.map((preset) => {
                  const isSelected = (activePreset || "all") === preset.value;
                  return (
                    <Button
                      key={preset.value}
                      size="slim"
                      icon={preset.icon || undefined}
                      pressed={isSelected}
                      onClick={() =>
                        onApplyPreset(preset.value === "all" ? null : preset.value)
                      }
                      style={
                        isSelected ? { color: preset.activeColor } : undefined
                      }
                    >
                      <span
                        style={{
                          color: isSelected ? preset.activeColor : undefined,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      >
                        {preset.label}
                      </span>
                    </Button>
                  );
                })}
              </ButtonGroup>
            </div>
            {hasActiveFilters && (
              <Button
                size="slim"
                variant="secondary"
                tone="critical"
                icon={XSmallIcon}
                onClick={onResetFilters}
              >
                Clear all filters
              </Button>
            )}
          </InlineStack>

          <Divider />

          {/* Search and Detailed Select Filters */}
          <InlineStack gap="300" wrap blockAlign="end">
            <Box minWidth="260px">
              <TextField
                label="Search idea or query"
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="e.g. linen, baby, skincare, coat..."
                prefix={<SearchIcon />}
                clearButton
                onClearButtonClick={() => onSearchChange("")}
                autoComplete="off"
              />
            </Box>

            <Box minWidth="150px">
              <Select
                label="Category / Niche"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={onCategoryChange}
              />
            </Box>

            <Box minWidth="170px">
              <Select
                label="Buyer Intent"
                options={BUYER_INTENT_OPTIONS}
                value={buyerIntent}
                onChange={onBuyerIntentChange}
              />
            </Box>

            <Box minWidth="160px">
              <Select
                label="Funnel Stage"
                options={FUNNEL_OPTIONS}
                value={funnelStage}
                onChange={onFunnelStageChange}
              />
            </Box>

            <Box minWidth="150px">
              <Select
                label="AI Source"
                options={AI_ENGINE_OPTIONS}
                value={aiEngine}
                onChange={onAiEngineChange}
              />
            </Box>

            <Box minWidth="140px">
              <Select
                label="SEO Difficulty"
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                onChange={onDifficultyChange}
              />
            </Box>
          </InlineStack>
        </BlockStack>
      </Card>
    </Box>
  );
}

export default ContentIdeasFilters;
