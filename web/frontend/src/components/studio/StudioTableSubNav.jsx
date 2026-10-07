import { useState } from "react";
import { Button, Icon, TextField } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { STATUS_TABS } from "../../mock/studioData";

export function StudioTableSubNav({
  selectedStatus = "all",
  onSelectStatus,
  searchQuery = "",
  onSearchChange,
  posts = [],
}) {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const getStatusCount = (statusKey) => {
    if (statusKey === "all") return posts.length;
    if (statusKey === "published") return posts.filter((p) => p.status.toLowerCase() === "published").length;
    if (statusKey === "drafts") return posts.filter((p) => p.status.toLowerCase() === "draft").length;
    if (statusKey === "scheduled") return posts.filter((p) => p.status.toLowerCase() === "scheduled").length;
    return 0;
  };

  if (showSearchInput) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          borderBottom: "1px solid #f1f2f4",
          gap: "14px",
          width: "100%",
        }}
      >
        <div style={{ flex: 1 }}>
          <TextField
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search"
            autoFocus
            suffix={<Icon source={SearchIcon} tone="subdued" />}
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            onSearchChange("");
            setShowSearchInput(false);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#303030",
            fontSize: "14px",
            fontWeight: 500,
            padding: "6px 8px",
            whiteSpace: "nowrap",
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        borderBottom: "1px solid #f1f2f4",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {/* Left side: status tabs matching sample image */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        {STATUS_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.key;
          const count = getStatusCount(tab.key);

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectStatus(tab.key)}
              className={`studio-tab-btn ${isSelected ? "active" : ""}`}
            >
              <span>{tab.label}</span>
              {count > 0 && (
                <span className="studio-tab-badge">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: standard Polaris Search button matching sample image */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          icon={SearchIcon}
          onClick={() => setShowSearchInput(true)}
          accessibilityLabel="Search"
        />
      </div>
    </div>
  );
}

export default StudioTableSubNav;
