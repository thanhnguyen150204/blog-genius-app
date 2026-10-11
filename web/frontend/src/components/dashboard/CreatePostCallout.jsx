import { Card, InlineStack, BlockStack, Text, Button } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { PlusCircleIcon } from "@shopify/polaris-icons";

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
          icon={PlusCircleIcon}
          onClick={() => {
            shopify.toast?.show("Opening Studio...");
            navigate("/studio");
          }}
        >
          Create blog post
        </Button>
      </InlineStack>
    </Card>
  );
}

export default CreatePostCallout;
