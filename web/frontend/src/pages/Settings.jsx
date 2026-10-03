import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function Settings() {
  const shopify = useAppBridge();

  return (
    <Page title="Blog Genius Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                API &amp; Theme App Embed Configuration
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Configure your OpenAI / DeepSeek / Qwen API keys, enable or disable Custom assets and Social share theme app embeds in your Shopify Online Store theme editor.
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Settings saved successfully!")}>
                  Save Settings
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
