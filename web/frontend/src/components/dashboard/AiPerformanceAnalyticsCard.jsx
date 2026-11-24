import { useState, useMemo } from "react";
import { Card, BlockStack, InlineStack, Text, Badge } from "@shopify/polaris";

// Telemetry datasets for AI engine citations and Search Traffic
const DATASETS = {
  citations: {
    "7D": [
      { label: "Nov 12", total: 18, perplexity: 8, searchGpt: 6, gemini: 3, claude: 1, traffic: 1240 },
      { label: "Nov 13", total: 22, perplexity: 10, searchGpt: 7, gemini: 3, claude: 2, traffic: 1380 },
      { label: "Nov 14", total: 20, perplexity: 9, searchGpt: 7, gemini: 3, claude: 1, traffic: 1310 },
      { label: "Nov 15", total: 27, perplexity: 13, searchGpt: 8, gemini: 4, claude: 2, traffic: 1560 },
      { label: "Nov 16", total: 31, perplexity: 15, searchGpt: 10, gemini: 4, claude: 2, traffic: 1720 },
      { label: "Nov 17", total: 36, perplexity: 17, searchGpt: 12, gemini: 5, claude: 2, traffic: 1910 },
      { label: "Today", total: 48, perplexity: 22, searchGpt: 16, gemini: 7, claude: 3, traffic: 2240 },
    ],
    "30D": [
      { label: "Oct 20", total: 6, perplexity: 2, searchGpt: 2, gemini: 1, claude: 1, traffic: 420 },
      { label: "Oct 23", total: 9, perplexity: 4, searchGpt: 3, gemini: 1, claude: 1, traffic: 580 },
      { label: "Oct 26", total: 12, perplexity: 5, searchGpt: 4, gemini: 2, claude: 1, traffic: 740 },
      { label: "Oct 29", total: 15, perplexity: 7, searchGpt: 5, gemini: 2, claude: 1, traffic: 920 },
      { label: "Nov 01", total: 19, perplexity: 9, searchGpt: 6, gemini: 3, claude: 1, traffic: 1150 },
      { label: "Nov 04", total: 22, perplexity: 10, searchGpt: 7, gemini: 3, claude: 2, traffic: 1320 },
      { label: "Nov 07", total: 25, perplexity: 12, searchGpt: 8, gemini: 3, claude: 2, traffic: 1480 },
      { label: "Nov 10", total: 28, perplexity: 13, searchGpt: 9, gemini: 4, claude: 2, traffic: 1650 },
      { label: "Nov 13", total: 33, perplexity: 15, searchGpt: 11, gemini: 5, claude: 2, traffic: 1890 },
      { label: "Nov 16", total: 38, perplexity: 18, searchGpt: 12, gemini: 5, claude: 3, traffic: 2050 },
      { label: "Today", total: 48, perplexity: 22, searchGpt: 16, gemini: 7, claude: 3, traffic: 2240 },
    ],
    "90D": [
      { label: "Sep W1", total: 4, perplexity: 1, searchGpt: 2, gemini: 1, claude: 0, traffic: 280 },
      { label: "Sep W3", total: 8, perplexity: 3, searchGpt: 3, gemini: 1, claude: 1, traffic: 540 },
      { label: "Oct W1", total: 14, perplexity: 6, searchGpt: 5, gemini: 2, claude: 1, traffic: 890 },
      { label: "Oct W3", total: 22, perplexity: 10, searchGpt: 7, gemini: 3, claude: 2, traffic: 1350 },
      { label: "Nov W1", total: 34, perplexity: 16, searchGpt: 11, gemini: 5, claude: 2, traffic: 1880 },
      { label: "Nov W3", total: 48, perplexity: 22, searchGpt: 16, gemini: 7, claude: 3, traffic: 2240 },
    ],
  },
};

