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
  Icon,
} from "@shopify/polaris";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@shopify/polaris-icons";
import {
  AccordionHeader,
  ColorPickerInput,
  ImagePlaceholderSvg,
  HOVER_ANIMATION_OPTIONS,
} from "../SettingsHelpers";

export default function ProductGridStyleItem({
  isOpen,
  onToggle,
  gridMaxProducts,
  setGridMaxProducts,
  gridShowPrice,
  setGridShowPrice,
  gridTransparentBg,
  setGridTransparentBg,
  gridShowBtnHover,
  setGridShowBtnHover,
  gridBtnLabel,
  setGridBtnLabel,
  gridBtnBgColor,
  setGridBtnBgColor,
  gridBtnTextColor,
  setGridBtnTextColor,
  gridBtnRadius,
  setGridBtnRadius,
  gridHoverAnimation,
  setGridHoverAnimation,
  gridAlignment,
  setGridAlignment,
  gridTitle,
  setGridTitle,
  gridTitleColor,
  setGridTitleColor,
}) {
  return (
    <div>
      <AccordionHeader
        title="Product Grid"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="product-grid-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <RangeSlider
              label="Maximum number of products to show"
              value={gridMaxProducts}
              onChange={setGridMaxProducts}
              min={2}
              max={12}
              step={1}
            />

            <Checkbox
              label="Show product price"
              checked={gridShowPrice}
              onChange={setGridShowPrice}
            />

            <Checkbox
              label="Transparent background"
              checked={gridTransparentBg}
              onChange={setGridTransparentBg}
            />

            <Checkbox
              label="Show button on hover"
              checked={gridShowBtnHover}
              onChange={setGridShowBtnHover}
            />

            <TextField
              label="Button label"
              value={gridBtnLabel}
              onChange={setGridBtnLabel}
              autoComplete="off"
            />

            <ColorPickerInput
              label="Button Background Color"
              value={gridBtnBgColor}
              onChange={setGridBtnBgColor}
            />

            <ColorPickerInput
              label="Button Text Color"
              value={gridBtnTextColor}
              onChange={setGridBtnTextColor}
            />

            <RangeSlider
              label="Button Corner Radius"
              value={gridBtnRadius}
              onChange={setGridBtnRadius}
              min={0}
              max={24}
              suffix={<Text variant="bodySm" tone="subdued">px</Text>}
            />

            <Select
              label="Hover Animation"
              options={HOVER_ANIMATION_OPTIONS}
              value={gridHoverAnimation}
              onChange={setGridHoverAnimation}
            />

            <BlockStack gap="100">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodySm">Content Alignment</Text>
                <ButtonGroup variant="segmented">
                  <Button
                    pressed={gridAlignment === "center"}
                    onClick={() => setGridAlignment("center")}
                  >
                    Center
                  </Button>
                  <Button
                    pressed={gridAlignment === "left"}
                    onClick={() => setGridAlignment("left")}
                  >
                    Left
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </BlockStack>

            <TextField
              label="Title"
              value={gridTitle}
              onChange={setGridTitle}
              autoComplete="off"
            />

            <ColorPickerInput
              label="Title color"
              value={gridTitleColor}
              onChange={setGridTitleColor}
            />

            {/* Product Grid Live Preview Canvas */}
            <div
              style={{
                backgroundColor: gridTransparentBg ? "transparent" : "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e1e3e5",
                padding: "24px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: gridTitleColor,
                  textAlign: gridAlignment,
                  marginBottom: "20px",
                }}
              >
                {gridTitle || "Featured Products"}
              </div>

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Left Navigation Chevron */}
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    left: "-8px",
                    zIndex: 2,
                    background: "#ffffff",
                    border: "1px solid #e1e3e5",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <Icon source={ChevronLeftIcon} tone="base" />
                </button>

                {/* Products Carousel */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    width: "100%",
                    overflow: "hidden",
                    padding: "4px 8px",
                  }}
                >
                  {[
                    { id: 1, title: "Product 1", price: "$100.00" },
                    { id: 2, title: "Product 2", price: "$100.00" },
                    { id: 3, title: "Product 3", price: "$100.00" },
                  ].map((prod) => (
                    <div
                      key={prod.id}
                      style={{
                        flex: "0 0 calc(38% - 10px)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: gridAlignment === "center" ? "center" : "flex-start",
                        textAlign: gridAlignment,
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "3 / 4",
                          borderRadius: "12px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <ImagePlaceholderSvg borderRadius="12px" />
                        {gridShowBtnHover && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "8px",
                              left: "8px",
                              right: "8px",
                            }}
                          >
                            <button
                              type="button"
                              style={{
                                width: "100%",
                                backgroundColor: gridBtnBgColor,
                                color: gridBtnTextColor,
                                border: "none",
                                borderRadius: `${gridBtnRadius}px`,
                                padding: "8px 10px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
                              }}
                            >
                              {gridBtnLabel || "Add to Cart"}
                            </button>
                          </div>
                        )}
                      </div>

                      <Text variant="bodyMd" fontWeight="bold">
                        {prod.title}
                      </Text>

                      {gridShowPrice && (
                        <Text variant="bodySm" tone="subdued">
                          {prod.price}
                        </Text>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Navigation Chevron */}
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    right: "-8px",
                    zIndex: 2,
                    background: "#ffffff",
                    border: "1px solid #e1e3e5",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <Icon source={ChevronRightIcon} tone="base" />
                </button>
              </div>
            </div>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
