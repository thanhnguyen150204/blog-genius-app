import { useState, useEffect, useMemo } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  Tag,
  Icon,
  Checkbox,
  Banner,
} from "@shopify/polaris";
import {
  MagicIcon,
  ArrowLeftIcon,
  SearchIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";
import {
  getSavedKeywords,
  addSavedKeyword,
  addSavedKeywords,
  isKeywordSaved,
} from "../utils/savedKeywordsStorage";

const LANGUAGE_OPTIONS = [
  { label: "English(US)", value: "en-US" },
  { label: "English(UK)", value: "en-GB" },
  { label: "Vietnamese", value: "vi-VN" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Spanish", value: "es-ES" },
  { label: "Japanese", value: "ja-JP" },
];

const MOCK_KEYWORDS_BY_TOPIC = {
  "mother and baby": [
    "Mother and baby care",
    "organic baby clothes online",
    "safe baby skincare products",
    "postpartum essentials for moms",
    "newborn baby clothing sets",
    "sustainable mother and baby apparel",
    "toddler developmental toys",
    "baby feeding accessories online",
    "maternity fashion trends 2026",
    "mother and baby gifts",
    "natural baby wipes & diapers",
    "baby sleep safety essentials",
    "eco-friendly nursery furniture",
    "breastfeeding support accessories",
    "hospital bag checklist essentials",
  ],
  vietnam: [
    "Vietnamese products online",
    "shop Vietnamese products",
    "authentic Vietnamese goods",
    "Vietnam online shopping",
    "Vietnamese gifts",
    "traditional Vietnamese gifts",
    "Vietnamese handicrafts",
    "Vietnamese specialty foods",
    "Vietnamese silk products",
    "Vietnamese coffee beans online",
    "handmade Vietnamese ceramics",
    "Vietnamese organic tea",
  ],
  "viet nam": [
    "Vietnamese products online",
    "shop Vietnamese products",
    "authentic Vietnamese goods",
    "Vietnam online shopping",
    "Vietnamese gifts",
    "traditional Vietnamese gifts",
    "Vietnamese handicrafts",
    "Vietnamese specialty foods",
    "Vietnamese silk products",
    "Vietnamese coffee beans online",
    "handmade Vietnamese ceramics",
    "Vietnamese organic tea",
  ],
};

function generateKeywordsForTopics(topics) {
  if (!topics || topics.length === 0) {
    return MOCK_KEYWORDS_BY_TOPIC["mother and baby"];
  }

  const normalized = topics.map((t) => t.toLowerCase().trim());
  const foundKeywords = new Set();

  for (const topic of normalized) {
    if (
      topic.includes("mother") ||
      topic.includes("baby") ||
      topic.includes("mom") ||
      topic.includes("maternity")
    ) {
      MOCK_KEYWORDS_BY_TOPIC["mother and baby"].forEach((k) => foundKeywords.add(k));
    } else if (topic.includes("viet") || topic.includes("nam")) {
      MOCK_KEYWORDS_BY_TOPIC["viet nam"].forEach((k) => foundKeywords.add(k));
    } else {
      // Generative keywords based on custom topic
      foundKeywords.add(`best ${topic} for 2026`);
      foundKeywords.add(`organic ${topic} online`);
      foundKeywords.add(`${topic} shopping guide`);
      foundKeywords.add(`affordable ${topic} reviews`);
      foundKeywords.add(`top rated ${topic} products`);
      foundKeywords.add(`sustainable ${topic} brands`);
      foundKeywords.add(`${topic} gift ideas`);
      foundKeywords.add(`how to choose ${topic}`);
      foundKeywords.add(`${topic} trends and essentials`);
      foundKeywords.add(`premium ${topic} collection`);
    }
  }

  return Array.from(foundKeywords);
}

export default function Keywords() {
  const shopify = useAppBridge();
  const navigate = useNavigate();

  // Banner State
  const [showPasswordBanner, setShowPasswordBanner] = useState(true);

  // Form State
  const [language, setLanguage] = useState("en-US");
  const [businessDesc, setBusinessDesc] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [isEditingBusinessDesc, setIsEditingBusinessDesc] = useState(false);
  const [isEditingTargetCustomer, setIsEditingTargetCustomer] = useState(false);

  // Topic tags state - starts empty so warning banner shows initially
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState("");
  const [isTopicInputFocused, setIsTopicInputFocused] = useState(false);
  const [topicError, setTopicError] = useState(false);

  // Keywords generation & results state
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [suggestedList, setSuggestedList] = useState([]);
  const [selectedKws, setSelectedKws] = useState(new Set());

  // Saved keywords tracker
  const [savedKws, setSavedKws] = useState(getSavedKeywords);

  useEffect(() => {
    const handleStorageUpdate = (e) => {
      if (Array.isArray(e.detail)) {
        setSavedKws(e.detail);
      } else {
        setSavedKws(getSavedKeywords());
      }
    };
    window.addEventListener("saved_keywords_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("saved_keywords_updated", handleStorageUpdate);
    };
  }, []);

  // Handle adding topic tag on Enter
  const handleTopicKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = topicInput.trim();
      if (trimmed && !topics.includes(trimmed)) {
        setTopics([...topics, trimmed]);
        setTopicInput("");
        setTopicError(false);
      }
    } else if (e.key === "Backspace" && !topicInput && topics.length > 0) {
      setTopics(topics.slice(0, topics.length - 1));
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setTopics(topics.filter((t) => t !== topicToRemove));
  };

  const handleClearTopics = () => {
    setTopics([]);
    setTopicInput("");
    setTopicError(false);
  };

  // Generate keywords with required validation
  const handleGenerateKeywords = () => {
    const trimmed = topicInput.trim();
    const effectiveTopics = [...topics];
    if (trimmed && !effectiveTopics.includes(trimmed)) {
      effectiveTopics.push(trimmed);
      setTopics(effectiveTopics);
      setTopicInput("");
    }

    if (effectiveTopics.length === 0) {
      setTopicError(true);
      return;
    }

    setTopicError(false);
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateKeywordsForTopics(effectiveTopics);
      setSuggestedList(generated);
      setIsGenerating(false);
      setHasGenerated(true);
      setSelectedKws(new Set());
    }, 600);
  };

  // Add single keyword
  const handleAddKeyword = (kw) => {
    addSavedKeyword(kw);
    shopify.toast?.show(`Added "${kw}" to saved keywords!`);
  };

  // Toggle selection checkbox
  const handleToggleSelectRow = (kw) => {
    setSelectedKws((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) {
        next.delete(kw);
      } else {
        next.add(kw);
      }
      return next;
    });
  };

  // Select all / Deselect all
  const handleToggleSelectAll = () => {
    if (selectedKws.size === suggestedList.length) {
      setSelectedKws(new Set());
    } else {
      setSelectedKws(new Set(suggestedList));
    }
  };

  // Bulk add selected
  const handleAddSelectedKeywords = () => {
    const listToAdd = Array.from(selectedKws);
    if (listToAdd.length === 0) return;
    addSavedKeywords(listToAdd);
    shopify.toast?.show(`Added ${listToAdd.length} keywords to saved list!`);
  };

  const isAllSelected =
    suggestedList.length > 0 && selectedKws.size === suggestedList.length;

  return (
    <div style={{ padding: "24px 32px 80px 32px", maxWidth: "1160px", margin: "0 auto" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            icon={ArrowLeftIcon}
            variant="plain"
            onClick={() => navigate(-1)}
            accessibilityLabel="Go back"
          />
          <Text variant="headingLg" as="h1" fontWeight="bold">
            Suggest keywords
          </Text>
          <div
            style={{
              backgroundColor: "#e0f2fe",
              color: "#0284c7",
              fontSize: "12.5px",
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            You have 305 AI Credits
          </div>
        </div>
      </div>

      <BlockStack gap="400">
        {/* Yellow Warning Banner: only visible when no topic hashtags exist */}
        {showPasswordBanner && topics.length === 0 && (
          <Banner
            tone="warning"
            title="Your store is password-protected"
            onDismiss={() => setShowPasswordBanner(false)}
          >
            <p>
              We can't suggest keywords for password-protected stores. Please remove
              password for your store first before you can use this feature.{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  shopify.toast?.show("Redirecting to Shopify Preferences...");
                }}
                style={{ color: "#005bd3", textDecoration: "underline", fontWeight: 500 }}
              >
                Remove store password
              </a>
            </p>
          </Banner>
        )}

        {/* AI Keyword Suggestion Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e1e3e5",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          }}
        >
          <BlockStack gap="400">
            <Text variant="headingSm" as="h2" fontWeight="bold">
              AI Keyword Suggestion
            </Text>

            {/* Language Selector */}
            <div style={{ maxWidth: "260px" }}>
              <Select
                label="Language"
                options={LANGUAGE_OPTIONS}
                value={language}
                onChange={setLanguage}
              />
            </div>

            {/* Business Description & Target Customer 2-column Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Business Description */}
              <div
                style={{
                  backgroundColor: isEditingBusinessDesc ? "#ffffff" : "#f7f7f8",
                  border: isEditingBusinessDesc ? "2px solid #005bd3" : "1px solid #e1e3e5",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  minHeight: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "#5c5f62", fontWeight: 500 }}>
                      Business description
                    </span>
                    <Button
                      variant="plain"
                      onClick={() => setIsEditingBusinessDesc(!isEditingBusinessDesc)}
                    >
                      {isEditingBusinessDesc ? "Save" : "Edit"}
                    </Button>
                  </div>

                  {isEditingBusinessDesc ? (
                    <textarea
                      value={businessDesc}
                      onChange={(e) => setBusinessDesc(e.target.value.slice(0, 500))}
                      placeholder="Enter your business description for better AI content generation"
                      rows={2}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: "13px", color: businessDesc ? "#202223" : "#8c9196" }}>
                      {businessDesc ||
                        "Enter your business description for better AI content generation"}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", fontSize: "11px", color: "#8c9196" }}>
                  {businessDesc.length}/500
                </div>
              </div>

              {/* Target Customer */}
              <div
                style={{
                  backgroundColor: isEditingTargetCustomer ? "#ffffff" : "#f7f7f8",
                  border: isEditingTargetCustomer ? "2px solid #005bd3" : "1px solid #e1e3e5",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  minHeight: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "#5c5f62", fontWeight: 500 }}>
                      Target customer
                    </span>
                    <Button
                      variant="plain"
                      onClick={() => setIsEditingTargetCustomer(!isEditingTargetCustomer)}
                    >
                      {isEditingTargetCustomer ? "Save" : "Edit"}
                    </Button>
                  </div>

                  {isEditingTargetCustomer ? (
                    <textarea
                      value={targetCustomer}
                      onChange={(e) => setTargetCustomer(e.target.value.slice(0, 500))}
                      placeholder="Enter your target customer description for better AI content generation"
                      rows={2}
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: "13px", color: targetCustomer ? "#202223" : "#8c9196" }}>
                      {targetCustomer ||
                        "Enter your business description for better AI content generation"}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", fontSize: "11px", color: "#8c9196" }}>
                  {targetCustomer.length}/500
                </div>
              </div>
            </div>

            {/* Topics Multi-Tag Input */}
            <BlockStack gap="150">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "13px", color: "#202223", fontWeight: 500 }}>
                  Enter topic(s) (product or services) closely related to your business{" "}
                  <span style={{ color: "#9e2a2b" }}>*</span>
                </span>
                {topics.length > 0 && (
                  <Button variant="plain" tone="critical" onClick={handleClearTopics}>
                    Clear
                  </Button>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "8px",
                  minHeight: "44px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: topicError
                    ? "1px solid #9e2a2b"
                    : isTopicInputFocused
                    ? "2px solid #005bd3"
                    : "1px solid #8c9196",
                  backgroundColor: topicError ? "#fbf2f2" : "#ffffff",
                  cursor: "text",
                  boxShadow: isTopicInputFocused && !topicError ? "0 0 0 1px #005bd3" : "none",
                  boxSizing: "border-box",
                  transition:
                    "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
                }}
                onClick={() => document.getElementById("topic-tag-input")?.focus()}
              >
                {topics.map((t) => (
                  <Tag key={t} onRemove={() => handleRemoveTopic(t)}>
                    {t}
                  </Tag>
                ))}

                <input
                  id="topic-tag-input"
                  type="text"
                  value={topicInput}
                  onChange={(e) => {
                    setTopicInput(e.target.value);
                    if (topicError) setTopicError(false);
                  }}
                  onFocus={() => setIsTopicInputFocused(true)}
                  onBlur={() => setIsTopicInputFocused(false)}
                  onKeyDown={handleTopicKeyDown}
                  placeholder={
                    topics.length === 0
                      ? "e.g. Mother and baby, organic baby clothes"
                      : "Press Enter to add more topics"
                  }
                  style={{
                    flex: 1,
                    minWidth: "180px",
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    color: "#202223",
                    backgroundColor: "transparent",
                    padding: "2px 0",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {topicError && (
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
                      flexShrink: 0,
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
                    Topic is required! Please enter at least one topic.
                  </span>
                </div>
              )}
            </BlockStack>

            {/* Generate Action Button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
              <Button
                variant="primary"
                icon={MagicIcon}
                loading={isGenerating}
                onClick={handleGenerateKeywords}
              >
                Generate keywords with AI
              </Button>
            </div>
          </BlockStack>
        </div>

        {/* Results Area */}
        {!hasGenerated ? (
          /* Empty State Search Illustration with Polaris Icon */
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e1e3e5",
              minHeight: "260px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
            }}
          >
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                backgroundColor: "#f7f7f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8c9196",
              }}
            >
              <div style={{ transform: "scale(2.4)" }}>
                <Icon source={SearchIcon} tone="subdued" />
              </div>
            </div>
          </div>
        ) : (
          /* Generated Keywords Table */
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e1e3e5",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Bulk Selection Bar */}
            {selectedKws.size > 0 && (
              <div
                style={{
                  backgroundColor: "#f0f7ff",
                  borderBottom: "1px solid #cce4ff",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#005bd3" }}>
                  {selectedKws.size} keyword(s) selected
                </span>
                <Button size="slim" variant="primary" onClick={handleAddSelectedKeywords}>
                  Add selected keywords ({selectedKws.size})
                </Button>
              </div>
            )}

            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 180px",
                alignItems: "center",
                padding: "12px 20px",
                borderBottom: "1px solid #e1e3e5",
                backgroundColor: "#f7f7f8",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5c5f62",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Checkbox
                  label=""
                  labelHidden
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                />
                <span>Keyword</span>
              </div>
              <div style={{ textAlign: "right", paddingRight: "8px" }}>Action</div>
            </div>

            {/* Table Rows */}
            <div>
              {suggestedList.map((kw) => {
                const isAdded =
                  isKeywordSaved(kw) ||
                  savedKws.some((s) => s.toLowerCase() === kw.toLowerCase());
                const isChecked = selectedKws.has(kw);

                return (
                  <div
                    key={kw}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 180px",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderBottom: "1px solid #f1f2f3",
                      backgroundColor: isChecked ? "#f8fafc" : "#ffffff",
                      transition: "background-color 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) e.currentTarget.style.backgroundColor = "#f7f7f8";
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Checkbox
                        label=""
                        labelHidden
                        checked={isChecked}
                        onChange={() => handleToggleSelectRow(kw)}
                      />
                      <span style={{ fontSize: "13.5px", color: "#202223", fontWeight: 400 }}>
                        {kw}
                      </span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      {isAdded ? (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#108043",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          <Icon source={CheckCircleIcon} tone="success" />
                          <span>Keyword added</span>
                        </div>
                      ) : (
                        <Button size="slim" onClick={() => handleAddKeyword(kw)}>
                          Add keyword
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </BlockStack>
    </div>
  );
}
