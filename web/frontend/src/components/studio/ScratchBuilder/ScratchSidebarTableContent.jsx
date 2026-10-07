import { useState, useRef, useEffect } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  TextField,
  Checkbox,
  Modal,
  Badge,
  Box,
  Tooltip,
} from "@shopify/polaris";
import {
  RefreshIcon,
  SaveIcon,
  DuplicateIcon,
  LanguageIcon,
} from "@shopify/polaris-icons";

export function ScratchSidebarTableContent({
  postData,
  onChange,
  blocks = [],
}) {
  const colorInputRef = useRef(null);
  const [isExcludeModalOpen, setIsExcludeModalOpen] = useState(false);

  const toc = postData.tableOfContents || {
    enabled: false,
    title: "Table of Contents",
    textColor: "#000000",
    listStyle: "none",
    indentation: "hierarchical",
    layout: "1-col",
    collapsible: false,
    excludedHeadingTypes: [],
  };

  const updateToc = (patch) => {
    onChange({
      tableOfContents: {
        ...toc,
        ...patch,
      },
    });
  };

  // Extract detected headings from blocks
  const getDetectedHeadings = () => {
    const excluded = (toc.excludedHeadingTypes || []).map((t) => t.toLowerCase());
    return blocks
      .filter(
        (b) =>
          b.type === "heading" &&
          b.text?.trim() &&
          !excluded.includes((b.level || "h2").toLowerCase())
      )
      .map((b, i) => ({
        id: b.id || `h-${i}`,
        level: b.level || "h2",
        text: b.text,
      }));
  };

  const detectedHeadings = getDetectedHeadings();

  const [statusFeedback, setStatusFeedback] = useState(null);

  const handleScanHeadings = () => {
    const scanned = getDetectedHeadings();
    updateToc({ detectedHeadings: scanned });
    setStatusFeedback("Table of Contents headings refreshed!");
    setTimeout(() => setStatusFeedback(null), 2500);
  };

  const handleSaveGlobalType = () => {
    try {
      const globalPreset = {
        title: toc.title || "Table of Contents",
        textColor: toc.textColor || "#000000",
        listStyle: toc.listStyle || "none",
        indentation: toc.indentation || "hierarchical",
        layout: toc.layout || "1-col",
        collapsible: Boolean(toc.collapsible),
        excludedHeadingTypes: toc.excludedHeadingTypes || [],
      };
      localStorage.setItem("bloggenius_global_toc_style", JSON.stringify(globalPreset));
      setStatusFeedback("Global Table of Contents style saved successfully!");
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (e) {
      console.error("Failed to save global TOC style:", e);
    }
  };

  const handleApplyGlobalType = () => {
    try {
      const raw = localStorage.getItem("bloggenius_global_toc_style");
      if (raw) {
        const parsed = JSON.parse(raw);
        updateToc({
          enabled: true,
          ...parsed,
        });
        setStatusFeedback("Applied Global Table of Contents style!");
      } else {
        // Apply high-converting standard default global type
        const defaultGlobal = {
          enabled: true,
          title: "Table of Contents",
          textColor: "#000000",
          listStyle: "numbered",
          indentation: "hierarchical",
          layout: "1-col",
          collapsible: false,
          excludedHeadingTypes: ["h1"],
        };
        updateToc(defaultGlobal);
        localStorage.setItem("bloggenius_global_toc_style", JSON.stringify(defaultGlobal));
        setStatusFeedback("Applied default Global Table of Contents style!");
      }
      setTimeout(() => setStatusFeedback(null), 3000);
    } catch (e) {
      console.error("Failed to apply global TOC style:", e);
    }
  };

  const languageOptions = [
    { label: "English (Primary)", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
    { label: "French (Français)", value: "fr" },
    { label: "German (Deutsch)", value: "de" },
    { label: "Spanish (Español)", value: "es" },
  ];

  const listStyleOptions = [
    { label: "None (Text only)", value: "none" },
    { label: "Numbered (1, 2, 3...)", value: "numbered" },
    { label: "Bulleted (•, •, •...)", value: "bulleted" },
    { label: "Roman (I, II, III...)", value: "roman" },
  ];

  const indentationOptions = [
    { label: "Hierarchical (Indented)", value: "hierarchical" },
    { label: "Flat (No indent)", value: "flat" },
  ];

  const layoutOptions = [
    { label: "1 Column", value: "1-col" },
    { label: "2 Columns", value: "2-col" },
    { label: "3 Columns", value: "3-col" },
  ];

  const headingTypesList = ["h1", "h2", "h3", "h4", "h5", "h6"];

  const toggleExcludeType = (type) => {
    const current = toc.excludedHeadingTypes || [];
    const isExcluded = current.includes(type);
    const updated = isExcluded
      ? current.filter((t) => t !== type)
      : [...current, type];
    updateToc({ excludedHeadingTypes: updated });
  };

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Sticky Language Selector Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          borderBottom: "1px solid #f1f2f4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <Select
            label="Language"
            labelHidden
            options={languageOptions}
            value={postData.language || "en"}
            onChange={(val) => onChange({ language: val })}
          />
        </div>

        <Button
          icon={LanguageIcon}
          variant="tertiary"
          accessibilityLabel="Translate language"
        />
      </div>

      {/* Scrollable Form Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Header with Title & Quick Action Icons */}
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingSm" as="h3" fontWeight="bold">
            Table Content
          </Text>
          <InlineStack gap="100">
            <Tooltip content="Refresh Table of Contents">
              <Button
                size="slim"
                icon={RefreshIcon}
                variant="tertiary"
                onClick={handleScanHeadings}
                accessibilityLabel="Refresh Table of Contents"
              />
            </Tooltip>
            <Tooltip content="Save as Global Style (Lưu Global Type)">
              <Button
                size="slim"
                icon={SaveIcon}
                variant="tertiary"
                onClick={handleSaveGlobalType}
                accessibilityLabel="Save as Global Style"
              />
            </Tooltip>
            <Tooltip content="Use Global Style (Sử dụng Global Type)">
              <Button
                size="slim"
                icon={DuplicateIcon}
                variant="tertiary"
                onClick={handleApplyGlobalType}
                accessibilityLabel="Use Global Style"
              />
            </Tooltip>
          </InlineStack>
        </InlineStack>

        {statusFeedback && (
          <Box
            padding="200"
            background="bg-surface-success"
            borderRadius="200"
            borderWidth="025"
            borderColor="border-success"
          >
            <Text variant="bodyXs" tone="success" fontWeight="medium">
              {statusFeedback}
            </Text>
          </Box>
        )}

        {/* Checkbox to Toggle Table of Contents */}
        <Checkbox
          label="Show Table of Content in article"
          checked={Boolean(toc.enabled)}
          onChange={(val) => updateToc({ enabled: val })}
        />

        {!toc.enabled ? (
          <Text variant="bodyXs" tone="subdued">
            0
          </Text>
        ) : (
          <BlockStack gap="300">
            {/* Title */}
            <TextField
              label="Title"
              value={toc.title !== undefined ? toc.title : "Table of Contents"}
              onChange={(val) => updateToc({ title: val })}
              placeholder="Table of Contents"
              autoComplete="off"
            />

            {/* Text Color */}
            <BlockStack gap="100">
              <Text variant="bodySm" tone="subdued">
                Text color
              </Text>
              <InlineStack gap="200" blockAlign="center">
                <div
                  onClick={() => colorInputRef.current?.click()}
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: toc.textColor || "#000000",
                    borderRadius: "6px",
                    border: "1px solid #d4d4d8",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  title="Choose text color"
                />
                <input
                  type="color"
                  ref={colorInputRef}
                  value={toc.textColor || "#000000"}
                  onChange={(e) => updateToc({ textColor: e.target.value })}
                  style={{ display: "none" }}
                />
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Text color"
                    labelHidden
                    value={toc.textColor || "#000000"}
                    onChange={(val) => updateToc({ textColor: val })}
                    placeholder="#000000"
                    autoComplete="off"
                  />
                </div>
              </InlineStack>
            </BlockStack>

            {/* Numbering / List Style */}
            <Select
              label="Numbering / List style"
              options={listStyleOptions}
              value={toc.listStyle || "none"}
              onChange={(val) => updateToc({ listStyle: val })}
            />

            {/* Indentation */}
            <Select
              label="Indentation"
              options={indentationOptions}
              value={toc.indentation || "hierarchical"}
              onChange={(val) => updateToc({ indentation: val })}
            />

            {/* Layout */}
            <Select
              label="Layout"
              options={layoutOptions}
              value={toc.layout || "1-col"}
              onChange={(val) => updateToc({ layout: val })}
            />

            {/* Collapsible */}
            <Checkbox
              label="Collapsible"
              checked={Boolean(toc.collapsible)}
              onChange={(val) => updateToc({ collapsible: val })}
            />

            {/* Exclude Heading Types */}
            <TextField
              label="Exclude heading types"
              value={
                toc.excludedHeadingTypes && toc.excludedHeadingTypes.length > 0
                  ? toc.excludedHeadingTypes.map((t) => t.toUpperCase()).join(", ")
                  : ""
              }
              placeholder="Select heading types to exclude"
              readOnly
              autoComplete="off"
              connectedRight={
                <Button onClick={() => setIsExcludeModalOpen(true)}>Select</Button>
              }
            />

            {/* Headings List Section */}
            <BlockStack gap="150">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodySm" fontWeight="bold">
                  Headings ({detectedHeadings.length})
                </Text>
                <Button variant="plain" icon={RefreshIcon} onClick={handleScanHeadings}>
                  Update
                </Button>
              </InlineStack>

              {detectedHeadings.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    maxHeight: "260px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {detectedHeadings.map((h, i) => (
                    <div
                      key={h.id || i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#64748b",
                          backgroundColor: "#e2e8f0",
                          borderRadius: "4px",
                          padding: "1px 5px",
                          lineHeight: "16px",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        {h.level.toLowerCase()}
                      </span>
                      <span
                        style={{
                          fontSize: "12.5px",
                          color: "#18181b",
                          lineHeight: "1.4",
                          wordBreak: "break-word",
                        }}
                      >
                        {h.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Text variant="bodyXs" tone="subdued">
                  No headings found in article yet. Headings generated from the outline will appear here automatically.
                </Text>
              )}
            </BlockStack>
          </BlockStack>
        )}
      </div>

      {/* Exclude Heading Types Modal */}
      <Modal
        open={isExcludeModalOpen}
        onClose={() => setIsExcludeModalOpen(false)}
        title="Exclude heading types"
        primaryAction={{
          content: "Done",
          onAction: () => setIsExcludeModalOpen(false),
        }}
      >
        <Modal.Section>
          <BlockStack gap="200">
            <Text variant="bodySm" tone="subdued">
              Select heading levels to omit from the Table of Contents:
            </Text>
            <InlineStack gap="300" wrap>
              {headingTypesList.map((tag) => {
                const isExcluded = (toc.excludedHeadingTypes || []).includes(tag);
                return (
                  <Checkbox
                    key={tag}
                    label={tag.toUpperCase()}
                    checked={isExcluded}
                    onChange={() => toggleExcludeType(tag)}
                  />
                );
              })}
            </InlineStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ScratchSidebarTableContent;
