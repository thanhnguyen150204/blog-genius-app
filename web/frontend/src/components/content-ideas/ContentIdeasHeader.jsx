import { Button } from "@shopify/polaris";
import { MagicIcon, SearchIcon, SettingsIcon } from "@shopify/polaris-icons";

export function ContentIdeasHeader({
  onOpenValidator,
  onStartLiveScan,
  isScanning,
  onOpenSettings,
}) {
  return (
    <div className="ideas-header-clean">
      <div className="ideas-header-left">
        <div className="ideas-title-row">
          <h1 className="ideas-title">Content Ideas</h1>
          <span className="ideas-badge">AI Opportunity Radar</span>
        </div>
        <p className="ideas-subtitle">
          Breakout search queries, buyer-intent topics, and generative AI questions matched to your Shopify inventory.
        </p>
      </div>

      <div className="ideas-header-actions">
        <Button
          variant="secondary"
          icon={SearchIcon}
          loading={isScanning}
          onClick={onStartLiveScan}
        >
          Scan Live Trends
        </Button>
        <Button
          variant="secondary"
          icon={MagicIcon}
          onClick={onOpenValidator}
        >
          Validate Custom Idea
        </Button>
        <Button
          variant="tertiary"
          icon={SettingsIcon}
          onClick={onOpenSettings}
        >
          Radar Settings
        </Button>
      </div>
    </div>
  );
}

export default ContentIdeasHeader;
