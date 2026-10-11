import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  Badge,
} from "@shopify/polaris";

export default function BuyCreditsModal({
  isOpen,
  onClose,
  selectedCreditPack,
  setSelectedCreditPack,
  onBuyCredits,
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Buy Lifetime AI Credits"
      primaryAction={{
        content: `Purchase for $${selectedCreditPack.price}`,
        onAction: onBuyCredits,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="bodySm" tone="subdued">
            Lifetime credits never expire and will be consumed after monthly credits:
          </Text>

          <BlockStack gap="200">
            {[
              { id: "pack-50", credits: 50, price: 4.99 },
              { id: "pack-200", credits: 200, price: 14.99, save: "Save 25%" },
              { id: "pack-500", credits: 500, price: 29.99, save: "Save 40%" },
            ].map((pack) => {
              const isSelected = selectedCreditPack.id === pack.id;
              return (
                <div
                  key={pack.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedCreditPack(pack)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedCreditPack(pack);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    border: isSelected ? "2px solid #005bd3" : "1px solid #e1e3e5",
                    backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                    padding: "12px 16px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="050">
                      <Text variant="bodyMd" fontWeight="bold">
                        {pack.credits} AI Credits
                      </Text>
                      <Text variant="bodyXs" tone="subdued">
                        Lifetime validity • Never expires
                      </Text>
                    </BlockStack>

                    <InlineStack gap="200" blockAlign="center">
                      {pack.save && <Badge tone="success">{pack.save}</Badge>}
                      <Text variant="headingMd" as="span" fontWeight="bold">
                        ${pack.price}
                      </Text>
                    </InlineStack>
                  </InlineStack>
                </div>
              );
            })}
          </BlockStack>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
