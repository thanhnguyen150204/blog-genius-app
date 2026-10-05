import { BlockStack, Text, Button } from "@shopify/polaris";

export function StudioHeader({ onCreateContent }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <BlockStack gap="100">
        <Text variant="headingLg" as="h1" fontWeight="bold">
          Content Studio
        </Text>
        <Text variant="bodyMd" tone="subdued">
          Everything you&apos;ve created, newest first — no need to know where it &ldquo;lives&rdquo;.
        </Text>
      </BlockStack>

      <Button variant="primary" onClick={onCreateContent}>
        Create content
      </Button>
    </div>
  );
}

export default StudioHeader;
