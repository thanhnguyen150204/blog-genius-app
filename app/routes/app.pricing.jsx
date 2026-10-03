import { Page, Layout, Card, BlockStack, InlineStack, Text, Badge } from "@shopify/polaris";

export default function PricingPage() {
  return (
    <Page title="Pricing Plans">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h2">
                  Blog Genius Plans
                </Text>
                <Badge tone="success">Current Plan: Pro Plan</Badge>
              </InlineStack>
              <Text as="p" variant="bodyMd" tone="subdued">
                Choose the subscription plan that fits your store scale: Free, Growth, or Pro.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
