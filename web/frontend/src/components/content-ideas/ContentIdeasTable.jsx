import { useState, useEffect } from "react";
import {
  Card,
  Icon,
  Select,
  Pagination,
  EmptySearchResult,
} from "@shopify/polaris";
import {
  MagicIcon,
  StarFilledIcon,
  StarIcon,
} from "@shopify/polaris-icons";

export function ContentIdeasTable({
  items,
  onDraftInStudio,
  onInspectIdea,
  onToggleBookmark,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [items?.length]);

  const totalItems = items ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = items ? items.slice(startIndex, endIndex) : [];

  if (!items || items.length === 0) {
    return (
      <Card>
        <EmptySearchResult
          title="No content ideas match your filter"
          description="Try clearing some filter options or searching for different product keywords."
        />
      </Card>
    );
  }

  return (
    <Card padding="0">
      <div className="ideas-table-container">
        <table className="ideas-data-table">
          <thead>
            <tr>
              <th style={{ width: "38%" }}>Opportunity & Target Product</th>
              <th style={{ width: "18%" }}>Buyer Intent</th>
              <th style={{ width: "14%", textAlign: "right" }}>Search Volume</th>
              <th style={{ width: "14%", textAlign: "center" }}>AI Citation Odds</th>
              <th style={{ width: "16%", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const isTransactional =
                item.buyerIntent === "Transactional" || item.funnelStage === "BOFU";
              const isCommercial =
                item.buyerIntent === "Commercial" || item.funnelStage === "MOFU";

              return (
                <tr key={item.id} className="ideas-table-row">
                  {/* 1. Opportunity & Targeted Shopify Product */}
                  <td>
                    <div className="table-topic-col">
                      <button
                        type="button"
                        className="topic-title-btn"
                        onClick={() => onInspectIdea(item)}
                        title="Click to view AI outline & content gap analysis"
                      >
                        {item.title}
                      </button>
                      <div className="topic-meta">
                        <span className="topic-query">“{item.query}”</span>
                        <span className="meta-sep">•</span>
                        <span className="meta-product" title={item.matchedProduct}>
                          🛍️ {item.matchedProduct}
                        </span>
                        <span className="meta-sep">•</span>
                        <span className="meta-engine">{item.aiEngine}</span>
                      </div>
                    </div>
                  </td>

                  {/* 2. Buyer Intent & Rankability */}
                  <td>
                    <div className="table-intent-col">
                      <div className="intent-line">
                        <span
                          className="intent-dot"
                          style={{
                            backgroundColor: isTransactional
                              ? "#10B981"
                              : isCommercial
                              ? "#F59E0B"
                              : "#64748B",
                          }}
                        />
                        <span className="intent-text">
                          {isTransactional
                            ? "Ready to Buy"
                            : isCommercial
                            ? "Comparison"
                            : "Informational"}
                        </span>
                        <span className="funnel-badge">{item.funnelStage}</span>
                      </div>
                      <div className="difficulty-line">
                        <span
                          className={`diff-val ${
                            item.difficulty === "Easy"
                              ? "easy"
                              : item.difficulty === "Medium"
                              ? "medium"
                              : "hard"
                          }`}
                        >
                          {item.difficulty === "Easy"
                            ? "Easy to rank"
                            : item.difficulty === "Medium"
                            ? "Medium effort"
                            : "High competition"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Search Demand & Growth */}
                  <td style={{ textAlign: "right" }}>
                    <div className="table-volume-col">
                      <span className="vol-num">{item.volume}</span>
                      <span className={`growth-pill ${item.isBreakout ? "breakout" : ""}`}>
                        {item.growth}
                      </span>
                    </div>
                  </td>

                  {/* 4. AI Citation Odds & Visual Progress */}
                  <td style={{ textAlign: "center" }}>
                    <div className="table-geo-col">
                      <span className="geo-pct">{item.geoScore}%</span>
                      <div className="geo-bar-track">
                        <div
                          className="geo-bar-fill"
                          style={{
                            width: `${item.geoScore}%`,
                            backgroundColor:
                              item.geoScore >= 90
                                ? "#10B981"
                                : item.geoScore >= 80
                                ? "#6366F1"
                                : "#F59E0B",
                          }}
                        />
                      </div>
                      <span className="geo-odds-label">Citation Chance</span>
                    </div>
                  </td>

                  {/* 5. Actions: Bookmark + Prominent Solid Obsidian Draft Button */}
                  <td style={{ textAlign: "right" }}>
                    <div className="table-action-col">
                      <button
                        type="button"
                        className={`bookmark-btn ${item.isSaved ? "saved" : ""}`}
                        onClick={() => onToggleBookmark(item.id)}
                        title={item.isSaved ? "Remove from bookmarks" : "Save idea"}
                      >
                        <Icon source={item.isSaved ? StarFilledIcon : StarIcon} />
                      </button>

                      <button
                        type="button"
                        className="draft-action-btn"
                        onClick={() => onDraftInStudio(item)}
                        title="Open Content Studio to write this post"
                      >
                        <Icon source={MagicIcon} />
                        <span>Draft</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Table Footer Pagination */}
        <div className="table-footer-bar">
          <span className="table-count-text">
            Showing {startIndex + 1}–{endIndex} of {totalItems} opportunities
          </span>

          <div className="table-pagination-wrap">
            <div className="rows-select-wrap">
              <span>Rows:</span>
              <Select
                label=""
                labelHidden
                options={[
                  { label: "5", value: "5" },
                  { label: "10", value: "10" },
                  { label: "25", value: "25" },
                ]}
                value={String(pageSize)}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
              />
            </div>

            <Pagination
              hasPrevious={currentPage > 1}
              onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
              hasNext={currentPage < totalPages}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ContentIdeasTable;
