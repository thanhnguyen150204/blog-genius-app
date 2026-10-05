import { useState, useRef, useEffect, useCallback } from "react";
import { Tag, Text, Checkbox, BlockStack } from "@shopify/polaris";

export function KeywordTagCombobox({
  tags = [],
  onChange,
  hasError = false,
}) {
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize active tags to array of strings
  const currentTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string" && tags.trim()
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Toggle/remove keyword when unchecked
  const handleToggleKeyword = useCallback(
    (kw) => {
      // Unchecking removes it completely from the list
      const nextTags = currentTags.filter((t) => t !== kw);
      onChange(nextTags);
      inputRef.current?.focus();
    },
    [currentTags, onChange]
  );

  // Add new tag from input text
  const handleAddCustomTag = useCallback(
    (newKw) => {
      const trimmed = (newKw || "").trim();
      if (!trimmed) return;

      if (!currentTags.includes(trimmed)) {
        const nextTags = [...currentTags, trimmed];
        onChange(nextTags);
      }

      setInputText("");
      inputRef.current?.focus();
    },
    [currentTags, onChange]
  );

  // Remove tag from active selection
  const handleRemoveTag = useCallback(
    (tagToRemove) => {
      const nextTags = currentTags.filter((t) => t !== tagToRemove);
      onChange(nextTags);
    },
    [currentTags, onChange]
  );

  // Keydown handler (Enter to add, Backspace to remove last)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputText.trim()) {
        handleAddCustomTag(inputText.trim());
      }
    } else if (e.key === "Backspace" && !inputText && currentTags.length > 0) {
      handleRemoveTag(currentTags[currentTags.length - 1]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter currentTags by query if typing
  const query = inputText.trim().toLowerCase();
  const visibleKeywords = query
    ? currentTags.filter((kw) => kw.toLowerCase().includes(query))
    : currentTags;

  const isExactMatch = currentTags.some(
    (kw) => kw.toLowerCase() === query
  );

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Interactive Tag Container & Input */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "6px",
          minHeight: "36px",
          padding: "4px 12px",
          borderRadius: "8px",
          border: hasError
            ? "1px solid #9e2a2b"
            : isOpen
            ? "2px solid #005bd3"
            : "1px solid #8c9196",
          backgroundColor: hasError ? "#fbf2f2" : "#ffffff",
          cursor: "text",
          boxShadow: isOpen && !hasError ? "0 0 0 1px #005bd3" : "none",
          transition: "border-color 0.15s ease, background-color 0.15s ease",
        }}
      >
        {/* Rendered Tags */}
        {currentTags.map((tag) => (
          <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
            {tag}
          </Tag>
        ))}

        {/* Inline Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={currentTags.length === 0 ? "Select keywords" : "Add keyword..."}
          style={{
            flex: 1,
            minWidth: "120px",
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: "#18181b",
            backgroundColor: "transparent",
            padding: "4px 0",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Popover Dropdown matching sample screenshot with toggleable checkboxes */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e4e4e7",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
            padding: "16px 20px",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          <BlockStack gap="300">
            {/* Header */}
            <Text variant="headingSm" as="h4" fontWeight="bold">
              Your keywords
            </Text>

            {/* Option to Add new keyword if user is typing */}
            {inputText.trim() && !isExactMatch && (
              <div
                onClick={() => handleAddCustomTag(inputText.trim())}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor: "#f8fafc",
                  color: "#18181b",
                  fontSize: "13px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "background-color 0.12s ease",
                  border: "1px dashed #cbd5e1",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eff6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
              >
                <span>Add "{inputText.trim()}"</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>Press Enter ↵</span>
              </div>
            )}

            {/* List of Keywords with Checkboxes */}
            {visibleKeywords.length > 0 ? (
              <BlockStack gap="200">
                {visibleKeywords.map((kw) => (
                  <div
                    key={kw}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "2px 0",
                    }}
                  >
                    <Checkbox
                      label={kw}
                      checked={true}
                      onChange={() => handleToggleKeyword(kw)}
                    />
                  </div>
                ))}
              </BlockStack>
            ) : (
              <div
                style={{
                  padding: "16px 8px",
                  textAlign: "center",
                  color: "#71717a",
                  fontSize: "13px",
                }}
              >
                {inputText.trim()
                  ? `No tags found matching "${inputText.trim()}"`
                  : "No keywords yet. Type a keyword above and press Enter to add."}
              </div>
            )}
          </BlockStack>
        </div>
      )}
    </div>
  );
}

export default KeywordTagCombobox;
