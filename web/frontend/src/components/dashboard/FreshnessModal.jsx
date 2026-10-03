import { Modal, BlockStack, Card, InlineStack, Text, Badge, Banner } from "@shopify/polaris";

export function FreshnessModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Content Freshness & Recency"
      primaryAction={{
        content: "Close",
        onAction: onClose,
      }}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack gap="200" blockAlign="center">
                <Text variant="headingSm" as="h3">
                  0 posts overdue for refresh
                </Text>
                <Badge tone="warning">Overdue (90+ Days)</Badge>
              </InlineStack>

              <Text variant="bodySm" tone="subdued">
                Generative AI models strongly favor recent information and check publication timestamps to ensure
                data reliability. Articles unupdated for over 90 days suffer diminished citation probability as AI
                bots favor fresher alternatives.
              </Text>

              <BlockStack gap="100">
                <Text variant="bodySm" fontWeight="bold">Status Details</Text>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#52525b", lineHeight: "1.6" }}>
                  <li>Click &ldquo;Quick Refresh&rdquo; to immediately update and re-sync the publication timestamp.</li>
                  <li>Batch update overdue posts in 1 click using bulk republish.</li>
                  <li>Or click &ldquo;Edit&rdquo; to review and add fresh statistics or pricing in the editor.</li>
                </ul>
              </BlockStack>
            </BlockStack>
          </Card>

          <Banner tone="info">
            <Text variant="bodySm" fontWeight="bold">
              All published posts meet this GEO criteria! No action required.
            </Text>
          </Banner>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default FreshnessModal;
