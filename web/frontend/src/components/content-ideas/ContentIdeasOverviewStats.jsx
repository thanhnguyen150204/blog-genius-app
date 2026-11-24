import { useMemo } from "react";

export function ContentIdeasOverviewStats({ ideas = [], onFilterByIntent }) {
  const {
    total,
    transactionalCount,
    commercialCount,
    informationalCount,
    transactionalPct,
    commercialPct,
    informationalPct,
    avgGeoScore,
  } = useMemo(() => {
    const list = ideas || [];
    const count = list.length || 1;
    const trans = list.filter(
      (i) => i.buyerIntent === "Transactional" || i.funnelStage === "BOFU"
    ).length;
    const comm = list.filter(
      (i) => i.buyerIntent === "Commercial" || i.funnelStage === "MOFU"
    ).length;
    const info = list.filter(
      (i) => i.buyerIntent === "Informational" || i.funnelStage === "TOFU"
    ).length;

    const avgGeo = Math.round(
      list.reduce((acc, curr) => acc + (curr.geoScore || 85), 0) / count
    );

    return {
      total: list.length,
      transactionalCount: trans,
      commercialCount: comm,
      informationalCount: info,
      transactionalPct: Math.round((trans / count) * 100),
      commercialPct: Math.round((comm / count) * 100),
      informationalPct: Math.max(0, 100 - Math.round((trans / count) * 100) - Math.round((comm / count) * 100)),
      avgGeoScore: avgGeo,
    };
  }, [ideas]);

  return (
    <div className="ideas-intelligence-banner">
      {/* Card 1: Available Opportunities */}
      <div className="intelligence-kpi-card">
        <div className="kpi-card-header">
          <span className="kpi-metric-title">Available Opportunities</span>
          <span className="kpi-badge kpi-badge-live">● Live Radar</span>
        </div>
        <div className="kpi-metric-row">
          <span className="kpi-metric-number">{total}</span>
          <span className="kpi-metric-unit">Curated Topics</span>
        </div>
        <div className="kpi-metric-meta">
          Scraped across 5 active product collections
        </div>
      </div>

      {/* Card 2: High Buyer Intent */}
      <div className="intelligence-kpi-card">
        <div className="kpi-card-header">
          <span className="kpi-metric-title">High Buyer Intent</span>
          <span className="kpi-badge kpi-badge-intent">⚡ High Conversion</span>
        </div>
        <div className="kpi-metric-row">
          <span className="kpi-metric-number">{transactionalCount}</span>
          <span className="kpi-metric-unit">Ready-to-Buy (BOFU)</span>
        </div>
        <div className="kpi-metric-meta">
          Direct pre-purchase queries matched to catalog
        </div>
      </div>

      {/* Card 3: Visual Intent & GEO Readiness Landscape Card */}
      <div className="intelligence-visual-card">
        <div className="visual-card-top">
          <div className="visual-card-title-wrap">
            <span className="visual-card-title">Opportunity Intent Distribution</span>
            <span className="visual-card-subtitle">
              Visual proportion of shopper search funnel stages & AI readiness
            </span>
          </div>
          <div className="geo-readiness-pill">
            <span className="geo-odds-label">Avg. AI Citation Odds</span>
            <span className="geo-odds-val">{avgGeoScore}%</span>
          </div>
        </div>

        {/* Multi-segment Visual Progress Meter */}
        <div className="intent-bar-container">
          <div
            className="intent-segment segment-transactional"
            style={{ width: `${transactionalPct}%` }}
            title={`Ready-to-Buy: ${transactionalCount} (${transactionalPct}%)`}
          />
          <div
            className="intent-segment segment-commercial"
            style={{ width: `${commercialPct}%` }}
            title={`Comparison / Research: ${commercialCount} (${commercialPct}%)`}
          />
          <div
            className="intent-segment segment-informational"
            style={{ width: `${informationalPct}%` }}
            title={`Informational / Awareness: ${informationalCount} (${informationalPct}%)`}
          />
        </div>

        {/* Legend with interactive quick-filter triggers */}
        <div className="intent-legend-row">
          <button
            type="button"
            className="legend-item-btn"
            onClick={() => onFilterByIntent && onFilterByIntent("Transactional")}
          >
            <span className="legend-dot dot-trans" />
            <span className="legend-label">Ready-to-Buy:</span>
            <span className="legend-count">{transactionalCount} ({transactionalPct}%)</span>
          </button>

          <button
            type="button"
            className="legend-item-btn"
            onClick={() => onFilterByIntent && onFilterByIntent("Commercial")}
          >
            <span className="legend-dot dot-comm" />
            <span className="legend-label">Comparison:</span>
            <span className="legend-count">{commercialCount} ({commercialPct}%)</span>
          </button>

          <button
            type="button"
            className="legend-item-btn"
            onClick={() => onFilterByIntent && onFilterByIntent("Informational")}
          >
            <span className="legend-dot dot-info" />
            <span className="legend-label">Educational:</span>
            <span className="legend-count">{informationalCount} ({informationalPct}%)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentIdeasOverviewStats;
