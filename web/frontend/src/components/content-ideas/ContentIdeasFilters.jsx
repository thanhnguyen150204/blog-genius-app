import {
  Card,
  TextField,
  Select,
  Button,
} from "@shopify/polaris";
import {
  SearchIcon,
  XSmallIcon,
} from "@shopify/polaris-icons";
import {
  BUYER_INTENT_OPTIONS,
  AI_ENGINE_OPTIONS,
  DIFFICULTY_OPTIONS,
} from "./mockData";

export function ContentIdeasFilters({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  buyerIntent,
  onBuyerIntentChange,
  aiEngine,
  onAiEngineChange,
  difficulty,
  onDifficultyChange,
  activePreset,
  onApplyPreset,
  onResetFilters,
  counts,
}) {
  const tabOptions = [
    { label: "All Opportunities", count: counts.all, value: "all" },
    { label: "Topic Ideas", count: counts.topic, value: "topic" },
    { label: "Hot Keywords", count: counts.keyword, value: "keyword" },
    { label: "AI Questions", count: counts.question, value: "question" },
    { label: "Bookmarks", count: counts.saved, value: "saved" },
  ];

  const presets = [
    { id: "quick-wins", label: "⚡ Quick Wins (Easy Rank)" },
    { id: "high-intent", label: "🎯 Ready to Buy (BOFU)" },
    { id: "ai-magnet", label: "🤖 90%+ Citation Odds" },
  ];

  const hasActiveFilters =
    searchQuery ||
    buyerIntent !== "all" ||
    aiEngine !== "all" ||
    difficulty !== "all" ||
    activePreset !== null;

  return (
    <div className="ideas-filter-panel">
      <Card padding="400">
        <div className="filter-panel-inner">
          {/* Row 1: Category Navigation Tabs & Preset Quick Chips */}
          <div className="filter-nav-row">
            {/* Tabs */}
            <div className="filter-tab-group">
              {tabOptions.map((tab) => {
                const isSelected = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    className={`filter-tab-pill ${isSelected ? "active" : ""}`}
                    onClick={() => onTabChange(tab.value)}
                  >
                    <span>{tab.label}</span>
                    <span className="tab-count-badge">{tab.count}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Filter Presets */}
            <div className="filter-preset-chips">
              {presets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-chip ${isSelected ? "active" : ""}`}
                    onClick={() => onApplyPreset(isSelected ? null : preset.id)}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          {/* Row 2: Search & Balanced Controls (1 single cohesive row, 0 awkward holes) */}
          <div className="filter-controls-row">
            <div className="search-field-wrap">
              <TextField
                label="Search idea or query"
                labelHidden
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search topics, queries, or matched products..."
                prefix={<SearchIcon />}
                clearButton
                onClearButtonClick={() => onSearchChange("")}
                autoComplete="off"
              />
            </div>

            <div className="filter-select-wrap">
              <Select
                label="Buyer Intent"
                labelHidden
                options={BUYER_INTENT_OPTIONS}
                value={buyerIntent}
                onChange={onBuyerIntentChange}
              />
            </div>

            <div className="filter-select-wrap">
              <Select
                label="SEO Difficulty"
                labelHidden
                options={DIFFICULTY_OPTIONS}
                value={difficulty}
                onChange={onDifficultyChange}
              />
            </div>

            <div className="filter-select-wrap">
              <Select
                label="AI Source"
                labelHidden
                options={AI_ENGINE_OPTIONS}
                value={aiEngine}
                onChange={onAiEngineChange}
              />
            </div>

            {hasActiveFilters && (
              <div className="filter-clear-wrap">
                <Button
                  variant="plain"
                  tone="critical"
                  icon={XSmallIcon}
                  onClick={onResetFilters}
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ContentIdeasFilters;
