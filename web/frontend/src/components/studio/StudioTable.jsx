import { useState } from "react";
import { Checkbox, Icon, Button, InlineStack } from "@shopify/polaris";
import { MagicIcon, BlogIcon } from "@shopify/polaris-icons";
import { ArticleActionsMenu } from "./ArticleActionsMenu";

export function StudioTable({
  posts = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onRowClick,
  onEditPost,
  onViewPost,
  onDuplicatePost,
  onDeletePost,
  onBulkPublish,
  onBulkUnpublish,
  onBulkEditAuthor,
  onBulkDelete,
}) {
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const isAllSelected = posts.length > 0 && posts.every((p) => selectedIds.includes(p.id));
  const isPartiallySelected =
    selectedIds.length > 0 && !isAllSelected && posts.some((p) => selectedIds.includes(p.id));

  // Determine whether to show "Publish" or "Unpublish" (never both)
  const selectedPosts = posts.filter((p) => selectedIds.includes(p.id));
  const hasDraft = selectedPosts.some((p) => (p.status || "").toLowerCase() === "draft");
  const hasPublished = selectedPosts.some((p) => (p.status || "").toLowerCase() === "published");

  // If all selected are published -> show "Unpublish", otherwise (all draft or mixed) -> show "Publish"
  const showUnpublish = hasPublished && !hasDraft;
  const showPublish = !showUnpublish;

  const getTypePillStyle = (type) => {
    switch (type) {
      case "Informational":
        return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
      case "Buyer's guide":
        return { bg: "#fff7ed", color: "#ea580c", border: "#fed7aa" };
      case "How-to":
        return { bg: "#ecfeff", color: "#0891b2", border: "#a5f3fc" };
      case "FAQ":
        return { bg: "#faf5ff", color: "#9333ea", border: "#e9d5ff" };
      case "Trust / About":
        return { bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe" };
      case "Company Facts":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      default:
        return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
    }
  };

  const renderStatusPill = (status, post) => {
    const s = (status || "").toLowerCase();
    if (s.includes("generating")) {
      const progressVal = post?.progress !== undefined ? post.progress : 14;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#fef08a",
            color: "#713f12",
            border: "none",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "11px",
              height: "11px",
              border: "2px solid #713f12",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "studioSpin 1s linear infinite",
            }}
          />
          {progressVal}% Generating
        </span>
      );
    }
    if (s === "published") {
      return (
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#a7f3d0",
            color: "#065f46",
            border: "none",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          Published
        </span>
      );
    }
    if (s === "draft") {
      return (
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#f1f3f5",
            color: "#27272a",
            border: "none",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          Draft
        </span>
      );
    }
    return (
      <span
        style={{
          display: "inline-block",
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "none",
          padding: "3px 12px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 400,
          whiteSpace: "nowrap",
        }}
      >
        {status}
      </span>
    );
  };

  if (posts.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px 68px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            fill="none"
            stroke="#71717a"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#18181b",
            margin: "0 0 8px 0",
          }}
        >
          No page found
        </h3>

        <p
          style={{
            fontSize: "13px",
            color: "#71717a",
            margin: 0,
          }}
        >
          Try changing the filters or search term
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "12.5px",
        }}
      >
        <colgroup>
          <col style={{ width: "48px" }} />
          <col style={{ width: "auto" }} />
          <col style={{ width: "115px" }} />
          <col style={{ width: "110px" }} />
          <col style={{ width: "145px" }} />
          <col style={{ width: "40px" }} />
          <col style={{ width: "40px" }} />
          <col style={{ width: "100px" }} />
          <col style={{ width: "52px" }} />
        </colgroup>
        <thead>
          {selectedIds.length > 0 ? (
            /* Bulk Actions Header matching exact frame height & alignment */
            <tr
              style={{
                height: "44px",
                borderBottom: "1px solid #ebeef2",
                borderLeft: "3px solid transparent",
                backgroundColor: "#f7f7f8",
                animation: "studioHeaderFade 0.15s ease",
              }}
            >
              <th
                style={{
                  width: "48px",
                  height: "44px",
                  padding: "0 8px 0 16px",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <Checkbox
                  checked={isAllSelected ? true : isPartiallySelected ? "indeterminate" : false}
                  onChange={onToggleSelectAll}
                  label=""
                  labelHidden
                />
              </th>
              <th
                colSpan="8"
                style={{
                  height: "44px",
                  padding: "0 16px 0 10px",
                  verticalAlign: "middle",
                  fontWeight: 400,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#616161",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {selectedIds.length} selected
                  </span>
                  <InlineStack align="end" gap="200" blockAlign="center">
                    {showPublish && (
                      <Button size="slim" onClick={onBulkPublish}>
                        Publish
                      </Button>
                    )}
                    {showUnpublish && (
                      <Button size="slim" onClick={onBulkUnpublish}>
                        Unpublish
                      </Button>
                    )}
                    <Button size="slim" onClick={onBulkEditAuthor}>
                      Edit author
                    </Button>
                    <Button size="slim" tone="critical" onClick={onBulkDelete}>
                      Delete
                    </Button>
                  </InlineStack>
                </div>
              </th>
            </tr>
          ) : (
            /* Normal Header matching exact frame height & alignment */
            <tr
              style={{
                height: "44px",
                borderBottom: "1px solid #ebeef2",
                borderLeft: "3px solid transparent",
                color: "#52525b",
                fontSize: "13px",
                fontWeight: 400,
                backgroundColor: "#f7f7f8",
                animation: "studioHeaderFade 0.15s ease",
              }}
            >
              <th
                style={{
                  width: "48px",
                  height: "44px",
                  padding: "0 8px 0 16px",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <Checkbox
                  checked={isAllSelected ? true : isPartiallySelected ? "indeterminate" : false}
                  onChange={onToggleSelectAll}
                  label=""
                  labelHidden
                />
              </th>
              <th style={{ height: "44px", padding: "0 10px", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Title</th>
              <th style={{ height: "44px", padding: "0 8px", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Type</th>
              <th style={{ height: "44px", padding: "0 8px", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Author</th>
              <th style={{ height: "44px", padding: "0 8px", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Last modified</th>
              <th style={{ height: "44px", padding: "0 4px", textAlign: "center", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>SEO</th>
              <th style={{ height: "44px", padding: "0 4px", textAlign: "center", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>GEO</th>
              <th style={{ height: "44px", padding: "0 8px", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Status</th>
              <th style={{ height: "44px", padding: "0 16px 0 4px", textAlign: "center", verticalAlign: "middle", color: "#52525b", fontWeight: 400, whiteSpace: "nowrap" }}>Action</th>
            </tr>
          )}
        </thead>
        <tbody>
          {posts.map((post) => {
            const isSelected = selectedIds.includes(post.id);
            const isHovered = hoveredRowId === post.id;
            const typeStyle = getTypePillStyle(post.type);
            const isAi = post.mode === "ai" || post.isAiGenerated === true || post.creationMode === "ai";

            return (
              <tr
                key={post.id}
                onClick={() => onToggleSelect(post.id)}
                onMouseEnter={() => setHoveredRowId(post.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{
                  borderBottom: "1px solid #f4f4f5",
                  borderLeft: isSelected ? "3px solid #f97316" : "3px solid transparent",
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "#fffaf5"
                    : isHovered
                    ? "#fafafa"
                    : "#ffffff",
                  transition: "all 0.15s ease",
                }}
              >
                <td
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(post.id);
                  }}
                  style={{ padding: "0 8px 0 16px", textAlign: "center", verticalAlign: "middle", height: "52px" }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(post.id)}
                    label=""
                    labelHidden
                  />
                </td>

                <td style={{ padding: "0 10px", verticalAlign: "middle" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      maxWidth: "100%",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onViewPost) onViewPost(post);
                      else if (onRowClick) onRowClick(post);
                    }}
                  >
                    <div
                      className="studio-lead-icon"
                      style={{
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "#18181b",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Icon source={isAi ? MagicIcon : BlogIcon} tone="base" />
                    </div>
                    <span
                      style={{
                        color: "#18181b",
                        fontWeight: 400,
                        fontSize: "13px",
                        textDecoration: "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "280px",
                        letterSpacing: "-0.01em",
                      }}
                      title={post.title}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f97316")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#18181b")}
                    >
                      {post.title}
                    </span>

                    {post.isNew !== false && (
                      <span
                        style={{
                          backgroundColor: "#f97316",
                          color: "#ffffff",
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "1px 6px",
                          borderRadius: "9999px",
                          lineHeight: "12px",
                          letterSpacing: "0.5px",
                          flexShrink: 0,
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                </td>

                <td style={{ padding: "0 8px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: typeStyle.bg,
                      color: typeStyle.color,
                      border: `1px solid ${typeStyle.border}`,
                      padding: "2px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 400,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.type}
                  </span>
                </td>

                <td
                  style={{
                    padding: "0 8px",
                    verticalAlign: "middle",
                    color: "#3f3f46",
                    fontSize: "13px",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "140px",
                  }}
                  title={post.author}
                >
                  {post.author}
                </td>

                <td
                  style={{
                    padding: "0 8px",
                    verticalAlign: "middle",
                    color: "#52525b",
                    fontSize: "12.5px",
                    fontWeight: 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {post.lastModified}
                </td>

                <td style={{ padding: "0 4px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor:
                        post.seoScore !== null && post.seoScore !== undefined
                          ? post.seoScore >= 80
                            ? "#16a34a"
                            : post.seoScore >= 70
                            ? "#b45309"
                            : post.seoScore >= 50
                            ? "#ea580c"
                            : "#dc2626"
                          : "#3f3f46",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {post.seoScore !== null && post.seoScore !== undefined ? post.seoScore : "—"}
                  </div>
                </td>

                <td style={{ padding: "0 4px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor:
                        post.geoScore !== null && post.geoScore !== undefined
                          ? post.geoScore >= 80
                            ? "#16a34a"
                            : post.geoScore >= 70
                            ? "#b45309"
                            : post.geoScore >= 50
                            ? "#ea580c"
                            : "#dc2626"
                          : "#3f3f46",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 600,
                    }}
                  >
                    {post.geoScore !== null && post.geoScore !== undefined ? post.geoScore : "—"}
                  </div>
                </td>

                <td style={{ padding: "0 8px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  {renderStatusPill(post.status, post)}
                </td>

                <td
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "0 16px 0 4px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}
                >
                  <ArticleActionsMenu
                    post={post}
                    onEdit={onEditPost}
                    onView={onViewPost}
                    onDuplicate={onDuplicatePost}
                    onDelete={onDeletePost}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <style>{`
        @keyframes studioHeaderFade {
          from {
            opacity: 0.85;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes studioSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .studio-lead-icon {
          color: #18181b !important;
        }
        .studio-lead-icon svg {
          fill: #18181b !important;
          color: #18181b !important;
          stroke: #18181b !important;
          stroke-width: 0.35px !important;
          shape-rendering: geometricPrecision;
        }
      `}</style>
    </div>
  );
}

export default StudioTable;
