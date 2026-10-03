import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Strategy() {
  const shopify = useAppBridge();

  return (
    <Page title="Content &amp; GEO Strategy">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Pillar-Cluster Topic Maps
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Generate interconnected blog topic maps, internal linking blueprints, and automated publishing calendars to build domain authority.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Generating topic clusters...")}>
                  Generate Content Plan
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
