import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Keywords() {
  const shopify = useAppBridge();

  return (
    <Page title="Keywords Explorer">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Keyword Research &amp; Search Intent
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Discover seed keywords, analyze search volume, keyword difficulty, and identify search intent (Informational, Commercial, Transactional).
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Starting keyword research...")}>
                  Explore new keywords
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
