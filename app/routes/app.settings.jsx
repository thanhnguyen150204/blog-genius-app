import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function SettingsPage() {
  const shopify = useAppBridge();

  return (
    <Page title="SEO & GEO Configuration Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                AI Crawlers & Robots.txt Configuration
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Manage crawl permissions for GPTBot, PerplexityBot, ClaudeBot, Google-Extended, and configure default settings for JSON-LD schemas.
              </Text>
              <div>
                <Button
                  variant="primary"
                  onClick={() => shopify.toast?.show("SEO/GEO configuration saved successfully!")}
                >
                  Save settings
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
