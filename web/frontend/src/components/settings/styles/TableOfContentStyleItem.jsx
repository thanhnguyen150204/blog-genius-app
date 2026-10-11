import { useState } from "react";
import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Select,
  TextField,
  Checkbox,
  Button,
  Text,
  Modal,
  Icon,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import {
  AccordionHeader,
  ColorPickerInput,
  TOC_LIST_STYLE_OPTIONS,
  TOC_INDENTATION_OPTIONS,
  TOC_LAYOUT_OPTIONS,
  TOC_HEADING_TYPES,
} from "../SettingsHelpers";

const SAMPLE_HEADINGS = [
  { level: "h2", text: "Heading 2" },
  { level: "h3", text: "Heading 3" },
  { level: "h4", text: "Heading 4" },
  { level: "h5", text: "Heading 5" },
  { level: "h6", text: "Heading 6" },
  { level: "h2", text: "Heading 2" },
  { level: "h3", text: "Heading 3" },
  { level: "h5", text: "Heading 5" },
  { level: "h6", text: "Heading 6" },
  { level: "h2", text: "Heading 2" },
  { level: "h3", text: "Heading 3" },
  { level: "h4", text: "Heading 4" },
];

const INDENT_MAP = {
  h1: 0,
  h2: 0,
  h3: 16,
  h4: 32,
  h5: 48,
  h6: 64,
};

export default function TableOfContentStyleItem({
  isOpen,
  onToggle,
  tocTitle,
  setTocTitle,
  tocTextColor,
  setTocTextColor,
  tocListStyle,
  setTocListStyle,
  tocIndentation,
  setTocIndentation,
  tocLayout,
  setTocLayout,
  tocCollapsible,
  setTocCollapsible,
  tocExcludeHeadings,
  setTocExcludeHeadings,
}) {
  const [isExcludeModalOpen, setIsExcludeModalOpen] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  const toggleExcludeType = (tag) => {
    const current = (tocExcludeHeadings || []).map((t) => t.toLowerCase());
    const isExcluded = current.includes(tag.toLowerCase());
    const updated = isExcluded
      ? current.filter((t) => t !== tag.toLowerCase())
      : [...current, tag.toLowerCase()];
    setTocExcludeHeadings(updated);
  };

  const filteredHeadings = SAMPLE_HEADINGS.filter((h) => {
    const excludedList = (tocExcludeHeadings || []).map((t) => t.toLowerCase());
    return !excludedList.includes(h.level.toLowerCase());
  });

  const getPrefix = (index, level) => {
    if (tocListStyle === "numbered") {
      return `${index + 1}. `;
    }
    if (tocListStyle === "bulleted") {
      return "• ";
    }
    if (tocListStyle === "roman") {
      const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
      return `${romanNumerals[index % romanNumerals.length]}. `;
    }
    return "";
  };

  const getLayoutStyles = () => {
    if (tocLayout === "2-col") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "6px 20px",
      };
    }
    if (tocLayout === "3-col") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "6px 16px",
      };
    }
    return {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    };
  };

  return (
    <div>
      <AccordionHeader
        title="Table of Content"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="toc-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <TextField
              label="Title"
              value={tocTitle}
              onChange={setTocTitle}
              autoComplete="off"
            />

            <ColorPickerInput
              label="Text color"
              value={tocTextColor}
              onChange={setTocTextColor}
            />

            <Select
              label="Numbering / List style"
              options={TOC_LIST_STYLE_OPTIONS}
              value={tocListStyle}
              onChange={setTocListStyle}
            />

            <Select
              label="Indentation"
              options={TOC_INDENTATION_OPTIONS}
              value={tocIndentation}
              onChange={setTocIndentation}
            />

            <Select
              label="Layout"
              options={TOC_LAYOUT_OPTIONS}
              value={tocLayout}
              onChange={setTocLayout}
            />

            <Checkbox
              label="Collapsible"
              checked={tocCollapsible}
              onChange={setTocCollapsible}
            />

            <TextField
              label="Exclude heading types"
              value={
                tocExcludeHeadings && tocExcludeHeadings.length > 0
                  ? tocExcludeHeadings.map((t) => t.toUpperCase()).join(", ")
                  : ""
              }
              placeholder="Select heading types to exclude"
              readOnly
              autoComplete="off"
              connectedRight={
                <Button onClick={() => setIsExcludeModalOpen(true)}>Select</Button>
              }
            />

            <Box
              background="bg-surface"
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <div
                style={{
                  border: "1px solid #e1e3e5",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isPreviewCollapsed ? 0 : "14px",
                    cursor: tocCollapsible ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={() => {
                    if (tocCollapsible) {
                      setIsPreviewCollapsed(!isPreviewCollapsed);
                    }
                  }}
                >
                  <Text
                    variant="headingMd"
                    as="h3"
                    fontWeight="bold"
                  >
                    <span style={{ color: tocTextColor || "#000000" }}>
                      {tocTitle || "Table of Contents"}
                    </span>
                  </Text>
                  {tocCollapsible && (
                    <Icon
                      source={isPreviewCollapsed ? ChevronDownIcon : ChevronUpIcon}
                      tone="subdued"
                    />
                  )}
                </div>

                {!isPreviewCollapsed && (
                  <div style={getLayoutStyles()}>
                    {filteredHeadings.map((heading, idx) => {
                      const indent =
                        tocIndentation === "hierarchical"
                          ? INDENT_MAP[heading.level] || 0
                          : 0;

                      return (
                        <div
                          key={idx}
                          style={{
                            paddingLeft: `${indent}px`,
                            lineHeight: "1.5",
                          }}
                        >
                          <a
                            href="#preview"
                            onClick={(e) => e.preventDefault()}
                            style={{
                              color: "#0000ee",
                              textDecoration: "underline",
                              fontSize: "13.5px",
                              cursor: "pointer",
                            }}
                          >
                            {getPrefix(idx, heading.level)}
                            {heading.text}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>

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
              {TOC_HEADING_TYPES.map((tag) => {
                const isExcluded = (tocExcludeHeadings || [])
                  .map((t) => t.toLowerCase())
                  .includes(tag.toLowerCase());
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
