import { Modal, BlockStack, Text, Button, Icon } from "@shopify/polaris";
import { MagicIcon, EditIcon, PlusIcon } from "@shopify/polaris-icons";

export function CreatePostTypeModal({
  open,
  onClose,
  onSelectAiGenerate,
  onSelectScratch,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Blog / Informational"
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="bodySm" tone="subdued">
            Choose how you would like to build your Informational page.
          </Text>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "4px",
            }}
          >
            {/* Card 1: Generate with AI */}
            <div
              onClick={onSelectAiGenerate}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectAiGenerate();
                }
              }}
              style={{
                border: "1.5px solid #e4e4e7",
                borderRadius: "10px",
                padding: "16px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#2563eb";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(37,99,235,0.08)";
                e.currentTarget.style.backgroundColor = "#fafcff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e7";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              <BlockStack gap="200">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon source={MagicIcon} tone="info" />
                  </div>
                  <Text variant="bodyMd" as="h3" fontWeight="bold">
                    Generate with AI
                  </Text>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.45",
                    color: "#71717a",
                    margin: 0,
                  }}
                >
                  Let AI analyze search intent, write optimized copy, format FAQs, and generate structured metadata for SEO &amp; GEO engines.
                </p>
              </BlockStack>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAiGenerate();
                }}
                style={{
                  width: "100%",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  backgroundColor: "#18181b",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "7px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#27272a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#18181b")}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a1 1 0 011 1v1.323l.707.707 1.323.003a1 1 0 011 1v1.323l.707.707.003 1.323a1 1 0 01-1 1l-1.323.003-.707.707V12a1 1 0 01-1 1h-1.323l-.707-.707-1.323-.003a1 1 0 01-1-1v-1.323l-.707-.707-.003-1.323a1 1 0 011-1l1.323-.003.707-.707V3a1 1 0 011-1z" />
                  </svg>
                </span>
                <span>Create with AI</span>
              </button>
            </div>

            {/* Card 2: Build from scratch */}
            <div
              onClick={onSelectScratch}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectScratch();
                }
              }}
              style={{
                border: "1.5px solid #e4e4e7",
                borderRadius: "10px",
                padding: "16px",
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f97316";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(249,115,22,0.08)";
                e.currentTarget.style.backgroundColor = "#fffdfa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e4e4e7";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
                e.currentTarget.style.backgroundColor = "#ffffff";
              }}
            >
              <BlockStack gap="200">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "8px",
                      backgroundColor: "#f4f4f5",
                      color: "#52525b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon source={EditIcon} tone="subdued" />
                  </div>
                  <Text variant="bodyMd" as="h3" fontWeight="bold">
                    Build from scratch
                  </Text>
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.45",
                    color: "#71717a",
                    margin: 0,
                  }}
                >
                  Start with a clean canvas and build your article layout manually using our rich text and drag-and-drop section builder.
                </p>
              </BlockStack>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScratch();
                }}
                style={{
                  width: "100%",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  backgroundColor: "#ffffff",
                  color: "#18181b",
                  border: "1px solid #d4d4d8",
                  borderRadius: "7px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              >
                <span>+ From scratch</span>
              </button>
            </div>
          </div>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default CreatePostTypeModal;
