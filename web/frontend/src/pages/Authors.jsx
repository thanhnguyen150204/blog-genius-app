import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Authors() {
  const shopify = useAppBridge();

  return (
    <Page title="Authors Management">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Author Profiles &amp; E-E-A-T Schema
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Manage blog authors, author bios, social profiles, and credentials to establish Google &amp; AI search E-E-A-T authority.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Author profile created!")}>
                  Add New Author
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