const ENGINE_DISTRIBUTION = [
  { name: "Perplexity AI", count: 22, pct: 45.8, color: "#6366F1", tag: "Claude 3.5 & Sonar" },
  { name: "SearchGPT / OpenAI", count: 16, pct: 33.3, color: "#10B981", tag: "GPT-4o Web" },
  { name: "Google Gemini", count: 7, pct: 14.6, color: "#0EA5E9", tag: "AI Overviews" },
  { name: "Anthropic Claude", count: 3, pct: 6.3, color: "#F59E0B", tag: "ClaudeBot Web" },
];

const LIVE_CRAWLER_TELEMETRY = [
  { bot: "GPTBot (OpenAI)", status: "Active & Indexed", latency: "2h ago", dot: "#10B981" },
  { bot: "PerplexityBot", status: "Active & Indexed", latency: "38m ago", dot: "#6366F1" },
  { bot: "ClaudeBot", status: "Active & Allowed", latency: "1h ago", dot: "#F59E0B" },
];

function createSmoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const mx = (curr.x + next.x) / 2;
    d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

export function AiPerformanceAnalyticsCard() {
  const [timeRange, setTimeRange] = useState("30D");
  const [viewMetric, setViewMetric] = useState("citations"); // 'citations' | 'traffic'
  const [activeEngineFilter, setActiveEngineFilter] = useState("all");
  const [hoverIndex, setHoverIndex] = useState(null);

  const rawData = DATASETS.citations[timeRange];

  // SVG Chart bounds
  const chartWidth = 640;
  const chartHeight = 220;
  const padLeft = 38;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 32;

  const innerW = chartWidth - padLeft - padRight;
  const innerH = chartHeight - padTop - padBottom;

  const maxVal = useMemo(() => {
    if (viewMetric === "traffic") {
      const max = Math.max(...rawData.map((d) => d.traffic));
      return Math.ceil(max / 500) * 500 || 2500;
    }
    const max = Math.max(...rawData.map((d) => d.total));
    return Math.ceil((max * 1.15) / 10) * 10 || 50;
  }, [rawData, viewMetric]);

  const points = useMemo(() => {
    return rawData.map((d, i) => {
      const x = padLeft + (i / (rawData.length - 1)) * innerW;
      let val = d.total;
      if (viewMetric === "traffic") {
        val = d.traffic;
      } else if (activeEngineFilter === "perplexity") {
        val = d.perplexity;
      } else if (activeEngineFilter === "searchGpt") {
        val = d.searchGpt;
      } else if (activeEngineFilter === "gemini") {
        val = d.gemini;
      }

      const y = padTop + innerH - (val / maxVal) * innerH;
      return { x, y, ...d, displayVal: val };
    });
  }, [rawData, innerW, innerH, padLeft, padTop, maxVal, viewMetric, activeEngineFilter]);

  const linePath = useMemo(() => createSmoothPath(points), [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const firstX = points[0].x;
    const lastX = points[points.length - 1].x;
    const baseY = padTop + innerH;
    return `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  }, [linePath, points, padTop, innerH]);

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];

  // Donut chart math
  const donutRadius = 46;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let accumulatedOffset = 0;

  return (
    <div className="ai-analytics-section">
      <Card>
        <BlockStack gap="400">
          {/* Header Bar */}
          <div className="analytics-card-header">
            <div className="header-left">
              <InlineStack gap="200" blockAlign="center">
                <Text variant="headingMd" as="h2">
                  AI Citation Velocity & Visibility
                </Text>
                <span className="geo-badge-pill">GEO Telemetry</span>
              </InlineStack>
              <Text variant="bodyXs" tone="subdued">
                Live frequency of how often generative search engines cite your blog as authoritative source
              </Text>
            </div>

            {/* Timeframe & Mode Selectors */}
            <div className="header-right-controls">
              <div className="metric-view-tabs">
                <button
                  type="button"
                  className={`metric-tab-btn ${viewMetric === "citations" ? "active" : ""}`}
                  onClick={() => {
                    setViewMetric("citations");
                    setActiveEngineFilter("all");
                  }}
                >
                  AI Citations
                </button>
                <button
                  type="button"
                  className={`metric-tab-btn ${viewMetric === "traffic" ? "active" : ""}`}
                  onClick={() => setViewMetric("traffic")}
                >
                  AI Inbound Visits
                </button>
              </div>

              <div className="timeframe-toggle-pills">
                {["7D", "30D", "90D"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`timeframe-btn ${timeRange === t ? "active" : ""}`}
                    onClick={() => {
                      setTimeRange(t);
                      setHoverIndex(null);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column Chart Canvas */}
          <div className="analytics-grid">
            {/* Left: Interactive Timeline Area Chart */}
            <div className="timeline-chart-col">
              {/* Stat highlight row */}
              <div className="chart-stat-bar">
                <div className="stat-unit">
                  <span className="stat-number">
                    {viewMetric === "traffic"
                      ? `${activePoint?.traffic?.toLocaleString()} visits`
                      : `${activePoint?.total || 48} citations`}
                  </span>
                  <span className="stat-label">
                    {viewMetric === "traffic" ? "Store Inbound Traffic" : "Total Citations"}
                  </span>
                </div>

                <div className="stat-growth-tag">
                  <span className="growth-icon">↑</span>
                  <span>{viewMetric === "traffic" ? "+28.4% AI Referral" : "+34.2% citation surge"}</span>
                </div>

                {viewMetric === "citations" && (
                  <div className="engine-filter-chips">
                    <button
                      type="button"
                      className={`filter-chip ${activeEngineFilter === "all" ? "active" : ""}`}
                      onClick={() => setActiveEngineFilter("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`filter-chip perplexity ${activeEngineFilter === "perplexity" ? "active" : ""}`}
                      onClick={() => setActiveEngineFilter("perplexity")}
                    >
                      Perplexity
                    </button>
                    <button
                      type="button"
                      className={`filter-chip searchgpt ${activeEngineFilter === "searchGpt" ? "active" : ""}`}
                      onClick={() => setActiveEngineFilter("searchGpt")}
                    >
                      SearchGPT
                    </button>
                  </div>
                )}
              </div>

              {/* Main SVG Area Chart */}
              <div className="svg-chart-container">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="interactive-svg-chart"
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F172A" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                    const y = padTop + innerH * (1 - ratio);
                    const labelVal = Math.round(maxVal * ratio);
                    return (
                      <g key={idx}>
                        <line
                          x1={padLeft}
                          y1={y}
                          x2={chartWidth - padRight}
                          y2={y}
                          stroke="#F1F5F9"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={padLeft - 8}
                          y={y + 3.5}
                          textAnchor="end"
                          fontSize="10"
                          fill="#94A3B8"
                          fontFamily="ui-monospace, monospace"
                        >
                          {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Shaded Area */}
                  <path d={areaPath} fill="url(#areaGradient)" />

                  {/* Smooth Primary Curve */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Hover vertical hairline & active point */}
                  {activePoint && (
                    <g>
                      <line
                        x1={activePoint.x}
                        y1={padTop}
                        x2={activePoint.x}
                        y2={padTop + innerH}
                        stroke="#CBD5E1"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={activePoint.x}
                        cy={activePoint.y}
                        r="5.5"
                        fill="#0F172A"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  {/* Invisible Hover detection zones for each point */}
                  {points.map((pt, i) => (
                    <rect
                      key={i}
                      x={pt.x - innerW / points.length / 2}
                      y={padTop}
                      width={innerW / points.length}
                      height={innerH + 10}
                      fill="transparent"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoverIndex(i)}
                    />
                  ))}

                  {/* X Axis Labels */}
                  {points.map((pt, i) => (
                    <text
                      key={i}
                      x={pt.x}
                      y={chartHeight - 8}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight={i === hoverIndex ? "600" : "450"}
                      fill={i === hoverIndex ? "#0F172A" : "#64748B"}
                    >
                      {pt.label}
                    </text>
                  ))}
                </svg>

                {/* Floating Tooltip Box */}
                {hoverIndex !== null && activePoint && (
                  <div
                    className="chart-tooltip"
                    style={{
                      left: `${(activePoint.x / chartWidth) * 100}%`,
                      top: `${(activePoint.y / chartHeight) * 100 - 30}%`,
                    }}
                  >
                    <div className="tooltip-header">
                      <span className="tooltip-date">{activePoint.label}</span>
                      <span className="tooltip-total">
                        {viewMetric === "traffic"
                          ? `${activePoint.traffic} visits`
                          : `${activePoint.total} citations`}
                      </span>
                    </div>
                    {viewMetric === "citations" ? (
                      <div className="tooltip-breakdown">
                        <div className="breakdown-item">
                          <span className="dot dot-perplexity" />
                          <span>Perplexity: <strong>{activePoint.perplexity}</strong></span>
                        </div>
                        <div className="breakdown-item">
                          <span className="dot dot-searchgpt" />
                          <span>SearchGPT: <strong>{activePoint.searchGpt}</strong></span>
                        </div>
                        <div className="breakdown-item">
                          <span className="dot dot-gemini" />
                          <span>Gemini: <strong>{activePoint.gemini}</strong></span>
                        </div>
                      </div>
                    ) : (
                      <div className="tooltip-breakdown">
                        <div className="breakdown-item">
                          <span>AI Referral Share: <strong>38.4%</strong></span>
                        </div>
                        <div className="breakdown-item">
                          <span>Google Organic: <strong>61.6%</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Engine Share Donut & Live Crawler Radar */}
            <div className="engine-share-col">
              <div className="share-col-title">
                <Text variant="headingSm" as="h3">
                  Citation Share by Engine
                </Text>
                <Text variant="bodyXs" tone="subdued">
                  30-day distribution
                </Text>
              </div>

              {/* Donut SVG */}
              <div className="donut-wrap">
                <svg viewBox="0 0 120 120" className="donut-svg">
                  {ENGINE_DISTRIBUTION.map((item, idx) => {
                    const strokeDash = (item.pct / 100) * donutCircumference;
                    const strokeOffset = -accumulatedOffset;
                    accumulatedOffset += strokeDash;

                    return (
                      <circle
                        key={idx}
                        cx="60"
                        cy="60"
                        r={donutRadius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth="11"
                        strokeDasharray={`${strokeDash} ${donutCircumference - strokeDash}`}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        className="donut-segment"
                      />
                    );
                  })}
                  {/* Center Stat */}
                  <text x="60" y="56" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0F172A">
                    48
                  </text>
                  <text x="60" y="70" textAnchor="middle" fontSize="9" fontWeight="500" fill="#94A3B8">
                    CITATIONS
                  </text>
                </svg>
              </div>

              {/* Engine Breakdown List */}
              <div className="engine-list">
                {ENGINE_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="engine-row">
                    <div className="engine-left">
                      <span className="engine-dot" style={{ backgroundColor: item.color }} />
                      <div className="engine-meta">
                        <span className="engine-name">{item.name}</span>
                        <span className="engine-tag">{item.tag}</span>
                      </div>
                    </div>
                    <div className="engine-right">
                      <span className="engine-count">{item.count}</span>
                      <span className="engine-pct">{item.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Crawler Telemetry Mini-radar */}
              <div className="crawler-telemetry-box">
                <div className="crawler-box-title">
                  <span>AI Crawler Status</span>
                  <span className="crawler-status-badge">100% Pass</span>
                </div>
                <div className="crawler-list">
                  {LIVE_CRAWLER_TELEMETRY.map((crawler, i) => (
                    <div key={i} className="crawler-row">
                      <div className="crawler-left">
                        <span className="crawler-dot" style={{ backgroundColor: crawler.dot }} />
                        <span className="crawler-bot">{crawler.bot}</span>
                      </div>
                      <span className="crawler-latency">{crawler.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BlockStack>
      </Card>
    </div>
  );
}

export default AiPerformanceAnalyticsCard;
