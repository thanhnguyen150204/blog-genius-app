import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Checkbox,
  TextField,
  Select,
  RangeSlider,
  Divider,
} from "@shopify/polaris";
import {
  AccordionHeader,
  ColorPickerInput,
  ImagePlaceholderSvg,
  COLLECTION_LAYOUT_OPTIONS,
  COLLECTION_RATIO_OPTIONS,
} from "../SettingsHelpers";

export default function CollectionCardStyleItem({
  isOpen,
  onToggle,
  collLayout,
  setCollLayout,
  collImageWidth,
  setCollImageWidth,
  collImageRatio,
  setCollImageRatio,
  collImageCornerRadius,
  setCollImageCornerRadius,
  collTitleFontSize,
  setCollTitleFontSize,
  collTitleColor,
  setCollTitleColor,
  collShowDescription,
  setCollShowDescription,
  collDescFontSize,
  setCollDescFontSize,
  collDescColor,
  setCollDescColor,
  collContentAlignment,
  setCollContentAlignment,
  collButtonLabel,
  setCollButtonLabel,
  collButtonBgColor,
  setCollButtonBgColor,
  collButtonTextColor,
  setCollButtonTextColor,
  collButtonCornerRadius,
  setCollButtonCornerRadius,
  collButtonWidth,
  setCollButtonWidth,
  collCardRadius,
  setCollCardRadius,
  collTransparentBg,
  setCollTransparentBg,
}) {
  return (
    <div>
      <AccordionHeader
        title="Collection Card"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="collection-card-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            {/* Layout */}
            <Select
              label="Layout"
              options={COLLECTION_LAYOUT_OPTIONS}
              value={collLayout}
              onChange={setCollLayout}
            />

            {/* Image Settings */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Image Settings
              </Text>
              <RangeSlider
                label={`Image Width: ${collImageWidth}%`}
                value={collImageWidth}
                onChange={setCollImageWidth}
                min={20}
                max={80}
                suffix={<Text variant="bodySm" tone="subdued">%</Text>}
              />
              <Select
                label="Image Ratio"
                options={COLLECTION_RATIO_OPTIONS}
                value={collImageRatio}
                onChange={setCollImageRatio}
              />
              <RangeSlider
                label={`Image Corner Radius: ${collImageCornerRadius}px`}
                value={collImageCornerRadius}
                onChange={setCollImageCornerRadius}
                min={0}
                max={32}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
            </BlockStack>

            <Divider />

            {/* Typography */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Typography
              </Text>
              <RangeSlider
                label={`Title Font Size: ${collTitleFontSize}px`}
                value={collTitleFontSize}
                onChange={setCollTitleFontSize}
                min={14}
                max={36}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
              <ColorPickerInput
                label="Title Color"
                value={collTitleColor}
                onChange={setCollTitleColor}
              />
              <Checkbox
                label="Show Description"
                checked={collShowDescription}
                onChange={setCollShowDescription}
              />
              {collShowDescription && (
                <>
                  <RangeSlider
                    label={`Description Font Size: ${collDescFontSize}px`}
                    value={collDescFontSize}
                    onChange={setCollDescFontSize}
                    min={10}
                    max={24}
                    suffix={<Text variant="bodySm" tone="subdued">px</Text>}
                  />
                  <ColorPickerInput
                    label="Description Color"
                    value={collDescColor}
                    onChange={setCollDescColor}
                  />
                </>
              )}

              <BlockStack gap="100">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodySm">Content Alignment</Text>
                  <ButtonGroup variant="segmented">
                    <Button
                      pressed={collContentAlignment === "left"}
                      onClick={() => setCollContentAlignment("left")}
                    >
                      Left
                    </Button>
                    <Button
                      pressed={collContentAlignment === "center"}
                      onClick={() => setCollContentAlignment("center")}
                    >
                      Center
                    </Button>
                    <Button
                      pressed={collContentAlignment === "right"}
                      onClick={() => setCollContentAlignment("right")}
                    >
                      Right
                    </Button>
                  </ButtonGroup>
                </InlineStack>
              </BlockStack>
            </BlockStack>

            <Divider />

            {/* Button Settings */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Button Settings
              </Text>
              <TextField
                label="Button Label"
                value={collButtonLabel}
                onChange={setCollButtonLabel}
                autoComplete="off"
              />
              <ColorPickerInput
                label="Button Background"
                value={collButtonBgColor}
                onChange={setCollButtonBgColor}
              />
              <ColorPickerInput
                label="Button Text Color"
                value={collButtonTextColor}
                onChange={setCollButtonTextColor}
              />
              <RangeSlider
                label={`Button Corner Radius: ${collButtonCornerRadius}px`}
                value={collButtonCornerRadius}
                onChange={setCollButtonCornerRadius}
                min={0}
                max={24}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
              <BlockStack gap="100">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodySm">Button Width</Text>
                  <ButtonGroup variant="segmented">
                    <Button
                      pressed={collButtonWidth === "auto"}
                      onClick={() => setCollButtonWidth("auto")}
                    >
                      Auto
                    </Button>
                    <Button
                      pressed={collButtonWidth === "full"}
                      onClick={() => setCollButtonWidth("full")}
                    >
                      Full
                    </Button>
                  </ButtonGroup>
                </InlineStack>
              </BlockStack>
            </BlockStack>

            <Divider />

            {/* Card Settings */}
            <BlockStack gap="300">
              <Text variant="bodyMd" fontWeight="semibold">
                Card Settings
              </Text>
              <RangeSlider
                label={`Card Radius: ${collCardRadius}px`}
                value={collCardRadius}
                onChange={setCollCardRadius}
                min={0}
                max={32}
                suffix={<Text variant="bodySm" tone="subdued">px</Text>}
              />
              <Checkbox
                label="Transparent Background"
                checked={collTransparentBg}
                onChange={setCollTransparentBg}
              />
            </BlockStack>

            {/* Collection Card Live Preview Canvas */}
            <div
              style={{
                backgroundColor: collTransparentBg ? "transparent" : "#ffffff",
                borderRadius: `${collCardRadius}px`,
                border: "1px solid #e1e3e5",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {collLayout === "side-by-side" ? (
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "center",
                  }}
                >
                  {/* Left Image Column */}
                  <div
                    style={{
                      width: `${collImageWidth}%`,
                      aspectRatio:
                        collImageRatio === "1:1"
                          ? "1 / 1"
                          : collImageRatio === "16:9"
                          ? "16 / 9"
                          : collImageRatio === "3:4"
                          ? "3 / 4"
                          : "4 / 3",
                      borderRadius: `${collImageCornerRadius}px`,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <ImagePlaceholderSvg borderRadius={`${collImageCornerRadius}px`} />
                  </div>

                  {/* Right Content Column */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        collContentAlignment === "center"
                          ? "center"
                          : collContentAlignment === "right"
                          ? "flex-end"
                          : "flex-start",
                      textAlign: collContentAlignment,
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: `${collTitleFontSize}px`,
                        fontWeight: "bold",
                        color: collTitleColor,
                        lineHeight: "1.2",
                      }}
                    >
                      Collection Title
                    </div>

                    {collShowDescription && (
                      <div
                        style={{
                          fontSize: `${collDescFontSize}px`,
                          color: collDescColor,
                          lineHeight: "1.4",
                        }}
                      >
                        Collection Description
                      </div>
                    )}

                    <button
                      type="button"
                      style={{
                        backgroundColor: collButtonBgColor,
                        color: collButtonTextColor,
                        border: "none",
                        borderRadius: `${collButtonCornerRadius}px`,
                        padding: "10px 24px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: collButtonWidth === "full" ? "100%" : "auto",
                        marginTop: "8px",
                        transition: "opacity 0.2s ease",
                      }}
                    >
                      {collButtonLabel || "Shop Collection"}
                    </button>
                  </div>
                </div>
              ) : (
                /* Stacked Layout */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio:
                        collImageRatio === "1:1"
                          ? "1 / 1"
                          : collImageRatio === "16:9"
                          ? "16 / 9"
                          : collImageRatio === "3:4"
                          ? "3 / 4"
                          : "4 / 3",
                      borderRadius: `${collImageCornerRadius}px`,
                      overflow: "hidden",
                    }}
                  >
                    <ImagePlaceholderSvg borderRadius={`${collImageCornerRadius}px`} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        collContentAlignment === "center"
                          ? "center"
                          : collContentAlignment === "right"
                          ? "flex-end"
                          : "flex-start",
                      textAlign: collContentAlignment,
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: `${collTitleFontSize}px`,
                        fontWeight: "bold",
                        color: collTitleColor,
                        lineHeight: "1.2",
                      }}
                    >
                      Collection Title
                    </div>

                    {collShowDescription && (
                      <div
                        style={{
                          fontSize: `${collDescFontSize}px`,
                          color: collDescColor,
                          lineHeight: "1.4",
                        }}
                      >
                        Collection Description
                      </div>
                    )}

                    <button
                      type="button"
                      style={{
                        backgroundColor: collButtonBgColor,
                        color: collButtonTextColor,
                        border: "none",
                        borderRadius: `${collButtonCornerRadius}px`,
                        padding: "10px 24px",
                        fontWeight: "600",
                        fontSize: "14px",
                        cursor: "pointer",
                        width: collButtonWidth === "full" ? "100%" : "auto",
                        marginTop: "6px",
                      }}
                    >
                      {collButtonLabel || "Shop Collection"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
