import { Box, InlineStack, BlockStack, Text, Badge, Button, Icon } from "@shopify/polaris";
import { AppExtensionIcon, ShareIcon, SettingsIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";

export function AppEmbedsFooter() {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  return (
    <Box paddingBlock="300">
      <InlineStack align="space-between" blockAlign="center" wrap gap="400">
        <BlockStack gap="200" inlineAlign="start">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                minWidth: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon source={AppExtensionIcon} tone="base" />
            </div>
            <Text variant="bodySm">Custom assets app embed</Text>
            <Badge tone="neutral">Off</Badge>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "20px",
                height: "20px",
                minWidth: "20px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon source={ShareIcon} tone="base" />
            </div>
            <Text variant="bodySm">Social share buttons app embed</Text>
            <Badge tone="neutral">Off</Badge>
          </div>
        </BlockStack>

        <Button
          icon={SettingsIcon}
          onClick={() => {
            shopify.toast?.show("Opening Theme App Embeds in Shopify Theme Editor...");
            navigate("/app/settings");
          }}
        >
          App embed settings
        </Button>
      </InlineStack>
    </Box>
  );
}

export default AppEmbedsFooter;
