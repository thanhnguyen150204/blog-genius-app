import { useState, useRef, useEffect } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  RadioButton,
  Select,
  TextField,
  Card,
  Box,
  Divider,
  Modal,
} from "@shopify/polaris";
import {
  UploadIcon,
  ImageIcon,
  MagicIcon,
  DeleteIcon,
  LanguageIcon,
  DesktopIcon,
  TabletIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import { addImageToLibrary } from "../../../mock/imageLibraryData";

export function ScratchSidebarPostSettings({
  postData,
  onChange,
  onOpenLibraryModal,
  onOpenAiImageModal,
  isEditMode = false,
}) {
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [configDevice, setConfigDevice] = useState("desktop");
  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false);
  const [editUrlBlog, setEditUrlBlog] = useState(postData.blogCategory || "News");
  const [editUrlHandle, setEditUrlHandle] = useState("");
  const isInitialCustom =
    Boolean(postData.author) &&
    postData.author !== "Default (Store Default)";
  const [isCustomAuthor, setIsCustomAuthor] = useState(isInitialCustom);
  const [customAuthorName, setCustomAuthorName] = useState(
    isInitialCustom ? postData.author : ""
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    const isCustom =
      Boolean(postData.author) &&
      postData.author !== "Default (Store Default)";
    setIsCustomAuthor(isCustom);
    if (isCustom) {
      setCustomAuthorName(postData.author);
    }
  }, [postData.author]);

  const languageOptions = [
    { label: "English (Primary)", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
    { label: "French (Français)", value: "fr" },
    { label: "German (Deutsch)", value: "de" },
    { label: "Spanish (Español)", value: "es" },
  ];

  const authorOptions = [
    { label: "Default (Store Default)", value: "default" },
    { label: "Custom author...", value: "custom" },
  ];

  const blogOptions = [
    { label: "Please select", value: "" },
    { label: "News", value: "News" },
  ];

  const imageSizeOptions = [
    { label: "Original size", value: "original" },
    { label: "Inline (16px)", value: "16px" },
    { label: "Icon (32px)", value: "32px" },
    { label: "Thumbnail (50px)", value: "50px" },
    { label: "Small logo (100px)", value: "100px" },
    { label: "Logo (160px)", value: "160px" },
    { label: "Product thumbnail (240px)", value: "240px" },
    { label: "Product image (480px)", value: "480px" },
    { label: "Banner image (600px)", value: "600px" },
    { label: "Wallpaper (1024px)", value: "1024px" },
    { label: "Wallpaper (2048px)", value: "2048px" },
    { label: "Full width (100%)", value: "100%" },
    { label: "Custom...", value: "custom" },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        onChange({ featuredImage: dataUrl });
        addImageToLibrary({
          url: dataUrl,
          filename: file.name,
          title: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleOpenEditUrlModal = () => {
    setEditUrlBlog(postData.blogCategory || "News");
    setEditUrlHandle(currentHandle);
    setIsEditUrlModalOpen(true);
  };

  const handleSaveEditUrl = () => {
    const cleanHandle = (editUrlHandle || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    onChange({
      blogCategory: editUrlBlog,
      handle: cleanHandle,
    });
    setIsEditUrlModalOpen(false);
  };

  const handleSaveImageUrl = () => {
    if (imageUrlInput.trim()) {
      const url = imageUrlInput.trim();
      const filename = url.split("/").pop()?.split("?")[0] || `image-${Date.now()}.png`;
      onChange({ featuredImage: url });
      addImageToLibrary({
        url,
        filename,
        title: filename,
      });
      setImageUrlInput("");
    }
  };

  const handleAutoFillAlt = () => {
    const autoAlt = postData.title
      ? `Featured image illustrating ${postData.title}`
      : "Shopify Ecommerce Article Featured Graphic";
    onChange({ imageAlt: autoAlt });
  };

  const handleGenerateExcerpt = () => {
    const gen = `Comprehensive guide on ${postData.title || "ecommerce strategies"}, providing actionable tactics, data frameworks, and expert GEO optimization tips.`;
    onChange({ excerpt: gen });
  };

  const handleGenerateTags = () => {
    const tags = ["ecommerce", "shopify", "geo-seo", "2026-trends", "content-marketing"];
    onChange({ tags: tags.join(", ") });
  };

  const handleSuggestLinks = () => {
    const sampleLinks = [
      { title: "10 Proven Shopify SEO Tactics for 2026", url: "/blogs/news/shopify-seo-tactics" },
      { title: "How to Optimize for Google AI Overviews", url: "/blogs/news/google-ai-overviews" },
    ];
    onChange({ internalLinks: sampleLinks });
  };

  const handleAutoFillSeoTitle = () => {
    onChange({ seoTitle: postData.title || "Shopify Ecommerce Guide" });
  };

  const handleGenerateMetaDesc = () => {
    const desc = `Discover the ultimate guide on ${postData.title || "ecommerce strategies"}. Master SEO and GEO search rankings for your Shopify store.`;
    onChange({ metaDescription: desc });
  };

  const currentHandle =
    postData.handle ||
    (postData.title || "this-is-the-blog-post-title-2")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const seoTitleLength = (postData.seoTitle || postData.title || "").length;
  const seoTitlePercent = Math.min(100, (seoTitleLength / 60) * 100);
  const isSeoTitleGood = seoTitleLength >= 30 && seoTitleLength <= 65;

  return (
    <div
      style={{
        width: "360px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e4e4e7",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Sticky Language Selector Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#ffffff",
          padding: "12px 16px",
          borderBottom: "1px solid #f1f2f4",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1 }}>
          <Select
            label="Language"
            labelHidden
            options={languageOptions}
            value={postData.language || "en"}
            onChange={(val) => onChange({ language: val })}
          />
        </div>

        <Button
          icon={LanguageIcon}
          variant="tertiary"
          accessibilityLabel="Translate language"
        />
      </div>

      {/* Scrollable Form Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Post Visibility */}
        <BlockStack gap="150">
          <Text variant="headingSm" as="h3" fontWeight="bold">
            Post
          </Text>

          <BlockStack gap="100">
            <Text variant="bodySm" fontWeight="medium" tone="subdued">
              Visibility
            </Text>
            <InlineStack gap="300">
              <RadioButton
                label="Visible"
                disabled={!isEditMode}
                checked={isEditMode ? postData.visibility === "visible" : false}
                id="visibility-visible"
                name="visibility"
                onChange={() => onChange({ visibility: "visible" })}
              />
              <RadioButton
                label="Hidden"
                disabled={!isEditMode}
                checked={isEditMode ? postData.visibility === "hidden" : false}
                id="visibility-hidden"
                name="visibility"
                onChange={() => onChange({ visibility: "hidden" })}
              />
            </InlineStack>
          </BlockStack>
        </BlockStack>

        {/* Featured Image */}
        <BlockStack gap="200">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Featured Image
            </Text>
            <Button
              variant="plain"
              icon={MagicIcon}
              onClick={onOpenAiImageModal}
            >
              Generate with AI
            </Button>
          </InlineStack>

          <div
            style={{
              border: "1px dashed #d4d4d8",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#fafafa",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {postData.featuredImage ? (
              <BlockStack gap="200">
                <img
                  src={postData.featuredImage}
                  alt={postData.imageAlt || "Featured preview"}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #e4e4e7",
                  }}
                />
                <InlineStack gap="200" align="center">
                  <Button size="slim" icon={UploadIcon} onClick={() => fileInputRef.current?.click()}>
                    Replace
                  </Button>
                  <Button
                    size="slim"
                    icon={DeleteIcon}
                    tone="critical"
                    variant="plain"
                    onClick={() => onChange({ featuredImage: null })}
                  >
                    Remove
                  </Button>
                </InlineStack>
              </BlockStack>
            ) : (
              <InlineStack gap="200" align="center">
                <Button size="slim" icon={UploadIcon} onClick={() => fileInputRef.current?.click()}>
                  Upload file
                </Button>
                <Button size="slim" icon={ImageIcon} onClick={onOpenLibraryModal}>
                  Select from library
                </Button>
              </InlineStack>
            )}
          </div>

          <TextField
            label="or Insert image URL"
            value={imageUrlInput}
            onChange={setImageUrlInput}
            placeholder="https://..."
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveImageUrl();
              }
            }}
            connectedRight={
              <Button onClick={handleSaveImageUrl} disabled={!imageUrlInput.trim()}>
                Save
              </Button>
            }
          />

          <BlockStack gap="100">
            <InlineStack align="space-between">
              <Text variant="bodySm" tone="subdued">
                Image alt
              </Text>
              <Button variant="plain" onClick={handleAutoFillAlt}>
                Auto fill
              </Button>
            </InlineStack>
            <TextField
              label="Image alt"
              labelHidden
              value={postData.imageAlt || ""}
              onChange={(val) => onChange({ imageAlt: val.slice(0, 250) })}
              placeholder="Describe image for SEO & accessibility"
              autoComplete="off"
            />
            <Text variant="bodyXs" tone="subdued">
              {(postData.imageAlt || "").length}/250
            </Text>
          </BlockStack>

          {/* Image size scope */}
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodySm" tone="subdued">
                Image size scope
              </Text>
              <ButtonGroup variant="segmented">
                <Button
                  size="slim"
                  pressed={(postData.imageScope || "All devices") === "All devices"}
                  onClick={() => onChange({ imageScope: "All devices" })}
                >
                  All devices
                </Button>
                <Button
                  size="slim"
                  pressed={(postData.imageScope || "All devices") === "Per device"}
                  onClick={() => onChange({ imageScope: "Per device" })}
                >
                  Per device
                </Button>
              </ButtonGroup>
            </InlineStack>

            {postData.imageScope === "Per device" ? (
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="bodySm" tone="subdued">
                    Select device to config:
                  </Text>
                  <ButtonGroup variant="segmented">
                    <Button
                      size="slim"
                      icon={DesktopIcon}
                      pressed={configDevice === "desktop"}
                      onClick={() => setConfigDevice("desktop")}
                      accessibilityLabel="Desktop config"
                    />
                    <Button
                      size="slim"
                      icon={TabletIcon}
                      pressed={configDevice === "tablet"}
                      onClick={() => setConfigDevice("tablet")}
                      accessibilityLabel="Tablet config"
                    />
                    <Button
                      size="slim"
                      icon={MobileIcon}
                      pressed={configDevice === "mobile"}
                      onClick={() => setConfigDevice("mobile")}
                      accessibilityLabel="Mobile config"
                    />
                  </ButtonGroup>
                </InlineStack>

                <Select
                  label={`${configDevice.charAt(0).toUpperCase() + configDevice.slice(1)} image size`}
                  options={imageSizeOptions}
                  value={
                    postData.deviceImageSizes?.[configDevice] ||
                    (configDevice === "mobile" ? "100%" : "original")
                  }
                  onChange={(val) => {
                    const currentSizes = postData.deviceImageSizes || {
                      desktop: "original",
                      tablet: "original",
                      mobile: "100%",
                    };
                    onChange({
                      deviceImageSizes: {
                        ...currentSizes,
                        [configDevice]: val,
                      },
                    });
                  }}
                />
              </BlockStack>
            ) : (
              <BlockStack gap="150">
                <Select
                  label="Desktop image size"
                  options={imageSizeOptions}
                  value={postData.imageSize || "original"}
                  onChange={(val) => onChange({ imageSize: val })}
                />
                {postData.imageSize === "custom" && (
                  <TextField
                    label="Custom size (e.g. 750px or 80%)"
                    value={postData.customImageSize || ""}
                    onChange={(val) => onChange({ customImageSize: val })}
                    placeholder="750px"
                    autoComplete="off"
                  />
                )}
              </BlockStack>
            )}
          </BlockStack>
        </BlockStack>

        <Divider />

        {/* Excerpt */}
        <BlockStack gap="150">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Excerpt
            </Text>
            <Button variant="plain" icon={MagicIcon} onClick={handleGenerateExcerpt}>
              Generate with AI
            </Button>
          </InlineStack>
          <TextField
            label="Excerpt"
            labelHidden
            multiline={3}
            value={postData.excerpt || ""}
            onChange={(val) => onChange({ excerpt: val })}
            placeholder="Eg: Add a summary of the post to appear on your home page or blog."
            autoComplete="off"
          />
        </BlockStack>

        <Divider />

        {/* Author & Blog */}
        <BlockStack gap="300">
          <Select
            label="Author"
            options={authorOptions}
            value={isCustomAuthor ? "custom" : "default"}
            onChange={(val) => {
              if (val === "custom") {
                setIsCustomAuthor(true);
                onChange({ author: customAuthorName || "" });
              } else {
                setIsCustomAuthor(false);
                onChange({ author: "Default (Store Default)" });
              }
            }}
          />
          {isCustomAuthor && (
            <TextField
              label="Custom author name"
              value={customAuthorName}
              onChange={(val) => {
                setCustomAuthorName(val);
                onChange({ author: val });
              }}
              placeholder="Enter author name"
              autoComplete="off"
            />
          )}
          <Select
            label="Blog"
            requiredIndicator
            options={blogOptions}
            value={postData.blogCategory !== undefined ? postData.blogCategory : "News"}
            onChange={(val) => onChange({ blogCategory: val })}
          />

          <TextField
            label="Keywords"
            value={postData.keyword || ""}
            onChange={(val) => onChange({ keyword: val })}
            placeholder="viet nam"
            autoComplete="off"
          />

          <BlockStack gap="100">
            <InlineStack align="space-between">
              <Text variant="bodySm" tone="subdued">
                Tags
              </Text>
              <Button variant="plain" icon={MagicIcon} onClick={handleGenerateTags}>
                Generate with AI
              </Button>
            </InlineStack>
            <TextField
              label="Tags"
              labelHidden
              value={postData.tags || ""}
              onChange={(val) => onChange({ tags: val })}
              placeholder="Vietnam, champions, victory, sports, national pride"
              autoComplete="off"
            />
          </BlockStack>
        </BlockStack>

        <Divider />

        {/* Internal Links */}
        <BlockStack gap="150">
          <InlineStack align="space-between">
            <Text variant="bodySm" fontWeight="bold">
              Internal Links ({postData.internalLinks ? postData.internalLinks.length : 0})
            </Text>
            <Button variant="plain" onClick={handleSuggestLinks}>
              Suggest Links
            </Button>
          </InlineStack>
          {postData.internalLinks && postData.internalLinks.length > 0 ? (
            <BlockStack gap="100">
              {postData.internalLinks.map((link, idx) => (
                <Box
                  key={idx}
                  padding="200"
                  background="bg-surface-secondary"
                  borderRadius="200"
                  borderWidth="025"
                  borderColor="border"
                >
                  <Text variant="bodySm" tone="interactive">
                    {link.title}
                  </Text>
                </Box>
              ))}
            </BlockStack>
          ) : (
            <Text variant="bodyXs" tone="subdued">
              No internal links added yet. Click &quot;Suggest Links&quot; to auto-link with other blogs.
            </Text>
          )}
        </BlockStack>

        <Divider />

          {/* Search Engine Listing Preview (Read-only real-time card) */}
          <BlockStack gap="200">
            <Text variant="bodySm" fontWeight="bold">
              Search Engine listing
            </Text>

            <Card padding="300" background="bg-surface-secondary">
              <BlockStack gap="050">
                <Text variant="headingSm" as="h4" tone="interactive">
                  {postData.seoTitle || postData.title || "Vietnam Crowned Champions—Deal With It"}
                </Text>
                <Text variant="bodyXs" tone="subdued">
                  https://thanh-store-oc3uxhrm.myshopify.com/blogs/{(postData.blogCategory || "news").toLowerCase()}/{currentHandle}
                </Text>
                <Text variant="bodySm" tone="subdued">
                  {postData.metaDescription || "Vietnam champions, and here's the case: heart, grit, and tactics that outclassed rivals. Doubt it? See why the win wasn't luck - it was inevitability."}
                </Text>
              </BlockStack>
            </Card>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  SEO title <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button variant="plain" onClick={handleAutoFillSeoTitle}>
                  Auto fill
                </Button>
              </InlineStack>
              <TextField
                label="SEO title"
                labelHidden
                value={postData.seoTitle !== undefined ? postData.seoTitle : (postData.title || "")}
                onChange={(val) => onChange({ seoTitle: val })}
                placeholder="SEO title"
                autoComplete="off"
              />
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e4e4e7",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${seoTitlePercent}%`,
                    height: "100%",
                    backgroundColor: isSeoTitleGood ? "#16a34a" : "#ea580c",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <Text variant="bodyXs" tone="subdued" alignment="end">
                {seoTitleLength} characters
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  Meta description <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button variant="plain" icon={MagicIcon} onClick={handleGenerateMetaDesc}>
                  Generate with AI
                </Button>
              </InlineStack>
              <TextField
                label="Meta description"
                labelHidden
                multiline={3}
                value={postData.metaDescription !== undefined ? postData.metaDescription : ""}
                onChange={(val) => onChange({ metaDescription: val.slice(0, 320) })}
                placeholder="Vietnam champions, and here's the case: heart, grit, and tactics that outclassed rivals..."
                autoComplete="off"
              />
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#e4e4e7",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, ((postData.metaDescription || "").length / 160) * 100)}%`,
                    height: "100%",
                    backgroundColor: (postData.metaDescription || "").length >= 100 && (postData.metaDescription || "").length <= 160 ? "#16a34a" : "#ea580c",
                    transition: "width 0.2s ease",
                  }}
                />
              </div>
              <Text variant="bodyXs" tone="subdued" alignment="end">
                {(postData.metaDescription || "").length} characters
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <InlineStack align="space-between">
                <Text variant="bodySm" tone="subdued">
                  URL and handle <span style={{ color: "#9e2a2b" }}>*</span>
                </Text>
                <Button
                  variant="plain"
                  onClick={handleOpenEditUrlModal}
                >
                  Edit
                </Button>
              </InlineStack>
              <TextField
                label="URL and handle"
                labelHidden
                prefix={`/${(postData.blogCategory || "news").toLowerCase()}/`}
                readOnly
                value={currentHandle}
                autoComplete="off"
              />
            </BlockStack>
          </BlockStack>
      </div>

      {/* Edit URL Handle Modal matching Shopify standard */}
      <Modal
        open={isEditUrlModalOpen}
        onClose={() => setIsEditUrlModalOpen(false)}
        title="Edit URL handle"
        primaryAction={{
          content: "Save",
          onAction: handleSaveEditUrl,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsEditUrlModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Select
              label="Blog"
              requiredIndicator
              options={blogOptions}
              value={editUrlBlog}
              onChange={setEditUrlBlog}
            />
            <TextField
              label="URL handle"
              requiredIndicator
              prefix={`/${(editUrlBlog || "news").toLowerCase()}/`}
              value={editUrlHandle}
              onChange={setEditUrlHandle}
              helpText="The URL handle is used to create the web address for your blog post"
              autoComplete="off"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}

export default ScratchSidebarPostSettings;
