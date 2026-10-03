import { Page, Layout, Card, BlockStack, Text, List, Link } from "@shopify/polaris";

export default function AdditionalPage() {
  return (
    <Page title="Additional page">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Multiple pages
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                The app template comes with an additional page which demonstrates how
                to create multiple pages within app navigation using{" "}
                <Link
                  url="https://shopify.dev/docs/apps/tools/app-bridge"
                  target="_blank"
                >
                  App Bridge
                </Link>
                .
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued">
                To create your own page and have it show up in the app navigation, add
                a page inside <code>app/routes</code>, and a link to it in the navigation menu.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text variant="headingMd" as="h2">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
