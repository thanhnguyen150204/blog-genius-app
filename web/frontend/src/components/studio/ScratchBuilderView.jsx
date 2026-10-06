import { useState } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Card,
  Button,
  TextField,
  Select,
} from "@shopify/polaris";
import { ArrowLeftIcon, PlusIcon, DeleteIcon } from "@shopify/polaris-icons";

export function ScratchBuilderView({ onBack, onCompleteSave, initialPost = null }) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [intent, setIntent] = useState(initialPost?.intent || initialPost?.type || "Informational");
  const [keyword, setKeyword] = useState(initialPost?.keyword || "");
  const [author, setAuthor] = useState(initialPost?.author || "Thành Nguyễn");
  const [content, setContent] = useState(initialPost?.bodyHtml || "");
  const [sections, setSections] = useState(
    initialPost?.outline && initialPost.outline.length > 0
      ? initialPost.outline
      : [
          { id: "1", level: "h2", title: "Introduction & Key Takeaways" },
          { id: "2", level: "h2", title: "Main Topic Breakdown" },
        ]
  );
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionLevel, setNewSectionLevel] = useState("h2");
  const [error, setError] = useState("");

  const intentOptions = [
    { label: "Informational", value: "Informational" },
    { label: "Commercial", value: "Commercial" },
    { label: "Transactional", value: "Transactional" },
    { label: "Navigational", value: "Navigational" },
  ];

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        level: newSectionLevel,
        title: newSectionTitle.trim(),
      },
    ]);
    setNewSectionTitle("");
  };

  const handleRemoveSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Please enter a title for the blog post");
      return;
    }

    const savedPost = {
      ...(initialPost || {}),
      id: initialPost?.id || `post-${Date.now()}`,
      title: title.trim(),
      mode: initialPost?.mode || "scratch",
      isAiGenerated: initialPost?.isAiGenerated || false,
      type: "Informational",
      intent,
      author: author.trim() || "Thành Nguyễn",
      lastModified: "Just now",
      isNew: initialPost ? initialPost.isNew : true,
      seoScore: initialPost?.seoScore ?? 78,
      geoScore: initialPost?.geoScore ?? 70,
      status: initialPost?.status || "Draft",
      keyword: keyword.trim() || title.trim().toLowerCase(),
      hasAnswerBlock: initialPost?.hasAnswerBlock || false,
      hasFaqSchema: initialPost?.hasFaqSchema || false,
      outline: sections,
      bodyHtml: content.trim() || `<h2>Introduction</h2><p>Article draft created from scratch.</p>`,
    };

    onCompleteSave(savedPost);
  };

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", width: "100%", paddingBottom: "40px" }}>
      <BlockStack gap="400">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <InlineStack gap="200" align="center">
            <Button
              icon={ArrowLeftIcon}
              variant="tertiary"
              onClick={onBack}
              accessibilityLabel="Back to Content Studio"
            />
            <Text variant="headingLg" as="h1" fontWeight="bold">
              Build Blog Post from Scratch
            </Text>
            <Badge tone="attention">Manual Canvas</Badge>
          </InlineStack>

          <Button variant="primary" onClick={handleSave}>
            Save Draft
          </Button>
        </div>

        <Card>
          <BlockStack gap="400">
            <TextField
              label="Blog Title"
              value={title}
              onChange={(val) => {
                setTitle(val);
                if (error) setError("");
              }}
              placeholder="e.g. 5 Steps to Building Brand Trust Online"
              autoComplete="off"
              error={error}
              requiredIndicator
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              <Select
                label="Search Intent"
                options={intentOptions}
                value={intent}
                onChange={setIntent}
              />

              <TextField
                label="Primary Keyword"
                value={keyword}
                onChange={setKeyword}
                placeholder="e.g. brand trust ecommerce"
                autoComplete="off"
              />

              <TextField
                label="Author"
                value={author}
                onChange={setAuthor}
                autoComplete="off"
              />
            </div>

            {/* Custom Outline Sections */}
            <BlockStack gap="200">
              <Text variant="headingSm" as="h3">
                Article Outline Sections
              </Text>

              <BlockStack gap="150">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <InlineStack gap="200" align="center">
                      <Badge tone="info">{sec.level.toUpperCase()}</Badge>
                      <Text variant="bodySm" fontWeight="medium">
                        {sec.title}
                      </Text>
                    </InlineStack>

                    <Button
                      icon={DeleteIcon}
                      variant="plain"
                      tone="critical"
                      size="slim"
                      onClick={() => handleRemoveSection(sec.id)}
                      accessibilityLabel="Remove section"
                    />
                  </div>
                ))}
              </BlockStack>

              {/* Add section */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px" }}>
                <div style={{ width: "90px" }}>
                  <select
                    value={newSectionLevel}
                    onChange={(e) => setNewSectionLevel(e.target.value)}
                    style={{
                      width: "100%",
                      height: "32px",
                      borderRadius: "6px",
                      border: "1px solid #d4d4d8",
                      padding: "0 8px",
                      fontSize: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Add heading title..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
                    style={{
                      width: "100%",
                      height: "32px",
                      borderRadius: "6px",
                      border: "1px solid #d4d4d8",
                      padding: "0 10px",
                      fontSize: "12px",
                      outline: "none",
                      backgroundColor: "#ffffff",
                    }}
                  />
                </div>
                <Button size="slim" icon={PlusIcon} onClick={handleAddSection}>
                  Add Section
                </Button>
              </div>
            </BlockStack>

            {/* Content area */}
            <BlockStack gap="100">
              <Text variant="bodySm" fontWeight="medium" as="label">
                Initial Draft Content (HTML / Markdown)
              </Text>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing your article paragraphs, lists, and content..."
                rows={6}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #d4d4d8",
                  padding: "12px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
            </BlockStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </div>
  );
}

export default ScratchBuilderView;
