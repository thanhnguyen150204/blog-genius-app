import { useState } from "react";
import { Checkbox, Icon } from "@shopify/polaris";
import { MagicIcon, EditIcon } from "@shopify/polaris-icons";
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
}) {
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const isAllSelected = posts.length > 0 && posts.every((p) => selectedIds.includes(p.id));
  const isPartiallySelected =
    selectedIds.length > 0 && !isAllSelected && posts.some((p) => selectedIds.includes(p.id));

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

  const renderStatusPill = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "published") {
      return (
        <span
          style={{
            display: "inline-block",
            backgroundColor: "#dcfce7",
            color: "#15803d",
            border: "1px solid #bbf7d0",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
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
            backgroundColor: "#f4f4f5",
            color: "#64748b",
            border: "1px solid #e4e4e7",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
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
          backgroundColor: "#eff6ff",
          color: "#2563eb",
          border: "1px solid #bfdbfe",
          padding: "3px 12px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 500,
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
            fontSize: "17px",
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
    <div style={{ width: "100%", overflow: "visible" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: "13px",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "44px" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "6%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "7%" }} />
        </colgroup>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #e4e4e7",
              color: "#52525b",
              fontWeight: 500,
              backgroundColor: "#ffffff",
            }}
          >
            <th style={{ padding: "12px 12px", textAlign: "center" }}>
              <Checkbox
                checked={isAllSelected ? true : isPartiallySelected ? "indeterminate" : false}
                onChange={onToggleSelectAll}
                label=""
                labelHidden
              />
            </th>
            <th style={{ padding: "12px 12px", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Title</th>
            <th style={{ padding: "12px 12px", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Type</th>
            <th style={{ padding: "12px 12px", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Author</th>
            <th style={{ padding: "12px 12px", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Last modified</th>
            <th style={{ padding: "12px 6px", textAlign: "center", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>SEO</th>
            <th style={{ padding: "12px 6px", textAlign: "center", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>GEO</th>
            <th style={{ padding: "12px 12px", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Status</th>
            <th style={{ padding: "12px 12px", textAlign: "center", color: "#52525b", fontWeight: 500, whiteSpace: "nowrap" }}>Action</th>
          </tr>
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
                onClick={() => onRowClick ? onRowClick(post) : (onEditPost && onEditPost(post))}
                onMouseEnter={() => setHoveredRowId(post.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                style={{
                  borderBottom: "1px solid #f1f2f4",
                  borderLeft: "3.5px solid #f97316",
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "#f8fafc"
                    : isHovered
                    ? "#fff9f0"
                    : "#fffdf9",
                  transition: "background-color 0.15s ease",
                }}
              >
                <td
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "12px 12px", textAlign: "center", verticalAlign: "middle" }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onToggleSelect(post.id)}
                    label=""
                    labelHidden
                  />
                </td>

                <td style={{ padding: "12px 12px", verticalAlign: "middle", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: isAi ? "#18181b" : "#64748b",
                      }}
                    >
                      <Icon source={isAi ? MagicIcon : EditIcon} tone={isAi ? "base" : "subdued"} />
                    </div>
                    <span
                      style={{
                        color: "#18181b",
                        fontWeight: 500,
                        fontSize: "13px",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {post.title}
                    </span>

                    {post.isNew !== false && (
                      <span
                        style={{
                          backgroundColor: "#f97316",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 7px",
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

                <td style={{ padding: "12px 12px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: typeStyle.bg,
                      color: typeStyle.color,
                      border: `1px solid ${typeStyle.border}`,
                      padding: "3px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {post.type}
                  </span>
                </td>

                <td style={{ padding: "12px 12px", verticalAlign: "middle", color: "#334155", whiteSpace: "nowrap" }}>
                  {post.author}
                </td>

                <td style={{ padding: "12px 12px", verticalAlign: "middle", color: "#475569", whiteSpace: "nowrap" }}>
                  {post.lastModified}
                </td>

                <td style={{ padding: "12px 6px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor:
                        post.seoScore !== null && post.seoScore !== undefined
                          ? post.seoScore >= 80
                            ? "#16a34a"
                            : post.seoScore >= 60
                            ? "#b45309"
                            : "#dc2626"
                          : "#334155",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {post.seoScore !== null && post.seoScore !== undefined ? post.seoScore : "—"}
                  </div>
                </td>

                <td style={{ padding: "12px 6px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor:
                        post.geoScore >= 80 ? "#16a34a" : post.geoScore >= 60 ? "#ea580c" : "#dc2626",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {post.geoScore}
                  </div>
                </td>

                <td style={{ padding: "12px 12px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                  {renderStatusPill(post.status)}
                </td>

                <td
                  onClick={(e) => e.stopPropagation()}
                  style={{ padding: "12px 12px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}
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
    </div>
  );
}

export default StudioTable;
