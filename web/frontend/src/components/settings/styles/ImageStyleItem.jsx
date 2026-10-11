import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Select,
  ButtonGroup,
  Button,
  Text,
} from "@shopify/polaris";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@shopify/polaris-icons";
import {
  AccordionHeader,
  IMAGE_SIZE_OPTIONS,
  IMAGE_FIT_OPTIONS,
  IMAGE_POSITION_OPTIONS,
} from "../SettingsHelpers";

export default function ImageStyleItem({
  isOpen,
  onToggle,
  imageSizeScope,
  setImageSizeScope,
  imageSameSize,
  setImageSameSize,
  imageAlign,
  setImageAlign,
  imageObjectFit,
  setImageObjectFit,
  imageObjectPosition,
  setImageObjectPosition,
}) {
  return (
    <div>
      <AccordionHeader
        title="Image"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="image-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodySm" tone="subdued">Image size scope</Text>
              <ButtonGroup variant="segmented">
                <Button
                  pressed={imageSizeScope === "all"}
                  onClick={() => setImageSizeScope("all")}
                >
                  All devices
                </Button>
                <Button
                  pressed={imageSizeScope === "device"}
                  onClick={() => setImageSizeScope("device")}
                >
                  Per device
                </Button>
              </ButtonGroup>
            </InlineStack>

            <Select
              label="Same size for all devices"
              options={IMAGE_SIZE_OPTIONS}
              value={imageSameSize}
              onChange={setImageSameSize}
            />

            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">Alignment</Text>
              <ButtonGroup fullWidth variant="segmented">
                <Button
                  icon={TextAlignLeftIcon}
                  pressed={imageAlign === "left"}
                  onClick={() => setImageAlign("left")}
                  accessibilityLabel="Align left"
                />
                <Button
                  icon={TextAlignCenterIcon}
                  pressed={imageAlign === "center"}
                  onClick={() => setImageAlign("center")}
                  accessibilityLabel="Align center"
                />
                <Button
                  icon={TextAlignRightIcon}
                  pressed={imageAlign === "right"}
                  onClick={() => setImageAlign("right")}
                  accessibilityLabel="Align right"
                />
              </ButtonGroup>
            </BlockStack>

            <Select
              label="Object fit"
              options={IMAGE_FIT_OPTIONS}
              value={imageObjectFit}
              onChange={setImageObjectFit}
            />

            <Select
              label="Object position"
              options={IMAGE_POSITION_OPTIONS}
              value={imageObjectPosition}
              onChange={setImageObjectPosition}
            />

            {/* Image Preview Box */}
            <Box
              background="bg-surface"
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    imageAlign === "left"
                      ? "flex-start"
                      : imageAlign === "right"
                      ? "flex-end"
                      : "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    width:
                      imageSameSize === "full"
                        ? "100%"
                        : imageSameSize === "75%"
                        ? "75%"
                        : imageSameSize === "50%"
                        ? "50%"
                        : imageSameSize === "25%"
                        ? "25%"
                        : "100%",
                    maxWidth: "100%",
                    height: "220px",
                    backgroundColor: "#d1d5db",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <svg
                    viewBox="0 0 500 280"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: imageObjectFit,
                      display: "block",
                    }}
                  >
                    <rect width="500" height="280" fill="#cfd4dc" />
                    <polygon points="50,280 230,120 330,280" fill="#9ca3af" />
                    <polygon points="260,280 390,160 500,280" fill="#88909d" />
                    <circle cx="390" cy="80" r="30" fill="#cbd5e1" />
                  </svg>
                </div>
              </div>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
