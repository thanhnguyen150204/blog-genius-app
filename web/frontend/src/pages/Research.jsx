import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Research() {
  const shopify = useAppBridge();

  return (
    <Page title="Content &amp; Competitor Research">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                SERP &amp; AI Citation Deep Research
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Analyze high-ranking search results, extract key statistics, review competitor citations, and identify content gaps.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Starting research scan...")}>
                  Start New Research
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
