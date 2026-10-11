import {
  Collapsible,
  Box,
  BlockStack,
  Select,
} from "@shopify/polaris";
import { AccordionHeader, COLOR_MODE_OPTIONS, ToggleSwitch } from "../SettingsHelpers";

export default function ContentStyleItem({
  isOpen,
  onToggle,
  colorMode,
  setColorMode,
  autoSave,
  setAutoSave,
}) {
  return (
    <div>
      <AccordionHeader
        title="Content"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <Collapsible
        id="content-collapsible"
        open={isOpen}
        transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
      >
        <Box padding="400" paddingBlockStart="0">
          <BlockStack gap="400">
            <ToggleSwitch
              label="Auto save"
              checked={autoSave}
              onChange={setAutoSave}
            />

            <Select
              label="Color mode"
              options={COLOR_MODE_OPTIONS}
              value={colorMode}
              onChange={setColorMode}
            />

            <Box
              background={colorMode === "dark" ? "bg-fill-inverse" : "bg-surface-secondary"}
              padding="400"
              borderRadius="200"
              borderWidth="025"
              borderColor="border"
            >
              <BlockStack gap="300">
                <p
                  style={{
                    fontSize: "13px",
                    color: colorMode === "dark" ? "#f9fafb" : "#000000",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  This is the introduction paragraph. The intro should be short, concise,
                  and give viewers an idea of what the whole blog post will be about.
                </p>

                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: colorMode === "dark" ? "#ffffff" : "#000000",
                    margin: "12px 0 6px 0",
                    lineHeight: 1.3,
                  }}
                >
                  This is a heading 2
                </h2>

                <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#f9fafb" : "#000000", margin: "0 0 6px 0" }}>
                  This is the first body paragraph.
                </p>
                <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#f9fafb" : "#000000", margin: "0 0 6px 0" }}>
                  This is the second body paragraph.
                </p>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: colorMode === "dark" ? "#ffffff" : "#000000",
                    margin: "12px 0 6px 0",
                    lineHeight: 1.3,
                  }}
                >
                  This is a heading 3
                </h3>

                <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#f9fafb" : "#000000", margin: "0 0 6px 0" }}>
                  This is the fourth body paragraph.
                </p>

                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: colorMode === "dark" ? "#ffffff" : "#000000",
                    margin: "12px 0 6px 0",
                    lineHeight: 1.3,
                  }}
                >
                  This is a heading 4
                </h4>

                <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#f9fafb" : "#000000", margin: 0 }}>
                  This is the seventh body paragraph.
                </p>
              </BlockStack>
            </Box>
          </BlockStack>
        </Box>
      </Collapsible>
    </div>
  );
}
