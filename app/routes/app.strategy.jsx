import { Page, Layout, Card, BlockStack, Text, Button } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export default function StrategyPage() {
  const shopify = useAppBridge();

  return (
    <Page title="Content Strategy">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                SEO & GEO Content Strategy
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                Plan content topics aligned with buyer journey funnels (Informational, Buyer&apos;s guide, FAQ, How-to, Trust page).
              </Text>
              <div>
                <Button variant="primary" onClick={() => shopify.toast?.show("Creating content strategy...")}>
                  Build Content Strategy
                </Button>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
