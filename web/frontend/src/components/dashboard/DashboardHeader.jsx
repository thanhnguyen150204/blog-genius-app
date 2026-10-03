import { InlineStack, Text, Badge, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export function DashboardHeader() {
  const shopify = useAppBridge();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="300" blockAlign="center">
          <Text variant="headingXl" as="h1">
            Blog Genius
          </Text>
          <Badge tone="success">Active</Badge>
        </InlineStack>

        <Button
          size="slim"
          onClick={() => {
            shopify.toast?.show("Refreshing GEO engine status...");
          }}
        >
          Check GEO Status
        </Button>
      </InlineStack>

      <Text variant="bodyMd" tone="subdued">
        AI SEO & Generative Engine Optimization Engine for Shopify Stores
      </Text>
    </div>
  );
}

export default DashboardHeader;
