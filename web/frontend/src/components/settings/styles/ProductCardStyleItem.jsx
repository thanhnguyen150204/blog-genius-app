import { useState } from "react";
import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Icon,
  Button,
  Checkbox,
  TextField,
} from "@shopify/polaris";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  AdjustIcon,
} from "@shopify/polaris-icons";
import {
  AccordionHeader,
  ColorPickerInput,
  ImagePlaceholderSvg,
} from "../SettingsHelpers";

export default function ProductCardStyleItem({
  isOpen,
  onToggle,
  prodShowDescription,
  setProdShowDescription,
  prodTransparentBg,
  setProdTransparentBg,
  prodAddToCartLabel,
  setProdAddToCartLabel,
  prodAddToCartBgColor,
  setProdAddToCartBgColor,
  prodAddToCartTextColor,
  setProdAddToCartTextColor,
}) {
  const [prodImageOptionsOpen, setProdImageOptionsOpen] = useState(true);

  return (
    <div>
      <AccordionHeader
        title="Product Card"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="product-card-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <BlockStack gap="200">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setProdImageOptionsOpen(!prodImageOptionsOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setProdImageOptionsOpen(!prodImageOptionsOpen);
                  }
                }}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodyMd" fontWeight="semibold">
                    Product Image Options
                  </Text>
                  <Icon
                    source={prodImageOptionsOpen ? ChevronUpIcon : ChevronDownIcon}
                    tone="subdued"
                  />
                </InlineStack>
              </div>

              <Collapsible
                id="product-image-options-collapsible"
                open={prodImageOptionsOpen}
                transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
              >
                <BlockStack gap="300">
                  <Text variant="bodySm" tone="subdued">
                    Select a specific variant or custom image to display instead of the default product image.
                  </Text>
                  <Button
                    icon={AdjustIcon}
                    fullWidth
                    onClick={() => {
                      if (window.shopify?.toast) {
                        window.shopify.toast.show("Opening image library...");
                      }
                    }}
                  >
                    Select from library
                  </Button>
                </BlockStack>
              </Collapsible>
            </BlockStack>

            <Checkbox
              label="Show product description"
              checked={prodShowDescription}
              onChange={setProdShowDescription}
            />

            <Checkbox
              label="Transparent background"
              checked={prodTransparentBg}
              onChange={setProdTransparentBg}
            />

            <TextField
              label="Add to Cart label"
              value={prodAddToCartLabel}
              onChange={setProdAddToCartLabel}
              autoComplete="off"
            />

            <ColorPickerInput
              label="Add to cart Background color"
              value={prodAddToCartBgColor}
              onChange={setProdAddToCartBgColor}
            />

            <ColorPickerInput
              label="Add to cart Text color"
              value={prodAddToCartTextColor}
              onChange={setProdAddToCartTextColor}
            />

            <div
              style={{
                backgroundColor: prodTransparentBg ? "transparent" : "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e1e3e5",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <ImagePlaceholderSvg borderRadius="6px" />
                </div>

                <BlockStack gap="200">
                  <Text variant="headingMd" as="h3" fontWeight="bold">
                    Product Title
                  </Text>
                  <Text variant="bodySm" tone="subdued">
                    Product Vendor
                  </Text>
                  <Text variant="bodyMd" fontWeight="bold">
                    $99.99
                  </Text>
                  {prodShowDescription && (
                    <Text variant="bodySm" tone="base">
                      Product Description
                    </Text>
                  )}

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid #d4d4d8",
                      borderRadius: "4px",
                      width: "fit-content",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        border: "none",
                        background: "none",
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#52525b",
                      }}
                    >
                      -
                    </button>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderLeft: "1px solid #e4e4e7",
                        borderRight: "1px solid #e4e4e7",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      1
                    </span>
                    <button
                      type="button"
                      style={{
                        border: "none",
                        background: "none",
                        padding: "4px 10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        color: "#52525b",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    style={{
                      backgroundColor: prodAddToCartBgColor,
                      color: prodAddToCartTextColor,
                      border: "none",
                      borderRadius: "4px",
                      padding: "10px 16px",
                      fontWeight: "600",
                      fontSize: "14px",
                      cursor: "pointer",
                      width: "100%",
                      marginTop: "6px",
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {prodAddToCartLabel || "Add to Cart"}
                  </button>
                </BlockStack>
              </div>
            </div>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
