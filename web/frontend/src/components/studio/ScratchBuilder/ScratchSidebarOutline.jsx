import { BlockStack, Text, Button } from "@shopify/polaris";
import { ChevronUpIcon, ChevronDownIcon, DeleteIcon } from "@shopify/polaris-icons";

export function ScratchSidebarOutline({ blocks = [], onMoveUp, onMoveDown, onDelete }) {
  return (
    <div
      style={{
        width: "350px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        overflowY: "auto",
        height: "calc(100vh - 56px)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        flexShrink: 0,
      }}
    >
      <Text variant="headingSm" as="h3" fontWeight="bold">
        Outline &amp; Section Layout
      </Text>

      <Text variant="bodyXs" tone="subdued">
        Reorder or remove sections to craft your structured content hierarchy.
      </Text>

      {blocks.length === 0 ? (
        <div
          style={{
            padding: "24px 12px",
            textAlign: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px dashed #cbd5e1",
          }}
        >
          <Text variant="bodySm" tone="subdued">
            No custom blocks added yet. Click &quot;Add Elements&quot; to insert sections.
          </Text>
        </div>
      ) : (
        <BlockStack gap="150">
          {blocks.map((block, index) => {
            const label =
              block.type === "heading"
                ? `${block.level.toUpperCase()}: ${block.text}`
                : block.type === "paragraph"
                ? `Paragraph: ${block.text.slice(0, 30)}...`
                : block.type === "answer-block"
                ? "GEO Answer Block"
                : block.type === "product"
                ? `Product: ${block.title}`
                : block.type === "faq"
                ? `FAQ: ${block.question.slice(0, 25)}...`
                : block.type === "image"
                ? "Image Banner"
                : block.type === "callout"
                ? `Callout: ${block.title}`
                : "Comparison Table";

            return (
              <div
                key={block.id || index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ flex: 1, minWidth: 0, marginRight: "8px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#6366f1",
                      backgroundColor: "#eef2ff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      marginRight: "6px",
                    }}
                  >
                    {block.type.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#18181b",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {label}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <Button
                    size="slim"
                    icon={ChevronUpIcon}
                    disabled={index === 0}
                    onClick={() => onMoveUp(index)}
                    accessibilityLabel="Move up"
                  />
                  <Button
                    size="slim"
                    icon={ChevronDownIcon}
                    disabled={index === blocks.length - 1}
                    onClick={() => onMoveDown(index)}
                    accessibilityLabel="Move down"
                  />
                  <Button
                    size="slim"
                    icon={DeleteIcon}
                    tone="critical"
                    variant="plain"
                    onClick={() => onDelete(index)}
                    accessibilityLabel="Delete block"
                  />
                </div>
              </div>
            );
          })}
        </BlockStack>
      )}
    </div>
  );
}

export default ScratchSidebarOutline;
