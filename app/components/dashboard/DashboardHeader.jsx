import { InlineStack, Text, Badge, Button } from "@shopify/polaris";
import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

export function DashboardHeader() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  return (
    <InlineStack align="space-between" blockAlign="center">
      <InlineStack gap="300" blockAlign="center">
        <Text variant="headingXl" as="h1">
          Dashboard
        </Text>
        <Badge tone="info">Pro</Badge>
      </InlineStack>

      <Button
        variant="primary"
        size="large"
        onClick={() => {
          shopify.toast?.show("Opening Content Studio...");
          navigate("/app/studio");
        }}
      >
        + Start building
      </Button>
    </InlineStack>
  );
}

export default DashboardHeader;
