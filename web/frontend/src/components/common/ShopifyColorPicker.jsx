import { useState, useCallback, useMemo } from "react";
import {
  Popover,
  ColorPicker,
  TextField,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Icon,
  Tooltip,
  Box,
  hsbToHex,
  rgbToHsb,
  hexToRgb,
  hsbToRgb,
  rgbToHex,
} from "@shopify/polaris";
import { EyeDropperIcon, ChevronDownIcon } from "@shopify/polaris-icons";

/**
 * Safely parses any HEX string to HSB format.
 */
function safeHexToHsb(hexColor) {
  try {
    if (!hexColor || typeof hexColor !== "string") {
      return { hue: 0, saturation: 0, brightness: 0 };
    }
    let clean = hexColor.trim();
    if (!clean.startsWith("#")) clean = `#${clean}`;
    if (clean.length === 4) {
      clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      return { hue: 0, saturation: 0, brightness: 0 };
    }
    const rgb = hexToRgb(clean);
    return rgbToHsb(rgb);
  } catch {
    return { hue: 0, saturation: 0, brightness: 0 };
  }
}

/**
 * Safely parses any HEX string to RGB format.
 */
function safeHexToRgb(hexColor) {
  try {
    if (!hexColor || typeof hexColor !== "string") {
      return { red: 0, green: 0, blue: 0 };
    }
    let clean = hexColor.trim();
    if (!clean.startsWith("#")) clean = `#${clean}`;
    if (clean.length === 4) {
      clean = `#${clean[1]}${clean[1]}${clean[2]}${clean[2]}${clean[3]}${clean[3]}`;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(clean)) {
      return { red: 0, green: 0, blue: 0 };
    }
    return hexToRgb(clean);
  } catch {
    return { red: 0, green: 0, blue: 0 };
  }
}

export default function ShopifyColorPicker({
  label,
  value = "#000000",
  onChange,
  allowAlpha = false,
}) {
  const [popoverActive, setPopoverActive] = useState(false);
  const [formatMode, setFormatMode] = useState("rgb"); 

  const currentColorHex = value || "#000000";
  const hsbColor = useMemo(() => safeHexToHsb(currentColorHex), [currentColorHex]);
  const rgbColor = useMemo(() => safeHexToRgb(currentColorHex), [currentColorHex]);

  const togglePopover = useCallback(
    () => setPopoverActive((prev) => !prev),
    []
  );

  const handleHsbChange = useCallback(
    (newHsb) => {
      try {
        const hex = hsbToHex(newHsb);
        if (onChange) onChange(hex.toLowerCase());
      } catch (err) {
        console.error("Failed to convert HSB to HEX", err);
      }
    },
    [onChange]
  );

  const handleRgbChange = (channel, val) => {
    const num = Math.max(0, Math.min(255, parseInt(val, 10) || 0));
    const nextRgb = {
      ...rgbColor,
      [channel]: num,
    };
    try {
      const hex = rgbToHex(nextRgb);
      if (onChange) onChange(hex.toLowerCase());
    } catch (err) {
      console.error("Failed to convert RGB to HEX", err);
    }
  };

  const handleHexInputChange = (val) => {
    let clean = val.trim();
    if (!clean.startsWith("#")) clean = `#${clean}`;
    if (onChange) onChange(clean);
  };

  const handleEyeDropper = async () => {
    if (window.EyeDropper) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex && onChange) {
          onChange(result.sRGBHex.toLowerCase());
        }
      } catch {
        // User cancelled picker
      }
    } else {
      alert("EyeDropper is supported in Chrome, Edge, and Opera desktop browsers.");
    }
  };

  const activator = (
    <InlineStack gap="200" blockAlign="center">
      <div
        role="button"
        tabIndex={0}
        onClick={togglePopover}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePopover();
          }
        }}
        aria-label={`Select color, current is ${currentColorHex}`}
        style={{
          width: "38px",
          height: "36px",
          borderRadius: "6px",
          border: "1px solid #d4d4d8",
          backgroundColor: currentColorHex,
          cursor: "pointer",
          flexShrink: 0,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
          transition: "transform 0.1s ease, border-color 0.1s ease",
        }}
      />
      <div style={{ width: "110px" }}>
        <TextField
          value={currentColorHex}
          onChange={handleHexInputChange}
          autoComplete="off"
          placeholder="#000000"
        />
      </div>
    </InlineStack>
  );

  return (
    <BlockStack gap="100">
      {label && (
        <Text variant="bodySm" tone="subdued">
          {label}
        </Text>
      )}

      <Popover
        active={popoverActive}
        activator={activator}
        onClose={togglePopover}
        preferredAlignment="left"
        preferredPosition="below"
      >
        <Box padding="300">
          <BlockStack gap="300">
              <ColorPicker
                color={hsbColor}
                onChange={handleHsbChange}
                allowAlpha={allowAlpha}
              />
          </BlockStack>
        </Box>
      </Popover>
    </BlockStack>
  );
}
