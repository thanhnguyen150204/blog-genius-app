import { Text, Icon } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ArrowDiagonalIcon } from "@shopify/polaris-icons";

export function MetricScorecards({
  geoHealthScore = 60,
  publishedCount = 1,
  totalPosts = 1,
  scheduledCount = 0,
  postsNeedingRefresh = 0,
  onOpenAiCitations,
  onOpenFreshness,
}) {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const handleKeyDown = (callback) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className="executive-kpi-cards">
      {/* Card 1: AI Citations */}
      <div
        role="button"
        tabIndex={0}
        className="kpi-card"
        onClick={onOpenAiCitations}
        onKeyDown={handleKeyDown(onOpenAiCitations)}
        title="Click to view AI engine citation breakdown"
      >
        <div className="kpi-card-top">
          <span className="kpi-num">48</span>
          <span className="kpi-pill kpi-pill-success">+34.2%</span>
        </div>
        <div className="kpi-card-mid">
          <span className="kpi-label">AI Citations (30d)</span>
          <Icon source={ArrowDiagonalIcon} tone="subdued" />
        </div>
        <div className="kpi-card-sub">Perplexity, SearchGPT, Gemini</div>
      </div>

      {/* Card 2: GEO Health Readiness */}
      <div
        role="button"
        tabIndex={0}
        className="kpi-card"
        onClick={() => {
          shopify.toast?.show("GEO Health Score: 3 content factors need optimization for AI crawlers.");
        }}
        onKeyDown={handleKeyDown(() => {
          shopify.toast?.show("GEO Health Score: 3 content factors need optimization for AI crawlers.");
        })}
        title="Click to inspect GEO technical factors"
      >
        <div className="kpi-card-top">
          <span className={`kpi-num ${geoHealthScore >= 80 ? "tone-green" : "tone-amber"}`}>
            {geoHealthScore}%
          </span>
          <span className={`kpi-pill ${geoHealthScore >= 80 ? "kpi-pill-success" : "kpi-pill-warning"}`}>
            {geoHealthScore >= 80 ? "Optimal" : "3 to fix"}
          </span>
        </div>
        <div className="kpi-card-mid">
          <span className="kpi-label">GEO Health Score</span>
          <Icon source={ArrowDiagonalIcon} tone="subdued" />
        </div>
        <div className="kpi-card-sub">FAQ Schema & Summary blocks</div>
      </div>

      {/* Card 3: Published & Cadence */}
      <div
        role="button"
        tabIndex={0}
        className="kpi-card"
        onClick={() => navigate("/studio")}
        onKeyDown={handleKeyDown(() => navigate("/studio"))}
        title="Click to open Content Studio"
      >
        <div className="kpi-card-top">
          <span className="kpi-num">{publishedCount} / {totalPosts}</span>
          <span className="kpi-pill kpi-pill-neutral">Active</span>
        </div>
        <div className="kpi-card-mid">
          <span className="kpi-label">Published Posts</span>
          <Icon source={ArrowDiagonalIcon} tone="subdued" />
        </div>
        <div className="kpi-card-sub">
          {scheduledCount > 0 ? `${scheduledCount} scheduled` : "Cadence on track"}
        </div>
      </div>

      {/* Card 4: Content Freshness */}
      <div
        role="button"
        tabIndex={0}
        className="kpi-card"
        onClick={onOpenFreshness}
        onKeyDown={handleKeyDown(onOpenFreshness)}
        title="Click to check post freshness"
      >
        <div className="kpi-card-top">
          <span className="kpi-num tone-green">100%</span>
          <span className="kpi-pill kpi-pill-success">Fresh</span>
        </div>
        <div className="kpi-card-mid">
          <span className="kpi-label">Content Freshness</span>
          <Icon source={ArrowDiagonalIcon} tone="subdued" />
        </div>
        <div className="kpi-card-sub">0 posts overdue for refresh</div>
      </div>
    </div>
  );
}

export default MetricScorecards;
