import { useState, useRef } from "react";
import { Button, Icon } from "@shopify/polaris";
import {
  UploadIcon,
  ImageIcon,
  MagicIcon,
  DeleteIcon,
  PlusIcon,
  EditIcon,
  RefreshIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@shopify/polaris-icons";
import { addImageToLibrary } from "../../../mock/imageLibraryData";

export function ScratchCanvas({
  postData,
  onPostDataChange,
  blocks = [],
  onUpdateBlock,
  onDeleteBlock,
  onInsertBlock,
  onOpenLibraryModal,
  onOpenAiImageModal,
  viewport = "desktop",
}) {
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const fileInputRef = useRef(null);

  const toRoman = (num) => {
    const romanNumerals = [
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ];
    let result = "";
    for (const { value, symbol } of romanNumerals) {
      while (num >= value) {
        result += symbol;
        num -= value;
      }
    }
    return result || String(num);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        onPostDataChange({ featuredImage: dataUrl });
        addImageToLibrary({
          url: dataUrl,
          filename: file.name,
          title: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCanvasWidth = () => {
    switch (viewport) {
      case "tablet":
        return "768px";
      case "mobile":
        return "380px";
      default:
        return "880px";
    }
  };

  const getFeaturedImageStyle = () => {
    let size = postData.imageSize || "original";
    if (postData.imageScope === "Per device" && postData.deviceImageSizes) {
      size = postData.deviceImageSizes[viewport] || (viewport === "mobile" ? "100%" : "original");
    }

    if (size === "100%") {
      return { width: "100%", maxHeight: "450px", objectFit: "cover", display: "block" };
    }
    if (size === "original") {
      return { width: "100%", maxHeight: "360px", objectFit: "cover", display: "block" };
    }
    if (size.endsWith("px")) {
      return { maxWidth: size, width: "100%", margin: "0 auto", objectFit: "cover", display: "block" };
    }
    return { width: "100%", maxHeight: "360px", objectFit: "cover", display: "block" };
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#f4f4f5",
        overflowY: "auto",
        height: "calc(100vh - 56px)",
        padding: "32px 24px 64px 24px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <div
        style={{
          width: getCanvasWidth(),
          backgroundColor: "#ffffff",
          borderRadius: viewport === "desktop" ? "8px" : "16px",
          border: "1px solid #e4e4e7",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          padding: viewport === "mobile" ? "20px 16px" : "40px 48px",
          minHeight: "750px",
          transition: "width 0.25s ease",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={postData.title || ""}
            onChange={(e) => onPostDataChange({ title: e.target.value })}
            placeholder="This is the blog post title"
            style={{
              width: "100%",
              fontSize: viewport === "mobile" ? "22px" : "32px",
              fontWeight: 700,
              color: "#18181b",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: "inherit",
              lineHeight: "1.25",
              padding: "4px 0",
            }}
          />
        </div>

        <div style={{ position: "relative" }}>
          {postData.featuredImage ? (
            <div
              style={{
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #e4e4e7",
                textAlign: "center",
              }}
            >
              <img
                src={postData.featuredImage}
                alt={postData.imageAlt || "Featured image"}
                style={getFeaturedImageStyle()}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  gap: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  padding: "4px 6px",
                  borderRadius: "6px",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Button size="slim" icon={EditIcon} onClick={() => fileInputRef.current?.click()}>
                  Replace
                </Button>
                <Button
                  size="slim"
                  icon={DeleteIcon}
                  tone="critical"
                  variant="plain"
                  onClick={() => onPostDataChange({ featuredImage: null })}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                border: "1px dashed #cbd5e1",
                borderRadius: "10px",
                padding: "36px 20px",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                <Button icon={UploadIcon} size="slim" onClick={() => fileInputRef.current?.click()}>
                  Upload file
                </Button>
                <Button icon={ImageIcon} size="slim" onClick={onOpenLibraryModal}>
                  Select from library
                </Button>
                <Button icon={MagicIcon} size="slim" onClick={onOpenAiImageModal}>
                  Generate with AI
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Table of Contents Container */}
        {postData.tableOfContents?.enabled && (() => {
          const toc = postData.tableOfContents;
          const excluded = (toc.excludedHeadingTypes || []).map((t) => t.toLowerCase());
          const detectedHeadings = blocks
            .filter(
              (b) =>
                b.type === "heading" &&
                b.text?.trim() &&
                !excluded.includes((b.level || "h2").toLowerCase())
            )
            .map((b, i) => ({
              id: b.id || `h-${i}`,
              level: b.level || "h2",
              text: b.text,
            }));

          return (
            <div
              style={{
                borderRadius: "8px",
                border: "1px solid #3b82f6",
                backgroundColor: "#ffffff",
                padding: "16px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease",
              }}
            >
              {detectedHeadings.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "4px 0",
                  }}
                >
                  <span style={{ fontStyle: "italic", fontSize: "13px", color: "#64748b" }}>
                    Table of contents is empty. Click <strong>Update</strong> above to generate headings.
                  </span>
                  <Button
                    size="slim"
                    icon={RefreshIcon}
                    onClick={() => {
                      if (blocks.filter((b) => b.type === "heading").length === 0) {
                        onInsertBlock({
                          type: "heading",
                          level: "h2",
                          text: "1. Strategic Overview & Objectives",
                        });
                        onInsertBlock({
                          type: "heading",
                          level: "h2",
                          text: "2. Key Ecommerce Tactics for 2026",
                        });
                        onInsertBlock({
                          type: "heading",
                          level: "h3",
                          text: "2.1 Optimizing for Google AI Overviews",
                        });
                      }
                    }}
                  >
                    Update ToC
                  </Button>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        color: toc.textColor || "#000000",
                      }}
                    >
                      {toc.title || "Table of Contents"}
                    </span>
                    {toc.collapsible && (
                      <Button
                        size="slim"
                        variant="plain"
                        icon={isTocCollapsed ? ChevronDownIcon : ChevronUpIcon}
                        onClick={() => setIsTocCollapsed(!isTocCollapsed)}
                      />
                    )}
                  </div>

                  {!isTocCollapsed && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          toc.layout === "3-col"
                            ? "repeat(3, 1fr)"
                            : toc.layout === "2-col"
                            ? "repeat(2, 1fr)"
                            : "1fr",
                        gap: "8px 16px",
                      }}
                    >
                      {detectedHeadings.map((h, i) => {
                        let prefix = "";
                        if (toc.listStyle === "numbered") {
                          prefix = `${i + 1}. `;
                        } else if (toc.listStyle === "bulleted") {
                          prefix = "• ";
                        } else if (toc.listStyle === "roman") {
                          prefix = `${toRoman(i + 1)}. `;
                        }

                        const indentPadding =
                          toc.indentation === "hierarchical"
                            ? h.level === "h3"
                              ? "18px"
                              : h.level === "h4"
                              ? "32px"
                              : "0px"
                            : "0px";

                        return (
                          <div
                            key={h.id || i}
                            style={{
                              paddingLeft: indentPadding,
                              fontSize: "13px",
                              lineHeight: "1.4",
                              color: toc.textColor || "#000000",
                              cursor: "pointer",
                              transition: "opacity 0.15s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                          >
                            <span style={{ fontWeight: 600 }}>{prefix}</span>
                            <span>{h.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {blocks.map((block, index) => {
            const isEditing = editingBlockId === (block.id || index);

            return (
              <div
                key={block.id || index}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  border: isEditing ? "1px solid #3b82f6" : "1px solid transparent",
                  padding: "6px 8px",
                  transition: "border-color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isEditing) e.currentTarget.style.border = "1px dashed #cbd5e1";
                }}
                onMouseLeave={(e) => {
                  if (!isEditing) e.currentTarget.style.border = "1px solid transparent";
                }}
              >
                {block.type === "heading" && (
                  <input
                    type="text"
                    value={block.text}
                    onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                    onFocus={() => setEditingBlockId(block.id || index)}
                    onBlur={() => setEditingBlockId(null)}
                    style={{
                      width: "100%",
                      fontSize: block.level === "h3" ? "18px" : "22px",
                      fontWeight: 600,
                      color: "#18181b",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      fontFamily: "inherit",
                    }}
                  />
                )}

                {block.type === "paragraph" && (
                  <textarea
                    rows={Math.max(2, Math.ceil((block.text || "").length / 80))}
                    value={block.text}
                    onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                    onFocus={() => setEditingBlockId(block.id || index)}
                    onBlur={() => setEditingBlockId(null)}
                    style={{
                      width: "100%",
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.6",
                      border: "none",
                      outline: "none",
                      backgroundColor: "transparent",
                      resize: "none",
                      fontFamily: "inherit",
                    }}
                  />
                )}

                {block.type === "answer-block" && (
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      padding: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#16a34a",
                        fontWeight: 700,
                        fontSize: "13px",
                        marginBottom: "6px",
                      }}
                    >
                      <Icon source={MagicIcon} tone="success" />
                      <span>{block.title || "Direct Answer Summary Block"}</span>
                    </div>
                    <textarea
                      rows={3}
                      value={block.text}
                      onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                      style={{
                        width: "100%",
                        fontSize: "13.5px",
                        color: "#166534",
                        lineHeight: "1.5",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        fontFamily: "inherit",
                        resize: "none",
                      }}
                    />
                  </div>
                )}

                {block.type === "product" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <img
                      src={block.image}
                      alt={block.title}
                      style={{
                        width: "72px",
                        height: "72px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#18181b" }}>
                        {block.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 6px 0" }}>
                        {block.description}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#16a34a" }}>
                        {block.price}
                      </div>
                    </div>
                    <Button variant="primary">Buy Now</Button>
                  </div>
                )}

                {block.type === "faq" && (
                  <div
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "14px", color: "#18181b", marginBottom: "4px" }}>
                      Q: {block.question}
                    </div>
                    <div style={{ fontSize: "13.5px", color: "#475569", lineHeight: "1.5" }}>
                      A: {block.answer}
                    </div>
                  </div>
                )}

                {block.type === "callout" && (
                  <div
                    style={{
                      borderLeft: "4px solid #3b82f6",
                      backgroundColor: "#eff6ff",
                      borderRadius: "4px 8px 8px 4px",
                      padding: "12px 16px",
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "#1e40af", marginBottom: "3px" }}>
                      {block.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "#1e3a8a", lineHeight: "1.5" }}>
                      {block.text}
                    </div>
                  </div>
                )}

                {block.type === "table" && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                          {block.headers.map((h, hi) => (
                            <th key={hi} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600 }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((r, ri) => (
                          <tr key={ri} style={{ borderBottom: "1px solid #f1f2f4" }}>
                            {r.map((cell, ci) => (
                              <td key={ci} style={{ padding: "8px 12px" }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteBlock(index)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "#ffffff",
                    border: "1px solid #e4e4e7",
                    borderRadius: "4px",
                    padding: "2px",
                    cursor: "pointer",
                    color: "#dc2626",
                    display: isEditing ? "flex" : "none",
                  }}
                >
                  <Icon source={DeleteIcon} tone="critical" />
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingTop: "16px" }}>
          <Button
            icon={PlusIcon}
            size="slim"
            onClick={() =>
              onInsertBlock({
                type: "paragraph",
                text: "Click to write next section insights, data evidence, or strategic recommendations.",
              })
            }
          >
            Add paragraph
          </Button>
        </div>

        {/* Social Share Buttons Storefront Preview */}
        {postData.socialShare?.appEmbedEnabled && postData.socialShare?.showShareButtons && (
          <div
            style={{
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid #f1f2f4",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>
              Share this article:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(postData.socialShare.platforms || ["facebook", "twitter", "pinterest", "linkedin", "copylink"]).map((plat) => {
                const labels = {
                  facebook: { name: "Facebook", bg: "#1877f2", color: "#ffffff" },
                  twitter: { name: "X (Twitter)", bg: "#000000", color: "#ffffff" },
                  pinterest: { name: "Pinterest", bg: "#e60023", color: "#ffffff" },
                  linkedin: { name: "LinkedIn", bg: "#0a66c2", color: "#ffffff" },
                  copylink: { name: "Copy Link", bg: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1" },
                };
                const info = labels[plat] || { name: plat, bg: "#f1f5f9", color: "#334155" };
                return (
                  <div
                    key={plat}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      borderRadius: postData.socialShare.style === "circle" ? "20px" : "8px",
                      backgroundColor: info.bg,
                      color: info.color,
                      border: info.border || "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <span>{info.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScratchCanvas;
