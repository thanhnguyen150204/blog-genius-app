import { Card, BlockStack, InlineStack, Text, Badge, Box, InlineGrid } from "@shopify/polaris";

export function ContentIdeasOverviewStats({ stats }) {
  const statItems = [
    {
      title: "Available Opportunities",
      value: `${stats.totalCount}`,
      subtext: "Across 5 store collections",
      badge: "Live",
      badgeTone: "success",
    },
    {
      title: "High Buyer Intent",
      value: `${stats.highIntentCount}`,
      subtext: "Pre-purchase queries",
      badge: "High Conversion",
      badgeTone: "attention",
    },
    {
      title: "Avg. Search Growth",
      value: "+148%",
      subtext: "Breakout queries this month",
      badge: "Trending",
      badgeTone: "magic",
    },
    {
      title: "AI Citation Odds",
      value: "92%",
      subtext: "GEO Engine indexing chance",
      badge: "Top Tier",
      badgeTone: "info",
    },
  ];

  return (
    <Box paddingBlockEnd="400">
      <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="300">
        {statItems.map((item, index) => (
          <Card key={index} padding="400">
            <BlockStack gap="150">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodySm" tone="subdued" fontWeight="medium">
                  {item.title}
                </Text>
                <Badge tone={item.badgeTone} size="small">
                  {item.badge}
                </Badge>
              </InlineStack>
              <Text variant="headingXl" as="p">
                {item.value}
              </Text>
              <Text variant="bodyXs" tone="subdued">
                {item.subtext}
              </Text>
            </BlockStack>
          </Card>
        ))}
      </InlineGrid>
    </Box>
  );
}

export default ContentIdeasOverviewStats;
