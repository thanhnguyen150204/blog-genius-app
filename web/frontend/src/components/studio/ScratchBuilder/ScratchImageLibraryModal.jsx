import { useState, useEffect } from "react";
import { Modal, BlockStack, InlineStack, Text, Button, TextField, Box } from "@shopify/polaris";
import { MagicIcon } from "@shopify/polaris-icons";
import {
  getImageLibrary,
  addImageToLibrary,
} from "../../../mock/imageLibraryData";

export function ScratchImageLibraryModal({
  open,
  onClose,
  onSelectImage,
  isAiMode = false,
}) {
  const [images, setImages] = useState([]);
  const [aiPrompt, setAiPrompt] = useState(
    "Place the product on a dark slate stone surface against a moody charcoal background, dramatic side lighting casting soft shadows, luxury aesthetic, high-end commercial photo."
  );
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (open) {
      setImages(getImageLibrary());
    }
  }, [open]);

  const handleGenerateAi = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const generatedUrl =
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80";
      const generatedFilename = `ai-gen-${Date.now()}.png`;

      addImageToLibrary({
        url: generatedUrl,
        filename: generatedFilename,
        title: "AI Generated Visual Banner",
      });

      onSelectImage(generatedUrl, generatedFilename);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isAiMode ? "Generate Featured Image with AI" : "Select image"}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        {isAiMode ? (
          <BlockStack gap="300">
            <Text variant="bodySm" tone="subdued">
              Enter visual prompt description to generate an ecommerce featured banner:
            </Text>
            <TextField
              label="Prompt"
              labelHidden
              multiline={3}
              value={aiPrompt}
              onChange={setAiPrompt}
              placeholder="Describe the image you want AI to create..."
              autoComplete="off"
            />
            <InlineStack align="end">
              <Button
                variant="primary"
                icon={MagicIcon}
                loading={isGenerating}
                onClick={handleGenerateAi}
              >
                Generate Image
              </Button>
            </InlineStack>
          </BlockStack>
        ) : (
          <div
            style={{
              maxHeight: "460px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            <BlockStack gap="0">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 8px",
                    borderBottom: idx < images.length - 1 ? "1px solid #f1f2f4" : "none",
                    gap: "24px",
                  }}
                >
                  <Button
                    size="slim"
                    onClick={() => {
                      onSelectImage(img.url, img.filename);
                      onClose();
                    }}
                  >
                    Select
                  </Button>

                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "6px",
                      border: "1px solid #e4e4e7",
                      backgroundColor: "#fafafa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.filename || img.title}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="bodySm" as="span" tone="base" breakWord>
                      {img.filename || img.title}
                    </Text>
                  </div>
                </div>
              ))}
            </BlockStack>
          </div>
        )}
      </Modal.Section>
    </Modal>
  );
}

export default ScratchImageLibraryModal;

