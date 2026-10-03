import { Page, Layout, Card, BlockStack, InlineStack, Text, Badge, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Pricing() {
  const shopify = useAppBridge();

  return (
    <Page title="Pricing &amp; AI Credits">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="headingMd" as="h2">
                  Plan &amp; Credit Management
                </Text>
                <Badge tone="success">Pro Plan Active</Badge>
              </InlineStack>

              <Text as="p" variant="bodyMd" tone="subdued">
                Manage your monthly subscription, buy additional AI writing credits, and configure billing settings.
              </Text>

              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Opening billing options...")}>
                  Upgrade Plan or Buy Credits
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
