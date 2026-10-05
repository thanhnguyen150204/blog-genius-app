import { useState } from "react";
import { BlockStack, Text, Button, Checkbox, Icon } from "@shopify/polaris";
import { MagicIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import { OutlineModal } from "./OutlineModal";

export function PostTitleAndOutlineSettings({
  title = "",
  onTitleChange,
  onGenerateTitle,
  outline = [],
  onOutlineChange,
  keywords = "",
  generateFeaturedImage = false,
  onToggleGenerateFeaturedImage,
  onGenerate,
  isGenerating = false,
  error = false,
}) {
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [outlineText, setOutlineText] = useState(
    typeof outline === "string"
      ? outline
      : Array.isArray(outline) && outline.length > 0
      ? outline.map((o) => `${o.level === "h2" ? "Heading 2: " : o.level === "h3" ? "Heading 3: " : "• "}${o.title}`).join("\n")
      : ""
  );

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSaveOutline = (savedText) => {
    setOutlineText(savedText);
    if (onOutlineChange) {
      onOutlineChange(savedText);
    }
  };

  return (
    <BlockStack gap="400">
      {/* Post title */}
      <BlockStack gap="100">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="bodySm" fontWeight="medium" as="label">
            Post title <span style={{ color: "#9e2a2b" }}>*</span>
          </Text>
          <button
            type="button"
            onClick={onGenerateTitle}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 400,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#18181b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <span>Generate title</span>
            <Icon source={MagicIcon} tone="subdued" />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "36px",
            padding: "0 12px",
            borderRadius: "8px",
            border: error
              ? "1px solid #9e2a2b"
              : isInputFocused
              ? "2px solid #005bd3"
              : "1px solid #8c9196",
            backgroundColor: error ? "#fbf2f2" : "#ffffff",
            boxShadow: isInputFocused && !error ? "0 0 0 1px #005bd3" : "none",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="e.g. 10 Essential SEO & GEO Tactics for Shopify Success in 2026"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "13px",
              color: "#18181b",
              fontFamily: "inherit",
            }}
          />
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ color: "#9e2a2b", display: "flex", alignItems: "center", width: "15px", height: "15px" }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
            <span style={{ color: "#9e2a2b", fontSize: "12px", fontWeight: 400 }}>
              Please enter post title
            </span>
          </div>
        )}
      </BlockStack>

      {/* Add outline button that opens the Outline Modal */}
      <Button
        variant="secondary"
        fullWidth
        onClick={() => setIsOutlineModalOpen(true)}
      >
        {Boolean(outlineText && outlineText.replace(/<[^>]*>/g, "").trim())
          ? "Edit outline"
          : "Add outline"}
      </Button>

      {/* Generate featured image checkbox */}
      <Checkbox
        label="Generate featured image"
        checked={generateFeaturedImage}
        onChange={onToggleGenerateFeaturedImage}
      />

      {/* Bottom right: Generate button */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px" }}>
        <Button
          variant="primary"
          icon={MagicIcon}
          loading={isGenerating}
          onClick={onGenerate}
          size="large"
        >
          Generate
        </Button>
      </div>

      {/* Outline Modal matching user sample */}
      <OutlineModal
        open={isOutlineModalOpen}
        onClose={() => setIsOutlineModalOpen(false)}
        outlineContent={outlineText}
        onSave={handleSaveOutline}
        postTitle={title}
        keywords={Array.isArray(keywords) ? keywords.join(", ") : keywords}
      />
    </BlockStack>
  );
}

export default PostTitleAndOutlineSettings;
