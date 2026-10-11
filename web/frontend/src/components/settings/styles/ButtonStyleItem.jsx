import { useState } from "react";
import {
  Collapsible,
  Box,
  BlockStack,
  Text,
  Button,
  ButtonGroup,
  Select,
  RangeSlider,
  Divider,
} from "@shopify/polaris";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@shopify/polaris-icons";
import {
  AccordionHeader,
  ColorPickerInput,
  ToggleSwitch,
  BUTTON_FONT_WEIGHT_OPTIONS,
  BUTTON_TEXT_TRANSFORM_OPTIONS,
  BUTTON_STYLE_OPTIONS,
} from "../SettingsHelpers";

export default function ButtonStyleItem({
  isOpen,
  onToggle,
  btnOpenNewTab,
  setBtnOpenNewTab,
  btnWidthMode,
  setBtnWidthMode,
  btnPosition,
  setBtnPosition,
  btnPaddingV,
  setBtnPaddingV,
  btnPaddingH,
  setBtnPaddingH,
  btnTextAlign,
  setBtnTextAlign,
  btnFontSize,
  setBtnFontSize,
  btnFontWeight,
  setBtnFontWeight,
  btnTextTransform,
  setBtnTextTransform,
  btnLetterSpacing,
  setBtnLetterSpacing,
  btnStyle,
  setBtnStyle,
  btnBorderRadius,
  setBtnBorderRadius,
  btnBorderWidth,
  setBtnBorderWidth,
  btnBgColor,
  setBtnBgColor,
  btnTextColor,
  setBtnTextColor,
  btnBorderColor,
  setBtnBorderColor,
  btnHoverBgColor,
  setBtnHoverBgColor,
  btnHoverTextColor,
  setBtnHoverTextColor,
  btnHoverBorderColor,
  setBtnHoverBorderColor,
}) {
  const [isBtnPreviewHovered, setIsBtnPreviewHovered] = useState(false);

  return (
    <div>
      <AccordionHeader
        title="Button"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="button-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <ToggleSwitch
              label="Open link in new tab"
              checked={btnOpenNewTab}
              onChange={setBtnOpenNewTab}
            />

            {/* Button Sizing */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Button Sizing
              </Text>
              <BlockStack gap="100">
                <Text variant="bodySm" tone="subdued">Width mode</Text>
                <ButtonGroup fullWidth variant="segmented">
                  <Button
                    pressed={btnWidthMode === "auto"}
                    onClick={() => setBtnWidthMode("auto")}
                  >
                    Auto
                  </Button>
                  <Button
                    pressed={btnWidthMode === "full"}
                    onClick={() => setBtnWidthMode("full")}
                  >
                    Full Width
                  </Button>
                  <Button
                    pressed={btnWidthMode === "custom"}
                    onClick={() => setBtnWidthMode("custom")}
                  >
                    Custom
                  </Button>
                </ButtonGroup>
              </BlockStack>

              <BlockStack gap="100">
                <Text variant="bodySm" tone="subdued">Button Position</Text>
                <ButtonGroup fullWidth variant="segmented">
                  <Button
                    pressed={btnPosition === "left"}
                    onClick={() => setBtnPosition("left")}
                    icon={TextAlignLeftIcon}
                  />
                  <Button
                    pressed={btnPosition === "center"}
                    onClick={() => setBtnPosition("center")}
                    icon={TextAlignCenterIcon}
                  />
                  <Button
                    pressed={btnPosition === "right"}
                    onClick={() => setBtnPosition("right")}
                    icon={TextAlignRightIcon}
                  />
                </ButtonGroup>
              </BlockStack>

              <RangeSlider
                label={`Padding Vertical: ${btnPaddingV}px`}
                value={btnPaddingV}
                onChange={setBtnPaddingV}
                min={4}
                max={30}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />

              <RangeSlider
                label={`Padding Horizontal: ${btnPaddingH}px`}
                value={btnPaddingH}
                onChange={setBtnPaddingH}
                min={8}
                max={60}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
            </BlockStack>

            <Divider />

            {/* Typography */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Typography
              </Text>
              <BlockStack gap="100">
                <Text variant="bodySm" tone="subdued">Text Alignment</Text>
                <ButtonGroup fullWidth variant="segmented">
                  <Button
                    pressed={btnTextAlign === "left"}
                    onClick={() => setBtnTextAlign("left")}
                    icon={TextAlignLeftIcon}
                  />
                  <Button
                    pressed={btnTextAlign === "center"}
                    onClick={() => setBtnTextAlign("center")}
                    icon={TextAlignCenterIcon}
                  />
                  <Button
                    pressed={btnTextAlign === "right"}
                    onClick={() => setBtnTextAlign("right")}
                    icon={TextAlignRightIcon}
                  />
                </ButtonGroup>
              </BlockStack>

              <RangeSlider
                label={`Font size: ${btnFontSize}px`}
                value={btnFontSize}
                onChange={setBtnFontSize}
                min={10}
                max={24}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />

              <Select
                label="Font weight"
                options={BUTTON_FONT_WEIGHT_OPTIONS}
                value={btnFontWeight}
                onChange={setBtnFontWeight}
              />

              <Select
                label="Text transform"
                options={BUTTON_TEXT_TRANSFORM_OPTIONS}
                value={btnTextTransform}
                onChange={setBtnTextTransform}
              />

              <RangeSlider
                label={`Letter spacing: ${btnLetterSpacing}px`}
                value={btnLetterSpacing}
                onChange={setBtnLetterSpacing}
                min={0}
                max={10}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
            </BlockStack>

            <Divider />

            {/* Border & Corners */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Border & Corners
              </Text>
              <Select
                label="Button style"
                options={BUTTON_STYLE_OPTIONS}
                value={btnStyle}
                onChange={setBtnStyle}
              />

              <RangeSlider
                label={`Border radius: ${btnBorderRadius}px`}
                value={btnBorderRadius}
                onChange={setBtnBorderRadius}
                min={0}
                max={30}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />

              <RangeSlider
                label={`Border width: ${btnBorderWidth}px`}
                value={btnBorderWidth}
                onChange={setBtnBorderWidth}
                min={0}
                max={10}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
            </BlockStack>

            <Divider />

            {/* Colors */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Colors
              </Text>
              <ColorPickerInput
                label="Background color"
                value={btnBgColor}
                onChange={setBtnBgColor}
              />
              <ColorPickerInput
                label="Text color"
                value={btnTextColor}
                onChange={setBtnTextColor}
              />
              <ColorPickerInput
                label="Border color"
                value={btnBorderColor}
                onChange={setBtnBorderColor}
              />
            </BlockStack>

            <Divider />

            {/* Hover Colors */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Hover Colors
              </Text>
              <ColorPickerInput
                label="Hover Background"
                value={btnHoverBgColor}
                onChange={setBtnHoverBgColor}
              />
              <ColorPickerInput
                label="Hover Text color"
                value={btnHoverTextColor}
                onChange={setBtnHoverTextColor}
              />
              <ColorPickerInput
                label="Hover Border color"
                value={btnHoverBorderColor}
                onChange={setBtnHoverBorderColor}
              />
            </BlockStack>

            {/* Button Live Preview Canvas */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e1e3e5",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    btnPosition === "center"
                      ? "center"
                      : btnPosition === "right"
                      ? "flex-end"
                      : "flex-start",
                  width: "100%",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setIsBtnPreviewHovered(true)}
                  onMouseLeave={() => setIsBtnPreviewHovered(false)}
                  style={{
                    backgroundColor:
                      btnStyle === "outline"
                        ? "transparent"
                        : isBtnPreviewHovered
                        ? btnHoverBgColor
                        : btnBgColor,
                    color: isBtnPreviewHovered ? btnHoverTextColor : btnTextColor,
                    border: `${btnBorderWidth}px solid ${
                      isBtnPreviewHovered ? btnHoverBorderColor : btnBorderColor
                    }`,
                    borderRadius: `${btnBorderRadius}px`,
                    padding: `${btnPaddingV}px ${btnPaddingH}px`,
                    fontSize: `${btnFontSize}px`,
                    fontWeight: btnFontWeight,
                    textTransform: btnTextTransform,
                    letterSpacing: `${btnLetterSpacing}px`,
                    textAlign: btnTextAlign,
                    cursor: "pointer",
                    width:
                      btnWidthMode === "full"
                        ? "100%"
                        : btnWidthMode === "custom"
                        ? "260px"
                        : "auto",
                    transition: "all 0.2s ease",
                  }}
                >
                  Button Label
                </button>
              </div>
            </div>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
