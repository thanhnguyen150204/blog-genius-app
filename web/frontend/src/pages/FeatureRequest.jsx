import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function FeatureRequest() {
  const shopify = useAppBridge();

  return (
    <Page title="Feature Request">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Submit Feature Request
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Need a specific feature for Blog Genius? Share your ideas and suggestions with our development team.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Feature request submitted!")}>
                  Submit request
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
