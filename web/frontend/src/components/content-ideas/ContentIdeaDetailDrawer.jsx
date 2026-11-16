import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Box,
  Divider,
  Icon,
} from "@shopify/polaris";
import {
  MagicIcon,
  ProductIcon,
  LightbulbIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";

export function ContentIdeaDetailDrawer({
  isOpen,
  onClose,
  idea,
  onDraftInStudio,
}) {
  if (!idea) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Content Opportunity Deep Dive"
      primaryAction={{
        content: "Open in Content Studio to Draft",
        icon: MagicIcon,
        onAction: () => {
          onClose();
          onDraftInStudio(idea);
        },
      }}
      secondaryActions={[
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Main Title and Badges */}
          <BlockStack gap="150">
            <InlineStack gap="150" blockAlign="center" wrap>
              <Badge tone="magic">{idea.aiEngine} Trend</Badge>
              <Badge tone="info">{idea.category}</Badge>
              <Badge tone={idea.buyerIntent === "Transactional" ? "success" : "attention"}>
                {idea.buyerIntent} Intent
              </Badge>
              <Badge>{idea.funnelStage}</Badge>
            </InlineStack>
            <Text variant="headingLg" as="h3">
              {idea.title}
            </Text>
            <Text variant="bodyMd" tone="subdued">
              Target query: <Text as="span" fontWeight="semibold">{idea.query}</Text>
            </Text>
          </BlockStack>

          {/* Key Metrics Strip */}
          <Box
            background="bg-surface-secondary"
            padding="300"
            borderRadius="200"
          >
            <InlineStack align="space-between" blockAlign="center" wrap gap="300">
              <BlockStack gap="050">
                <Text variant="bodyXs" tone="subdued">Monthly Volume</Text>
                <Text variant="headingMd" as="p">{idea.volume}</Text>
              </BlockStack>
              <BlockStack gap="050">
                <Text variant="bodyXs" tone="subdued">Growth Rate</Text>
                <Text variant="headingMd" as="p" tone="success">{idea.growth}</Text>
              </BlockStack>
              <BlockStack gap="050">
                <Text variant="bodyXs" tone="subdued">SEO Difficulty</Text>
                <Text variant="headingMd" as="p">{idea.difficulty}</Text>
              </BlockStack>
              <BlockStack gap="050">
                <Text variant="bodyXs" tone="subdued">GEO Citation Score</Text>
                <Text variant="headingMd" as="p" tone="magic">{idea.geoScore}%</Text>
              </BlockStack>
            </InlineStack>
          </Box>

          <Divider />

          {/* AI Search Snippet */}
          <BlockStack gap="200">
            <InlineStack gap="150" blockAlign="center">
              <Icon source={LightbulbIcon} tone="magic" />
              <Text variant="headingSm" as="h4">
                What AI Engines Answer Today
              </Text>
            </InlineStack>
            <Box
              background="bg-surface-magic"
              padding="300"
              borderRadius="200"
            >
              <Text variant="bodySm" as="p">
                {idea.aiSnippet}
              </Text>
            </Box>
          </BlockStack>

          {/* Content Gap & Opportunity */}
          <BlockStack gap="200">
            <InlineStack gap="150" blockAlign="center">
              <Icon source={AlertCircleIcon} tone="caution" />
              <Text variant="headingSm" as="h4">
                Content Gap to Exploit
              </Text>
            </InlineStack>
            <Box
              background="bg-surface-caution"
              padding="300"
              borderRadius="200"
            >
              <Text variant="bodySm" as="p">
                {idea.contentGap}
              </Text>
            </Box>
          </BlockStack>

          {/* Matched Product to Promote */}
          <BlockStack gap="200">
            <InlineStack gap="150" blockAlign="center">
              <Icon source={ProductIcon} tone="base" />
              <Text variant="headingSm" as="h4">
                Recommended Store Product to Link
              </Text>
            </InlineStack>
            <Box
              background="bg-surface-secondary"
              padding="300"
              borderRadius="200"
            >
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="050">
                  <Text variant="bodyMd" fontWeight="semibold">
                    {idea.matchedProduct}
                  </Text>
                  <Text variant="bodyXs" tone="subdued">
                    Collection: {idea.matchedCollection}
                  </Text>
                </BlockStack>
                <Badge tone="success">In Catalog</Badge>
              </InlineStack>
            </Box>
          </BlockStack>

          {/* Suggested Blog Outline */}
          <BlockStack gap="200">
            <InlineStack gap="150" blockAlign="center">
              <Icon source={CheckCircleIcon} tone="success" />
              <Text variant="headingSm" as="h4">
                AI Suggested Outline Structure
              </Text>
            </InlineStack>
            <BlockStack gap="150">
              {idea.suggestedOutline &&
                idea.suggestedOutline.map((step, idx) => (
                  <Box
                    key={idx}
                    background="bg-surface-secondary"
                    padding="200"
                    borderRadius="150"
                  >
                    <Text variant="bodySm" as="p">
                      {step}
                    </Text>
                  </Box>
                ))}
            </BlockStack>
          </BlockStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default ContentIdeaDetailDrawer;
