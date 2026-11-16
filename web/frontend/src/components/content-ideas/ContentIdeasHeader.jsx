import { BlockStack, InlineStack, Text, Badge, Button, Box } from "@shopify/polaris";
import { MagicIcon, SearchIcon } from "@shopify/polaris-icons";

export function ContentIdeasHeader({
  onOpenValidator,
  onStartLiveScan,
  isScanning,
}) {
  return (
    <Box paddingBlockEnd="400">
      <InlineStack align="space-between" blockAlign="center" gap="400" wrap>
        <BlockStack gap="100">
          <InlineStack gap="200" blockAlign="center">
            <Text variant="headingXl" as="h1">
              Content Ideas
            </Text>
            <Badge tone="magic">AI & Buyer Radar</Badge>
          </InlineStack>
          <Text variant="bodyMd" tone="subdued">
            High-opportunity blog post ideas, hot buyer keywords, and AI search questions scraped from real Shopify shopper behavior.
          </Text>
        </BlockStack>

        <InlineStack gap="200" blockAlign="center">
          <Button
            variant="secondary"
            icon={SearchIcon}
            loading={isScanning}
            onClick={onStartLiveScan}
          >
            Scan Live Trends
          </Button>
          <Button
            variant="primary"
            icon={MagicIcon}
            onClick={onOpenValidator}
          >
            Validate Custom Idea
          </Button>
        </InlineStack>
      </InlineStack>
    </Box>
  );
}

export default ContentIdeasHeader;
