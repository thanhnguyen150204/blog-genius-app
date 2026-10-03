import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function ResearchPage() {
  const shopify = useAppBridge();

  return (
    <Page title="Keyword Research & Content Brief (Module 1)">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Keyword Discovery & Search Intent Analysis
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Module 1: Enter seed keywords to analyze Search Intent (Informational, Commercial, Transactional) and automatically generate an SEO &amp; GEO optimized Content Brief.
              </Text>
              <div>
                <Button
                  variant="primary"
                  onClick={() => shopify.toast?.show("Keyword Research module is ready!")}
                >
                  Start keyword analysis
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
