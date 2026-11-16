import { useState, useMemo } from "react";
import { Page, BlockStack, Box } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import {
  ContentIdeasHeader,
  ContentIdeasOverviewStats,
  ContentIdeasFilters,
  ContentIdeasTable,
  ContentIdeaDetailDrawer,
  CustomIdeaValidatorModal,
  ContentIdeasSettingsDrawer,
  LiveScanModal,
  INITIAL_IDEAS_DATA,
  DEFAULT_RADAR_SETTINGS,
  AI_TELEMETRY_STATS,
} from "../components/content-ideas";
import { SettingsIcon } from "@shopify/polaris-icons";
import { Icon } from "@shopify/polaris";

export default function ContentIdeas() {
  const shopify = useAppBridge();
  const navigate = useNavigate();

  // Ideas state
  const [ideas, setIdeas] = useState(INITIAL_IDEAS_DATA);

  // Radar scraping settings state
  const [radarSettings, setRadarSettings] = useState(DEFAULT_RADAR_SETTINGS);

  // Filter states
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [buyerIntent, setBuyerIntent] = useState("all");
  const [funnelStage, setFunnelStage] = useState("all");
  const [aiEngine, setAiEngine] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [activePreset, setActivePreset] = useState(null);

  // Modals & Drawers state
  const [selectedIdeaForInspection, setSelectedIdeaForInspection] = useState(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [isValidatorModalOpen, setIsValidatorModalOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isLiveScanModalOpen, setIsLiveScanModalOpen] = useState(false);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: ideas.length,
      topic: ideas.filter((i) => i.type === "topic").length,
      keyword: ideas.filter((i) => i.type === "keyword").length,
      question: ideas.filter((i) => i.type === "question").length,
      saved: ideas.filter((i) => i.isSaved).length,
    };
  }, [ideas]);

  // Overall stats
  const stats = useMemo(() => {
    return {
      totalCount: ideas.length,
      highIntentCount: ideas.filter(
        (i) => i.buyerIntent === "Transactional" || i.funnelStage === "BOFU"
      ).length,
    };
  }, [ideas]);

  // Apply filters
  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      // 1. Tab filter
      if (activeTab === "topic" && item.type !== "topic") return false;
      if (activeTab === "keyword" && item.type !== "keyword") return false;
      if (activeTab === "question" && item.type !== "question") return false;
      if (activeTab === "saved" && !item.isSaved) return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesQuery = item.query.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesProduct = item.matchedProduct?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesQuery && !matchesCategory && !matchesProduct) {
          return false;
        }
      }

      // 3. Category filter
      if (category !== "all" && item.category !== category) return false;

      // 4. Buyer Intent filter
      if (buyerIntent !== "all" && item.buyerIntent !== buyerIntent) return false;

      // 5. Funnel Stage filter
      if (funnelStage !== "all" && item.funnelStage !== funnelStage) return false;

      // 6. AI Engine filter
      if (aiEngine !== "all" && item.aiEngine !== aiEngine) return false;

      // 7. Difficulty filter
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;

      // 8. Preset filters
      if (activePreset === "quick-wins") {
        if (item.difficulty !== "Easy" || item.growthNum < 100) return false;
      } else if (activePreset === "high-intent") {
        if (item.buyerIntent !== "Transactional" && item.funnelStage !== "BOFU") return false;
      } else if (activePreset === "ai-magnet") {
        if (item.geoScore < 90) return false;
      } else if (activePreset === "breakouts") {
        if (!item.isBreakout) return false;
      }

      return true;
    });
  }, [
    ideas,
    activeTab,
    searchQuery,
    category,
    buyerIntent,
    funnelStage,
    aiEngine,
    difficulty,
    activePreset,
  ]);

  // Preset click handler
  const handleApplyPreset = (presetId) => {
    if (activePreset === presetId) {
      setActivePreset(null);
    } else {
      setActivePreset(presetId);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("all");
    setBuyerIntent("all");
    setFunnelStage("all");
    setAiEngine("all");
    setDifficulty("all");
    setActivePreset(null);
  };

  // Bookmark toggle
  const handleToggleBookmark = (id) => {
    setIdeas((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSaved = !item.isSaved;
          shopify.toast?.show(
            nextSaved ? "Idea saved to Bookmarks" : "Idea removed from Bookmarks"
          );
          return { ...item, isSaved: nextSaved };
        }
        return item;
      })
    );
  };

  // Inspect drawer
  const handleInspectIdea = (idea) => {
    setSelectedIdeaForInspection(idea);
    setIsInspectModalOpen(true);
  };

  // Draft in Studio
  const handleDraftInStudio = (idea) => {
    shopify.toast?.show(`Opening Content Studio for "${idea.title}"`);
    navigate("/studio", {
      state: {
        autoFillTitle: idea.title,
        autoFillKeyword: idea.query,
        targetProduct: idea.matchedProduct,
      },
    });
  };

  // Start live scan modal
  const handleStartLiveScan = () => {
    setIsLiveScanModalOpen(true);
  };

  // Save settings and trigger immediate scan
  const handleSaveAndScan = (newSettings) => {
    setRadarSettings(newSettings);
    shopify.toast?.show("Settings saved! Initiating live radar scan...");
    setIsLiveScanModalOpen(true);
  };

  // Apply new live scanned ideas to feed
  const handleApplyNewIdeas = (newIdeas) => {
    setIdeas((prev) => [...newIdeas, ...prev]);
    shopify.toast?.show(`Added ${newIdeas.length} fresh live-scanned opportunities to your feed!`);
  };

  // Save custom idea from validator
  const handleSaveCustomIdea = (newIdea) => {
    setIdeas((prev) => [newIdea, ...prev]);
    shopify.toast?.show(`Saved "${newIdea.title}" to Content Ideas!`);
    setActiveTab("saved");
  };

  // Settings handlers
  const handleSaveSettings = (newSettings) => {
    setRadarSettings(newSettings);
    shopify.toast?.show("Radar scraping settings updated successfully!");
  };

  const handleResetSettings = () => {
    setRadarSettings(DEFAULT_RADAR_SETTINGS);
    shopify.toast?.show("Radar settings reset to default parameters.");
  };

  return (
    <div className="content-ideas-page">
      <Page fullWidth>
        <BlockStack gap="400">
          {/* Header */}
          <ContentIdeasHeader
            onOpenValidator={() => setIsValidatorModalOpen(true)}
            onStartLiveScan={handleStartLiveScan}
            isScanning={isLiveScanModalOpen}
          />

          {/* Overview Scorecards */}
          <ContentIdeasOverviewStats stats={stats} />

          {/* Detailed Filters & Presets */}
          <ContentIdeasFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            buyerIntent={buyerIntent}
            onBuyerIntentChange={setBuyerIntent}
            funnelStage={funnelStage}
            onFunnelStageChange={setFunnelStage}
            aiEngine={aiEngine}
            onAiEngineChange={setAiEngine}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            activePreset={activePreset}
            onApplyPreset={handleApplyPreset}
            onResetFilters={handleResetFilters}
            counts={counts}
          />

          {/* Main Opportunities Data Table */}
          <ContentIdeasTable
            items={filteredIdeas}
            onDraftInStudio={handleDraftInStudio}
            onInspectIdea={handleInspectIdea}
            onToggleBookmark={handleToggleBookmark}
          />
        </BlockStack>

        {/* Modal: Opportunity Deep Dive Inspector */}
        <ContentIdeaDetailDrawer
          isOpen={isInspectModalOpen}
          onClose={() => setIsInspectModalOpen(false)}
          idea={selectedIdeaForInspection}
          onDraftInStudio={handleDraftInStudio}
        />

        {/* Modal: Custom Idea Validator */}
        <CustomIdeaValidatorModal
          isOpen={isValidatorModalOpen}
          onClose={() => setIsValidatorModalOpen(false)}
          onLaunchToStudio={handleDraftInStudio}
          onSaveCustomIdea={handleSaveCustomIdea}
        />

        {/* Slide-over Right Drawer: Radar Settings & AI Telemetry */}
        <ContentIdeasSettingsDrawer
          isOpen={isSettingsDrawerOpen}
          onClose={() => setIsSettingsDrawerOpen(false)}
          settings={radarSettings}
          onSaveSettings={handleSaveSettings}
          onResetSettings={handleResetSettings}
          onSaveAndScan={handleSaveAndScan}
          telemetry={AI_TELEMETRY_STATS}
        />

        {/* Modal: Interactive Live Scan Progress */}
        <LiveScanModal
          isOpen={isLiveScanModalOpen}
          onClose={() => setIsLiveScanModalOpen(false)}
          onApplyNewIdeas={handleApplyNewIdeas}
        />

        {/* Floating Right Tab Trigger */}
        <div
          className="content-ideas-floating-tab-trigger"
          onClick={() => setIsSettingsDrawerOpen(true)}
          role="button"
          tabIndex={0}
          title="Open Radar Settings & AI Usage"
          aria-label="Open Radar Settings & AI Usage"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsSettingsDrawerOpen(true);
            }
          }}
        >
          <div className="tab-icon-wrap">
            <Icon source={SettingsIcon} tone="base" />
          </div>
          <span className="tab-text">Radar & AI Settings</span>
        </div>
      </Page>
    </div>
  );
}
