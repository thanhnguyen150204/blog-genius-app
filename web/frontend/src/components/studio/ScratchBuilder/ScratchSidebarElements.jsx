import { useState } from "react";
import { Tooltip, Icon } from "@shopify/polaris";
import { LanguageTranslateIcon, ChevronDownIcon } from "@shopify/polaris-icons";
import {
  ELEMENT_CATEGORIES,
  ELEMENT_TOOLS,
  ElementCategorySection,
} from "./elements";

/**
 * ScratchSidebarElements renders the Element toolbox panel.
 * Each item acts as a modular tool to insert and format blog post content.
 */
export function ScratchSidebarElements({ onInsertBlock, onSelectTool }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", label: "English (Primary)" },
    { code: "vi", label: "Vietnamese" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "es", label: "Spanish" },
  ];

  const handleToolClick = (tool) => {
    // Notify tool inspector if registered
    if (onSelectTool) {
      onSelectTool(tool);
    }
    // Insert corresponding block into the blog post canvas
    if (onInsertBlock && tool.defaultPayload) {
      onInsertBlock({
        ...tool.defaultPayload,
        id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      });
    }
  };

  return (
    <div
      style={{
        width: "330px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        overflowY: "auto",
        height: "calc(100vh - 56px)",
        padding: "16px 14px 28px 14px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      {/* Top Header: Language Switcher & Translation Action */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
          }}
        >
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              width: "100%",
              padding: "7px 28px 7px 10px",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              backgroundColor: "#f9fafb",
              color: "#374151",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <div
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon source={ChevronDownIcon} tone="subdued" />
          </div>
        </div>

        <Tooltip content="Translate content" preferredPosition="below">
          <button
            type="button"
            style={{
              width: "34px",
              height: "34px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "1px solid #e4e4e7",
              backgroundColor: "#ffffff",
              color: "#4b5563",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f4f4f5";
              e.currentTarget.style.color = "#18181b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#4b5563";
            }}
            aria-label="Translate Content"
          >
            <Icon source={LanguageTranslateIcon} tone="base" />
          </button>
        </Tooltip>
      </div>

      {/* Sidebar Panel Title */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "#18181b",
          marginBottom: "12px",
          letterSpacing: "-0.02em",
        }}
      >
        Element
      </div>

      {/* Categories & 4-Column Tool Grids */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ELEMENT_CATEGORIES.map((category, index) => {
          const categoryTools = ELEMENT_TOOLS.filter(
            (tool) => tool.category === category.id
          );

          return (
            <ElementCategorySection
              key={category.id}
              category={category}
              tools={categoryTools}
              onSelect={handleToolClick}
              showDivider={index > 0}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ScratchSidebarElements;
