import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Studio() {
  const shopify = useAppBridge();

  return (
    <Page title="AI Content Studio & GEO Optimization">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Outline Tree &amp; Canvas Editor
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Hierarchical outline tree, section-by-section AI content generation with seamless context chaining, real-time scoring, and 1-Click Auto-Fix SEO/GEO Inspector.
              </Text>
              <div>
                <Button
                  variant="primary"
                  onClick={() => shopify.toast?.show("AI Content Studio is ready!")}
                >
                  Start Outline Generation
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
