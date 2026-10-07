import { useState } from "react";
import {
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  Checkbox,
  Banner,
  Divider,
  Icon,
} from "@shopify/polaris";
import {
  RefreshIcon,
  LanguageIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "@shopify/polaris-icons";

export function ScratchSidebarExport({ postData, onChange }) {
  const socialConfig = postData.socialShare || {
    appEmbedEnabled: false,
    showShareButtons: false,
    platforms: ["facebook", "twitter", "pinterest", "linkedin", "copylink"],
    style: "rounded",
    position: "bottom",
  };

  const [appEmbedEnabled, setAppEmbedEnabled] = useState(
    Boolean(socialConfig.appEmbedEnabled)
  );
  const [isChecking, setIsChecking] = useState(false);
  const [showEnableSuccess, setShowEnableSuccess] = useState(false);

  const handleUpdateConfig = (patch) => {
    const updated = {
      ...socialConfig,
      ...patch,
      appEmbedEnabled: patch.appEmbedEnabled !== undefined ? patch.appEmbedEnabled : appEmbedEnabled,
    };
    if (onChange) {
      onChange({ socialShare: updated });
    }
  };

  const handleEnableAppEmbed = () => {
    setAppEmbedEnabled(true);
    setShowEnableSuccess(true);
    handleUpdateConfig({ appEmbedEnabled: true, showShareButtons: true });
    setTimeout(() => {
      setShowEnableSuccess(false);
    }, 4000);
  };

  const handleCheckAppEmbed = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
    }, 500);
  };

  const handleTogglePlatform = (platformId) => {
    const currentPlatforms = socialConfig.platforms || [];
    let updated;
    if (currentPlatforms.includes(platformId)) {
      updated = currentPlatforms.filter((p) => p !== platformId);
    } else {
      updated = [...currentPlatforms, platformId];
    }
    handleUpdateConfig({ platforms: updated });
  };

  const languageOptions = [
    { label: "English (Primary)", value: "en" },
    { label: "Vietnamese (Tiếng Việt)", value: "vi" },
    { label: "French (Français)", value: "fr" },
    { label: "German (Deutsch)", value: "de" },
    { label: "Spanish (Español)", value: "es" },
  ];

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
            onChange={(val) => onChange && onChange({ language: val })}
          />
        </div>

        <Button
          icon={LanguageIcon}
          variant="tertiary"
          accessibilityLabel="Translate language"
        />
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Title */}
        <Text variant="headingSm" as="h3" fontWeight="bold">
          Social Share
        </Text>

        {showEnableSuccess && (
          <Banner
            title="App embed enabled successfully"
            tone="success"
            onDismiss={() => setShowEnableSuccess(false)}
          >
            <p>Social share buttons app embed has been activated for your store theme.</p>
          </Banner>
        )}

        {/* Warning / Status Card */}
        {!appEmbedEnabled ? (
          <div
            style={{
              border: "1px solid #e4e4e7",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
            }}
          >
            {/* Amber/Yellow Top Section */}
            <div
              style={{
                backgroundColor: "#f59e0b",
                padding: "14px 16px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                color: "#18181b",
              }}
            >
              <div style={{ marginTop: "1px", flexShrink: 0 }}>
                <Icon source={AlertTriangleIcon} tone="base" />
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  lineHeight: "1.4",
                  color: "#18181b",
                }}
              >
                Please enable "Social share buttons app embed" first.
              </div>
            </div>

            {/* Card Action Area */}
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Button onClick={handleEnableAppEmbed}>Enable</Button>
              <Button
                icon={RefreshIcon}
                onClick={handleCheckAppEmbed}
                loading={isChecking}
                accessibilityLabel="Check app embed status"
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              border: "1px solid #bbf7d0",
              backgroundColor: "#f0fdf4",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <InlineStack gap="200" blockAlign="center">
              <Icon source={CheckCircleIcon} tone="success" />
              <div>
                <Text variant="bodySm" fontWeight="bold">
                  App embed is active
                </Text>
                <Text variant="bodyXs" tone="subdued">
                  Buttons will appear on your storefront
                </Text>
              </div>
            </InlineStack>
            <Button
              size="slim"
              variant="plain"
              onClick={() => {
                setAppEmbedEnabled(false);
                handleUpdateConfig({ appEmbedEnabled: false });
              }}
            >
              Disable
            </Button>
          </div>
        )}

        {/* Checkbox: Show Social Media Sharing Buttons */}
        <div
          style={{
            opacity: appEmbedEnabled ? 1 : 0.6,
            cursor: appEmbedEnabled ? "default" : "not-allowed",
          }}
        >
          <Checkbox
            label="Show Social Media Sharing Buttons"
            checked={Boolean(socialConfig.showShareButtons && appEmbedEnabled)}
            disabled={!appEmbedEnabled}
            onChange={(checked) => handleUpdateConfig({ showShareButtons: checked })}
          />
        </div>

        {/* Detailed Sharing Settings when enabled */}
        {appEmbedEnabled && socialConfig.showShareButtons && (
          <BlockStack gap="300">
            <Divider />

            <Text variant="headingXs" as="h4" fontWeight="semibold">
              Supported Platforms
            </Text>

            <BlockStack gap="150">
              {[
                { id: "facebook", label: "Facebook", color: "#1877f2" },
                { id: "twitter", label: "X (Twitter)", color: "#000000" },
                { id: "pinterest", label: "Pinterest", color: "#e60023" },
                { id: "linkedin", label: "LinkedIn", color: "#0a66c2" },
                { id: "copylink", label: "Copy Post Link", color: "#64748b" },
              ].map((plat) => {
                const isSelected = (socialConfig.platforms || []).includes(plat.id);
                return (
                  <div
                    key={plat.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <Checkbox
                      label={plat.label}
                      checked={isSelected}
                      onChange={() => handleTogglePlatform(plat.id)}
                    />
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: plat.color,
                      }}
                    />
                  </div>
                );
              })}
            </BlockStack>

            <Divider />

            <Select
              label="Button Layout & Style"
              options={[
                { label: "Rounded Pills with Icons & Labels", value: "rounded" },
                { label: "Compact Circle Icon Badges", value: "circle" },
                { label: "Minimalist Outline Style", value: "outline" },
              ]}
              value={socialConfig.style || "rounded"}
              onChange={(val) => handleUpdateConfig({ style: val })}
            />

            <Select
              label="Position on Page"
              options={[
                { label: "Bottom of Article", value: "bottom" },
                { label: "Top of Article (under title)", value: "top" },
                { label: "Both Top & Bottom", value: "both" },
              ]}
              value={socialConfig.position || "bottom"}
              onChange={(val) => handleUpdateConfig({ position: val })}
            />
          </BlockStack>
        )}
      </div>
    </div>
  );
}

export default ScratchSidebarExport;
