import { useState, useRef, useEffect } from "react";
import { Button, ButtonGroup, Popover, ActionList, Tooltip } from "@shopify/polaris";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  LinkIcon,
  MagicIcon,
  XIcon,
} from "@shopify/polaris-icons";

// Polaris-compliant SVG Icon for Strikethrough (matching Polaris 20x20 icon grid)
const TextStrikethroughIcon = () => (
  <svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10.875 4c-1.38 0-2.375.72-2.375 1.75 0 .82.63 1.35 1.78 1.63l.72.18c.2.05.39.1.58.15l-1.08.29H3.5a.75.75 0 0 0 0 1.5h6.1l.4.1c1.55.39 2.5 1.22 2.5 2.4 0 1.4-1.24 2.5-3.5 2.5-1.5 0-2.82-.54-3.54-1.28a.75.75 0 0 0-1.06 1.06c1.03 1.04 2.72 1.72 4.6 1.72 3.14 0 5-1.7 5-4 0-1.56-1.1-2.67-2.92-3.14l-.7-.18a7.8 7.8 0 0 1-.58-.15l1.2-.33h4.9a.75.75 0 0 0 0-1.5h-5.2l-.3-.08c-1.42-.35-2-1-2-1.77 0-.44.42-.75 1.12-.75 1.16 0 2.22.42 2.87 1.03a.75.75 0 1 0 1.02-1.1c-.93-.86-2.33-1.43-3.89-1.43Z"
      clipRule="evenodd"
      fill="currentColor"
    />
  </svg>
);

/**
 * Color Picker Popover Content:
 * Displays title ("Text" or "Background"), a Reset/Trash icon,
 * 6 preset circular swatches (Black, White, Grey, Blue, Green, Orange),
 * and a '+' button to open the custom browser color picker.
 */
