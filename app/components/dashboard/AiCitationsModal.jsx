import { Modal, BlockStack, Banner, Text, Button, Card, InlineStack, ProgressBar } from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";

export function AiCitationsModal({ open, onClose }) {
  const shopify = useAppBridge();

  const handleKeyDown = (callback) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="AI Brand Visibility Breakdown (30 Days)"
      primaryAction={{
        content: "Close",
        onAction: onClose,
      }}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Banner tone="info">
            <BlockStack gap="200">
              <Text variant="bodySm">
                These metrics track citation visibility across your configured AI models (<strong>DeepSeek V4.1 Flash</strong> and <strong>Qwen 3.8 Flash</strong>).
              </Text>
              <Button
                size="slim"
                onClick={() => shopify.toast?.show("Scanning citation data from DeepSeek V4.1 Flash & Qwen 3.8 Flash...")}
              >
                Open AI Visibility
              </Button>
            </BlockStack>
          </Banner>

          <Card>
            <BlockStack gap="100">
              <Text variant="bodySm" tone="subdued">Total Brand Citations</Text>
              <Text variant="heading2xl" as="p">0</Text>
            </BlockStack>
          </Card>

          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">Citations by AI Search Engine</Text>

            <div
              role="button"
              tabIndex={0}
              className="ai-model-card deepseek"
              onClick={() => shopify.toast?.show("DeepSeek V4.1 Flash model is active for GEO.")}
              onKeyDown={handleKeyDown(() => shopify.toast?.show("DeepSeek V4.1 Flash model is active for GEO."))}
            >
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <span style={{ fontSize: "16px" }}>🐳</span>
                    <Text variant="bodyMd" fontWeight="semibold">DeepSeek V4.1 Flash</Text>
                  </InlineStack>
                  <Text variant="bodySm" tone="subdued">0 mentions (0%)</Text>
                </InlineStack>
                <ProgressBar progress={0} size="small" tone="highlight" />
              </BlockStack>
            </div>

            <div
              role="button"
              tabIndex={0}
              className="ai-model-card qwen"
              onClick={() => shopify.toast?.show("Qwen 3.8 Flash model is active for GEO.")}
              onKeyDown={handleKeyDown(() => shopify.toast?.show("Qwen 3.8 Flash model is active for GEO."))}
            >
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="200" blockAlign="center">
                    <span style={{ fontSize: "16px" }}>⚡</span>
                    <Text variant="bodyMd" fontWeight="semibold">Qwen 3.8 Flash (Owen)</Text>
                  </InlineStack>
                  <Text variant="bodySm" tone="subdued">0 mentions (0%)</Text>
                </InlineStack>
                <ProgressBar progress={0} size="small" tone="primary" />
              </BlockStack>
            </div>
          </BlockStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default AiCitationsModal;
