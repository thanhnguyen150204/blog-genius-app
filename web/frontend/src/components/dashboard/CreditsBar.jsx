import { Box, InlineStack, Text, Button, Card } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export function CreditsBar({
  monthlyCredits = 250,
  lifetimeCredits = 55,
  resetDate = "Nov 2, 2026",
}) {
  const navigate = useNavigate();

  return (
    <Card>
      <InlineStack align="space-between" blockAlign="center" wrap>
        <InlineStack gap="500" blockAlign="center">
          <Text variant="bodySm" as="span" tone="subdued">
            Monthly AI credits:{" "}
            <Text variant="bodySm" as="span" fontWeight="bold" tone="base">
              {monthlyCredits}
            </Text>
          </Text>
          <Text variant="bodySm" as="span" tone="subdued">
            Lifetime AI credits:{" "}
            <Text variant="bodySm" as="span" fontWeight="bold" tone="base">
              {lifetimeCredits}
            </Text>
          </Text>
        </InlineStack>

        <InlineStack gap="400" blockAlign="center">
          <Text variant="bodySm" as="span" tone="subdued">
            Monthly credits reset{" "}
            <Text variant="bodySm" as="span" fontWeight="bold" tone="base">
              {resetDate}
            </Text>
          </Text>
          <Button
            size="slim"
            variant="primary"
            onClick={() => navigate("/pricing")}
          >
            Buy more
          </Button>
        </InlineStack>
      </InlineStack>
    </Card>
  );
}

export default CreditsBar;
