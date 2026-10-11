import {
  Collapsible,
  Box,
  BlockStack,
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
  ColorPickerInput,
  HEADING_TAG_OPTIONS,
} from "../SettingsHelpers";

export default function HeadingStyleItem({
  isOpen,
  onToggle,
  headingTag,
  setHeadingTag,
  headingAlign,
  setHeadingAlign,
  headingColor,
  setHeadingColor,
}) {
  return (
    <div>
      <AccordionHeader
        title="Heading"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="heading-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <Select
              label="HTML Tag"
              options={HEADING_TAG_OPTIONS}
              value={headingTag}
              onChange={setHeadingTag}
            />

            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">Alignment</Text>
              <ButtonGroup fullWidth variant="segmented">
                <Button
                  icon={TextAlignLeftIcon}
                  pressed={headingAlign === "left"}
                  onClick={() => setHeadingAlign("left")}
                  accessibilityLabel="Align left"
                />
                <Button
                  icon={TextAlignCenterIcon}
                  pressed={headingAlign === "center"}
                  onClick={() => setHeadingAlign("center")}
                  accessibilityLabel="Align center"
                />
                <Button
                  icon={TextAlignRightIcon}
                  pressed={headingAlign === "right"}
                  onClick={() => setHeadingAlign("right")}
                  accessibilityLabel="Align right"
                />
              </ButtonGroup>
            </BlockStack>

            <ColorPickerInput
              label="Text color"
              value={headingColor}
              onChange={setHeadingColor}
            />

            {/* Heading Preview Box */}
            <Box
              background="bg-surface"
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <div style={{ textAlign: headingAlign }}>
                <span
                  style={{
                    fontSize:
                      headingTag === "H1"
                        ? "28px"
                        : headingTag === "H2"
                        ? "24px"
                        : headingTag === "H3"
                        ? "20px"
                        : headingTag === "H4"
                        ? "17px"
                        : headingTag === "H5"
                        ? "15px"
                        : "13px",
                    fontWeight: 700,
                    color: headingColor || "#000000",
                    fontFamily: "inherit",
                    lineHeight: 1.3,
                  }}
                >
                  This is a heading preview for {headingTag}
                </span>
              </div>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
