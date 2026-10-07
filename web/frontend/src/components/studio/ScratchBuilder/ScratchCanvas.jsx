import { useState, useRef, useEffect } from "react";
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

/**
 * Auto-growing textarea that reflows text naturally without internal scrollbars.
 * Features 60fps continuous requestAnimationFrame height adjustments and GPU-accelerated transitions.
 */
function AutoGrowTextarea({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  viewport,
  style = {},
  className = "",
}) {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    adjustHeight();

    // Continuously adjust height every frame during the 450ms transition
    let frameId;
    const start = performance.now();
    const duration = 480;

    const animateReflow = (now) => {
      adjustHeight();
      if (now - start < duration) {
        frameId = requestAnimationFrame(animateReflow);
      } else {
        adjustHeight();
      }
    };

    frameId = requestAnimationFrame(animateReflow);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined" && textareaRef.current) {
      resizeObserver = new ResizeObserver(() => {
        adjustHeight();
      });
      resizeObserver.observe(textareaRef.current);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [value, viewport]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => {
        if (onChange) onChange(e);
        adjustHeight();
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{
        width: "100%",
        display: "block",
        boxSizing: "border-box",
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        resize: "none",
        overflow: "hidden",
        fontFamily: "inherit",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        margin: 0,
        padding: 0,
        transform: "translateZ(0)",
        willChange: "font-size, line-height",
        transition:
          "font-size 0.45s cubic-bezier(0.16, 1, 0.3, 1), line-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease, padding 0.45s ease",
        ...style,
      }}
    />
  );
}

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

  const getCanvasConfig = () => {
    switch (viewport) {
      case "mobile":
        return {
          width: "420px",
          maxWidth: "420px",
          padding: "24px 16px 96px 16px",
          titleFontSize: "22px",
          imageHeight: "260px",
          blockGap: "16px",
        };
      case "tablet":
        return {
          width: "768px",
          maxWidth: "768px",
          padding: "36px 32px 96px 32px",
          titleFontSize: "27px",
          imageHeight: "380px",
          blockGap: "20px",
        };
      default: // desktop
        return {
          width: "1000px",
          maxWidth: "1000px",
          padding: "48px 56px 96px 56px",
          titleFontSize: "34px",
          imageHeight: "480px",
          blockGap: "24px",
        };
    }
  };

  const canvasConfig = getCanvasConfig();

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 56px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
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
          width: canvasConfig.width,
          maxWidth: canvasConfig.maxWidth,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: canvasConfig.padding,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          gap: canvasConfig.blockGap,
          boxSizing: "border-box",
          transform: "translateZ(0)",
          willChange: "width, max-width, padding, gap",
          transition:
            "width 0.45s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.45s cubic-bezier(0.16, 1, 0.3, 1), padding 0.45s cubic-bezier(0.16, 1, 0.3, 1), gap 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div style={{ position: "relative" }}>
          <AutoGrowTextarea
            value={postData.title || ""}
            onChange={(e) => onPostDataChange({ title: e.target.value })}
            placeholder="This is the blog post title"
            viewport={viewport}
            style={{
              fontSize: canvasConfig.titleFontSize,
              fontWeight: 700,
              color: "#18181b",
              lineHeight: "1.25",
              padding: "4px 0",
              letterSpacing: "-0.015em",
              transition:
                "font-size 0.45s cubic-bezier(0.16, 1, 0.3, 1), line-height 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
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
                height: canvasConfig.imageHeight,
                transform: "translateZ(0)",
                willChange: "height",
                transition: "height 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <img
                src={postData.featuredImage}
                alt={postData.imageAlt || "Featured image"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: "translateZ(0)",
                  willChange: "transform",
                  transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
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
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                padding: viewport === "mobile" ? "14px 16px" : "20px 24px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                margin: "4px 0 12px 0",
                transition: "padding 0.35s ease, margin 0.35s ease",
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
                      marginBottom: "14px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#18181b",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {toc.title || "Table of Contents"}
                    </h3>
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
                          viewport === "mobile"
                            ? "1fr"
                            : toc.layout === "3-col"
                            ? "repeat(3, 1fr)"
                            : toc.layout === "2-col"
                            ? "repeat(2, 1fr)"
                            : "1fr",
                        gap: "6px 16px",
                        transition: "all 0.35s ease",
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
                              ? "20px"
                              : h.level === "h4"
                              ? "36px"
                              : h.level === "h5"
                              ? "52px"
                              : "0px"
                            : "0px";

                        const linkColor = toc.textColor && toc.textColor !== "#000000" ? toc.textColor : "#2563eb";

                        return (
                          <div
                            key={h.id || i}
                            style={{
                              paddingLeft: indentPadding,
                              fontSize: "13.5px",
                              lineHeight: "1.55",
                            }}
                          >
                            <a
                              href={`#${h.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(h.id);
                                if (el) {
                                  el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                              style={{
                                color: linkColor,
                                textDecoration: "underline",
                                cursor: "pointer",
                                transition: "color 0.15s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "#1d4ed8")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                            >
                              <span style={{ fontWeight: 600 }}>{prefix}</span>
                              <span>{h.text}</span>
                            </a>
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: canvasConfig.blockGap,
            transition: "gap 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {blocks.map((block, index) => {
            const isEditing = editingBlockId === (block.id || index);

            return (
              <div
                key={block.id || index}
                id={block.id || `b-${index}`}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  border: isEditing ? "1px solid #3b82f6" : "1px solid transparent",
                  padding: "6px 8px",
                  transition:
                    "border-color 0.15s ease, padding 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isEditing) e.currentTarget.style.border = "1px dashed #cbd5e1";
                }}
                onMouseLeave={(e) => {
                  if (!isEditing) e.currentTarget.style.border = "1px solid transparent";
                }}
              >
                {block.type === "heading" && (
                  <AutoGrowTextarea
                    value={block.text}
                    onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                    onFocus={() => setEditingBlockId(block.id || index)}
                    onBlur={() => setEditingBlockId(null)}
                    viewport={viewport}
                    placeholder="Enter heading..."
                    style={{
                      fontSize:
                        block.level === "h1"
                          ? viewport === "mobile"
                            ? "24px"
                            : viewport === "tablet"
                            ? "28px"
                            : "32px"
                          : block.level === "h3"
                          ? viewport === "mobile"
                            ? "16px"
                            : viewport === "tablet"
                            ? "17px"
                            : "19px"
                          : viewport === "mobile"
                          ? "19px"
                          : viewport === "tablet"
                          ? "21px"
                          : "24px",
                      fontWeight: 700,
                      color: "#18181b",
                      lineHeight: "1.32",
                      letterSpacing: "-0.015em",
                    }}
                  />
                )}

                {block.type === "paragraph" && (
                  <AutoGrowTextarea
                    value={block.text}
                    onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                    onFocus={() => setEditingBlockId(block.id || index)}
                    onBlur={() => setEditingBlockId(null)}
                    viewport={viewport}
                    placeholder="Enter paragraph text..."
                    style={{
                      fontSize: viewport === "mobile" ? "14.5px" : "15.5px",
                      color: "#374151",
                      lineHeight: "1.75",
                      letterSpacing: "0.005em",
                    }}
                  />
                )}

                {block.type === "answer-block" && (
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "8px",
                      padding: viewport === "mobile" ? "12px 14px" : "16px 20px",
                      transition: "padding 0.35s ease",
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
                        marginBottom: "8px",
                      }}
                    >
                      <Icon source={MagicIcon} tone="success" />
                      <span>{block.title || "Direct Answer Summary Block"}</span>
                    </div>
                    <AutoGrowTextarea
                      value={block.text}
                      onChange={(e) => onUpdateBlock(index, { ...block, text: e.target.value })}
                      onFocus={() => setEditingBlockId(block.id || index)}
                      onBlur={() => setEditingBlockId(null)}
                      viewport={viewport}
                      placeholder="Enter direct answer summary..."
                      style={{
                        fontSize: viewport === "mobile" ? "13.5px" : "14.5px",
                        color: "#166534",
                        lineHeight: "1.65",
                        fontWeight: 500,
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
                      padding: viewport === "mobile" ? "12px 14px" : "14px 18px",
                      backgroundColor: "#ffffff",
                      transition: "padding 0.35s ease",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: viewport === "mobile" ? "13.5px" : "14.5px",
                        color: "#18181b",
                        marginBottom: "6px",
                        transition: "font-size 0.35s ease",
                      }}
                    >
                      Q: {block.question}
                    </div>
                    <div
                      style={{
                        fontSize: viewport === "mobile" ? "13px" : "14px",
                        color: "#475569",
                        lineHeight: "1.65",
                        wordBreak: "break-word",
                        transition: "font-size 0.35s ease, line-height 0.35s ease",
                      }}
                    >
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
                      padding: viewport === "mobile" ? "12px 14px" : "14px 18px",
                      transition: "padding 0.35s ease",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: viewport === "mobile" ? "13px" : "14px",
                        color: "#1e40af",
                        marginBottom: "4px",
                        transition: "font-size 0.35s ease",
                      }}
                    >
                      {block.title}
                    </div>
                    <div
                      style={{
                        fontSize: viewport === "mobile" ? "13px" : "13.5px",
                        color: "#1e3a8a",
                        lineHeight: "1.6",
                        wordBreak: "break-word",
                        transition: "font-size 0.35s ease, line-height 0.35s ease",
                      }}
                    >
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

