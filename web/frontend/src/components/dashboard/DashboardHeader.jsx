import { InlineStack, Text, Badge, Button } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { PlusCircleIcon } from "@shopify/polaris-icons";

export function DashboardHeader() {
  const shopify = useAppBridge();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <InlineStack align="space-between" blockAlign="center">
        <InlineStack gap="300" blockAlign="center">
          <Text variant="headingXl" as="h1">
            Dashboard
          </Text>
          <Badge tone="info">Pro</Badge>
        </InlineStack>

        <Button
          variant="primary"
          icon={PlusCircleIcon}
          onClick={() => {
            shopify.toast?.show("Opening Content Studio...");
            navigate("/studio");
          }}
        >
          Start building
        </Button>
      </InlineStack>
    </div>
  );
}

export default DashboardHeader;
