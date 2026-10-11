import {
  Collapsible,
  Box,
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Select,
} from "@shopify/polaris";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@shopify/polaris-icons";
import {
  AccordionHeader,
  ImagePlaceholderSvg,
  VerticalAlignTopIcon,
  VerticalAlignCenterIcon,
  VerticalAlignBottomIcon,
  ImagePosLeftIcon,
  ImagePosRightIcon,
  IMAGE_TEXT_SIZE_OPTIONS,
} from "../SettingsHelpers";

export default function ImageAndTextStyleItem({
  isOpen,
  onToggle,
  imgTextScope,
  setImgTextScope,
  imgTextSize,
  setImgTextSize,
  imgTextVerticalAlign,
  setImgTextVerticalAlign,
  imgTextHorizontalAlign,
  setImgTextHorizontalAlign,
  imgTextPosition,
  setImgTextPosition,
}) {
  return (
    <div>
      <AccordionHeader
        title="Image & Text"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="image-and-text-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <BlockStack gap="100">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodySm">Image size scope</Text>
                <ButtonGroup variant="segmented">
                  <Button
                    pressed={imgTextScope === "all"}
                    onClick={() => setImgTextScope("all")}
                  >
                    All devices
                  </Button>
                  <Button
                    pressed={imgTextScope === "device"}
                    onClick={() => setImgTextScope("device")}
                  >
                    Per device
                  </Button>
                </ButtonGroup>
              </InlineStack>
            </BlockStack>

            <Select
              label="Image size"
              options={IMAGE_TEXT_SIZE_OPTIONS}
              value={imgTextSize}
              onChange={setImgTextSize}
            />

            <BlockStack gap="100">
              <Text variant="bodySm" tone="subdued">Vertical alignment</Text>
              <ButtonGroup fullWidth variant="segmented">
                <Button
                  pressed={imgTextVerticalAlign === "top"}
                  onClick={() => setImgTextVerticalAlign("top")}
                  icon={VerticalAlignTopIcon}
                />
                <Button
                  pressed={imgTextVerticalAlign === "center"}
                  onClick={() => setImgTextVerticalAlign("center")}
                  icon={VerticalAlignCenterIcon}
                />
                <Button
                  pressed={imgTextVerticalAlign === "bottom"}
                  onClick={() => setImgTextVerticalAlign("bottom")}
                  icon={VerticalAlignBottomIcon}
                />
              </ButtonGroup>
            </BlockStack>

            <BlockStack gap="100">
              <Text variant="bodySm" tone="subdued">Horizontal alignment</Text>
              <ButtonGroup fullWidth variant="segmented">
                <Button
                  pressed={imgTextHorizontalAlign === "left"}
                  onClick={() => setImgTextHorizontalAlign("left")}
                  icon={TextAlignLeftIcon}
                />
                <Button
                  pressed={imgTextHorizontalAlign === "center"}
                  onClick={() => setImgTextHorizontalAlign("center")}
                  icon={TextAlignCenterIcon}
                />
                <Button
                  pressed={imgTextHorizontalAlign === "right"}
                  onClick={() => setImgTextHorizontalAlign("right")}
                  icon={TextAlignRightIcon}
                />
              </ButtonGroup>
            </BlockStack>

            <BlockStack gap="100">
              <Text variant="bodySm" tone="subdued">Image position</Text>
              <ButtonGroup fullWidth variant="segmented">
                <Button
                  pressed={imgTextPosition === "left"}
                  onClick={() => setImgTextPosition("left")}
                >
                  <ImagePosLeftIcon />
                </Button>
                <Button
                  pressed={imgTextPosition === "right"}
                  onClick={() => setImgTextPosition("right")}
                >
                  <ImagePosRightIcon />
                </Button>
              </ButtonGroup>
            </BlockStack>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #e1e3e5",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: imgTextPosition === "right" ? "row-reverse" : "row",
                  gap: "28px",
                  alignItems:
                    imgTextVerticalAlign === "top"
                      ? "flex-start"
                      : imgTextVerticalAlign === "bottom"
                      ? "flex-end"
                      : "center",
                }}
              >
                <div
                  style={{
                    width:
                      imgTextSize === "240"
                        ? "240px"
                        : imgTextSize === "360"
                        ? "360px"
                        : imgTextSize === "480"
                        ? "480px"
                        : "240px",
                    maxWidth: "45%",
                    aspectRatio: "1 / 1",
                    borderRadius: "4px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <ImagePlaceholderSvg borderRadius="4px" />
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      imgTextHorizontalAlign === "center"
                        ? "center"
                        : imgTextHorizontalAlign === "right"
                        ? "flex-end"
                        : "flex-start",
                    textAlign: imgTextHorizontalAlign,
                  }}
                >
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: imgTextHorizontalAlign === "center" ? 0 : "20px",
                      listStylePosition: "inside",
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: "#202223",
                    }}
                  >
                    <li>Lorem ipsum dolor sit amet.</li>
                    <li>Consectetur adipiscing elit.</li>
                  </ul>
                </div>
              </div>
            </div>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