function InlineColorPickerContent({
  title,
  currentColor,
  onSelectColor,
  onResetColor,
  colorInputRef,
}) {
  const defaultPalette = [
    { label: "Black", hex: "#000000" },
    { label: "White", hex: "#ffffff", hasBorder: true },
    { label: "Grey", hex: "#808080" },
    { label: "Blue", hex: "#0080ff" },
    { label: "Green", hex: "#10b981" },
    { label: "Orange", hex: "#f97316" },
  ];

  return (
    <div
      style={{
        padding: "10px 14px",
        minWidth: "220px",
        backgroundColor: "#ffffff",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "#374151",
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* 1. Trash / Reset Icon Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onResetColor}
          title="Clear color"
          style={{
            width: "22px",
            height: "22px",
            border: "none",
            backgroundColor: "transparent",
            color: "#9ca3af",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
            borderRadius: "4px",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.75 3a.75.75 0 0 0-.75.75v.5H4.75a.75.75 0 0 0 0 1.5h.38l.64 10.19A2 2 0 0 0 7.76 17.8h4.48a2 2 0 0 0 1.99-1.86l.64-10.19h.38a.75.75 0 0 0 0-1.5h-3.25v-.5a.75.75 0 0 0-.75-.75h-2.5Zm1.75 1.25h-1v-.5h1v.5Zm-2.5 4.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75Zm4 0a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0v-5.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* 2. 6 Circular Swatches */}
        {defaultPalette.map((item) => {
          const isSelected = currentColor?.toLowerCase() === item.hex.toLowerCase();
          return (
            <button
              key={item.hex}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelectColor(item.hex)}
              title={item.label}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: item.hex,
                border: item.hasBorder ? "1px solid #d4d4d8" : "none",
                cursor: "pointer",
                padding: 0,
                outline: isSelected ? "2px solid #2563eb" : "none",
                outlineOffset: "2px",
                transition: "transform 0.12s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          );
        })}

        {/* 3. '+' Custom Color Button */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => colorInputRef.current?.click()}
          title="Custom color..."
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "1px dashed #9ca3af",
            backgroundColor: "transparent",
            color: "#6b7280",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
            lineHeight: 1,
            padding: 0,
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#2563eb";
            e.currentTarget.style.color = "#2563eb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#9ca3af";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * BlockFormattingToolbar renders the floating rich-text toolbar
 * docked directly above the selected section in the blog canvas.
 * Formats mouse-highlighted text ranges inline using document.execCommand.
 */
export function BlockFormattingToolbar({
  block,
  onUpdateBlock,
  onClose,
  onAiRewrite,
}) {
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isHighlightPickerOpen, setIsHighlightPickerOpen] = useState(false);

  const toolbarRef = useRef(null);
  const textColorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Close color popups when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setIsColorPickerOpen(false);
        setIsHighlightPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      savedRangeRef.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  // Formats highlighted text inline via execCommand, or falls back to block styling
  const applyFormat = (command, value = null) => {
    restoreSelection();
    const sel = window.getSelection();
    const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed;

    if (hasSelection) {
      document.execCommand(command, false, value);
      const activeEl = document.activeElement;
      if (activeEl && activeEl.isContentEditable) {
        activeEl.dispatchEvent(new Event("input", { bubbles: true }));
      }
    } else {
      if (command === "bold") toggleFormat("isBold");
      else if (command === "italic") toggleFormat("isItalic");
      else if (command === "underline") toggleFormat("isUnderline");
      else if (command === "strikeThrough") toggleFormat("isStrike");
      else if (command === "foreColor") onUpdateBlock({ ...block, textColor: value });
      else if (command === "hiliteColor") onUpdateBlock({ ...block, highlightColor: value });
    }
  };

  const toggleFormat = (key) => {
    onUpdateBlock({
      ...block,
      [key]: !block[key],
    });
  };

  const handleAlign = (align) => {
    onUpdateBlock({
      ...block,
      align,
    });
  };

  const handleAiAction = (actionType) => {
    setIsAiMenuOpen(false);
    if (onAiRewrite) {
      onAiRewrite(actionType);
    } else {
      let newText = block.text || "";
      if (actionType === "shorter") {
        newText = newText.split(". ").slice(0, 2).join(". ") + ".";
      } else if (actionType === "longer") {
        newText += " Furthermore, field tests indicate that properly tuned edges improve carving control across diverse slope gradients.";
      } else if (actionType === "geo") {
        newText = `Direct Summary: ${newText} Designed for citation by AI answer engines and search overviews.`;
      }
      onUpdateBlock({
        ...block,
        text: newText,
      });
    }
  };

  const buttonStyle = (isActive) => ({
    width: "28px",
    height: "28px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: isActive ? "#e4e5e7" : "transparent",
    color: isActive ? "#000000" : "#303030",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    transition: "background-color 0.12s ease",
    outline: "none",
  });

  return (
    <div
      ref={toolbarRef}
      className="Polaris-Box"
      style={{
        position: "absolute",
        top: "-42px",
        left: "0",
        zIndex: 50,
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: "var(--p-color-bg-surface, #ffffff)",
        border: "1px solid var(--p-color-border, #d2d5d8)",
        borderRadius: "var(--p-border-radius-200, 8px)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)",
        padding: "3px 4px",
        gap: "6px",
        userSelect: "none",
        animation: "toolbarFadeIn 0.12s ease-out forwards",
        willChange: "opacity, transform",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden browser native color pickers for '+' custom color selection */}
      <input
        ref={textColorInputRef}
        type="color"
        value={block.textColor || "#000000"}
        onChange={(e) => {
          applyFormat("foreColor", e.target.value);
          setIsColorPickerOpen(false);
        }}
        style={{ display: "none" }}
      />
      <input
        ref={bgColorInputRef}
        type="color"
        value={
          block.highlightColor && block.highlightColor !== "transparent"
            ? block.highlightColor
            : "#000000"
        }
        onChange={(e) => {
          applyFormat("hiliteColor", e.target.value);
          setIsHighlightPickerOpen(false);
        }}
        style={{ display: "none" }}
      />

      {/* 1. Typography Formatting (Inline on highlighted text, or block fallback) */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
        <Tooltip content="Bold (Ctrl+B)">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => applyFormat("bold")}
            style={buttonStyle(block.isBold)}
            aria-label="Bold"
          >
            <TextBoldIcon />
          </button>
        </Tooltip>
        <Tooltip content="Italic (Ctrl+I)">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => applyFormat("italic")}
            style={buttonStyle(block.isItalic)}
            aria-label="Italic"
          >
            <TextItalicIcon />
          </button>
        </Tooltip>
        <Tooltip content="Underline (Ctrl+U)">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => applyFormat("underline")}
            style={buttonStyle(block.isUnderline)}
            aria-label="Underline"
          >
            <TextUnderlineIcon />
          </button>
        </Tooltip>
        <Tooltip content="Strikethrough">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => applyFormat("strikeThrough")}
            style={buttonStyle(block.isStrike)}
            aria-label="Strikethrough"
          >
            <TextStrikethroughIcon />
          </button>
        </Tooltip>
      </div>

      <div style={{ width: "1px", height: "16px", backgroundColor: "#e4e4e7" }} />

      {/* 2. Text Alignment - Block level */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
        <Tooltip content="Align Left">
          <button
            type="button"
            onClick={() => handleAlign("left")}
            style={buttonStyle(!block.align || block.align === "left")}
            aria-label="Align Left"
          >
            <TextAlignLeftIcon />
          </button>
        </Tooltip>
        <Tooltip content="Align Center">
          <button
            type="button"
            onClick={() => handleAlign("center")}
            style={buttonStyle(block.align === "center")}
            aria-label="Align Center"
          >
            <TextAlignCenterIcon />
          </button>
        </Tooltip>
        <Tooltip content="Align Right">
          <button
            type="button"
            onClick={() => handleAlign("right")}
            style={buttonStyle(block.align === "right")}
            aria-label="Align Right"
          >
            <TextAlignRightIcon />
          </button>
        </Tooltip>
      </div>

      <div style={{ width: "1px", height: "16px", backgroundColor: "#e4e4e7" }} />

      {/* 3. Text Color & Background Color Pickers (Formats highlighted text) */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
        {/* A ˅ Text Color Trigger */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              saveSelection();
              setIsColorPickerOpen(!isColorPickerOpen);
              setIsHighlightPickerOpen(false);
            }}
            title="Text Color"
            style={{
              height: "26px",
              padding: "0 6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              borderRadius: "6px",
              border: isColorPickerOpen ? "1px solid #2563eb" : "1px solid transparent",
              backgroundColor: isColorPickerOpen ? "#f1f5f9" : "transparent",
              cursor: "pointer",
              outline: "none",
              transition: "background-color 0.12s ease",
            }}
            aria-label="Text Color"
          >
            <span
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                lineHeight: 1,
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "serif", color: "#18181b" }}>
                A
              </span>
              <span
                style={{
                  width: "12px",
                  height: "2.5px",
                  backgroundColor: block.textColor || "#000000",
                  borderRadius: "1px",
                  marginTop: "1px",
                }}
              />
            </span>
            <svg viewBox="0 0 20 20" width="12" height="12" fill="#6b7280">
              {isColorPickerOpen ? (
                <path
                  fillRule="evenodd"
                  d="M14.78 12.28a.75.75 0 0 1-1.06 0L10 8.56l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06Z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M5.22 7.72a.75.75 0 0 1 1.06 0L10 11.44l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.78a.75.75 0 0 1 0-1.06Z"
                />
              )}
            </svg>
          </button>

          {/* Embedded Text Color Popover */}
          {isColorPickerOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: "0",
                zIndex: 100,
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e4e4e7",
                animation: "toolbarFadeIn 0.1s ease-out forwards",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <InlineColorPickerContent
                title="Text"
                currentColor={block.textColor || "#000000"}
                onSelectColor={(hex) => {
                  applyFormat("foreColor", hex);
                  setIsColorPickerOpen(false);
                }}
                onResetColor={() => {
                  applyFormat("removeFormat");
                  onUpdateBlock({ ...block, textColor: "" });
                  setIsColorPickerOpen(false);
                }}
                colorInputRef={textColorInputRef}
              />
            </div>
          )}
        </div>

        {/* [A] ˅ Background Color Trigger */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              saveSelection();
              setIsHighlightPickerOpen(!isHighlightPickerOpen);
              setIsColorPickerOpen(false);
            }}
            title="Background Color"
            style={{
              height: "26px",
              padding: "0 6px",
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
              borderRadius: "6px",
              border: isHighlightPickerOpen ? "1px solid #2563eb" : "1px solid transparent",
              backgroundColor: isHighlightPickerOpen ? "#f1f5f9" : "transparent",
              cursor: "pointer",
              outline: "none",
              transition: "background-color 0.12s ease",
            }}
            aria-label="Background Color"
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "15px",
                height: "15px",
                borderRadius: "3px",
                backgroundColor:
                  block.highlightColor && block.highlightColor !== "transparent"
                    ? block.highlightColor
                    : "#000000",
                color:
                  block.highlightColor === "#ffffff" ||
                  block.highlightColor === "#fef08a" ||
                  block.highlightColor === "#bbf7d0"
                    ? "#000000"
                    : "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "serif",
                lineHeight: 1,
              }}
            >
              A
            </span>
            <svg viewBox="0 0 20 20" width="12" height="12" fill="#6b7280">
              {isHighlightPickerOpen ? (
                <path
                  fillRule="evenodd"
                  d="M14.78 12.28a.75.75 0 0 1-1.06 0L10 8.56l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06Z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M5.22 7.72a.75.75 0 0 1 1.06 0L10 11.44l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.78a.75.75 0 0 1 0-1.06Z"
                />
              )}
            </svg>
          </button>

          {/* Embedded Background Color Popover */}
          {isHighlightPickerOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: "0",
                zIndex: 100,
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.06)",
                border: "1px solid #e4e4e7",
                animation: "toolbarFadeIn 0.1s ease-out forwards",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <InlineColorPickerContent
                title="Background"
                currentColor={block.highlightColor || "transparent"}
                onSelectColor={(hex) => {
                  applyFormat("hiliteColor", hex);
                  setIsHighlightPickerOpen(false);
                }}
                onResetColor={() => {
                  applyFormat("removeFormat");
                  onUpdateBlock({ ...block, highlightColor: "transparent" });
                  setIsHighlightPickerOpen(false);
                }}
                colorInputRef={bgColorInputRef}
              />
            </div>
          )}
        </div>

        {/* Hyperlink Button */}
        <Tooltip content="Hyperlink">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
            }}
            onClick={() => {
              const url = window.prompt("Enter destination URL:", block.linkUrl || "https://");
              if (url !== null) {
                applyFormat("createLink", url);
                onUpdateBlock({ ...block, linkUrl: url });
              }
            }}
            style={buttonStyle(Boolean(block.linkUrl))}
            aria-label="Insert Link"
          >
            <LinkIcon />
          </button>
        </Tooltip>
      </div>

      <div style={{ width: "1px", height: "16px", backgroundColor: "#e4e4e7" }} />

      {/* 4. ✨ AI Rewrite Dropdown Pill */}
      <Popover
        active={isAiMenuOpen}
        activator={
          <Button
            size="micro"
            variant="primary"
            icon={MagicIcon}
            disclosure="down"
            onClick={() => setIsAiMenuOpen(!isAiMenuOpen)}
          >
            AI Rewrite
          </Button>
        }
        onClose={() => setIsAiMenuOpen(false)}
      >
        <ActionList
          actionRole="menuitem"
          items={[
            {
              content: "✨ Improve Writing & Flow",
              onAction: () => handleAiAction("improve"),
            },
            {
              content: "⚡ Make Shorter & Punchier",
              onAction: () => handleAiAction("shorter"),
            },
            {
              content: "📝 Expand with Technical Details",
              onAction: () => handleAiAction("longer"),
            },
            {
              content: "🔍 Fix Grammar & Typos",
              onAction: () => handleAiAction("grammar"),
            },
            {
              content: "🌐 Optimize for GEO & Answer Block",
              onAction: () => handleAiAction("geo"),
            },
          ]}
        />
      </Popover>

      {/* 5. Close / Deselect Button */}
      <Tooltip content="Close Toolbar">
        <button
          type="button"
          onClick={onClose}
          style={{
            ...buttonStyle(false),
            width: "24px",
            height: "24px",
          }}
          aria-label="Close Toolbar"
        >
          <XIcon />
        </button>
      </Tooltip>
    </div>
  );
}

export default BlockFormattingToolbar;
