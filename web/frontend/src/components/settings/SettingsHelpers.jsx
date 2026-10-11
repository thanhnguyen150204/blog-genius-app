import {
  InlineStack,
  Text,
  Icon,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@shopify/polaris-icons";

export function AccordionHeader({ title, isOpen, onToggle }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={{
        cursor: "pointer",
        userSelect: "none",
        width: "100%",
        padding: "14px 16px",
      }}
    >
      <InlineStack align="space-between" blockAlign="center">
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          {title}
        </Text>
        <Icon source={isOpen ? ChevronUpIcon : ChevronDownIcon} tone="subdued" />
      </InlineStack>
    </div>
  );
}

import ShopifyColorPicker from "../common/ShopifyColorPicker";

export const ColorPickerInput = ShopifyColorPicker;

export function ToggleSwitch({ label, checked, onChange }) {
  return (
    <InlineStack align="space-between" blockAlign="center">
      <Text variant="bodySm">{label}</Text>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: checked ? "#f97316" : "#4b5563",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          padding: 0,
          outline: "none",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "22px" : "2px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </button>
    </InlineStack>
  );
}

export function ImagePlaceholderSvg({ style = {}, borderRadius = "0px" }) {
  return (
    <div
      style={{
        backgroundColor: "#a6a6a6",
        borderRadius,
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "120px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      >
        <path
          d="M0,200 L0,150 L50,90 L90,135 L145,65 L200,125 L200,200 Z"
          fill="#808080"
        />
      </svg>
    </div>
  );
}

export function VerticalAlignTopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="4" x2="16" y2="4" strokeWidth="2" />
      <path d="M10 16V8M7 11l3-3 3 3" />
    </svg>
  );
}

export function VerticalAlignCenterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="10" x2="17" y2="10" strokeWidth="2" />
      <path d="M10 4v4M8 6l2 2 2-2M10 16v-4M8 14l2-2 2 2" />
    </svg>
  );
}

export function VerticalAlignBottomIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="16" x2="16" y2="16" strokeWidth="2" />
      <path d="M10 4v8M7 9l3 3 3-3" />
    </svg>
  );
}

export function ImagePosLeftIcon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          width: "22px",
          height: "16px",
          borderRadius: "3px",
          border: "1.5px solid #8c9196",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <span style={{ width: "50%", height: "100%", backgroundColor: "#8c9196", display: "inline-block" }} />
        <span style={{ width: "50%", height: "100%", backgroundColor: "#ffffff", display: "inline-block" }} />
      </span>
    </span>
  );
}

export function ImagePosRightIcon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          width: "22px",
          height: "16px",
          borderRadius: "3px",
          border: "1.5px solid #8c9196",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <span style={{ width: "50%", height: "100%", backgroundColor: "#ffffff", display: "inline-block" }} />
        <span style={{ width: "50%", height: "100%", backgroundColor: "#8c9196", display: "inline-block" }} />
      </span>
    </span>
  );
}

