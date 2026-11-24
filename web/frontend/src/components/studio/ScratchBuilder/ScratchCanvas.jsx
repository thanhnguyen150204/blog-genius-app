import { useState, useRef, useEffect } from "react";
import { Button, Icon, Badge } from "@shopify/polaris";
import {
  UploadIcon,
  ImageIcon,
  MagicIcon,
  DeleteIcon,
  DuplicateIcon,
  DragHandleIcon,
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
  ExternalIcon,
  MobileIcon,
} from "@shopify/polaris-icons";
import { addImageToLibrary } from "../../../mock/imageLibraryData";
import { BlockFormattingToolbar } from "./BlockFormattingToolbar";

/**
 * QuickElementInsertMenu renders the contextual quick element insertion popover.
 */
function QuickElementInsertMenu({ onSelect, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [onClose]);

  const items = [
    {
      type: "heading",
      title: "Heading",
      shortcut: "/h3",
      iconText: "T",
      payload: { type: "heading", level: "h3", text: "Heading 3", align: "left" },
    },
    {
      type: "paragraph",
      title: "Paragraph",
      shortcut: "/p",
      iconText: "≡",
      payload: { type: "paragraph", text: "Your text goes here.", align: "left" },
    },
    {
      type: "quote",
      title: "Quote",
      shortcut: "/q",
      iconText: "❝",
      payload: { type: "quote", text: "Your quote text goes here." },
    },
    {
      type: "table",
      title: "Table",
      shortcut: "/t",
      iconText: "⊞",
      payload: {
        type: "table",
        rows: 2,
        cols: 2,
        headers: ["Heading 1", "Heading 2"],
        data: [["Your text go here", "Your text go here"]],
      },
    },
    {
      type: "list",
      title: "List",
      shortcut: "/l",
      iconText: "⁝≡",
      payload: { type: "list", style: "bullet", items: ["List item 1", "List item 2"] },
    },
    {
      type: "image-text",
      title: "Image & Text",
      shortcut: "/it",
      iconText: "🖼",
      payload: {
        type: "image-text",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        imagePosition: "left",
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: 0,
        zIndex: 150,
        width: "270px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e4e4e7",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.05)",
        padding: "6px",
        userSelect: "none",
        animation: "toolbarFadeIn 0.1s ease-out forwards",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          fontSize: "11px",
          color: "#9ca3af",
          padding: "4px 8px 6px 8px",
          fontWeight: 500,
        }}
      >
        Use ↑ ↓ to move and Enter to select
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {items.map((item) => (
          <div
            key={item.type}
            onClick={() => onSelect(item.payload)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.12s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "1px solid #e4e4e7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#18181b",
                  backgroundColor: "#fafafa",
                }}
              >
                {item.iconText}
              </div>
              <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#18181b" }}>
                {item.title}
              </span>
            </div>
            <span style={{ fontSize: "11.5px", color: "#9ca3af", fontFamily: "monospace" }}>
              {item.shortcut}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * RichEditableText enables inline formatting (bold, italic, color, background)
 * on mouse-highlighted text ranges via contentEditable.
 */
function RichEditableText({
  html,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Type '/' to add elements",
  style = {},
  className = "",
  tagName = "div",
}) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current && document.activeElement !== contentRef.current) {
      if (contentRef.current.innerHTML !== (html || "")) {
        contentRef.current.innerHTML = html || "";
      }
    }
  }, [html]);

  const handleInput = () => {
    if (contentRef.current && onChange) {
      const rawText = contentRef.current.innerText || "";
      if (rawText.trim() === "" && contentRef.current.innerHTML !== "") {
        contentRef.current.innerHTML = "";
      }
      onChange(contentRef.current.innerHTML);
    }
  };

  const Component = tagName;

  return (
    <Component
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={onFocus}
      onBlur={(e) => {
        handleInput();
        if (onBlur) onBlur(e);
      }}
      data-placeholder={placeholder}
      className={`rich-editable-text ${className}`}
      style={{
        width: "100%",
        minHeight: "1.4em",
        outline: "none",
        border: "none",
        backgroundColor: "transparent",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
        margin: 0,
        padding: 0,
        ...style,
      }}
    />
  );
}

