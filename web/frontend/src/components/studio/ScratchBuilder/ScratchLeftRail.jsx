import { Tooltip, BlockStack } from "@shopify/polaris";
import {
  ComposeIcon,
  PlusCircleIcon,
  DataTableIcon,
  ExportIcon,
} from "@shopify/polaris-icons";

export function ScratchLeftRail({ activeTab, onSelectTab }) {
  const tabs = [
    { id: "post", label: "Post Settings", icon: ComposeIcon },
    { id: "elements", label: "Add Elements", icon: PlusCircleIcon },
    { id: "toc", label: "Table Content", icon: DataTableIcon },
    { id: "seo", label: "SEO & GEO Audit", isSeoBadge: true },
    { id: "export", label: "Social Share", icon: ExportIcon },
  ];

  return (
    <div
      style={{
        width: "56px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        flexShrink: 0,
        zIndex: 15,
      }}
    >
      <BlockStack gap="300" align="center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const activeColor = "#f97316"; // Brand Orange
          const inactiveColor = "#202223"; // Dark Black/Gray

          if (tab.isSeoBadge) {
            return (
              <Tooltip key={tab.id} content={tab.label} preferredPosition="right">
                <button
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  style={{
                    width: "42px",
                    height: "38px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: isActive ? "#e4e5e7" : "transparent",
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: 800,
                    fontSize: "12px",
                    letterSpacing: "0.2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "#f4f4f5";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  aria-label={tab.label}
                >
                  SEO
                </button>
              </Tooltip>
            );
          }

          const IconComponent = tab.icon;

          return (
            <Tooltip key={tab.id} content={tab.label} preferredPosition="right">
              <button
                type="button"
                onClick={() => onSelectTab(tab.id)}
                style={{
                  width: "42px",
                  height: "38px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isActive ? "#e4e5e7" : "transparent",
                  color: isActive ? activeColor : inactiveColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#f4f4f5";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
                aria-label={tab.label}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: isActive ? activeColor : inactiveColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.15s ease",
                  }}
                >
                  <IconComponent />
                </div>
              </button>
            </Tooltip>
          );
        })}
      </BlockStack>
    </div>
  );
}

export default ScratchLeftRail;