// Option Constants
export const LANGUAGE_OPTIONS = [
  { label: "English(US)", value: "en-US" },
  { label: "English(UK)", value: "en-GB" },
  { label: "Vietnamese", value: "vi-VN" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Spanish", value: "es-ES" },
  { label: "Japanese", value: "ja-JP" },
];

export const TARGET_MARKET_OPTIONS = [
  { label: "None", value: "none" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Vietnam", value: "vn" },
  { label: "Global", value: "global" },
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Japan", value: "jp" },
];

export const AI_PROVIDER_OPTIONS = [
  { label: "Anthropic", value: "anthropic" },
  { label: "OpenAI", value: "openai" },
  { label: "Google", value: "google" },
  { label: "DeepSeek", value: "deepseek" },
  { label: "Qwen", value: "qwen" },
];

export const AI_PROVIDER_METADATA = {
  openai: {
    name: "OpenAI",
    keyLabel: "Your OpenAI API key",
  },
  anthropic: {
    name: "Anthropic",
    keyLabel: "Your Anthropic API key",
  },
  google: {
    name: "Google Gemini",
    keyLabel: "Your Google Gemini API key",
  },
  deepseek: {
    name: "DeepSeek",
    keyLabel: "Your DeepSeek API key",
  },
  qwen: {
    name: "Qwen",
    keyLabel: "Your Qwen API key",
  },
};

export const COLOR_MODE_OPTIONS = [
  { label: "Unset", value: "unset" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Custom", value: "custom" },
];

export const HEADING_TAG_OPTIONS = [
  { label: "H1", value: "H1" },
  { label: "H2", value: "H2" },
  { label: "H3", value: "H3" },
  { label: "H4", value: "H4" },
  { label: "H5", value: "H5" },
  { label: "H6", value: "H6" },
];

export const TABLE_BORDER_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Solid", value: "solid" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

export const IMAGE_SIZE_OPTIONS = [
  { label: "Full width (100%)", value: "full" },
  { label: "Original size", value: "original" },
  { label: "Large (75%)", value: "75%" },
  { label: "Medium (50%)", value: "50%" },
  { label: "Small (25%)", value: "25%" },
];

export const IMAGE_FIT_OPTIONS = [
  { label: "Cover", value: "cover" },
  { label: "Contain", value: "contain" },
  { label: "Fill", value: "fill" },
  { label: "None", value: "none" },
  { label: "Scale-down", value: "scale-down" },
];

export const IMAGE_POSITION_OPTIONS = [
  { label: "Unset", value: "unset" },
  { label: "Top", value: "top" },
  { label: "Center", value: "center" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
];

export const COLLECTION_LAYOUT_OPTIONS = [
  { label: "Side by Side", value: "side-by-side" },
  { label: "Stacked", value: "stacked" },
];

export const COLLECTION_RATIO_OPTIONS = [
  { label: "Standard 4:3", value: "4:3" },
  { label: "Square 1:1", value: "1:1" },
  { label: "Landscape 16:9", value: "16:9" },
  { label: "Portrait 3:4", value: "3:4" },
];

export const HOVER_ANIMATION_OPTIONS = [
  { label: "Slide Up", value: "slide-up" },
  { label: "Fade In", value: "fade-in" },
  { label: "Zoom In", value: "zoom-in" },
  { label: "None", value: "none" },
];

export const BUTTON_FONT_WEIGHT_OPTIONS = [
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi-bold", value: "600" },
  { label: "Bold", value: "700" },
];

export const BUTTON_TEXT_TRANSFORM_OPTIONS = [
  { label: "Normal", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

export const BUTTON_STYLE_OPTIONS = [
  { label: "Fill", value: "fill" },
  { label: "Outline", value: "outline" },
  { label: "Soft", value: "soft" },
];

export const IMAGE_TEXT_SIZE_OPTIONS = [
  { label: "Product thumbnail (240px)", value: "240" },
  { label: "Medium (360px)", value: "360" },
  { label: "Large (480px)", value: "480" },
  { label: "Original", value: "original" },
];

export const TOC_LIST_STYLE_OPTIONS = [
  { label: "None (Text only)", value: "none" },
  { label: "Numbered (1, 2, 3...)", value: "numbered" },
  { label: "Bulleted (•, •, •...)", value: "bulleted" },
  { label: "Roman (I, II, III...)", value: "roman" },
];

export const TOC_INDENTATION_OPTIONS = [
  { label: "Hierarchical (Indented)", value: "hierarchical" },
  { label: "Flat (No indent)", value: "flat" },
];

export const TOC_LAYOUT_OPTIONS = [
  { label: "1 Column", value: "1-col" },
  { label: "2 Columns", value: "2-col" },
  { label: "3 Columns", value: "3-col" },
];

export const TOC_HEADING_TYPES = ["h1", "h2", "h3", "h4", "h5", "h6"];

export const INITIAL_LOGS = [
  "08-10-2026 22:26:15: Suggest keywords - Blog Builder: -3 credits",
  "08-10-2026 22:25:12: Suggest keywords - Blog Builder: -3 credits",
  "07-10-2026 21:21:30: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 21:19:22: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 21:14:52: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 19:42:10: Generate full article - Blog Builder: -10 credits",
  "06-10-2026 14:05:32: Generate SEO Meta & FAQ - Blog Builder: -5 credits",
  "05-10-2026 11:18:04: Generate featured AI image - Blog Builder: -5 credits",
];

export const SETTINGS_TABS = [
  { id: "general", content: "General Settings" },
  { id: "custom_assets", content: "Custom Assets" },
];

