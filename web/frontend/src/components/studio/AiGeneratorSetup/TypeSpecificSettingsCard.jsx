import { BlockStack, Text } from "@shopify/polaris";

export function TypeSpecificSettingsCard({
  insertSectionSummary = false,
  onToggleSectionSummary,
}) {
  return (
    <div
      style={{
        border: "1px solid #d4d4d8",
        borderRadius: "8px",
        padding: "16px 20px",
        backgroundColor: "#ffffff",
        width: "100%",
      }}
    >
      <BlockStack gap="200">
        <Text variant="bodySm" fontWeight="semibold" as="h4">
          Blog post settings
        </Text>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <BlockStack gap="050">
            <Text variant="bodySm" fontWeight="medium">
              Insert summary at top of each section
            </Text>
            <Text variant="bodyXs" tone="subdued">
              A short direct summary / answer before the full explanation
            </Text>
          </BlockStack>

          {/* Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={insertSectionSummary}
            onClick={onToggleSectionSummary}
            style={{
              position: "relative",
              width: "34px",
              height: "20px",
              borderRadius: "9999px",
              backgroundColor: insertSectionSummary ? "#15803d" : "#e4e4e7",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              padding: "2px",
              outline: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                transform: insertSectionSummary ? "translateX(14px)" : "translateX(0px)",
                transition: "transform 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            />
          </button>
        </div>
      </BlockStack>
    </div>
  );
}

export default TypeSpecificSettingsCard;
