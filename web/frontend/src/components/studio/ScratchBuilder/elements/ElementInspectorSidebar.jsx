import { useState, useRef } from "react";
import {
  Text,
  Button,
  Checkbox,
  Select,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LanguageTranslateIcon,
  DeleteIcon,
  DuplicateIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  UploadIcon,
  ImageIcon,
  MagicIcon,
  LinkIcon,
  DesktopIcon,
  MobileIcon,
  ExternalIcon,
} from "@shopify/polaris-icons";

/**
 * Reusable clean collapsible card component
 */
function CollapsibleCard({ title, isOpen, onToggle, children }) {
  return (
    <div
      style={{
        border: "1px solid #e4e4e7",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fafafa",
          border: "none",
          borderBottom: isOpen ? "1px solid #e4e4e7" : "none",
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "13px",
          color: "#09090b",
        }}
      >
        <span>{title}</span>
        <Icon
          source={isOpen ? ChevronUpIcon : ChevronDownIcon}
          tone="base"
        />
      </button>

      {isOpen && (
        <div style={{ padding: "12px 14px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * ColorSwatchInput: Swatch button + uppercase Hex input + native color picker
 */
function ColorSwatchInput({ label, value, onChange }) {
  const inputRef = useRef(null);
  const colorVal = value || "#000000";

  return (
    <div>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#18181b",
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "6px",
            backgroundColor: colorVal,
            border: "1px solid #cbd5e1",
            cursor: "pointer",
            flexShrink: 0,
            padding: 0,
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
          }}
          title="Pick color"
        />
        <input
          ref={inputRef}
          type="color"
          value={colorVal.startsWith("#") ? colorVal : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
        />
        <input
          type="text"
          value={colorVal}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontSize: "13px",
            color: "#18181b",
            fontWeight: 600,
            textTransform: "uppercase",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
}

/**
 * SliderSetting: Label with live value + range input
 */
function SliderSetting({ label, value, min = 0, max = 100, step = 1, unit = "", onChange }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
          {label}: {value}{unit}
        </label>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          accentColor: "#18181b",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

/**
 * ToggleSwitch: Clean modern toggle switch
 */
function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
      {label && (
        <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: "38px",
          height: "22px",
          borderRadius: "11px",
          backgroundColor: checked ? "#2563eb" : "#e4e4e7",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: 0,
          transition: "background-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "18px" : "2px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transition: "left 0.2s ease",
          }}
        />
      </button>
    </div>
  );
}

/**
 * SegmentedButtonGroup: Clean segmented buttons
 */
function SegmentedButtonGroup({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", border: "1px solid #cbd5e1", borderRadius: "6px", overflow: "hidden" }}>
      {options.map((opt, i) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              flex: 1,
              padding: "7px 6px",
              border: "none",
              borderLeft: i > 0 ? "1px solid #cbd5e1" : "none",
              backgroundColor: isSelected ? "#ea580c18" : "#ffffff",
              color: isSelected ? "#ea580c" : "#18181b",
              fontWeight: isSelected ? 700 : 500,
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.12s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * ElementInspectorSidebar renders dedicated inspectors for
 * content blocks, media, products, and company facts.
 */
export function ElementInspectorSidebar({
  block,
  onUpdateBlock,
  onBack,
  onDeleteBlock,
  onDuplicateBlock,
  onOpenLibraryModal,
  onOpenAiImageModal,
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [openSections, setOpenSections] = useState({
    content: true,
    table: true,
    color: true,
    listType: true,
    image: true,
    layout: true,
    productSource: true,
    productImage: true,
    addToCart: true,
    checkoutButton: true,
    collectionSource: true,
    collectionImage: true,
    imageSettings: true,
    typography: true,
    buttonSettings: true,
    cardSettings: true,
    productGridSource: true,
    responsive: true,
  });

  if (!block) return null;

  const toggleSection = (sectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey] !== undefined ? !prev[sectionKey] : false,
    }));
  };

  const handleResponsiveChange = (key, val) => {
    onUpdateBlock({
      ...block,
      [key]: val,
    });
  };

  const languages = [
    { code: "en", label: "English (Primary)" },
    { code: "vi", label: "Vietnamese" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "es", label: "Spanish" },
  ];

  // Dynamic inspector title based on block type
  const getInspectorTitle = () => {
    if (block.type === "heading") {
      return block.level ? block.level.toUpperCase() : "Heading";
    }
    if (block.type === "paragraph") return "Paragraph";
    if (block.type === "quote") return "Quote";
    if (block.type === "table") return "Table";
    if (block.type === "list") return "List";
    if (block.type === "image-text") return "Image & Text";
    if (block.type === "image") return "Image";
    if (block.type === "image-gallery") return "Image Gallery";
    if (block.type === "faq-accordion" || block.type === "faq") return "FAQ Accordion";
    if (block.type === "video") return "Video";
    if (block.type === "product" || block.type === "product-card") return "Product";
    if (block.type === "collection" || block.type === "collection-card") return "Collection";
    if (block.type === "product-grid") return "Product Grid";
    if (block.type === "button") return "Button";
    if (block.type === "custom-html") return "Custom HTML";
    if (block.type === "company-hero") return "Company Profile Hero";
    if (block.type === "fact-highlight") return "Fact Highlight Card";
    if (block.type === "contact-grid") return "Contact Channels Grid";
    if (block.type === "social-strip") return "Social Channels Strip";
    return block.type.charAt(0).toUpperCase() + block.type.slice(1);
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
        boxSizing: "border-box",
        overflowY: "auto",
        userSelect: "none",
      }}
    >
      {/* 1. Sticky Language Selector Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ffffff",
          padding: "10px 14px",
          borderBottom: "1px solid #f1f2f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div style={{ flex: 1 }}>
          <Select
            label="Language"
            labelHidden
            options={languages.map((l) => ({ label: l.label, value: l.code }))}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
          />
        </div>

        <Tooltip content="Translate element" preferredPosition="below">
          <Button
            icon={LanguageTranslateIcon}
            variant="tertiary"
            accessibilityLabel="Translate"
          />
        </Tooltip>
      </div>

      {/* 2. Header with Back Chevron < and Element Title + Action Icons */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f2f4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              color: "#18181b",
            }}
            aria-label="Back"
          >
            <Icon source={ChevronLeftIcon} tone="base" />
          </button>
          <Text variant="headingMd" as="h3" fontWeight="bold">
            {getInspectorTitle()}
          </Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {onDuplicateBlock && (
            <Tooltip content="Duplicate section">
              <Button
                size="micro"
                variant="tertiary"
                icon={DuplicateIcon}
                onClick={onDuplicateBlock}
                accessibilityLabel="Duplicate"
              />
            </Tooltip>
          )}
          {onDeleteBlock && (
            <Tooltip content="Delete section">
              <Button
                size="micro"
                variant="tertiary"
                icon={DeleteIcon}
                onClick={onDeleteBlock}
                accessibilityLabel="Delete"
              />
            </Tooltip>
          )}
        </div>
      </div>

      {/* 3. Main Settings Body */}
      <div
        style={{
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* ==================== 1. TEXT ELEMENTS ==================== */}

        {/* Heading */}
        {block.type === "heading" && (
          <CollapsibleCard
            title="Content"
            isOpen={openSections.content !== false}
            onToggle={() => toggleSection("content")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Title
                </label>
                <input
                  type="text"
                  value="Heading"
                  readOnly
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f4f4f5",
                    color: "#3f3f46",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  HTML Tag
                </label>
                <select
                  value={(block.level || "h2").toUpperCase()}
                  onChange={(e) => onUpdateBlock({ ...block, level: e.target.value.toLowerCase() })}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    color: "#18181b",
                    fontWeight: 500,
                  }}
                >
                  <option value="H1">H1</option>
                  <option value="H2">H2</option>
                  <option value="H3">H3</option>
                  <option value="H4">H4</option>
                  <option value="H5">H5</option>
                  <option value="H6">H6</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Alignment
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ]}
                  value={block.align || "left"}
                  onChange={(val) => onUpdateBlock({ ...block, align: val })}
                />
              </div>

              <ColorSwatchInput
                label="Text color"
                value={block.textColor || "#000000"}
                onChange={(hex) => onUpdateBlock({ ...block, textColor: hex })}
              />
            </div>
          </CollapsibleCard>
        )}

        {/* Paragraph */}
        {block.type === "paragraph" && (
          <CollapsibleCard
            title="Typography"
            isOpen={openSections.content !== false}
            onToggle={() => toggleSection("content")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Alignment
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ]}
                  value={block.align || "left"}
                  onChange={(val) => onUpdateBlock({ ...block, align: val })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Font size treatment
                </label>
                <select
                  value={block.fontSizeTreatment || "standard"}
                  onChange={(e) => onUpdateBlock({ ...block, fontSizeTreatment: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: "6px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    color: "#18181b",
                    fontWeight: 500,
                  }}
                >
                  <option value="compact">Compact (13.5px)</option>
                  <option value="standard">Standard (15.5px)</option>
                  <option value="large">Large (17px)</option>
                  <option value="featured">Featured Lead (20px)</option>
                </select>
              </div>

              <ColorSwatchInput
                label="Text color"
                value={block.textColor || "#374151"}
                onChange={(hex) => onUpdateBlock({ ...block, textColor: hex })}
              />
            </div>
          </CollapsibleCard>
        )}

        {/* Table */}
        {block.type === "table" && (
          <>
            <CollapsibleCard
              title="Table"
              isOpen={openSections.table !== false}
              onToggle={() => toggleSection("table")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Row count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={block.rowCount || block.rows?.length || 2}
                    onChange={(e) => onUpdateBlock({ ...block, rowCount: Math.max(1, parseInt(e.target.value) || 1) })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Column count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={block.colCount || block.headers?.length || 2}
                    onChange={(e) => onUpdateBlock({ ...block, colCount: Math.max(1, parseInt(e.target.value) || 1) })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Border style
                  </label>
                  <select
                    value={block.borderStyle || "Solid"}
                    onChange={(e) => onUpdateBlock({ ...block, borderStyle: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="None">None</option>
                    <option value="Solid">Solid</option>
                    <option value="Dashed">Dashed</option>
                  </select>
                </div>

                <SliderSetting
                  label="Cell padding"
                  value={block.cellPadding !== undefined ? block.cellPadding : 8}
                  min={2}
                  max={24}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, cellPadding: val })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Color"
              isOpen={openSections.color !== false}
              onToggle={() => toggleSection("color")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Header</span>
                  <div style={{ marginTop: "6px" }}>
                    <Checkbox
                      label="Transparent background"
                      checked={Boolean(block.headerTransparent)}
                      onChange={(val) => onUpdateBlock({ ...block, headerTransparent: val })}
                    />
                  </div>
                  {!block.headerTransparent && (
                    <div style={{ marginTop: "8px" }}>
                      <ColorSwatchInput
                        label="Background color"
                        value={block.headerBg || "#F8FAFC"}
                        onChange={(hex) => onUpdateBlock({ ...block, headerBg: hex })}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: "8px" }}>
                    <ColorSwatchInput
                      label="Text color"
                      value={block.headerText || "#000000"}
                      onChange={(hex) => onUpdateBlock({ ...block, headerText: hex })}
                    />
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Body</span>
                  <div style={{ marginTop: "6px" }}>
                    <Checkbox
                      label="Transparent background"
                      checked={Boolean(block.bodyTransparent)}
                      onChange={(val) => onUpdateBlock({ ...block, bodyTransparent: val })}
                    />
                  </div>
                  {!block.bodyTransparent && (
                    <div style={{ marginTop: "8px" }}>
                      <ColorSwatchInput
                        label="Background color"
                        value={block.bodyBg || "#FFFFFF"}
                        onChange={(hex) => onUpdateBlock({ ...block, bodyBg: hex })}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: "8px" }}>
                    <ColorSwatchInput
                      label="Text color"
                      value={block.bodyText || "#374151"}
                      onChange={(hex) => onUpdateBlock({ ...block, bodyText: hex })}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* List */}
        {block.type === "list" && (
          <CollapsibleCard
            title="List Type"
            isOpen={openSections.listType !== false}
            onToggle={() => toggleSection("listType")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
                List style
              </label>
              <SegmentedButtonGroup
                options={[
                  { label: "Bullet", value: "bullet" },
                  { label: "Numbered", value: "numbered" },
                ]}
                value={block.style || "bullet"}
                onChange={(val) => onUpdateBlock({ ...block, style: val })}
              />
            </div>
          </CollapsibleCard>
        )}

        {/* Image & Text */}
        {block.type === "image-text" && (
          <CollapsibleCard
            title="Image & Text Settings"
            isOpen={openSections.image !== false}
            onToggle={() => toggleSection("image")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  icon={UploadIcon}
                  onClick={() => onOpenLibraryModal && onOpenLibraryModal()}
                >
                  Upload
                </Button>
                <Button
                  icon={MagicIcon}
                  onClick={() => onOpenAiImageModal && onOpenAiImageModal()}
                >
                  AI Image
                </Button>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Image Alt
                </label>
                <input
                  type="text"
                  value={block.imageAlt || ""}
                  onChange={(e) => onUpdateBlock({ ...block, imageAlt: e.target.value })}
                  placeholder="Alt text for SEO..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Image position
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "Image Left", value: "left" },
                    { label: "Image Right", value: "right" },
                  ]}
                  value={block.imagePosition || "left"}
                  onChange={(val) => onUpdateBlock({ ...block, imagePosition: val })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Vertical align
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "Top", value: "top" },
                    { label: "Middle", value: "middle" },
                    { label: "Bottom", value: "bottom" },
                  ]}
                  value={block.verticalAlign || "middle"}
                  onChange={(val) => onUpdateBlock({ ...block, verticalAlign: val })}
                />
              </div>
            </div>
          </CollapsibleCard>
        )}

        {/* ==================== 2. MEDIA ELEMENTS ==================== */}

        {/* Image (Matches media_1794761310067_f73bd38a.jpg) */}
        {block.type === "image" && (
          <CollapsibleCard
            title="Image"
            isOpen={openSections.image !== false}
            onToggle={() => toggleSection("image")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Image url
                </label>
                <input
                  type="text"
                  value={block.url || block.imageUrl || ""}
                  onChange={(e) => onUpdateBlock({ ...block, url: e.target.value, imageUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Image alt
                </label>
                <input
                  type="text"
                  value={block.alt || block.imageAlt || ""}
                  onChange={(e) => onUpdateBlock({ ...block, alt: e.target.value, imageAlt: e.target.value })}
                  placeholder="Describe image..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Image size scope
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "All devices", value: "all" },
                    { label: "Per device", value: "per-device" },
                  ]}
                  value={block.sizeScope || "all"}
                  onChange={(val) => onUpdateBlock({ ...block, sizeScope: val })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Same size for all devices
                </label>
                <select
                  value={block.sameSize || "Full width (100%)"}
                  onChange={(e) => onUpdateBlock({ ...block, sameSize: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                >
                  <option value="Full width (100%)">Full width (100%)</option>
                  <option value="Custom">Custom</option>
                  <option value="Small">Small (25%)</option>
                  <option value="Medium">Medium (50%)</option>
                  <option value="Large">Large (75%)</option>
                  <option value="Original">Original size</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Link
                </label>
                <input
                  type="text"
                  value={block.linkUrl || ""}
                  onChange={(e) => onUpdateBlock({ ...block, linkUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <ToggleSwitch
                label="Open link in new tab"
                checked={Boolean(block.openInNewTab)}
                onChange={(val) => onUpdateBlock({ ...block, openInNewTab: val })}
              />

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Alignment
                </label>
                <SegmentedButtonGroup
                  options={[
                    { label: "Left", value: "left" },
                    { label: "Center", value: "center" },
                    { label: "Right", value: "right" },
                  ]}
                  value={block.align || "center"}
                  onChange={(val) => onUpdateBlock({ ...block, align: val })}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Object fit
                </label>
                <select
                  value={block.objectFit || "Cover"}
                  onChange={(e) => onUpdateBlock({ ...block, objectFit: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                >
                  <option value="Cover">Cover</option>
                  <option value="Contain">Contain</option>
                  <option value="Fill">Fill</option>
                  <option value="None">None</option>
                  <option value="Scale-down">Scale-down</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Object position
                </label>
                <select
                  value={block.objectPosition || "Unset"}
                  onChange={(e) => onUpdateBlock({ ...block, objectPosition: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                >
                  <option value="Unset">Unset</option>
                  <option value="Center">Center</option>
                  <option value="Top">Top</option>
                  <option value="Bottom">Bottom</option>
                  <option value="Left">Left</option>
                  <option value="Right">Right</option>
                </select>
              </div>
            </div>
          </CollapsibleCard>
        )}

        {/* Image Gallery (Matches media_1794761574814_64167498.jpg) */}
        {block.type === "image-gallery" && (
          <>
            <CollapsibleCard
              title="Layout Settings"
              isOpen={openSections.layout !== false}
              onToggle={() => toggleSection("layout")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Layout Style
                  </label>
                  <select
                    value={block.layoutStyle || "Grid"}
                    onChange={(e) => onUpdateBlock({ ...block, layoutStyle: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Grid">Grid</option>
                    <option value="Masonry">Masonry</option>
                    <option value="Carousel">Carousel</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
                      Images in a row
                    </label>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <Icon source={DesktopIcon} tone="base" />
                    </div>
                  </div>
                  <SegmentedButtonGroup
                    options={[
                      { label: "2 Columns", value: 2 },
                      { label: "3 Columns", value: 3 },
                      { label: "4 Columns", value: 4 },
                    ]}
                    value={block.columns || 3}
                    onChange={(val) => onUpdateBlock({ ...block, columns: val })}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Aspect Ratio
                  </label>
                  <select
                    value={block.aspectRatio || "Square (1:1)"}
                    onChange={(e) => onUpdateBlock({ ...block, aspectRatio: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Square (1:1)">Square (1:1)</option>
                    <option value="Standard (4:3)">Standard (4:3)</option>
                    <option value="Widescreen (16:9)">Widescreen (16:9)</option>
                    <option value="Portrait (3:4)">Portrait (3:4)</option>
                    <option value="Original">Original</option>
                  </select>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Images"
              isOpen={openSections.image !== false}
              onToggle={() => toggleSection("image")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    icon={ImageIcon}
                    onClick={() => onOpenLibraryModal && onOpenLibraryModal()}
                  >
                    Select from library
                  </Button>
                  <Button
                    icon={MagicIcon}
                    onClick={() => onOpenAiImageModal && onOpenAiImageModal()}
                  >
                    Generate with AI
                  </Button>
                </div>

                <ToggleSwitch
                  label="Caption"
                  checked={Boolean(block.showCaption)}
                  onChange={(val) => onUpdateBlock({ ...block, showCaption: val })}
                />
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* FAQ Accordion (Matches media_1794761613259_0088e612.png) */}
        {(block.type === "faq-accordion" || block.type === "faq") && (
          <CollapsibleCard
            title="Content"
            isOpen={openSections.content !== false}
            onToggle={() => toggleSection("content")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
                    Question
                  </label>
                  <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 500 }}>
                    Edit on canvas
                  </span>
                </div>
                <input
                  type="text"
                  value={block.question || (block.items && block.items[0]?.question) || ""}
                  onChange={(e) => {
                    const q = e.target.value;
                    const items = block.items ? [...block.items] : [{ question: q, answer: block.answer || "" }];
                    if (items[0]) items[0].question = q;
                    onUpdateBlock({ ...block, question: q, items });
                  }}
                  placeholder="Enter question..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#18181b" }}>
                    Answer
                  </label>
                  <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 500 }}>
                    Edit on canvas
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={block.answer || (block.items && block.items[0]?.answer) || ""}
                  onChange={(e) => {
                    const a = e.target.value;
                    const items = block.items ? [...block.items] : [{ question: block.question || "", answer: a }];
                    if (items[0]) items[0].answer = a;
                    onUpdateBlock({ ...block, answer: a, items });
                  }}
                  placeholder="Enter answer..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b", fontSize: "13px" }}
                />
              </div>
            </div>
          </CollapsibleCard>
        )}

        {/* Video */}
        {block.type === "video" && (
          <CollapsibleCard
            title="Video Settings"
            isOpen={openSections.content !== false}
            onToggle={() => toggleSection("content")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Video URL (YouTube or MP4)
                </label>
                <input
                  type="text"
                  value={block.videoUrl || ""}
                  onChange={(e) => onUpdateBlock({ ...block, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={block.coverUrl || ""}
                  onChange={(e) => onUpdateBlock({ ...block, coverUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Title
                </label>
                <input
                  type="text"
                  value={block.title || ""}
                  onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <ToggleSwitch
                label="Autoplay"
                checked={Boolean(block.autoplay)}
                onChange={(val) => onUpdateBlock({ ...block, autoplay: val })}
              />

              <ToggleSwitch
                label="Mute audio"
                checked={Boolean(block.mute)}
                onChange={(val) => onUpdateBlock({ ...block, mute: val })}
              />
            </div>
          </CollapsibleCard>
        )}

        {/* ==================== 3. PRODUCT ELEMENTS ==================== */}

        {/* Product Card (Matches media_1794761627445_f68a0f82.jpg & 477a8a9d.png) */}
        {(block.type === "product" || block.type === "product-card") && (
          <>
            <CollapsibleCard
              title="Product source"
              isOpen={openSections.productSource !== false}
              onToggle={() => toggleSection("productSource")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Button fullWidth onClick={() => alert("Select product from Shopify store")}>
                  Select product
                </Button>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Product Image Options"
              isOpen={openSections.productImage !== false}
              onToggle={() => toggleSection("productImage")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "12px", color: "#4b5563", margin: 0 }}>
                  Select a specific variant or custom image to display instead of the default product image.
                </p>
                <Button icon={ImageIcon} onClick={() => onOpenLibraryModal && onOpenLibraryModal()}>
                  Select from library
                </Button>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                  <Checkbox
                    label="Show product description"
                    checked={block.showDescription !== false}
                    onChange={(val) => onUpdateBlock({ ...block, showDescription: val })}
                  />
                  <Checkbox
                    label="Show variant selector"
                    helpText="Display variant dropdown if product has multiple variants"
                    checked={block.showVariantSelector !== false}
                    onChange={(val) => onUpdateBlock({ ...block, showVariantSelector: val })}
                  />
                  <Checkbox
                    label="Show quantity selector"
                    helpText="Uncheck to hide the - 1 + quantity selector"
                    checked={block.showQuantitySelector !== false}
                    onChange={(val) => onUpdateBlock({ ...block, showQuantitySelector: val })}
                  />
                </div>

                <div style={{ marginTop: "6px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Add to Cart action
                  </label>
                  <select
                    value={block.cartAction || "Open Cart Drawer"}
                    onChange={(e) => onUpdateBlock({ ...block, cartAction: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Open Cart Drawer">Open Cart Drawer</option>
                    <option value="Redirect to Cart page">Redirect to Cart page</option>
                    <option value="Instant Checkout">Instant Checkout</option>
                  </select>
                  <p style={{ fontSize: "11.5px", color: "#6b7280", margin: "4px 0 0 0" }}>
                    If Cart Drawer is selected but the theme has no drawer, it will automatically fallback to the Cart page.
                  </p>
                </div>

                <Checkbox
                  label="Transparent background"
                  checked={Boolean(block.transparentBg)}
                  onChange={(val) => onUpdateBlock({ ...block, transparentBg: val })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Add to Cart Button"
              isOpen={openSections.addToCart !== false}
              onToggle={() => toggleSection("addToCart")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Add to Cart label
                  </label>
                  <input
                    type="text"
                    value={block.buttonLabel || "Add to Cart"}
                    onChange={(e) => onUpdateBlock({ ...block, buttonLabel: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <ColorSwatchInput
                  label="Add to cart Background color"
                  value={block.buttonBg || "#4A4AF4"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonBg: hex })}
                />

                <ColorSwatchInput
                  label="Add to cart Text color"
                  value={block.buttonTextColor || "#FFFFFF"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonTextColor: hex })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Checkout Button"
              isOpen={openSections.checkoutButton !== false}
              onToggle={() => toggleSection("checkoutButton")}
            >
              <Checkbox
                label="Show checkout button (Shop Pay)"
                helpText="Note: Only enable this option if your store has Shop Pay activated."
                checked={Boolean(block.showShopPay)}
                onChange={(val) => onUpdateBlock({ ...block, showShopPay: val })}
              />
            </CollapsibleCard>
          </>
        )}

        {/* Collection Card (Matches media_1794761672441_fd96f2dd.png, 5539df4f, 07912a0c) */}
        {(block.type === "collection" || block.type === "collection-card") && (
          <>
            <CollapsibleCard
              title="Source"
              isOpen={openSections.collectionSource !== false}
              onToggle={() => toggleSection("collectionSource")}
            >
              <Button fullWidth onClick={() => alert("Select collection from Shopify store")}>
                Select collection
              </Button>
            </CollapsibleCard>

            <CollapsibleCard
              title="Collection Image"
              isOpen={openSections.collectionImage !== false}
              onToggle={() => toggleSection("collectionImage")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="slim"
                    icon={MagicIcon}
                    onClick={() => onOpenAiImageModal && onOpenAiImageModal()}
                  >
                    Generate with AI
                  </Button>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Button fullWidth icon={UploadIcon} onClick={() => onOpenLibraryModal && onOpenLibraryModal()}>
                    Upload file
                  </Button>
                  <Button fullWidth icon={ImageIcon} onClick={() => onOpenLibraryModal && onOpenLibraryModal()}>
                    Select from library
                  </Button>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                    or Insert image URL
                  </label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      value={block.imageUrl || ""}
                      onChange={(e) => onUpdateBlock({ ...block, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b", fontSize: "12.5px" }}
                    />
                    <Button size="slim">Save</Button>
                  </div>
                </div>

                <div style={{ marginTop: "4px" }}>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Layout
                  </label>
                  <select
                    value={block.layout || "Side by Side"}
                    onChange={(e) => onUpdateBlock({ ...block, layout: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Side by Side">Side by Side</option>
                    <option value="Card Overlay">Card Overlay</option>
                    <option value="Image Top">Image Top</option>
                  </select>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Image Settings"
              isOpen={openSections.imageSettings !== false}
              onToggle={() => toggleSection("imageSettings")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <SliderSetting
                  label="Image Width"
                  value={block.imageWidth || 50}
                  min={20}
                  max={80}
                  unit="%"
                  onChange={(val) => onUpdateBlock({ ...block, imageWidth: val })}
                />

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Image Ratio
                  </label>
                  <select
                    value={block.imageRatio || "Standard 4:3"}
                    onChange={(e) => onUpdateBlock({ ...block, imageRatio: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Standard 4:3">Standard 4:3</option>
                    <option value="Square 1:1">Square 1:1</option>
                    <option value="Widescreen 16:9">Widescreen 16:9</option>
                    <option value="Original">Original</option>
                  </select>
                </div>

                <SliderSetting
                  label="Image Corner Radius"
                  value={block.imageRadius !== undefined ? block.imageRadius : 8}
                  min={0}
                  max={30}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, imageRadius: val })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Typography"
              isOpen={openSections.typography !== false}
              onToggle={() => toggleSection("typography")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <SliderSetting
                  label="Title Font Size"
                  value={block.titleSize || 24}
                  min={16}
                  max={40}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, titleSize: val })}
                />

                <ColorSwatchInput
                  label="Title Color"
                  value={block.titleColor || "#000000"}
                  onChange={(hex) => onUpdateBlock({ ...block, titleColor: hex })}
                />

                <Checkbox
                  label="Show Description"
                  checked={block.showDescription !== false}
                  onChange={(val) => onUpdateBlock({ ...block, showDescription: val })}
                />

                {block.showDescription !== false && (
                  <>
                    <SliderSetting
                      label="Description Font Size"
                      value={block.descSize || 14}
                      min={11}
                      max={20}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, descSize: val })}
                    />

                    <ColorSwatchInput
                      label="Description Color"
                      value={block.descColor || "#555555"}
                      onChange={(hex) => onUpdateBlock({ ...block, descColor: hex })}
                    />
                  </>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Content Alignment
                  </label>
                  <SegmentedButtonGroup
                    options={[
                      { label: "Left", value: "left" },
                      { label: "Center", value: "center" },
                      { label: "Right", value: "right" },
                    ]}
                    value={block.align || "left"}
                    onChange={(val) => onUpdateBlock({ ...block, align: val })}
                  />
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Button Settings"
              isOpen={openSections.buttonSettings !== false}
              onToggle={() => toggleSection("buttonSettings")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={block.ctaText || "Shop Collection"}
                    onChange={(e) => onUpdateBlock({ ...block, ctaText: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <ColorSwatchInput
                  label="Button Background"
                  value={block.buttonBg || "#000000"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonBg: hex })}
                />

                <ColorSwatchInput
                  label="Button Text Color"
                  value={block.buttonTextColor || "#FFFFFF"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonTextColor: hex })}
                />

                <SliderSetting
                  label="Button Corner Radius"
                  value={block.buttonRadius !== undefined ? block.buttonRadius : 6}
                  min={0}
                  max={30}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, buttonRadius: val })}
                />

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Button Width
                  </label>
                  <SegmentedButtonGroup
                    options={[
                      { label: "Auto", value: "auto" },
                      { label: "Full", value: "full" },
                    ]}
                    value={block.buttonWidth || "auto"}
                    onChange={(val) => onUpdateBlock({ ...block, buttonWidth: val })}
                  />
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Card Settings"
              isOpen={openSections.cardSettings !== false}
              onToggle={() => toggleSection("cardSettings")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <SliderSetting
                  label="Card Radius"
                  value={block.cardRadius !== undefined ? block.cardRadius : 12}
                  min={0}
                  max={30}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, cardRadius: val })}
                />

                <Checkbox
                  label="Transparent Background"
                  checked={Boolean(block.transparentBg)}
                  onChange={(val) => onUpdateBlock({ ...block, transparentBg: val })}
                />
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* Product Grid (Matches media_1794761719552_999ac7f2.jpg & a8fffcce.jpg) */}
        {block.type === "product-grid" && (
          <>
            <div
              style={{
                border: "1px solid #e4e4e7",
                borderRadius: "8px",
                padding: "12px 14px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Title
                </label>
                <input
                  type="text"
                  value={block.title || "Featured Products"}
                  onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Link from Title
                </label>
                <input
                  type="text"
                  value={block.titleLink || ""}
                  onChange={(e) => onUpdateBlock({ ...block, titleLink: e.target.value })}
                  placeholder="https://..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>

              <ToggleSwitch
                label="Open link in new tab"
                checked={Boolean(block.openInNewTab)}
                onChange={(val) => onUpdateBlock({ ...block, openInNewTab: val })}
              />

              <ColorSwatchInput
                label="Title color"
                value={block.titleColor || "#000000"}
                onChange={(hex) => onUpdateBlock({ ...block, titleColor: hex })}
              />
            </div>

            <CollapsibleCard
              title="Source"
              isOpen={openSections.productGridSource !== false}
              onToggle={() => toggleSection("productGridSource")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#18181b", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="gridSource"
                      checked={block.sourceMode !== "manual"}
                      onChange={() => onUpdateBlock({ ...block, sourceMode: "auto" })}
                    />
                    <span>Auto select by filters</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#18181b", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="gridSource"
                      checked={block.sourceMode === "manual"}
                      onChange={() => onUpdateBlock({ ...block, sourceMode: "manual" })}
                    />
                    <div>
                      <div>Manually select products</div>
                      <div style={{ fontSize: "11.5px", color: "#6b7280" }}>
                        Manually select products from the list.
                      </div>
                    </div>
                  </label>

                  <Button fullWidth onClick={() => alert("Select products from store")}>
                    Select products
                  </Button>
                </div>

                <SliderSetting
                  label="Maximum number of products to show"
                  value={block.limit || 4}
                  min={2}
                  max={12}
                  unit=""
                  onChange={(val) => onUpdateBlock({ ...block, limit: val })}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Checkbox
                    label="Show product price"
                    checked={block.showPrice !== false}
                    onChange={(val) => onUpdateBlock({ ...block, showPrice: val })}
                  />
                  <Checkbox
                    label="Transparent background"
                    checked={Boolean(block.transparentBg)}
                    onChange={(val) => onUpdateBlock({ ...block, transparentBg: val })}
                  />
                  <Checkbox
                    label="Show button on hover"
                    checked={Boolean(block.showButtonOnHover)}
                    onChange={(val) => onUpdateBlock({ ...block, showButtonOnHover: val })}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Button label
                  </label>
                  <input
                    type="text"
                    value={block.buttonLabel || "Add to Cart"}
                    onChange={(e) => onUpdateBlock({ ...block, buttonLabel: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <ColorSwatchInput
                  label="Button Background Color"
                  value={block.buttonBg || "#000000"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonBg: hex })}
                />

                <ColorSwatchInput
                  label="Button Text Color"
                  value={block.buttonTextColor || "#FFFFFF"}
                  onChange={(hex) => onUpdateBlock({ ...block, buttonTextColor: hex })}
                />

                <SliderSetting
                  label="Button Corner Radius"
                  value={block.buttonRadius !== undefined ? block.buttonRadius : 4}
                  min={0}
                  max={30}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, buttonRadius: val })}
                />

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Hover Animation
                  </label>
                  <select
                    value={block.hoverAnimation || "Slide Up"}
                    onChange={(e) => onUpdateBlock({ ...block, hoverAnimation: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Slide Up">Slide Up</option>
                    <option value="Fade In">Fade In</option>
                    <option value="Zoom">Zoom</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Content Alignment
                  </label>
                  <SegmentedButtonGroup
                    options={[
                      { label: "Center", value: "center" },
                      { label: "Left", value: "left" },
                    ]}
                    value={block.contentAlign || "center"}
                    onChange={(val) => onUpdateBlock({ ...block, contentAlign: val })}
                  />
                </div>
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* ==================== 4. OTHER ELEMENTS ==================== */}

        {/* Button (Matches media_1794795817987_13a31f5c.jpg & d1e5fa89.png) */}
        {block.type === "button" && (
          <>
            <CollapsibleCard
              title="Button"
              isOpen={openSections.button !== false}
              onToggle={() => toggleSection("button")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Button label
                  </label>
                  <input
                    type="text"
                    value={block.buttonLabel || block.text || "Shop now"}
                    onChange={(e) => onUpdateBlock({ ...block, buttonLabel: e.target.value, text: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Button link
                  </label>
                  <input
                    type="text"
                    value={block.url || "http://"}
                    onChange={(e) => onUpdateBlock({ ...block, url: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                </div>

                <ToggleSwitch
                  label="Open link in new tab"
                  checked={Boolean(block.openInNewTab)}
                  onChange={(val) => onUpdateBlock({ ...block, openInNewTab: val })}
                />

                <ToggleSwitch
                  label="Nofollow"
                  checked={Boolean(block.nofollow)}
                  onChange={(val) => onUpdateBlock({ ...block, nofollow: val })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Button Style"
              isOpen={openSections.buttonStyle !== false}
              onToggle={() => toggleSection("buttonStyle")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Button Sizing */}
                <div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Button Sizing</span>
                  <div style={{ marginTop: "8px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Width mode
                    </label>
                    <SegmentedButtonGroup
                      options={[
                        { label: "Auto", value: "Auto" },
                        { label: "Full Width", value: "Full Width" },
                        { label: "Custom", value: "Custom" },
                      ]}
                      value={block.widthMode || "Auto"}
                      onChange={(val) => onUpdateBlock({ ...block, widthMode: val })}
                    />
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Button Position
                    </label>
                    <SegmentedButtonGroup
                      options={[
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                      ]}
                      value={block.align || "center"}
                      onChange={(val) => onUpdateBlock({ ...block, align: val })}
                    />
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <SliderSetting
                      label="Padding Vertical"
                      value={block.paddingVertical !== undefined ? block.paddingVertical : 10}
                      min={0}
                      max={40}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, paddingVertical: val })}
                    />
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <SliderSetting
                      label="Padding Horizontal"
                      value={block.paddingHorizontal !== undefined ? block.paddingHorizontal : 22}
                      min={0}
                      max={60}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, paddingHorizontal: val })}
                    />
                  </div>
                </div>

                {/* Typography */}
                <div style={{ borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Typography</span>
                  <div style={{ marginTop: "8px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Text Alignment
                    </label>
                    <SegmentedButtonGroup
                      options={[
                        { label: "Left", value: "left" },
                        { label: "Center", value: "center" },
                        { label: "Right", value: "right" },
                      ]}
                      value={block.textAlign || "center"}
                      onChange={(val) => onUpdateBlock({ ...block, textAlign: val })}
                    />
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Text transform
                    </label>
                    <select
                      value={block.textTransform || "Normal"}
                      onChange={(e) => onUpdateBlock({ ...block, textTransform: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Uppercase">Uppercase</option>
                      <option value="Lowercase">Lowercase</option>
                      <option value="Capitalize">Capitalize</option>
                    </select>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <SliderSetting
                      label="Letter spacing"
                      value={block.letterSpacing !== undefined ? block.letterSpacing : 0}
                      min={-2}
                      max={10}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, letterSpacing: val })}
                    />
                  </div>
                </div>

                {/* Border & Corners */}
                <div style={{ borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Border & Corners</span>
                  <div style={{ marginTop: "8px" }}>
                    <label style={{ display: "block", fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Button style
                    </label>
                    <select
                      value={block.buttonStyle || "Fill"}
                      onChange={(e) => onUpdateBlock({ ...block, buttonStyle: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                    >
                      <option value="Fill">Fill</option>
                      <option value="Outline">Outline</option>
                      <option value="Text Only">Text Only</option>
                    </select>
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <SliderSetting
                      label="Border radius"
                      value={block.borderRadius !== undefined ? block.borderRadius : 6}
                      min={0}
                      max={30}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, borderRadius: val })}
                    />
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    <SliderSetting
                      label="Border width"
                      value={block.borderWidth !== undefined ? block.borderWidth : 1}
                      min={0}
                      max={10}
                      unit="px"
                      onChange={(val) => onUpdateBlock({ ...block, borderWidth: val })}
                    />
                  </div>
                </div>

                {/* Colors */}
                <div style={{ borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Colors</span>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <ColorSwatchInput
                      label="Background color"
                      value={block.bgColor || "#008060"}
                      onChange={(hex) => onUpdateBlock({ ...block, bgColor: hex })}
                    />
                    <ColorSwatchInput
                      label="Text color"
                      value={block.textColor || "#FFFFFF"}
                      onChange={(hex) => onUpdateBlock({ ...block, textColor: hex })}
                    />
                    <ColorSwatchInput
                      label="Border color"
                      value={block.borderColor || "#008060"}
                      onChange={(hex) => onUpdateBlock({ ...block, borderColor: hex })}
                    />
                  </div>
                </div>

                {/* Hover Colors */}
                <div style={{ borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#18181b" }}>Hover Colors</span>
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <ColorSwatchInput
                      label="Hover Background"
                      value={block.hoverBgColor || "#004C3F"}
                      onChange={(hex) => onUpdateBlock({ ...block, hoverBgColor: hex })}
                    />
                    <ColorSwatchInput
                      label="Hover Text color"
                      value={block.hoverTextColor || "#FFFFFF"}
                      onChange={(hex) => onUpdateBlock({ ...block, hoverTextColor: hex })}
                    />
                    <ColorSwatchInput
                      label="Hover Border color"
                      value={block.hoverBorderColor || "#004C3F"}
                      onChange={(hex) => onUpdateBlock({ ...block, hoverBorderColor: hex })}
                    />
                  </div>
                </div>
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* Custom HTML (Matches media_1794795861638_9bdbff12.png) */}
        {block.type === "custom-html" && (
          <CollapsibleCard
            title="HTML Content"
            isOpen={openSections.htmlContent !== false}
            onToggle={() => toggleSection("htmlContent")}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <textarea
                rows={12}
                value={block.html || block.code || "<div>Your HTML</div>"}
                onChange={(e) => onUpdateBlock({ ...block, html: e.target.value, code: e.target.value })}
                placeholder="<div>Your HTML</div>"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  fontFamily: "monospace",
                  fontSize: "12.5px",
                  color: "#18181b",
                  backgroundColor: "#ffffff",
                  boxSizing: "border-box",
                }}
              />
              <Button fullWidth disabled>
                Convert to Blocks
              </Button>
            </div>
          </CollapsibleCard>
        )}

        {/* ==================== 5. COMPANY & FACTS ELEMENTS ==================== */}

        {/* Company Profile Hero (Matches media_1794795882273_1bb9ada5.jpg & 1b6ce0ab.jpg) */}
        {block.type === "company-hero" && (
          <>
            <CollapsibleCard
              title="Header Titles & Content"
              isOpen={openSections.companyHeader !== false}
              onToggle={() => toggleSection("companyHeader")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "2px" }}>
                    Brand / Category Badge
                  </label>
                  <input
                    type="text"
                    value={block.badge || "COMPANY NAME"}
                    onChange={(e) => onUpdateBlock({ ...block, badge: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Edit directly on canvas editor</span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "2px" }}>
                    Main Title (H1/Heading)
                  </label>
                  <input
                    type="text"
                    value={block.title || "Organization Fact Sheet"}
                    onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Edit directly on canvas editor</span>
                </div>

                <SliderSetting
                  label="Title Font Size"
                  value={block.titleSize || 36}
                  min={18}
                  max={60}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, titleSize: val })}
                />

                <Checkbox
                  label="Show Accent Underline Bar"
                  checked={block.showAccentLine !== false}
                  onChange={(val) => onUpdateBlock({ ...block, showAccentLine: val })}
                />

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "2px" }}>
                    Tagline / Description
                  </label>
                  <input
                    type="text"
                    value={block.tagline || "Quality You Trust, Service You Deserve."}
                    onChange={(e) => onUpdateBlock({ ...block, tagline: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>Edit directly on canvas editor</span>
                </div>

                <SliderSetting
                  label="Tagline Font Size"
                  value={block.taglineSize || 15}
                  min={12}
                  max={24}
                  unit="px"
                  onChange={(val) => onUpdateBlock({ ...block, taglineSize: val })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Colors & Styling"
              isOpen={openSections.companyColors !== false}
              onToggle={() => toggleSection("companyColors")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ColorSwatchInput
                  label="Card Background Color"
                  value={block.cardBg || "#F8FAFC"}
                  onChange={(hex) => onUpdateBlock({ ...block, cardBg: hex })}
                />
                <ColorSwatchInput
                  label="Border Color"
                  value={block.borderColor || "#E2E8F0"}
                  onChange={(hex) => onUpdateBlock({ ...block, borderColor: hex })}
                />
                <ColorSwatchInput
                  label="Title Color"
                  value={block.titleColor || "#0F172A"}
                  onChange={(hex) => onUpdateBlock({ ...block, titleColor: hex })}
                />
                <ColorSwatchInput
                  label="Accent Line Color"
                  value={block.accentColor || "#0F172A"}
                  onChange={(hex) => onUpdateBlock({ ...block, accentColor: hex })}
                />
                <ColorSwatchInput
                  label="Tagline Color"
                  value={block.taglineColor || "#475569"}
                  onChange={(hex) => onUpdateBlock({ ...block, taglineColor: hex })}
                />
                <ColorSwatchInput
                  label="Badge Color"
                  value={block.badgeColor || "#64748B"}
                  onChange={(hex) => onUpdateBlock({ ...block, badgeColor: hex })}
                />
                <ColorSwatchInput
                  label="Metadata Label Color"
                  value={block.labelColor || "#0F172A"}
                  onChange={(hex) => onUpdateBlock({ ...block, labelColor: hex })}
                />
                <ColorSwatchInput
                  label="Metadata Value Color"
                  value={block.valueColor || "#64748B"}
                  onChange={(hex) => onUpdateBlock({ ...block, valueColor: hex })}
                />
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* Fact Highlight Card (Matches media_1794795917678_33e8a730.jpg) */}
        {block.type === "fact-highlight" && (
          <>
            <CollapsibleCard
              title="Card Banner Header"
              isOpen={openSections.factHeader !== false}
              onToggle={() => toggleSection("factHeader")}
            >
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                  Header Title
                </label>
                <input
                  type="text"
                  value={block.headerTitle || "FACT HIGHLIGHT"}
                  onChange={(e) => onUpdateBlock({ ...block, headerTitle: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Header Colors"
              isOpen={openSections.factHeaderColors !== false}
              onToggle={() => toggleSection("factHeaderColors")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ColorSwatchInput
                  label="Header Background"
                  value={block.headerBg || "#008060"}
                  onChange={(hex) => onUpdateBlock({ ...block, headerBg: hex })}
                />
                <ColorSwatchInput
                  label="Header Text"
                  value={block.headerTextColor || "#FFFFFF"}
                  onChange={(hex) => onUpdateBlock({ ...block, headerTextColor: hex })}
                />
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Card Body Colors"
              isOpen={openSections.factBodyColors !== false}
              onToggle={() => toggleSection("factBodyColors")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ColorSwatchInput
                  label="Card Background"
                  value={block.cardBg || "#FFFFFF"}
                  onChange={(hex) => onUpdateBlock({ ...block, cardBg: hex })}
                />
                <ColorSwatchInput
                  label="Card Text Color"
                  value={block.cardTextColor || "#202223"}
                  onChange={(hex) => onUpdateBlock({ ...block, cardTextColor: hex })}
                />
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* Contact Channels Grid (Matches media_1794795986303_02de1119.jpg & 7e0089c8.jpg) */}
        {block.type === "contact-grid" && (() => {
          const channels = block.channels || [
            { type: "Email", label: "EMAIL", value: "support@store.com" },
            { type: "Phone", label: "PHONE", value: "Available via website" },
            { type: "Website", label: "WEBSITE", value: "Official Store" },
            { type: "Headquarters", label: "HEADQUARTERS", value: "Global Operations" },
          ];

          const handleUpdateChannel = (idx, field, val) => {
            const next = channels.map((c, i) => (i === idx ? { ...c, [field]: val } : c));
            onUpdateBlock({ ...block, channels: next });
          };

          const handleRemoveChannel = (idx) => {
            const next = channels.filter((_, i) => i !== idx);
            onUpdateBlock({ ...block, channels: next });
          };

          const handleAddChannel = () => {
            const next = [...channels, { type: "Email", label: "New Channel", value: "Details" }];
            onUpdateBlock({ ...block, channels: next });
          };

          return (
            <>
              <CollapsibleCard
                title="Section Header"
                isOpen={openSections.contactHeader !== false}
                onToggle={() => toggleSection("contactHeader")}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={block.title || "LET'S GET IN TOUCH"}
                      onChange={(e) => onUpdateBlock({ ...block, title: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                      Subtitle / Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={block.subtitle || ""}
                      onChange={(e) => onUpdateBlock({ ...block, subtitle: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                    />
                  </div>
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title="Styling & Colors"
                isOpen={openSections.contactColors !== false}
                onToggle={() => toggleSection("contactColors")}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <ColorSwatchInput
                    label="Icon Color"
                    value={block.iconColor || "#1E293B"}
                    onChange={(hex) => onUpdateBlock({ ...block, iconColor: hex })}
                  />
                  <ColorSwatchInput
                    label="Card Background"
                    value={block.cardBg || "#FFFFFF"}
                    onChange={(hex) => onUpdateBlock({ ...block, cardBg: hex })}
                  />
                  <ColorSwatchInput
                    label="Text Color"
                    value={block.textColor || "#0F172A"}
                    onChange={(hex) => onUpdateBlock({ ...block, textColor: hex })}
                  />
                </div>
              </CollapsibleCard>

              <CollapsibleCard
                title={`Contact Channels (${channels.length})`}
                isOpen={openSections.contactChannels !== false}
                onToggle={() => toggleSection("contactChannels")}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button size="slim" onClick={handleAddChannel}>
                      + Add
                    </Button>
                  </div>

                  {channels.map((ch, ci) => (
                    <div
                      key={ci}
                      style={{
                        padding: "10px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6px",
                        backgroundColor: "#fafafa",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <select
                          value={ch.type || "Email"}
                          onChange={(e) => handleUpdateChannel(ci, "type", e.target.value)}
                          style={{ flex: 1, padding: "5px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px", color: "#18181b" }}
                        >
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="Website">Website</option>
                          <option value="Headquarters">Headquarters</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveChannel(ci)}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: "4px" }}
                        >
                          <Icon source={DeleteIcon} tone="critical" />
                        </button>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#6b7280" }}>Label</label>
                        <input
                          type="text"
                          value={ch.label || ""}
                          onChange={(e) => handleUpdateChannel(ci, "label", e.target.value)}
                          style={{ width: "100%", padding: "5px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px", color: "#18181b" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11px", color: "#6b7280" }}>Value / Information</label>
                        <input
                          type="text"
                          value={ch.value || ""}
                          onChange={(e) => handleUpdateChannel(ci, "value", e.target.value)}
                          style={{ width: "100%", padding: "5px 8px", borderRadius: "4px", border: "1px solid #cbd5e1", fontSize: "12px", color: "#18181b" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleCard>
            </>
          );
        })()}

        {/* Social Channels Strip (Matches media_1794796018810_36d66dfa.jpg) */}
        {block.type === "social-strip" && (
          <>
            <CollapsibleCard
              title="Capsule & Header"
              isOpen={openSections.socialCapsule !== false}
              onToggle={() => toggleSection("socialCapsule")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Checkbox
                  label="Show Header Label"
                  checked={block.showLabel !== false}
                  onChange={(val) => onUpdateBlock({ ...block, showLabel: val })}
                />

                {block.showLabel !== false && (
                  <div>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                      Header Label
                    </label>
                    <input
                      type="text"
                      value={block.label || "Follow us:"}
                      onChange={(e) => onUpdateBlock({ ...block, label: e.target.value })}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Alignment
                  </label>
                  <select
                    value={block.align || "Center"}
                    onChange={(e) => onUpdateBlock({ ...block, align: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Center">Center</option>
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                  </select>
                </div>

                <div>
                  <SliderSetting
                    label="Capsule Width"
                    value={block.capsuleWidth || 320}
                    min={300}
                    max={750}
                    unit="px"
                    onChange={(val) => onUpdateBlock({ ...block, capsuleWidth: val })}
                  />
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    Adjust width from 300px (compact) to 750px (wide banner)
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#18181b", marginBottom: "4px" }}>
                    Icon Theme
                  </label>
                  <select
                    value={block.theme || "Brand Colors on Hover"}
                    onChange={(e) => onUpdateBlock({ ...block, theme: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #cbd5e1", color: "#18181b" }}
                  >
                    <option value="Brand Colors on Hover">Brand Colors on Hover</option>
                    <option value="Monochrome">Monochrome</option>
                    <option value="Color Fill">Color Fill</option>
                  </select>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>
                    Choose how social icons are highlighted when hovered or viewed.
                  </span>
                </div>
              </div>
            </CollapsibleCard>

            <CollapsibleCard
              title="Appearance & Colors"
              isOpen={openSections.socialColors !== false}
              onToggle={() => toggleSection("socialColors")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <ColorSwatchInput
                  label="Capsule Background"
                  value={block.capsuleBg || "#F8FAFC"}
                  onChange={(hex) => onUpdateBlock({ ...block, capsuleBg: hex })}
                />
                <ColorSwatchInput
                  label="Border Color"
                  value={block.borderColor || "#E2E8F0"}
                  onChange={(hex) => onUpdateBlock({ ...block, borderColor: hex })}
                />
                <ColorSwatchInput
                  label="Label Text Color"
                  value={block.labelColor || "#334155"}
                  onChange={(hex) => onUpdateBlock({ ...block, labelColor: hex })}
                />
              </div>
            </CollapsibleCard>
          </>
        )}

        {/* --- RESPONSIVE SECTION --- */}
        <CollapsibleCard
          title="Responsive"
          isOpen={openSections.responsive !== false}
          onToggle={() => toggleSection("responsive")}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Checkbox
              label="Hide on Desktop/Laptop"
              checked={Boolean(block.hideDesktop)}
              onChange={(val) => handleResponsiveChange("hideDesktop", val)}
            />
            <Checkbox
              label="Hide on Tablet"
              checked={Boolean(block.hideTablet)}
              onChange={(val) => handleResponsiveChange("hideTablet", val)}
            />
            <Checkbox
              label="Hide on Mobile"
              checked={Boolean(block.hideMobile)}
              onChange={(val) => handleResponsiveChange("hideMobile", val)}
            />
          </div>
        </CollapsibleCard>
      </div>
    </div>
  );
}

export default ElementInspectorSidebar;