/**
 * Auto-growing textarea that reflows text naturally without layout thrashing.
 * Uses a pure CSS Grid overlay technique: zero JavaScript height manipulation,
 * zero scrollHeight reflows, and zero jitter during active typing or editing.
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
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          gridArea: "1 / 1 / 2 / 2",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          fontFamily: "inherit",
          fontSize: style.fontSize || "inherit",
          fontWeight: style.fontWeight || "inherit",
          lineHeight: style.lineHeight || "inherit",
          letterSpacing: style.letterSpacing || "inherit",
          padding: style.padding || 0,
          margin: 0,
          boxSizing: "border-box",
          minHeight: "1.5em",
        }}
      >
        {(value || placeholder || " ") + " "}
      </div>
      <textarea
        value={value || ""}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
        style={{
          gridArea: "1 / 1 / 2 / 2",
          width: "100%",
          height: "100%",
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
          ...style,
        }}
      />
    </div>
  );
}

export function ScratchCanvas({
  postData,
  onPostDataChange,
  blocks = [],
  onUpdateBlock,
  onDeleteBlock,
  onInsertBlock,
  onDuplicateBlock,
  onMoveUp,
  onMoveDown,
  onOpenLibraryModal,
  onOpenAiImageModal,
  viewport = "desktop",
  selectedBlockIndex = null,
  onSelectBlock,
}) {
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [isTocCollapsed, setIsTocCollapsed] = useState(false);
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState(null);
  const [insertMenuTargetIndex, setInsertMenuTargetIndex] = useState(null);
  const [moveMenuTargetIndex, setMoveMenuTargetIndex] = useState(null);
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
          }}
        >
          {blocks.map((block, index) => {
            const isEditing = editingBlockId === (block.id || index);
            const isSelected = selectedBlockIndex === index;
            const isHiddenOnCurrentViewport =
              (block.hideDesktop && viewport === "desktop") ||
              (block.hideTablet && viewport === "tablet") ||
              (block.hideMobile && viewport === "mobile");

            return (
              <div
                key={block.id || index}
                id={block.id || `b-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBlock) onSelectBlock(index);
                }}
                style={{
                  position: "relative",
                  borderRadius: "8px",
                  border: isSelected
                    ? "1.5px solid #2563eb"
                    : isEditing
                    ? "1.5px solid #3b82f6"
                    : "1.5px solid transparent",
                  outline: isSelected ? "2px solid rgba(37, 99, 235, 0.15)" : "none",
                  outlineOffset: "2px",
                  padding: "6px 8px",
                  opacity: isHiddenOnCurrentViewport ? 0.4 : 1,
                  transition: "border-color 0.12s ease, opacity 0.15s ease",
                  cursor: "text",
                }}
                onMouseEnter={(e) => {
                  setHoveredBlockIndex(index);
                  if (!isEditing && !isSelected) e.currentTarget.style.border = "1.5px dashed #cbd5e1";
                }}
                onMouseLeave={(e) => {
                  setHoveredBlockIndex(null);
                  if (!isEditing && !isSelected) e.currentTarget.style.border = "1.5px solid transparent";
                }}
              >
                {/* Section Left Hover Action Bar */}
                {(hoveredBlockIndex === index || isSelected) && (
                  <div
                    style={{
                      position: "absolute",
                      top: isSelected ? "-68px" : "-26px",
                      left: "0px",
                      zIndex: 60,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "2px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #e4e4e7",
                      borderRadius: "6px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      padding: "2px 4px",
                      userSelect: "none",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* 1. Drag / Move Icon (6 dots) */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        title="Move section"
                        onClick={() =>
                          setMoveMenuTargetIndex(moveMenuTargetIndex === index ? null : index)
                        }
                        style={{
                          width: "22px",
                          height: "22px",
                          border: "none",
                          backgroundColor:
                            moveMenuTargetIndex === index ? "#f1f2f4" : "transparent",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#4b5563",
                        }}
                      >
                        <Icon source={DragHandleIcon} tone="subdued" />
                      </button>

                      {moveMenuTargetIndex === index && (
                        <div
                          style={{
                            position: "absolute",
                            top: "calc(100% + 4px)",
                            left: 0,
                            zIndex: 100,
                            backgroundColor: "#ffffff",
                            borderRadius: "6px",
                            border: "1px solid #e4e4e7",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                            padding: "4px",
                            minWidth: "110px",
                          }}
                        >
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              if (onMoveUp) onMoveUp(index);
                              setMoveMenuTargetIndex(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "none",
                              background: "none",
                              fontSize: "12px",
                              cursor: index === 0 ? "not-allowed" : "pointer",
                              color: index === 0 ? "#d1d5db" : "#374151",
                              borderRadius: "4px",
                            }}
                            onMouseEnter={(e) => {
                              if (index > 0) e.currentTarget.style.backgroundColor = "#f3f4f6";
                            }}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            ↑ Move up
                          </button>
                          <button
                            type="button"
                            disabled={index === blocks.length - 1}
                            onClick={() => {
                              if (onMoveDown) onMoveDown(index);
                              setMoveMenuTargetIndex(null);
                            }}
                            style={{
                              width: "100%",
                              padding: "5px 8px",
                              textAlign: "left",
                              border: "none",
                              background: "none",
                              fontSize: "12px",
                              cursor: index === blocks.length - 1 ? "not-allowed" : "pointer",
                              color: index === blocks.length - 1 ? "#d1d5db" : "#374151",
                              borderRadius: "4px",
                            }}
                            onMouseEnter={(e) => {
                              if (index < blocks.length - 1)
                                e.currentTarget.style.backgroundColor = "#f3f4f6";
                            }}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = "transparent")
                            }
                          >
                            ↓ Move down
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 2. Plus Icon: Quick Element Insert Menu */}
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        title="Add element below"
                        onClick={() =>
                          setInsertMenuTargetIndex(
                            insertMenuTargetIndex === index ? null : index
                          )
                        }
                        style={{
                          width: "22px",
                          height: "22px",
                          border: "none",
                          backgroundColor:
                            insertMenuTargetIndex === index ? "#f1f2f4" : "transparent",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#4b5563",
                        }}
                      >
                        <Icon source={PlusIcon} tone="subdued" />
                      </button>

                      {insertMenuTargetIndex === index && (
                        <QuickElementInsertMenu
                          onSelect={(elementPayload) => {
                            onInsertBlock(elementPayload, index);
                            setInsertMenuTargetIndex(null);
                          }}
                          onClose={() => setInsertMenuTargetIndex(null)}
                        />
                      )}
                    </div>

                    {/* 3. Duplicate Icon */}
                    <button
                      type="button"
                      title="Duplicate section"
                      onClick={() => {
                        if (onDuplicateBlock) onDuplicateBlock(index);
                      }}
                      style={{
                        width: "22px",
                        height: "22px",
                        border: "none",
                        backgroundColor: "transparent",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#4b5563",
                      }}
                    >
                      <Icon source={DuplicateIcon} tone="subdued" />
                    </button>

                    {/* 4. Delete Icon */}
                    <button
                      type="button"
                      title="Delete section"
                      onClick={() => {
                        if (onDeleteBlock) onDeleteBlock(index);
                      }}
                      style={{
                        width: "22px",
                        height: "22px",
                        border: "none",
                        backgroundColor: "transparent",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#dc2626",
                      }}
                    >
                      <Icon source={DeleteIcon} tone="critical" />
                    </button>
                  </div>
                )}

                {/* Floating Rich Text Toolbar when block is selected */}
                {isSelected && (
                  <BlockFormattingToolbar
                    block={block}
                    onUpdateBlock={(updated) => onUpdateBlock(index, updated)}
                    onClose={() => onSelectBlock && onSelectBlock(null)}
                  />
                )}

                {block.type === "heading" && (
                  <RichEditableText
                    html={block.html || block.text}
                    onChange={(newHtml) =>
                      onUpdateBlock(index, {
                        ...block,
                        html: newHtml,
                        text: newHtml.replace(/<[^>]+>/g, ""),
                      })
                    }
                    onFocus={() => {
                      setEditingBlockId(block.id || index);
                      if (onSelectBlock) onSelectBlock(index);
                    }}
                    onBlur={() => setEditingBlockId(null)}
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
                      fontWeight: block.isBold !== undefined ? (block.isBold ? 800 : 400) : 700,
                      fontStyle: block.isItalic ? "italic" : "normal",
                      textDecoration: [block.isUnderline ? "underline" : "", block.isStrike ? "line-through" : ""].filter(Boolean).join(" ") || "none",
                      textAlign: block.align || "left",
                      color: block.textColor || "#18181b",
                      backgroundColor: (block.highlightColor && block.highlightColor !== "transparent") ? block.highlightColor : "transparent",
                      lineHeight: "1.32",
                      letterSpacing: "-0.015em",
                    }}
                  />
                )}

                {block.type === "paragraph" && (
                  <RichEditableText
                    html={block.html || block.text}
                    onChange={(newHtml) =>
                      onUpdateBlock(index, {
                        ...block,
                        html: newHtml,
                        text: newHtml.replace(/<[^>]+>/g, ""),
                      })
                    }
                    onFocus={() => {
                      setEditingBlockId(block.id || index);
                      if (onSelectBlock) onSelectBlock(index);
                    }}
                    onBlur={() => setEditingBlockId(null)}
                    placeholder="Enter paragraph text..."
                    style={{
                      fontSize:
                        block.fontSizeTreatment === "compact"
                          ? "13.5px"
                          : block.fontSizeTreatment === "large"
                          ? "17px"
                          : block.fontSizeTreatment === "featured"
                          ? "20px"
                          : viewport === "mobile" ? "14.5px" : "15.5px",
                      fontWeight: block.isBold ? 700 : 400,
                      fontStyle: block.isItalic ? "italic" : "normal",
                      textDecoration: [block.isUnderline ? "underline" : "", block.isStrike ? "line-through" : ""].filter(Boolean).join(" ") || "none",
                      textAlign: block.align || "left",
                      color: block.textColor || "#374151",
                      backgroundColor: (block.highlightColor && block.highlightColor !== "transparent") ? block.highlightColor : "transparent",
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

                {block.type === "table" && (() => {
                  const numCols = Number(block.colCount || block.cols || 2);
                  const numRows = Number(block.rowCount || block.rows || 1);
                  const defaultHeaders = ["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6"];
                  const headers = Array.from({ length: numCols }, (_, cIdx) => {
                    if (Array.isArray(block.headers) && block.headers[cIdx] !== undefined) {
                      return block.headers[cIdx];
                    }
                    return defaultHeaders[cIdx] || `Heading ${cIdx + 1}`;
                  });

                  const rawData = Array.isArray(block.data)
                    ? block.data
                    : Array.isArray(block.rows) && typeof block.rows[0] === "object"
                    ? block.rows
                    : [];

                  const rowsData = Array.from({ length: numRows }, (_, rIdx) => {
                    const rowCells = rawData[rIdx] || [];
                    return Array.from({ length: numCols }, (_, cIdx) => {
                      return rowCells[cIdx] !== undefined ? rowCells[cIdx] : "Your text go here";
                    });
                  });

                  const borderCss =
                    block.borderStyle === "None"
                      ? "none"
                      : block.borderStyle === "Dashed"
                      ? "1px dashed #d1d5db"
                      : "1px solid #e5e7eb";

                  const cellPadding = (block.cellPadding !== undefined ? block.cellPadding : 8) + "px";

                  return (
                    <div style={{ overflowX: "auto", margin: "4px 0" }}>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: "14px",
                          border: borderCss,
                        }}
                      >
                        <thead>
                          <tr
                            style={{
                              backgroundColor: block.headerTransparent
                                ? "transparent"
                                : block.headerBg || "#f9fafb",
                              color: block.headerText || "#111827",
                            }}
                          >
                            {headers.map((h, hi) => (
                              <th
                                key={hi}
                                style={{
                                  padding: cellPadding,
                                  textAlign: "left",
                                  fontWeight: 600,
                                  border: borderCss,
                                }}
                              >
                                <RichEditableText
                                  tagName="span"
                                  html={h}
                                  onChange={(newHtml) => {
                                    const nextHeaders = [...headers];
                                    nextHeaders[hi] = newHtml;
                                    onUpdateBlock(index, {
                                      ...block,
                                      headers: nextHeaders,
                                    });
                                  }}
                                  onFocus={() => {
                                    setEditingBlockId(block.id || index);
                                    if (onSelectBlock) onSelectBlock(index);
                                  }}
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rowsData.map((row, ri) => (
                            <tr
                              key={ri}
                              style={{
                                backgroundColor: block.bodyTransparent
                                  ? "transparent"
                                  : block.bodyBg || "#ffffff",
                                color: block.bodyText || "#374151",
                              }}
                            >
                              {row.map((cell, ci) => (
                                <td
                                  key={ci}
                                  style={{
                                    padding: cellPadding,
                                    border: borderCss,
                                  }}
                                >
                                  <RichEditableText
                                    tagName="span"
                                    html={cell}
                                    onChange={(newHtml) => {
                                      const nextData = rowsData.map((r, r_i) =>
                                        r_i === ri
                                          ? r.map((c, c_i) => (c_i === ci ? newHtml : c))
                                          : [...r]
                                      );
                                      onUpdateBlock(index, {
                                        ...block,
                                        data: nextData,
                                        rows: nextData,
                                      });
                                    }}
                                    onFocus={() => {
                                      setEditingBlockId(block.id || index);
                                      if (onSelectBlock) onSelectBlock(index);
                                    }}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

                {/* --- Extended Element Types --- */}
                {block.type === "quote" && (
                  <div
                    style={{
                      paddingLeft: "16px",
                      borderLeft: "3px solid #18181b",
                      margin: "4px 0",
                    }}
                  >
                    <RichEditableText
                      html={block.html || block.text}
                      placeholder="Type '/' to add elements"
                      onChange={(newHtml) =>
                        onUpdateBlock(index, {
                          ...block,
                          html: newHtml,
                          text: newHtml.replace(/<[^>]+>/g, ""),
                        })
                      }
                      onFocus={() => {
                        setEditingBlockId(block.id || index);
                        if (onSelectBlock) onSelectBlock(index);
                      }}
                      onBlur={() => setEditingBlockId(null)}
                      style={{
                        fontSize: "15px",
                        lineHeight: "1.75",
                        color: block.textColor || "#18181b",
                        fontStyle: "italic",
                      }}
                    />
                  </div>
                )}

                {block.type === "list" && (
                  <div
                    style={{
                      padding: "4px 8px",
                      backgroundColor:
                        block.highlightColor && block.highlightColor !== "transparent"
                          ? block.highlightColor
                          : "transparent",
                      borderRadius: "6px",
                      textAlign: block.align || "left",
                    }}
                  >
                    {block.style === "numbered" ? (
                      <ol
                        style={{
                          margin: 0,
                          paddingLeft: "24px",
                          color: block.textColor || "#374151",
                          fontSize: "15px",
                          lineHeight: "1.8",
                          fontWeight: block.isBold ? 700 : 400,
                          fontStyle: block.isItalic ? "italic" : "normal",
                          textDecoration: [
                            block.isUnderline ? "underline" : "",
                            block.isStrike ? "line-through" : "",
                          ]
                            .filter(Boolean)
                            .join(" ") || "none",
                        }}
                      >
                        {(block.items || []).map((item, liIdx) => (
                          <li key={liIdx}>
                            <RichEditableText
                              tagName="span"
                              html={typeof item === "string" ? item : (item.html || item.text || "")}
                              onChange={(newHtml) => {
                                const newItems = [...(block.items || [])];
                                newItems[liIdx] = newHtml;
                                onUpdateBlock(index, { ...block, items: newItems });
                              }}
                              onFocus={() => {
                                setEditingBlockId(block.id || index);
                                if (onSelectBlock) onSelectBlock(index);
                              }}
                            />
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: "24px",
                          color: block.textColor || "#374151",
                          fontSize: "15px",
                          lineHeight: "1.8",
                          fontWeight: block.isBold ? 700 : 400,
                          fontStyle: block.isItalic ? "italic" : "normal",
                          textDecoration: [
                            block.isUnderline ? "underline" : "",
                            block.isStrike ? "line-through" : "",
                          ]
                            .filter(Boolean)
                            .join(" ") || "none",
                        }}
                      >
                        {(block.items || []).map((item, liIdx) => (
                          <li key={liIdx}>
                            <RichEditableText
                              tagName="span"
                              html={typeof item === "string" ? item : (item.html || item.text || "")}
                              onChange={(newHtml) => {
                                const newItems = [...(block.items || [])];
                                newItems[liIdx] = newHtml;
                                onUpdateBlock(index, { ...block, items: newItems });
                              }}
                              onFocus={() => {
                                setEditingBlockId(block.id || index);
                                if (onSelectBlock) onSelectBlock(index);
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {block.type === "image-text" && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        viewport === "mobile"
                          ? "1fr"
                          : block.imagePosition === "right"
                          ? "1.2fr 1fr"
                          : "1fr 1.2fr",
                      gap: "24px",
                      alignItems:
                        block.verticalAlign === "top"
                          ? "flex-start"
                          : block.verticalAlign === "bottom"
                          ? "flex-end"
                          : "center",
                      margin: "6px 0",
                    }}
                  >
                    {/* Image Column */}
                    <div
                      style={{
                        order: block.imagePosition === "right" ? 2 : 1,
                        display: "flex",
                        justifyContent:
                          block.horizontalAlign === "right"
                            ? "flex-end"
                            : block.horizontalAlign === "center"
                            ? "center"
                            : "flex-start",
                      }}
                    >
                      {block.imageUrl ? (
                        <img
                          src={block.imageUrl}
                          alt={block.imageAlt || ""}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "260px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          onClick={() => {
                            if (onOpenLibraryModal) onOpenLibraryModal();
                          }}
                          style={{
                            width: "100%",
                            height: "180px",
                            border: "1px dashed #cbd5e1",
                            borderRadius: "8px",
                            backgroundColor: "#f8fafc",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            color: "#64748b",
                            transition: "background-color 0.15s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f1f5f9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f8fafc")
                          }
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              backgroundColor: "#ffffff",
                              border: "1px solid #e2e8f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon source={ImageIcon} tone="subdued" />
                          </div>
                          <span style={{ fontSize: "13px", fontWeight: 500 }}>
                            Add Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Text Column */}
                    <div
                      style={{
                        order: block.imagePosition === "right" ? 1 : 2,
                        textAlign: block.horizontalAlign || "left",
                      }}
                    >
                      <RichEditableText
                        html={block.html || block.text}
                        placeholder="Type '/' to add elements"
                        onChange={(newHtml) =>
                          onUpdateBlock(index, {
                            ...block,
                            html: newHtml,
                            text: newHtml.replace(/<[^>]+>/g, ""),
                          })
                        }
                        onFocus={() => {
                          setEditingBlockId(block.id || index);
                          if (onSelectBlock) onSelectBlock(index);
                        }}
                        onBlur={() => setEditingBlockId(null)}
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.75",
                          color: block.textColor || "#374151",
                        }}
                      />
                    </div>
                  </div>
                )}

                {block.type === "image" && (
                  !block.url && !block.imageUrl ? (
                    <div
                      style={{
                        border: "1px dashed #cbd5e1",
                        borderRadius: "8px",
                        padding: "36px 20px",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => onOpenLibraryModal && onOpenLibraryModal()}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                        <Button icon={UploadIcon} size="slim">Upload image</Button>
                        <Button size="slim">Insert from URL</Button>
                        <Button icon={ImageIcon} size="slim">Select from library</Button>
                        <Button icon={MagicIcon} size="slim">Generate with AI</Button>
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                        Upload or drag an image file here, or pick one from your library.
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          block.align === "left"
                            ? "flex-start"
                            : block.align === "right"
                            ? "flex-end"
                            : "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={block.url || block.imageUrl}
                        alt={block.alt || block.imageAlt || ""}
                        style={{
                          width:
                            block.sameSize === "Small" || block.sameSize === "Small (25%)"
                              ? "25%"
                              : block.sameSize === "Medium" || block.sameSize === "Medium (50%)"
                              ? "50%"
                              : block.sameSize === "Large" || block.sameSize === "Large (75%)"
                              ? "75%"
                              : "100%",
                          maxHeight: "480px",
                          objectFit: (block.objectFit || "cover").toLowerCase(),
                          objectPosition: (block.objectPosition || "center").toLowerCase(),
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )
                )}

                {block.type === "video" && (
                  !block.videoUrl && !block.coverUrl ? (
                    <div
                      style={{
                        border: "1px dashed #cbd5e1",
                        borderRadius: "8px",
                        padding: "36px 20px",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      <Button size="slim">Insert from URL</Button>
                      <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                        Pick one video from your library, or insert video from URL.
                      </div>
                    </div>
                  ) : (
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
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)" }} />
                      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "#ffffff", textAlign: "center", padding: "16px" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}>
                          <Icon source={PlayCircleIcon} tone="base" />
                        </div>
                        <div style={{ fontWeight: 600, fontSize: "16px" }}>{block.title || "Video"}</div>
                      </div>
                    </div>
                  )
                )}

                {block.type === "image-gallery" && (
                  (!block.images || block.images.length === 0) ? (
                    <div
                      style={{
                        border: "1px solid #cbd5e1",
                        borderRadius: "8px",
                        padding: "32px 20px",
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#64748b",
                        fontSize: "13.5px",
                      }}
                    >
                      No image
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
                        gap: "12px",
                      }}
                    >
                      {block.images.map((img, gi) => (
                        <div key={gi} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <img
                            src={img.url}
                            alt={img.alt || ""}
                            style={{
                              width: "100%",
                              aspectRatio:
                                block.aspectRatio === "Standard (4:3)"
                                  ? "4 / 3"
                                  : block.aspectRatio === "Widescreen (16:9)"
                                  ? "16 / 9"
                                  : block.aspectRatio === "Portrait (3:4)"
                                  ? "3 / 4"
                                  : "1 / 1",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                          {block.showCaption && (
                            <div style={{ fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                              {img.alt || `Image ${gi + 1}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                )}

                {(block.type === "faq-accordion" || block.type === "faq") && (() => {
                  const qText = block.question || (block.items && block.items[0]?.question) || "What is your return policy?";
                  const aText = block.answer || (block.items && block.items[0]?.answer) || "We offer a 30-day money-back guarantee on all items.";
                  const isExpanded = block.isExpanded !== false;

                  return (
                    <div
                      style={{
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() => onUpdateBlock(index, { ...block, isExpanded: !isExpanded })}
                        style={{
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#18181b" }}>
                          {qText}
                        </span>
                        <Icon source={isExpanded ? ChevronUpIcon : ChevronDownIcon} tone="base" />
                      </div>

                      {isExpanded && (
                        <div style={{ padding: "0 16px 14px 16px" }}>
                          <div
                            style={{
                              padding: "10px 14px",
                              borderRadius: "6px",
                              border: isSelected ? "2px solid #2563eb" : "1px solid #f1f2f4",
                              backgroundColor: isSelected ? "#ffffff" : "#fbfbfb",
                            }}
                          >
                            <RichEditableText
                              html={block.html || aText}
                              onChange={(newHtml) => {
                                const clean = newHtml.replace(/<[^>]+>/g, "");
                                const items = block.items ? [...block.items] : [{ question: qText, answer: clean }];
                                if (items[0]) items[0].answer = clean;
                                onUpdateBlock(index, {
                                  ...block,
                                  html: newHtml,
                                  answer: clean,
                                  items,
                                });
                              }}
                              onFocus={() => {
                                setEditingBlockId(block.id || index);
                                if (onSelectBlock) onSelectBlock(index);
                              }}
                              style={{
                                fontSize: "14px",
                                color: "#374151",
                                lineHeight: "1.6",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {(block.type === "product" || block.type === "product-card") && (
                  !block.productHandle && !block.title ? (
                    <div
                      style={{
                        position: "relative",
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                        height: "200px",
                        backgroundColor: "#f4f4f5",
                        backgroundImage: "linear-gradient(135deg, #e4e4e7 25%, #f4f4f5 25%, #f4f4f5 50%, #e4e4e7 50%, #e4e4e7 75%, #f4f4f5 75%, #f4f4f5 100%)",
                        backgroundSize: "28px 28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button onClick={() => onSelectBlock && onSelectBlock(block.id)}>
                        Select product
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: viewport === "mobile" ? "column" : "row",
                        alignItems: viewport === "mobile" ? "flex-start" : "center",
                        gap: "20px",
                        padding: "18px",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: block.transparentBg ? "transparent" : "#ffffff",
                        boxShadow: block.transparentBg ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                      }}
                    >
                      <img
                        src={block.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80"}
                        alt={block.title || "Product"}
                        style={{
                          width: viewport === "mobile" ? "100%" : "120px",
                          height: viewport === "mobile" ? "180px" : "120px",
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
                        <div style={{ fontWeight: 700, fontSize: "17px", color: "#0f172a" }}>
                          {block.title || "Alpine Explorer Pro Edition"}
                        </div>
                        {block.showDescription !== false && (
                          <div style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 8px 0", lineHeight: "1.5" }}>
                            {block.subtitle || "High-performance all-mountain board engineered for precision edge control."}
                          </div>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                          <span style={{ fontWeight: 700, fontSize: "18px", color: "#16a34a" }}>
                            {block.price || "$499.00"}
                          </span>
                          {block.compareAtPrice && (
                            <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through" }}>
                              {block.compareAtPrice}
                            </span>
                          )}
                        </div>

                        {/* Variant and Quantity selector */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                          {block.showVariantSelector !== false && (
                            <select
                              style={{
                                padding: "6px 10px",
                                borderRadius: "6px",
                                border: "1px solid #cbd5e1",
                                fontSize: "12.5px",
                                color: "#18181b",
                              }}
                            >
                              <option>Size: 156cm</option>
                              <option>Size: 159cm</option>
                              <option>Size: 162cm</option>
                            </select>
                          )}
                          {block.showQuantitySelector !== false && (
                            <div style={{ display: "inline-flex", alignItems: "center", border: "1px solid #cbd5e1", borderRadius: "6px", overflow: "hidden" }}>
                              <button type="button" style={{ padding: "4px 8px", border: "none", background: "#f4f4f5", cursor: "pointer" }}>-</button>
                              <span style={{ padding: "4px 10px", fontSize: "12.5px", fontWeight: 600 }}>1</span>
                              <button type="button" style={{ padding: "4px 8px", border: "none", background: "#f4f4f5", cursor: "pointer" }}>+</button>
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            style={{
                              padding: "9px 20px",
                              borderRadius: "6px",
                              backgroundColor: block.buttonBg || "#4A4AF4",
                              color: block.buttonTextColor || "#FFFFFF",
                              border: "none",
                              fontWeight: 600,
                              fontSize: "13.5px",
                              cursor: "pointer",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            }}
                          >
                            {block.buttonLabel || "Add to Cart"}
                          </button>
                          {block.showShopPay && (
                            <button
                              type="button"
                              style={{
                                padding: "9px 16px",
                                borderRadius: "6px",
                                backgroundColor: "#5a31f4",
                                color: "#ffffff",
                                border: "none",
                                fontWeight: 700,
                                fontSize: "13.5px",
                                cursor: "pointer",
                              }}
                            >
                              Shop Pay
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {(block.type === "collection" || block.type === "collection-card") && (
                  !block.collectionHandle && !block.title ? (
                    <div
                      style={{
                        position: "relative",
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                        height: "200px",
                        backgroundColor: "#f4f4f5",
                        backgroundImage: "linear-gradient(135deg, #e4e4e7 25%, #f4f4f5 25%, #f4f4f5 50%, #e4e4e7 50%, #e4e4e7 75%, #f4f4f5 75%, #f4f4f5 100%)",
                        backgroundSize: "28px 28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Button onClick={() => alert("Select Collection")}>
                        Select Collection
                      </Button>
                    </div>
                  ) : (
                    <div
                      style={{
                        position: "relative",
                        borderRadius: `${block.cardRadius !== undefined ? block.cardRadius : 12}px`,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: viewport === "mobile" || block.layout === "Image Top" ? "column" : "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: block.layout === "Card Overlay" ? "32px 24px" : "18px",
                        backgroundColor: block.transparentBg ? "transparent" : "#ffffff",
                        border: block.transparentBg ? "none" : "1px solid #e2e8f0",
                        backgroundImage: block.layout === "Card Overlay" ? `url(${block.imageUrl})` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: block.layout === "Card Overlay" ? "#ffffff" : "#09090b",
                        gap: "20px",
                      }}
                    >
                      {block.layout === "Card Overlay" && (
                        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1 }} />
                      )}

                      {block.layout !== "Card Overlay" && (
                        <img
                          src={block.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80"}
                          alt={block.title || "Collection"}
                          style={{
                            width: viewport === "mobile" ? "100%" : `${block.imageWidth || 50}%`,
                            borderRadius: `${block.imageRadius !== undefined ? block.imageRadius : 8}px`,
                            aspectRatio:
                              block.imageRatio === "Square 1:1"
                                ? "1 / 1"
                                : block.imageRatio === "Widescreen 16:9"
                                ? "16 / 9"
                                : "4 / 3",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div style={{ position: "relative", zIndex: 2, flex: 1, textAlign: block.align || "left" }}>
                        <div
                          style={{
                            fontSize: `${block.titleSize || 24}px`,
                            fontWeight: 700,
                            color: block.layout === "Card Overlay" ? "#ffffff" : (block.titleColor || "#000000"),
                            marginBottom: "6px",
                          }}
                        >
                          {block.title || "All-Mountain Snowboards Collection"}
                        </div>
                        {block.showDescription !== false && (
                          <div
                            style={{
                              fontSize: `${block.descSize || 14}px`,
                              color: block.layout === "Card Overlay" ? "#e4e4e7" : (block.descColor || "#555555"),
                              lineHeight: "1.6",
                              marginBottom: "14px",
                            }}
                          >
                            {block.description || "Discover premium snowboards, boots, and bindings designed for every slope and mountain condition."}
                          </div>
                        )}
                        <button
                          type="button"
                          style={{
                            padding: "9px 20px",
                            borderRadius: `${block.buttonRadius !== undefined ? block.buttonRadius : 6}px`,
                            backgroundColor: block.buttonBg || "#000000",
                            color: block.buttonTextColor || "#FFFFFF",
                            border: "none",
                            fontWeight: 600,
                            fontSize: "13px",
                            cursor: "pointer",
                            width: block.buttonWidth === "full" ? "100%" : "auto",
                          }}
                        >
                          {block.ctaText || "Shop Collection"}
                        </button>
                      </div>
                    </div>
                  )
                )}

                {block.type === "product-grid" && (
                  <div style={{ margin: "4px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: block.titleColor || "#000000",
                        }}
                      >
                        {block.title || "Featured Products"}
                      </div>
                      {block.titleLink && (
                        <a href={block.titleLink} target={block.openInNewTab ? "_blank" : "_self"} rel="noreferrer" style={{ fontSize: "13px", color: "#2563eb", textDecoration: "none" }}>
                          View all
                        </a>
                      )}
                    </div>

                    {(!block.products || block.products.length === 0) ? (
                      <div
                        style={{
                          border: "1px solid #e4e4e7",
                          borderRadius: "8px",
                          height: "180px",
                          backgroundColor: "#f4f4f5",
                          backgroundImage: "linear-gradient(135deg, #e4e4e7 25%, #f4f4f5 25%, #f4f4f5 50%, #e4e4e7 50%, #e4e4e7 75%, #f4f4f5 75%, #f4f4f5 100%)",
                          backgroundSize: "28px 28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button onClick={() => alert("Select Products")}>
                          Select Products
                        </Button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: viewport === "mobile" ? "1fr" : "repeat(3, 1fr)",
                          gap: "14px",
                        }}
                      >
                        {block.products.slice(0, block.limit || 4).map((prod, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              border: block.transparentBg ? "none" : "1px solid #e2e8f0",
                              borderRadius: "8px",
                              padding: "10px",
                              backgroundColor: block.transparentBg ? "transparent" : "#ffffff",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              textAlign: block.contentAlign || "center",
                            }}
                          >
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              style={{ width: "100%", height: "130px", objectFit: "cover", borderRadius: "6px" }}
                            />
                            <div style={{ fontWeight: 600, fontSize: "14px", color: "#1e293b" }}>{prod.title}</div>
                            {block.showPrice !== false && (
                              <div style={{ fontWeight: 700, color: "#16a34a", fontSize: "14px" }}>{prod.price}</div>
                            )}
                            <button
                              type="button"
                              style={{
                                padding: "7px 14px",
                                borderRadius: `${block.buttonRadius !== undefined ? block.buttonRadius : 4}px`,
                                backgroundColor: block.buttonBg || "#000000",
                                color: block.buttonTextColor || "#FFFFFF",
                                border: "none",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                cursor: "pointer",
                                marginTop: "auto",
                              }}
                            >
                              {block.buttonLabel || "Add to Cart"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {block.type === "button" && (() => {
                  const label = block.buttonLabel || block.text || "Button Label";
                  const isFullWidth = block.widthMode === "Full Width";
                  const paddingV = block.paddingVertical !== undefined ? block.paddingVertical : 10;
                  const paddingH = block.paddingHorizontal !== undefined ? block.paddingHorizontal : 22;
                  const radius = block.borderRadius !== undefined ? block.borderRadius : 6;
                  const borderWidth = block.borderWidth !== undefined ? block.borderWidth : 1;
                  const styleType = block.buttonStyle || "Fill";

                  const bg =
                    styleType === "Outline" || styleType === "Text Only"
                      ? "transparent"
                      : block.bgColor || "#008060";
                  const textCol =
                    styleType === "Outline"
                      ? block.borderColor || block.bgColor || "#008060"
                      : block.textColor || "#FFFFFF";
                  const borderCss =
                    styleType === "Fill"
                      ? `${borderWidth}px solid ${block.borderColor || block.bgColor || "#008060"}`
                      : styleType === "Outline"
                      ? `${borderWidth}px solid ${block.borderColor || "#008060"}`
                      : "none";

                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          block.align === "left" ? "flex-start" : block.align === "right" ? "flex-end" : "center",
                        padding: "10px 0",
                        width: "100%",
                      }}
                    >
                      <button
                        type="button"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: isFullWidth ? "100%" : "auto",
                          padding: `${paddingV}px ${paddingH}px`,
                          borderRadius: `${radius}px`,
                          backgroundColor: bg,
                          color: textCol,
                          border: borderCss,
                          fontWeight: 600,
                          fontSize: "14px",
                          letterSpacing: `${block.letterSpacing || 0}px`,
                          textTransform: (block.textTransform || "Normal").toLowerCase(),
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          boxShadow: styleType === "Fill" ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (block.hoverBgColor && styleType === "Fill")
                            e.currentTarget.style.backgroundColor = block.hoverBgColor;
                          if (block.hoverTextColor) e.currentTarget.style.color = block.hoverTextColor;
                          if (block.hoverBorderColor) e.currentTarget.style.borderColor = block.hoverBorderColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = bg;
                          e.currentTarget.style.color = textCol;
                          if (styleType !== "Text Only") e.currentTarget.style.border = borderCss;
                        }}
                      >
                        {label}
                      </button>
                    </div>
                  );
                })()}

                {block.type === "custom-html" && (
                  <div
                    style={{
                      border: isSelected ? "2px solid #2563eb" : "1px dashed #cbd5e1",
                      borderRadius: "6px",
                      padding: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: block.html || block.code || "<div>Your HTML</div>" }} />
                  </div>
                )}

                {block.type === "company-hero" && (() => {
                  const facts = block.facts || [
                    { label: "Legal Name", value: "Company Corp Inc." },
                    { label: "Founded", value: "Established Online Brand" },
                    { label: "Headquarters", value: "Global Operations Center" },
                    { label: "Team Scale", value: "Specialized Professional Team" },
                    { label: "Markets", value: "Worldwide Delivery Network" },
                  ];

                  return (
                    <div
                      style={{
                        padding: "24px",
                        borderRadius: "12px",
                        border: `1px solid ${block.borderColor || "#E2E8F0"}`,
                        backgroundColor: block.cardBg || "#F8FAFC",
                        display: "grid",
                        gridTemplateColumns: viewport === "mobile" ? "1fr" : "1.4fr 1fr",
                        gap: "24px",
                        alignItems: "center",
                      }}
                    >
                      {/* Left: Titles & Facts */}
                      <div>
                        {block.badge && (
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              color: block.badgeColor || "#64748B",
                              marginBottom: "4px",
                            }}
                          >
                            {block.badge}
                          </div>
                        )}

                        <div
                          style={{
                            fontSize: `${block.titleSize || 36}px`,
                            fontWeight: 800,
                            color: block.titleColor || "#0F172A",
                            lineHeight: "1.2",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          <RichEditableText
                            html={block.html || block.title || "Organization Fact Sheet"}
                            placeholder="Organization Fact Sheet"
                            onChange={(newHtml) => {
                              onUpdateBlock(index, {
                                ...block,
                                html: newHtml,
                                title: newHtml.replace(/<[^>]+>/g, ""),
                              });
                            }}
                            onFocus={() => {
                              setEditingBlockId(block.id || index);
                              if (onSelectBlock) onSelectBlock(index);
                            }}
                          />
                        </div>

                        {block.showAccentLine !== false && (
                          <div
                            style={{
                              width: "48px",
                              height: "3px",
                              backgroundColor: block.accentColor || "#0F172A",
                              margin: "12px 0 10px 0",
                              borderRadius: "2px",
                            }}
                          />
                        )}

                        {block.tagline && (
                          <div
                            style={{
                              fontSize: `${block.taglineSize || 15}px`,
                              color: block.taglineColor || "#475569",
                              lineHeight: "1.6",
                              marginBottom: "16px",
                            }}
                          >
                            {block.tagline}
                          </div>
                        )}

                        {/* Metadata Tag Pills */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {facts.map((fact, fi) => (
                            <div
                              key={fi}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "5px 10px",
                                backgroundColor: "#ffffff",
                                border: "1px solid #e2e8f0",
                                borderRadius: "6px",
                                fontSize: "12px",
                              }}
                            >
                              <span style={{ fontWeight: 700, color: block.labelColor || "#0F172A" }}>
                                {fact.label}:
                              </span>
                              <span style={{ color: block.valueColor || "#64748B" }}>
                                {fact.value}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextFacts = facts.filter((_, i) => i !== fi);
                                  onUpdateBlock(index, { ...block, facts: nextFacts });
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#94a3b8",
                                  cursor: "pointer",
                                  padding: "0 2px",
                                  fontSize: "13px",
                                  lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextFacts = [...facts, { label: "New Fact", value: "Verified Information" }];
                              onUpdateBlock(index, { ...block, facts: nextFacts });
                            }}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              backgroundColor: "#ffffff",
                              border: "1px dashed #cbd5e1",
                              borderRadius: "6px",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              color: "#059669",
                              cursor: "pointer",
                            }}
                          >
                            + Add Fact
                          </button>
                        </div>
                      </div>

                      {/* Right: Picture */}
                      <div>
                        <img
                          src={block.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&auto=format&fit=crop&q=80"}
                          alt={block.title || "Company Profile"}
                          style={{
                            width: "100%",
                            maxHeight: "300px",
                            borderRadius: "12px",
                            objectFit: "cover",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}

                {block.type === "fact-highlight" && (
                  <div
                    style={{
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                      backgroundColor: block.cardBg || "#FFFFFF",
                      margin: "6px 0",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: block.headerBg || "#008060",
                        color: block.headerTextColor || "#FFFFFF",
                        padding: "10px 16px",
                        fontWeight: 700,
                        fontSize: "13px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {block.headerTitle || "FACT HIGHLIGHT"}
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      <RichEditableText
                        html={block.html || block.text || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                        placeholder="Enter fact highlight content..."
                        onChange={(newHtml) => {
                          onUpdateBlock(index, {
                            ...block,
                            html: newHtml,
                            text: newHtml.replace(/<[^>]+>/g, ""),
                          });
                        }}
                        onFocus={() => {
                          setEditingBlockId(block.id || index);
                          if (onSelectBlock) onSelectBlock(index);
                        }}
                        style={{
                          fontSize: "14px",
                          color: block.cardTextColor || "#202223",
                          lineHeight: "1.65",
                        }}
                      />
                    </div>
                  </div>
                )}

                {block.type === "contact-grid" && (() => {
                  const channels = block.channels || [
                    { type: "Email", label: "EMAIL", value: "support@store.com" },
                    { type: "Phone", label: "PHONE", value: "Available via website" },
                    { type: "Website", label: "WEBSITE", value: "Official Store" },
                    { type: "Headquarters", label: "HEADQUARTERS", value: "Global Operations" },
                  ];

                  const getChannelIcon = (type) => {
                    if (type === "Phone") return MobileIcon;
                    if (type === "Website") return ExternalIcon;
                    if (type === "Headquarters") return StoreIcon;
                    return EmailIcon;
                  };

                  return (
                    <div
                      style={{
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "28px 20px",
                        backgroundColor: block.cardBg || "#FFFFFF",
                        margin: "8px 0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "22px",
                          fontWeight: 800,
                          color: block.textColor || "#0F172A",
                          textAlign: "center",
                          marginBottom: block.subtitle ? "6px" : "24px",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {block.title || "LET'S GET IN TOUCH"}
                      </div>
                      {block.subtitle && (
                        <div style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                          {block.subtitle}
                        </div>
                      )}

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: viewport === "mobile" ? "repeat(2, 1fr)" : `repeat(${channels.length || 4}, 1fr)`,
                          gap: "20px",
                          textAlign: "center",
                        }}
                      >
                        {channels.map((ch, ci) => (
                          <div key={ci} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: block.iconColor || "#1E293B",
                                marginBottom: "4px",
                              }}
                            >
                              <Icon source={getChannelIcon(ch.type)} tone="base" />
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                color: "#64748b",
                              }}
                            >
                              {ch.label}
                            </div>
                            <div
                              style={{
                                fontSize: "13.5px",
                                fontWeight: 600,
                                color: block.textColor || "#0F172A",
                                wordBreak: "break-word",
                              }}
                            >
                              {ch.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {block.type === "social-strip" && (() => {
                  const channels = block.channels || [
                    { name: "LinkedIn", platform: "linkedin", url: "https://linkedin.com" },
                    { name: "Instagram", platform: "instagram", url: "https://instagram.com" },
                    { name: "Facebook", platform: "facebook", url: "https://facebook.com" },
                    { name: "X", platform: "twitter", url: "https://x.com" },
                    { name: "YouTube", platform: "youtube", url: "https://youtube.com" },
                  ];

                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          block.align === "Left" ? "flex-start" : block.align === "Right" ? "flex-end" : "center",
                        width: "100%",
                        padding: "10px 0",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "14px",
                          padding: "8px 20px",
                          borderRadius: "9999px",
                          backgroundColor: block.capsuleBg || "#F8FAFC",
                          border: `1px solid ${block.borderColor || "#E2E8F0"}`,
                          maxWidth: `${block.capsuleWidth || 320}px`,
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        {block.showLabel !== false && (
                          <span style={{ fontSize: "12.5px", fontWeight: 600, color: block.labelColor || "#334155", flexShrink: 0 }}>
                            {block.label || "Follow us:"}
                          </span>
                        )}

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {channels.map((ch, ci) => (
                            <a
                              key={ci}
                              href={ch.url}
                              target="_blank"
                              rel="noreferrer"
                              title={ch.name}
                              style={{
                                color: "#475569",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textDecoration: "none",
                                transition: "color 0.15s ease, transform 0.15s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = "#000000";
                                e.currentTarget.style.transform = "scale(1.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = "#475569";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                            >
                              <Icon source={ShareIcon} tone="base" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

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

        {/* Interactive placeholder row at the bottom of the canvas */}
        <div
          onClick={() => {
            const nextIndex = blocks.length;
            onInsertBlock(
              {
                type: "heading",
                level: "h2",
                text: "",
                html: "",
                align: "left",
              },
              nextIndex
            );
          }}
          style={{
            marginTop: "16px",
            padding: "10px 14px",
            color: "#9ca3af",
            fontSize: "15px",
            borderRadius: "6px",
            border: "1px dashed transparent",
            backgroundColor: "transparent",
            cursor: "text",
            display: "flex",
            alignItems: "center",
            transition: "all 0.15s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "1px dashed #d1d5db";
            e.currentTarget.style.backgroundColor = "#fafafa";
            e.currentTarget.style.color = "#6b7280";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = "1px dashed transparent";
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >
          Type &apos;/&apos; to add elements
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

