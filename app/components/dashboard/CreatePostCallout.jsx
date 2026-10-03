import { Card, InlineStack, BlockStack, Text, Button } from "@shopify/polaris";
import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

export function CreatePostCallout() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  return (
    <Card>
      <InlineStack align="space-between" blockAlign="center" wrap>
        <BlockStack gap="100">
          <Text variant="headingMd" as="h2">
            Ready to add a new blog post?
          </Text>
          <Text variant="bodySm" tone="subdued">
            Generate high-quality blog posts optimized for Search Engine &amp; AI Citations (GEO).
          </Text>
        </BlockStack>

        <Button
          variant="primary"
          onClick={() => {
            shopify.toast?.show("Opening Studio...");
            navigate("/app/studio");
          }}
        >
          + Create blog post
        </Button>
      </InlineStack>
    </Card>
  );
}

export default CreatePostCallout;
