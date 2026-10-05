import { useState } from "react";
import { BlockStack, Text, Button, Modal, InlineStack, Icon } from "@shopify/polaris";
import { DatabaseIcon, CollectionIcon, MagicIcon } from "@shopify/polaris-icons";

export function BusinessContextCard({
  businessDesc = "",
  onBusinessDescChange,
  targetCustomer = "",
  onTargetCustomerChange,
  onInsertProduct,
  onInsertCollection,
}) {
  // Modal state: null | 'business' | 'customer'
  const [activeModal, setActiveModal] = useState(null);
  const [draftText, setDraftText] = useState("");

  const handleOpenModal = (type) => {
    setActiveModal(type);
    setDraftText(type === "business" ? businessDesc : targetCustomer);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setDraftText("");
  };

  const handleSaveModal = () => {
    if (activeModal === "business") {
      onBusinessDescChange(draftText);
    } else if (activeModal === "customer") {
      onTargetCustomerChange(draftText);
    }
    handleCloseModal();
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "16px",
        width: "100%",
      }}
    >
      {/* Column 1: Business description */}
      <BlockStack gap="150">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="bodySm" fontWeight="medium" as="label">
            Business description
          </Text>
          <button
            type="button"
            onClick={() => handleOpenModal("business")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Edit
          </button>
        </div>

        {/* Readonly preview box matching sample */}
        <div
          style={{
            position: "relative",
            border: "1px solid #e4e4e7",
            borderRadius: "8px",
            backgroundColor: "#f4f4f5",
            padding: "10px 12px 28px 12px",
            minHeight: "84px",
            cursor: "default",
            userSelect: "none",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: businessDesc ? "#18181b" : "#71717a",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: "1.4",
              minHeight: "44px",
            }}
          >
            {businessDesc || "Enter your business description for better AI content generation"}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              right: "12px",
              fontSize: "11px",
              color: "#71717a",
              fontWeight: 500,
            }}
          >
            {businessDesc.length}/500
          </div>
        </div>

        <Button
          variant="secondary"
          fullWidth
          icon={DatabaseIcon}
          onClick={onInsertProduct}
        >
          Insert a product into the post
        </Button>
      </BlockStack>

      {/* Column 2: Target customer */}
      <BlockStack gap="150">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="bodySm" fontWeight="medium" as="label">
            Target customer
          </Text>
          <button
            type="button"
            onClick={() => handleOpenModal("customer")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0",
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Edit
          </button>
        </div>

        {/* Readonly preview box matching sample */}
        <div
          style={{
            position: "relative",
            border: "1px solid #e4e4e7",
            borderRadius: "8px",
            backgroundColor: "#f4f4f5",
            padding: "10px 12px 28px 12px",
            minHeight: "84px",
            cursor: "default",
            userSelect: "none",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: targetCustomer ? "#18181b" : "#71717a",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: "1.4",
              minHeight: "44px",
            }}
          >
            {targetCustomer || "Enter your target customer description for better AI content generation"}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              right: "12px",
              fontSize: "11px",
              color: "#71717a",
              fontWeight: 500,
            }}
          >
            {targetCustomer.length}/500
          </div>
        </div>

        <Button
          variant="secondary"
          fullWidth
          icon={CollectionIcon}
          onClick={onInsertCollection}
        >
          Insert a collection into the post
        </Button>
      </BlockStack>

      {/* Edit Modal matching sample screenshot */}
      <Modal
        open={Boolean(activeModal)}
        onClose={handleCloseModal}
        title={activeModal === "business" ? "Edit Business description" : "Edit Target customer"}
        primaryAction={{
          content: "Save",
          onAction: handleSaveModal,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleCloseModal,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text variant="bodySm" tone="subdued">
              {activeModal === "business"
                ? "Describe your business to help generate better AI content. This will be used to create more relevant and targeted content."
                : "Describe your target customer to help generate better AI content. This will be used to create more relevant and targeted content."}
            </Text>

            {/* Input textarea box */}
            <div
              style={{
                position: "relative",
                border: "1px solid #d4d4d8",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                padding: "12px 14px 28px 14px",
              }}
            >
              <textarea
                value={draftText}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDraftText(e.target.value);
                  }
                }}
                placeholder={
                  activeModal === "business"
                    ? "Enter your business description for better AI content generation"
                    : "Enter your target customer description for better AI content generation"
                }
                rows={5}
                style={{
                  width: "100%",
                  border: "none",
                  backgroundColor: "transparent",
                  resize: "vertical",
                  outline: "none",
                  fontSize: "13px",
                  color: "#18181b",
                  fontFamily: "inherit",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  fontSize: "11px",
                  color: "#71717a",
                  fontWeight: 500,
                }}
              >
                {draftText.length}/500
              </div>
            </div>

            {/* Generate with AI helper info */}
            <BlockStack gap="100">
              <Text variant="bodyXs" tone="subdued">
                Remove password to generate with AI
              </Text>
              <div>
                <Button disabled icon={MagicIcon} size="slim">
                  Generate with AI
                </Button>
              </div>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default BusinessContextCard;
