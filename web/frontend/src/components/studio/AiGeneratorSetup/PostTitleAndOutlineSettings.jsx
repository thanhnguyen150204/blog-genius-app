import { useState, useRef } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  Checkbox,
  Icon,
  Modal,
  ProgressBar,
} from "@shopify/polaris";
import {
  MagicIcon,
  UploadIcon,
  ImageIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { OutlineModal } from "./OutlineModal";

const LIBRARY_IMAGES = [
  {
    id: "img-cat",
    title: "Cat Reference",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt:
      "Place the product on a dark slate stone surface against a moody charcoal background, dramatic side lighting casting soft shadows, luxury aesthetic, high-end commercial photo.",
  },
  {
    id: "img-sneaker",
    title: "Sport Sneaker",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt: "A sneaker made of colorful disco ball",
  },
  {
    id: "img-watch",
    title: "Minimal Watch",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt:
      "Luxury watch placed on polished white marble with soft morning shadows.",
  },
  {
    id: "img-headphones",
    title: "Studio Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt:
      "Modern headphones surrounded by vibrant geometric audio waves.",
  },
  {
    id: "img-bottle",
    title: "Cosmetic Bottle",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt:
      "Skincare bottle on smooth river stones with water ripple reflections.",
  },
  {
    id: "img-backpack",
    title: "Travel Backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80",
    suggestedPrompt:
      "Durable backpack on a scenic mountain summit at golden hour.",
  },
];

export function PostTitleAndOutlineSettings({
  title = "",
  onTitleChange,
  onGenerateTitle,
  outline = [],
  onOutlineChange,
  keywords = "",
  generateFeaturedImage = true,
  onToggleGenerateFeaturedImage,
  productImage = null,
  onProductImageChange,
  featuredImagePrompt = "",
  onFeaturedImagePromptChange,
  featuredImageQuality = "Medium",
  onFeaturedImageQualityChange,
  onGenerate,
  isGenerating = false,
  generatingProgress = 20,
  generatingStep = "Step 1/3: Analyzing topic & outline...",
  error = false,
  onOutlineValidationError,
}) {
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isOutlineGenerating, setIsOutlineGenerating] = useState(false);
  const [outlineGenProgress, setOutlineGenProgress] = useState(10);
  const [outlineGenStep, setOutlineGenStep] = useState("Step 1/3: Analyzing topic & outline...");
  const [outlineText, setOutlineText] = useState(
    typeof outline === "string"
      ? outline
      : Array.isArray(outline) && outline.length > 0
      ? outline
          .map((o) => {
            const level = o.level || (o.type === "heading" ? o.level : "");
            const prefix =
              level === "h1"
                ? "Heading 1: "
                : level === "h2"
                ? "Heading 2: "
                : level === "h3"
                ? "Heading 3: "
                : "";
            return `${prefix}${o.title || o.text || ""}`;
          })
          .join("\n")
      : ""
  );

  const [isInputFocused, setIsInputFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveOutline = (savedText) => {
    setOutlineText(savedText);
    if (onOutlineChange) {
      onOutlineChange(savedText);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (onProductImageChange) {
          onProductImageChange(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectLibraryImage = (item) => {
    if (onProductImageChange) {
      onProductImageChange(item.url);
    }
    if (!featuredImagePrompt && onFeaturedImagePromptChange && item.suggestedPrompt) {
      onFeaturedImagePromptChange(item.suggestedPrompt);
    }
    setIsLibraryModalOpen(false);
  };

  const hasOutline = Boolean(
    outlineText && outlineText.replace(/<[^>]*>/g, "").trim()
  );

  return (
    <BlockStack gap="400">
      <BlockStack gap="100">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text variant="bodySm" fontWeight="medium" as="label">
            Post title <span style={{ color: "#9e2a2b" }}>*</span>
          </Text>
          <button
            type="button"
            onClick={onGenerateTitle}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 400,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#18181b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <span>Generate title</span>
            <Icon source={MagicIcon} tone="subdued" />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "36px",
            padding: "0 12px",
            borderRadius: "8px",
            border: error
              ? "1px solid #9e2a2b"
              : isInputFocused
              ? "2px solid #005bd3"
              : "1px solid #8c9196",
            backgroundColor: error ? "#fbf2f2" : "#ffffff",
            boxShadow: isInputFocused && !error ? "0 0 0 1px #005bd3" : "none",
            transition: "border-color 0.15s ease, background-color 0.15s ease",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="e.g. 10 Essential SEO & GEO Tactics for Shopify Success in 2026"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "13px",
              color: "#18181b",
              fontFamily: "inherit",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "4px",
            }}
          >
            <span
              style={{
                color: "#9e2a2b",
                display: "flex",
                alignItems: "center",
                width: "15px",
                height: "15px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span
              style={{
                color: "#9e2a2b",
                fontSize: "12px",
                fontWeight: 400,
              }}
            >
              Post title is required!
            </span>
          </div>
        )}
      </BlockStack>

      <Button
        variant="secondary"
        fullWidth
        onClick={() => setIsOutlineModalOpen(true)}
      >
        {hasOutline ? "Added outline" : "Add outline"}
      </Button>

      <BlockStack gap="300">
        <Checkbox
          label="Generate featured image"
          checked={generateFeaturedImage}
          onChange={onToggleGenerateFeaturedImage}
        />

        {generateFeaturedImage && (
          <BlockStack gap="300">
            <BlockStack gap="150">
              <Text variant="bodySm" as="span" tone="base">
                Product Reference Image (Optional)
              </Text>

              {productImage ? (
                <InlineStack gap="300" align="start" blockAlign="center">
                  <img
                    src={productImage}
                    alt="Product reference"
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      border: "1px solid #d4d4d8",
                    }}
                  />
                  <Button
                    icon={DeleteIcon}
                    tone="critical"
                    variant="secondary"
                    onClick={() => onProductImageChange && onProductImageChange(null)}
                  >
                    Remove product image
                  </Button>
                </InlineStack>
              ) : (
                <InlineStack gap="200" align="start">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <Button
                    icon={UploadIcon}
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload image
                  </Button>
                  <Button
                    icon={ImageIcon}
                    variant="secondary"
                    onClick={() => setIsLibraryModalOpen(true)}
                  >
                    Select from library
                  </Button>
                </InlineStack>
              )}
            </BlockStack>

            <BlockStack gap="150">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text variant="bodySm" as="span">
                  Describe the featured image (optional)
                </Text>

                <InlineStack gap="200" align="center">
                  <Text variant="bodySm" as="span">
                    Featured image quality
                  </Text>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid #d4d4d8",
                      borderRadius: "8px",
                      backgroundColor: "#ffffff",
                      overflow: "hidden",
                    }}
                  >
                    {["Low", "Medium", "High"].map((q) => {
                      const isSelected = featuredImageQuality === q;
                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() =>
                            onFeaturedImageQualityChange &&
                            onFeaturedImageQualityChange(q)
                          }
                          style={{
                            border: "none",
                            padding: "4px 12px",
                            fontSize: "12px",
                            fontWeight: isSelected ? "600" : "400",
                            backgroundColor: isSelected ? "#8c9196" : "transparent",
                            color: isSelected ? "#ffffff" : "#18181b",
                            cursor: "pointer",
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                </InlineStack>
              </div>

              <div
                style={{
                  border: "1px solid #8c9196",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  padding: "8px 12px",
                }}
              >
                <textarea
                  rows={3}
                  value={featuredImagePrompt}
                  onChange={(e) =>
                    onFeaturedImagePromptChange &&
                    onFeaturedImagePromptChange(e.target.value.slice(0, 300))
                  }
                  placeholder="Place the product on a dark slate stone surface against a moody charcoal background, dramatic side lighting casting soft shadows, luxury aesthetic, high-end commercial photo."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "none",
                    fontSize: "13px",
                    color: "#18181b",
                    fontFamily: "inherit",
                    backgroundColor: "transparent",
                    lineHeight: "1.5",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    color: "#8c9196",
                    fontSize: "12px",
                    marginTop: "4px",
                  }}
                >
                  {featuredImagePrompt ? featuredImagePrompt.length : 0}/300
                </div>
              </div>
            </BlockStack>
          </BlockStack>
        )}
      </BlockStack>

      {(isGenerating || isOutlineGenerating) && (
        <BlockStack gap="150">
          <InlineStack align="space-between" blockAlign="center">
            <Text variant="bodyXs" fontWeight="medium" tone="base">
              {isOutlineGenerating
                ? outlineGenStep
                : generatingStep || "Step 1/3: Analyzing topic & outline..."}
            </Text>
            <Text variant="bodyXs" tone="subdued">
              {isOutlineGenerating
                ? `${outlineGenProgress}%`
                : `${generatingProgress || 20}%`}
            </Text>
          </InlineStack>
          <ProgressBar
            progress={
              isOutlineGenerating
                ? outlineGenProgress
                : generatingProgress || 20
            }
            size="small"
            tone="primary"
          />
        </BlockStack>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingTop: "12px",
        }}
      >
        <Button
          variant="primary"
          icon={MagicIcon}
          loading={isGenerating}
          onClick={onGenerate}
          size="large"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      <OutlineModal
        open={isOutlineModalOpen}
        onClose={() => {
          setIsOutlineModalOpen(false);
          setIsOutlineGenerating(false);
        }}
        outlineContent={outlineText}
        onSave={handleSaveOutline}
        postTitle={title}
        keywords={Array.isArray(keywords) ? keywords.join(", ") : keywords}
        onValidationError={onOutlineValidationError}
        onGeneratingProgress={(isGen, prog, step) => {
          setIsOutlineGenerating(isGen);
          setOutlineGenProgress(prog);
          setOutlineGenStep(step);
        }}
      />

      <Modal
        open={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        title="Select Product Image from Library"
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsLibraryModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="300">
            <Text variant="bodySm" tone="subdued">
              Choose a reference product image to guide the AI generated featured image composition:
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              {LIBRARY_IMAGES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectLibraryImage(item)}
                  style={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    backgroundColor: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "110px",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ padding: "8px" }}>
                    <Text variant="bodySm" fontWeight="medium">
                      {item.title}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
}

export default PostTitleAndOutlineSettings;
