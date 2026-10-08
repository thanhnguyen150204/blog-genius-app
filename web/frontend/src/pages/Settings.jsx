import { useState, useEffect } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  ButtonGroup,
  Select,
  Modal,
  Badge,
  Banner,
  Icon,
} from "@shopify/polaris";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  MinusIcon,
  MagicIcon,
} from "@shopify/polaris-icons";
import { useAppBridge } from "@shopify/app-bridge-react";

const LANGUAGE_OPTIONS = [
  { label: "English(US)", value: "en-US" },
  { label: "English(UK)", value: "en-GB" },
  { label: "Vietnamese", value: "vi-VN" },
  { label: "French", value: "fr-FR" },
  { label: "German", value: "de-DE" },
  { label: "Spanish", value: "es-ES" },
  { label: "Japanese", value: "ja-JP" },
];

const TARGET_MARKET_OPTIONS = [
  { label: "None", value: "none" },
  { label: "United States", value: "us" },
  { label: "United Kingdom", value: "uk" },
  { label: "Vietnam", value: "vn" },
  { label: "Global", value: "global" },
  { label: "Australia", value: "au" },
  { label: "Canada", value: "ca" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Japan", value: "jp" },
];

const CLAUDE_MODEL_OPTIONS = [
  { label: "Sonnet 4.5", value: "sonnet-4.5" },
  { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet" },
  { label: "Claude 3 Opus", value: "claude-3-opus" },
  { label: "Claude 3.5 Haiku", value: "claude-3-5-haiku" },
];

const COLOR_MODE_OPTIONS = [
  { label: "Unset", value: "unset" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "Custom", value: "custom" },
];

const INITIAL_LOGS = [
  "08-10-2026 22:26:15: Suggest keywords - Blog Builder: -3 credits",
  "08-10-2026 22:25:12: Suggest keywords - Blog Builder: -3 credits",
  "07-10-2026 21:21:30: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 21:19:22: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 21:14:52: Generate outline - Blog Builder: -3 credits",
  "07-10-2026 19:42:10: Generate full article - Blog Builder: -10 credits",
  "06-10-2026 14:05:32: Generate SEO Meta & FAQ - Blog Builder: -5 credits",
  "05-10-2026 11:18:04: Generate featured AI image - Blog Builder: -5 credits",
];

export default function Settings() {
  const shopify = useAppBridge();

  // Top Tab Navigation
  const [activeTab, setActiveTab] = useState("general"); // "general" | "custom_assets"

  // Section 1: Useful information for AI
  const [businessDesc, setBusinessDesc] = useState(() => {
    return localStorage.getItem("tapita_business_desc") || "";
  });
  const [targetCustomer, setTargetCustomer] = useState(() => {
    return localStorage.getItem("tapita_target_customer") || "";
  });
  const [businessDescLang, setBusinessDescLang] = useState("en-US");
  const [targetCustomerLang, setTargetCustomerLang] = useState("en-US");
  const [brandVoice, setBrandVoice] = useState(() => {
    return localStorage.getItem("tapita_brand_voice") || "";
  });
  const [targetMarket, setTargetMarket] = useState("none");

  // Section 2: Global styles accordions
  const [expandedStyles, setExpandedStyles] = useState({
    content: true,
    heading: false,
    table: false,
    image: false,
    video: false,
    productCard: false,
    collectionCard: false,
    productGrid: false,
    button: false,
    imageAndText: false,
    tableOfContent: false,
  });
  const [colorMode, setColorMode] = useState("unset");

  // Section 3: Claude API Key
  const [claudeApiKey, setClaudeApiKey] = useState(() => {
    return localStorage.getItem("tapita_claude_api_key") || "";
  });
  const [claudeModel, setClaudeModel] = useState("sonnet-4.5");

  // Section 4: Credit history
  const [monthlyCredits] = useState(250);
  const [lifetimeCredits, setLifetimeCredits] = useState(55);
  const [logs] = useState(INITIAL_LOGS);

  // Section 5: FAQ
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Buy Credits Modal
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [selectedCreditPack, setSelectedCreditPack] = useState({
    id: "pack-200",
    credits: 200,
    price: 14.99,
  });

  // Custom Assets Tab State
  const [customCss, setCustomCss] = useState(
    "/* Add your custom styles for blog posts here */\n.tapita-blog-post {\n  font-family: inherit;\n}"
  );
  const [customJs, setCustomJs] = useState(
    "// Custom JS to execute on blog post pages\nconsole.log('Tapita blog loaded');"
  );
  const [googleFontUrl, setGoogleFontUrl] = useState("");

  const toggleStyleSection = (key) => {
    setExpandedStyles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem("tapita_business_desc", businessDesc);
    localStorage.setItem("tapita_target_customer", targetCustomer);
    localStorage.setItem("tapita_brand_voice", brandVoice);
    localStorage.setItem("tapita_claude_api_key", claudeApiKey);
    shopify.toast?.show("Settings saved successfully!");
  };

  const handleAutoSuggestAI = (field) => {
    if (field === "businessDesc") {
      setBusinessDesc(
        "Modern eco-friendly lifestyle brand focusing on organic cotton babywear, sustainable mother essentials, and non-toxic nursery accessories."
      );
      shopify.toast?.show("AI suggestion applied to Business description!");
    } else if (field === "targetCustomer") {
      setTargetCustomer(
        "First-time parents, expectant mothers, and gift shoppers aged 24-40 looking for safe, sustainable, premium baby and maternal care products."
      );
      shopify.toast?.show("AI suggestion applied to Target customer!");
    }
  };

  const handleBuyCredits = () => {
    setLifetimeCredits((prev) => prev + selectedCreditPack.credits);
    setIsBuyCreditsModalOpen(false);
    shopify.toast?.show(
      `Purchased ${selectedCreditPack.credits} lifetime credits successfully!`
    );
  };

  return (
    <div
      style={{
        padding: "24px 32px 100px 32px",
        maxWidth: "1160px",
        margin: "0 auto",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Text variant="headingLg" as="h1" fontWeight="bold">
          Settings
        </Text>

        <Button variant="primary" onClick={handleSaveSettings}>
          Save settings
        </Button>
      </div>

      {/* Top Pill Tab Switcher using Polaris ButtonGroup Segmented */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <ButtonGroup variant="segmented">
          <Button
            pressed={activeTab === "general"}
            onClick={() => setActiveTab("general")}
          >
            General Settings
          </Button>
          <Button
            pressed={activeTab === "custom_assets"}
            onClick={() => setActiveTab("custom_assets")}
          >
            Custom Assets
          </Button>
        </ButtonGroup>
      </div>

      {activeTab === "general" ? (
        <BlockStack gap="600">
          {/* Section 1: Useful information for AI */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14.5px",
                  fontWeight: 600,
                  color: "#202223",
                  marginBottom: "6px",
                }}
              >
                Useful information for AI
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175", lineHeight: "1.5" }}>
                These information will provide our AI with more context which helps it generate
                more relevant content for your blog posts.
              </div>
            </div>

            {/* Right Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e1e3e5",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
            >
              <BlockStack gap="400">
                {/* Business description */}
                <BlockStack gap="150">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                      Business description
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "125px" }}>
                        <Select
                          label=""
                          labelHidden
                          options={LANGUAGE_OPTIONS}
                          value={businessDescLang}
                          onChange={setBusinessDescLang}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={MagicIcon}
                        onClick={() => handleAutoSuggestAI("businessDesc")}
                        accessibilityLabel="Generate description with AI"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #8c9196",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <textarea
                      rows={3}
                      value={businessDesc}
                      onChange={(e) => setBusinessDesc(e.target.value.slice(0, 500))}
                      placeholder="Enter your business description"
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "13px",
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
                        fontSize: "11px",
                        marginTop: "2px",
                      }}
                    >
                      {businessDesc.length}/500
                    </div>
                  </div>
                </BlockStack>

                {/* Target customer */}
                <BlockStack gap="150">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                      Target customer
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "125px" }}>
                        <Select
                          label=""
                          labelHidden
                          options={LANGUAGE_OPTIONS}
                          value={targetCustomerLang}
                          onChange={setTargetCustomerLang}
                        />
                      </div>
                      <Button
                        variant="plain"
                        icon={MagicIcon}
                        onClick={() => handleAutoSuggestAI("targetCustomer")}
                        accessibilityLabel="Generate target customer with AI"
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      border: "1px solid #8c9196",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <textarea
                      rows={3}
                      value={targetCustomer}
                      onChange={(e) => setTargetCustomer(e.target.value.slice(0, 500))}
                      placeholder="Enter your target customer description"
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        resize: "none",
                        fontSize: "13px",
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
                        fontSize: "11px",
                        marginTop: "2px",
                      }}
                    >
                      {targetCustomer.length}/500
                    </div>
                  </div>
                </BlockStack>

                {/* Brand voice */}
                <BlockStack gap="150">
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                    Brand voice
                  </span>
                  <div
                    style={{
                      border: "1px solid #8c9196",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <input
                      type="text"
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      placeholder="e.g. Friendly, professional, authoritative, warm"
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </BlockStack>

                {/* Target market */}
                <BlockStack gap="150">
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                    Target market
                  </span>
                  <Select
                    label=""
                    labelHidden
                    options={TARGET_MARKET_OPTIONS}
                    value={targetMarket}
                    onChange={setTargetMarket}
                  />
                </BlockStack>
              </BlockStack>
            </div>
          </div>

          {/* Section 2: Global styles */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14.5px",
                  fontWeight: 600,
                  color: "#202223",
                  marginBottom: "6px",
                }}
              >
                Global styles
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175", lineHeight: "1.5" }}>
                These styles will be applied by default to all new blog posts you build with
                Tapita, but won't affect posts you've already created.
              </div>
            </div>

            {/* Right Card Accordion */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e1e3e5",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Accordion Item: Content (Expanded by default) */}
              <div>
                <div
                  onClick={() => toggleStyleSection("content")}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    borderBottom: expandedStyles.content ? "1px solid #f1f2f3" : "1px solid #e1e3e5",
                  }}
                >
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#202223" }}>
                    Content
                  </span>
                  <Icon
                    source={expandedStyles.content ? ChevronUpIcon : ChevronDownIcon}
                    tone="subdued"
                  />
                </div>

                {expandedStyles.content && (
                  <div style={{ padding: "20px" }}>
                    <BlockStack gap="400">
                      <div style={{ maxWidth: "100%" }}>
                        <span
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 500,
                            color: "#5c5f62",
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          Color mode
                        </span>
                        <Select
                          label=""
                          labelHidden
                          options={COLOR_MODE_OPTIONS}
                          value={colorMode}
                          onChange={setColorMode}
                        />
                      </div>

                      {/* Content Preview Canvas matching screenshot */}
                      <div
                        style={{
                          backgroundColor: colorMode === "dark" ? "#1f2937" : "#ffffff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          padding: "24px 28px",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "13px",
                            color: colorMode === "dark" ? "#d1d5db" : "#374151",
                            lineHeight: "1.6",
                            marginBottom: "16px",
                          }}
                        >
                          This is the introduction paragraph. The intro should be short, concise,
                          and give viewers an idea of what the whole blog post will be about.
                        </p>

                        <h2
                          style={{
                            fontSize: "22px",
                            fontWeight: 700,
                            color: colorMode === "dark" ? "#f9fafb" : "#111827",
                            margin: "18px 0 10px 0",
                            lineHeight: "1.3",
                          }}
                        >
                          This is a heading 2
                        </h2>

                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "8px" }}>
                          This is the first body paragraph.
                        </p>
                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "8px" }}>
                          This is the second body paragraph.
                        </p>
                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "16px" }}>
                          This is the third body paragraph.
                        </p>

                        <h3
                          style={{
                            fontSize: "18px",
                            fontWeight: 700,
                            color: colorMode === "dark" ? "#f9fafb" : "#111827",
                            margin: "18px 0 10px 0",
                            lineHeight: "1.3",
                          }}
                        >
                          This is a heading 3
                        </h3>

                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "8px" }}>
                          This is the fourth body paragraph.
                        </p>
                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "8px" }}>
                          This is the fifth body paragraph.
                        </p>
                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", marginBottom: "16px" }}>
                          This is the sixth body paragraph.
                        </p>

                        <h4
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: colorMode === "dark" ? "#f9fafb" : "#111827",
                            margin: "18px 0 10px 0",
                            lineHeight: "1.3",
                          }}
                        >
                          This is a heading 4
                        </h4>

                        <p style={{ fontSize: "13px", color: colorMode === "dark" ? "#d1d5db" : "#374151", margin: 0 }}>
                          This is the seventh body paragraph.
                        </p>
                      </div>
                    </BlockStack>
                  </div>
                )}
              </div>

              {/* Other Accordion Items */}
              {[
                { key: "heading", label: "Heading" },
                { key: "table", label: "Table" },
                { key: "image", label: "Image" },
                { key: "video", label: "Video" },
                { key: "productCard", label: "Product Card" },
                { key: "collectionCard", label: "Collection Card" },
                { key: "productGrid", label: "Product Grid" },
                { key: "button", label: "Button" },
                { key: "imageAndText", label: "Image & Text" },
                { key: "tableOfContent", label: "Table of Content" },
              ].map((sec) => {
                const isOpen = expandedStyles[sec.key];
                return (
                  <div key={sec.key} style={{ borderTop: "1px solid #e1e3e5" }}>
                    <div
                      onClick={() => toggleStyleSection(sec.key)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px 20px",
                        cursor: "pointer",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <span style={{ fontSize: "13.5px", fontWeight: 500, color: "#202223" }}>
                        {sec.label}
                      </span>
                      <Icon source={isOpen ? ChevronUpIcon : ChevronDownIcon} tone="subdued" />
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: "16px 20px 20px 20px",
                          backgroundColor: "#f9fafb",
                          borderTop: "1px solid #f1f2f3",
                        }}
                      >
                        <div style={{ fontSize: "13px", color: "#6d7175" }}>
                          Customize default typography, alignment, and spacing styles for{" "}
                          <strong>{sec.label}</strong> blocks.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Claude API key */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "32px",
              alignItems: "start",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14.5px",
                  fontWeight: 600,
                  color: "#202223",
                  marginBottom: "6px",
                }}
              >
                Claude API key
              </div>
              <div style={{ fontSize: "13px", color: "#6d7175", lineHeight: "1.5" }}>
                By entering your Claude API key, all AI content generations (except image generations)
                will use credits from your Claude account instead of using Tapita AI credits.
              </div>
            </div>

            {/* Right Card */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e1e3e5",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
            >
              <BlockStack gap="400">
                <BlockStack gap="150">
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                    Your Claude API key (optional)
                  </span>
                  <div
                    style={{
                      border: "1px solid #8c9196",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <input
                      type="password"
                      value={claudeApiKey}
                      onChange={(e) => setClaudeApiKey(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      style={{
                        width: "100%",
                        border: "none",
                        outline: "none",
                        fontSize: "13px",
                        fontFamily: "inherit",
                        backgroundColor: "transparent",
                      }}
                    />
                  </div>
                </BlockStack>

                <BlockStack gap="150">
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#202223" }}>
                    Claude model
                  </span>
                  <Select
                    label=""
                    labelHidden
                    options={CLAUDE_MODEL_OPTIONS}
                    value={claudeModel}
                    onChange={setClaudeModel}
                  />
                </BlockStack>
              </BlockStack>
            </div>
          </div>

          {/* Section 4: Credit history */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e1e3e5",
              padding: "20px 24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "14.5px", fontWeight: 600, color: "#202223" }}>
                Credit history
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {monthlyCredits} monthly credits
                </div>
                <div
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    fontSize: "12.5px",
                    fontWeight: 500,
                    padding: "4px 10px",
                    borderRadius: "6px",
                  }}
                >
                  {lifetimeCredits} lifetime credits
                </div>
                <Button
                  size="slim"
                  variant="primary"
                  onClick={() => setIsBuyCreditsModalOpen(true)}
                >
                  Buy more
                </Button>
              </div>
            </div>

            {/* Scrollable Log Box */}
            <div
              style={{
                maxHeight: "140px",
                overflowY: "auto",
                border: "1px solid #f1f2f3",
                borderRadius: "6px",
                padding: "8px 12px",
                backgroundColor: "#fafafa",
                fontFamily: "monospace",
                fontSize: "12px",
                color: "#374151",
                lineHeight: "1.8",
              }}
            >
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>

          {/* Section 5: FAQ */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e1e3e5",
              padding: "20px 24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                fontSize: "14.5px",
                fontWeight: 600,
                color: "#202223",
                marginBottom: "12px",
              }}
            >
              FAQ
            </div>

            <div
              style={{
                borderTop: "1px solid #f1f2f3",
                paddingTop: "12px",
              }}
            >
              <div
                onClick={() => setIsFaqOpen(!isFaqOpen)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "13.5px", color: "#202223", fontWeight: 500 }}>
                  How are credits counted?
                </span>
                <Button
                  variant="plain"
                  icon={isFaqOpen ? MinusIcon : PlusIcon}
                  onClick={() => setIsFaqOpen(!isFaqOpen)}
                  accessibilityLabel="Toggle FAQ"
                />
              </div>

              {isFaqOpen && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#5c5f62",
                    lineHeight: "1.6",
                  }}
                >
                  <p>AI credits are deducted based on actions performed:</p>
                  <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                    <li>Keyword suggestions: 3 credits per search</li>
                    <li>Outline generation: 3 credits per outline</li>
                    <li>Full AI blog generation: 10 credits per post</li>
                    <li>Featured AI image generation: 5 credits per image</li>
                  </ul>
                  <p style={{ marginTop: "6px" }}>
                    Monthly recurring credits refresh every 30 days. Lifetime credits never
                    expire and will only be consumed after monthly credits run out.
                  </p>
                </div>
              )}
            </div>
          </div>
        </BlockStack>
      ) : (
        /* Custom Assets Tab */
        <BlockStack gap="500">
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e1e3e5",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Custom Fonts &amp; Typography
              </Text>
              <Text variant="bodySm" tone="subdued">
                Paste Google Fonts URL or external @font-face CSS link to apply brand fonts across all blog posts:
              </Text>
              <div
                style={{
                  border: "1px solid #8c9196",
                  borderRadius: "8px",
                  padding: "8px 12px",
                }}
              >
                <input
                  type="text"
                  value={googleFontUrl}
                  onChange={(e) => setGoogleFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap"
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <Text variant="headingMd" as="h2">
                Custom CSS
              </Text>
              <div
                style={{
                  border: "1px solid #8c9196",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  backgroundColor: "#fafafa",
                }}
              >
                <textarea
                  rows={6}
                  value={customCss}
                  onChange={(e) => setCustomCss(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    backgroundColor: "transparent",
                    lineHeight: "1.5",
                  }}
                />
              </div>

              <Text variant="headingMd" as="h2">
                Custom JavaScript
              </Text>
              <div
                style={{
                  border: "1px solid #8c9196",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  backgroundColor: "#fafafa",
                }}
              >
                <textarea
                  rows={5}
                  value={customJs}
                  onChange={(e) => setCustomJs(e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    backgroundColor: "transparent",
                    lineHeight: "1.5",
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" onClick={handleSaveSettings}>
                  Save custom assets
                </Button>
              </div>
            </BlockStack>
          </div>
        </BlockStack>
      )}

      {/* Buy Extra Credits Modal */}
      <Modal
        open={isBuyCreditsModalOpen}
        onClose={() => setIsBuyCreditsModalOpen(false)}
        title="Buy Lifetime AI Credits"
        primaryAction={{
          content: `Purchase for $${selectedCreditPack.price}`,
          onAction: handleBuyCredits,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setIsBuyCreditsModalOpen(false),
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Text variant="bodySm" tone="subdued">
              Lifetime credits never expire and will be consumed after monthly credits:
            </Text>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { id: "pack-50", credits: 50, price: 4.99 },
                { id: "pack-200", credits: 200, price: 14.99, popular: true, save: "Save 25%" },
                { id: "pack-500", credits: 500, price: 29.99, save: "Save 40%" },
              ].map((pack) => {
                const isSelected = selectedCreditPack.id === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedCreditPack(pack)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #005bd3" : "1px solid #e1e3e5",
                      backgroundColor: isSelected ? "#f0f7ff" : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px", color: "#202223" }}>
                        {pack.credits} AI Credits
                      </div>
                      <div style={{ fontSize: "12px", color: "#6d7175" }}>
                        Lifetime validity • Never expires
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {pack.save && (
                        <span
                          style={{
                            backgroundColor: "#def7ec",
                            color: "#03543f",
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {pack.save}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, fontSize: "15px", color: "#202223" }}>
                        ${pack.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
