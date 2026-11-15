import { useState, useRef, useEffect } from "react";
import { Button, Icon, Badge } from "@shopify/polaris";
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
  PlayCircleIcon,
  StarIcon,
  IdentityCardIcon,
  StoreIcon,
  EmailIcon,
  ShareIcon,
  TextQuoteIcon,
  ButtonIcon,
  CodeIcon,
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
          width: "100%",
          maxWidth: "440px",
          padding: "24px 16px 96px 16px",
          titleFontSize: "24px",
          blockGap: "16px",
        };
      case "tablet":
        return {
          width: "100%",
          maxWidth: "768px",
          padding: "32px 28px 96px 28px",
          titleFontSize: "32px",
          blockGap: "20px",
        };
      default: // desktop
        return {
          width: "100%",
          maxWidth: "100%",
          padding: "36px 48px 96px 48px",
          titleFontSize: "32px",
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
                width: "100%",
                aspectRatio: "16 / 9",
                backgroundColor: "#f4f4f5",
                transform: "translateZ(0)",
                willChange: "aspect-ratio",
                transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
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

                {/* --- Extended Tapita Element Types --- */}
                {block.type === "quote" && (
                  <blockquote
                    style={{
                      margin: 0,
                      padding: "16px 20px",
                      borderLeft: "4px solid #ea580c",
                      backgroundColor: "#fff7ed",
                      borderRadius: "0 8px 8px 0",
                      fontStyle: "italic",
                    }}
                  >
                    <div style={{ fontSize: "16px", color: "#1c1917", lineHeight: "1.6", marginBottom: "8px" }}>
                      "{block.text}"
                    </div>
                    {(block.author || block.role) && (
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#c2410c", fontStyle: "normal" }}>
                        — {block.author} {block.role ? `(${block.role})` : ""}
                      </div>
                    )}
                  </blockquote>
                )}

                {block.type === "list" && (
                  <div style={{ padding: "4px 8px" }}>
                    {block.style === "numbered" ? (
                      <ol style={{ margin: 0, paddingLeft: "24px", color: "#374151", fontSize: "15px", lineHeight: "1.8" }}>
                        {(block.items || []).map((item, liIdx) => (
                          <li key={liIdx}>{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: "24px", color: "#374151", fontSize: "15px", lineHeight: "1.8" }}>
                        {(block.items || []).map((item, liIdx) => (
                          <li key={liIdx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {block.type === "image-text" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: viewport === "mobile" ? "1fr" : "1fr 1fr",
                      gap: "20px",
                      alignItems: "center",
                      padding: "12px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <img
                      src={block.imageUrl}
                      alt={block.imageAlt || ""}
                      style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "18px", color: "#0f172a", marginBottom: "8px" }}>
                        {block.title}
                      </div>
                      <div style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>
                        {block.text}
                      </div>
                    </div>
                  </div>
                )}

                {block.type === "image" && (
                  <figure style={{ margin: 0 }}>
                    <img
                      src={block.url}
                      alt={block.alt || ""}
                      style={{
                        width: "100%",
                        maxHeight: "420px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    {block.caption && (
                      <figcaption
                        style={{
                          marginTop: "8px",
                          textAlign: "center",
                          fontSize: "13px",
                          color: "#64748b",
                          fontStyle: "italic",
                        }}
                      >
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {block.type === "video" && (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#000",
                      aspectRatio: "16 / 9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundImage: `url(${block.coverUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.35)",
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        color: "#ffffff",
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "56px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(255,255,255,0.9)",
                          color: "#ea580c",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Icon source={PlayCircleIcon} tone="base" />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: "16px" }}>{block.title}</div>
                      {block.duration && (
                        <span style={{ fontSize: "12px", opacity: 0.85 }}>Duration: {block.duration}</span>
                      )}
                    </div>
                  </div>
                )}

                {block.type === "image-gallery" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
                      gap: "10px",
                    }}
                  >
                    {(block.images || []).map((img, gi) => (
                      <img
                        key={gi}
                        src={img.url}
                        alt={img.alt || ""}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </div>
                )}

                {block.type === "faq-accordion" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      padding: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "4px" }}>
                      Frequently Asked Questions
                    </div>
                    {(block.items || []).map((faq, fi) => (
                      <div
                        key={fi}
                        style={{
                          borderBottom: fi < (block.items.length - 1) ? "1px solid #f1f2f4" : "none",
                          paddingBottom: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b", marginBottom: "4px" }}>
                          Q: {faq.question}
                        </div>
                        <div style={{ fontSize: "13.5px", color: "#64748b", lineHeight: "1.6" }}>
                          A: {faq.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "product-card" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: viewport === "mobile" ? "column" : "row",
                      alignItems: viewport === "mobile" ? "flex-start" : "center",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      style={{
                        width: viewport === "mobile" ? "100%" : "96px",
                        height: viewport === "mobile" ? "180px" : "96px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      {block.badge && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#ea580c",
                            backgroundColor: "#fff7ed",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            display: "inline-block",
                            marginBottom: "6px",
                          }}
                        >
                          {block.badge}
                        </span>
                      )}
                      <div style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>
                        {block.title}
                      </div>
                      <div style={{ fontSize: "13px", color: "#64748b", margin: "4px 0" }}>
                        {block.subtitle}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px", color: "#16a34a" }}>
                          {block.price}
                        </span>
                        {block.compareAtPrice && (
                          <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" }}>
                            {block.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="primary">Buy Now</Button>
                  </div>
                )}

                {block.type === "collection-card" && (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      height: "160px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "24px",
                      backgroundImage: `url(${block.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.45)",
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>
                        Collection • {block.itemCount} Products
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: 700, marginTop: "4px" }}>
                        {block.title}
                      </div>
                    </div>
                    <div style={{ position: "relative", zIndex: 2 }}>
                      <Button variant="primary">{block.ctaText || "Shop Collection"}</Button>
                    </div>
                  </div>
                )}

                {block.type === "product-grid" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: viewport === "mobile" ? "1fr" : "repeat(3, 1fr)",
                      gap: "14px",
                    }}
                  >
                    {(block.products || []).map((prod, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "10px",
                          backgroundColor: "#ffffff",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
                        />
                        <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{prod.title}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "#16a34a" }}>{prod.price}</span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>{prod.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "button" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        block.align === "left" ? "flex-start" : block.align === "right" ? "flex-end" : "center",
                      padding: "12px 0",
                    }}
                  >
                    <Button variant="primary" size="large">
                      {block.text}
                    </Button>
                  </div>
                )}

                {block.type === "custom-html" && (
                  <div
                    style={{
                      border: "1px dashed #cbd5e1",
                      borderRadius: "8px",
                      padding: "14px",
                      backgroundColor: "#f8fafc",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b", fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                      <Icon source={CodeIcon} tone="subdued" />
                      <span>Custom HTML Embed Block</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: block.code }} />
                  </div>
                )}

                {block.type === "company-hero" && (
                  <div
                    style={{
                      padding: "20px",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: 700, fontSize: "18px", color: "#0f172a" }}>
                        {block.companyName}
                      </div>
                      {block.badgeText && (
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#0284c7", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "4px" }}>
                          {block.badgeText}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", color: "#475569" }}>{block.tagline}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Est. {block.foundedYear} • Headquarters: {block.headquarters}
                    </div>
                  </div>
                )}

                {block.type === "fact-highlight" && (
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: "8px",
                      border: "1px solid #fed7aa",
                      backgroundColor: "#fffbeb",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div style={{ color: "#f59e0b", marginTop: "2px" }}>
                      <Icon source={StarIcon} tone="base" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "#92400e" }}>
                        {block.headline}
                      </div>
                      <div style={{ fontSize: "13.5px", color: "#78350f", margin: "4px 0" }}>
                        {block.detail}
                      </div>
                      {block.source && (
                        <div style={{ fontSize: "11.5px", color: "#b45309", fontStyle: "italic" }}>
                          Source: {block.source}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {block.type === "offering-card" && (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "8px",
                        backgroundColor: "#f1f5f9",
                        color: "#ea580c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon source={StoreIcon} tone="base" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{block.title}</div>
                      <div style={{ fontSize: "12.5px", color: "#64748b", margin: "2px 0 4px 0" }}>{block.description}</div>
                      {block.cta && (
                        <a href="#terms" style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600, textDecoration: "underline" }}>
                          {block.cta}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {block.type === "key-metrics" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: viewport === "mobile" ? "1fr" : `repeat(${block.metrics?.length || 3}, 1fr)`,
                      gap: "12px",
                      padding: "12px 0",
                    }}
                  >
                    {(block.metrics || []).map((m, mi) => (
                      <div
                        key={mi}
                        style={{
                          padding: "16px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          backgroundColor: "#f8fafc",
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "22px", fontWeight: 800, color: "#ea580c" }}>{m.value}</div>
                        <div style={{ fontSize: "12.5px", color: "#475569", marginTop: "4px" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {block.type === "milestone-timeline" && (
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "10px" }}>
                      Milestone Timeline
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(block.milestones || []).map((ms, msi) => (
                        <div key={msi} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "12px",
                              color: "#ea580c",
                              backgroundColor: "#fff7ed",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            {ms.year}
                          </span>
                          <span style={{ fontSize: "13.5px", color: "#334151" }}>{ms.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {block.type === "contact-grid" && (
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      display: "grid",
                      gridTemplateColumns: viewport === "mobile" ? "1fr" : "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon source={EmailIcon} tone="subdued" />
                      <div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>Email Support</div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{block.email}</div>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>Phone Support</div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{block.phone}</div>
                    </div>
                  </div>
                )}

                {block.type === "social-strip" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      padding: "12px",
                    }}
                  >
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>Follow us:</span>
                    {(block.channels || []).map((ch, ci) => (
                      <a
                        key={ci}
                        href={ch.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          backgroundColor: "#f1f5f9",
                          color: "#334151",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <Icon source={ShareIcon} tone="subdued" />
                        <span>{ch.name}</span>
                      </a>
                    ))}
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

