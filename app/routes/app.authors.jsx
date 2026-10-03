import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function AuthorsPage() {
  const shopify = useAppBridge();

  return (
    <Page title="Authors (E-E-A-T Management)">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Manage Blog Authors
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Declare author profiles, expertise credentials, and profile links (E-E-A-T) to help Google and AI search engines reliably cite your articles.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Creating author profile...")}>
                  + Add new author
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
