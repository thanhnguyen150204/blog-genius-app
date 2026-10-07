import { BlockStack, Text, Button, Select, Icon } from "@shopify/polaris";
import { QuestionCircleIcon, AlertCircleIcon } from "@shopify/polaris-icons";
import { StudioDatePicker } from "./StudioDatePicker";
import { KeywordTagCombobox } from "./KeywordTagCombobox";

export function KeywordAndScheduleSettings({
  keywords = [],
  onKeywordsChange,
  publishDate = "05 Oct 2026",
  onPublishDateChange,
  refreshReminder = "30 days",
  onRefreshReminderChange,
  onOpenKeywordSuggestions,
  error = false,
}) {
  const refreshOptions = [
    { label: "30 days", value: "30 days" },
    { label: "60 days", value: "60 days" },
    { label: "90 days (Recommended for GEO)", value: "90 days" },
    { label: "180 days", value: "180 days" },
    { label: "Never", value: "Never" },
  ];

  return (
    <BlockStack gap="400">
      {/* Keywords */}
      <BlockStack gap="100">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="bodySm" fontWeight="medium" as="label">
            Keywords <span style={{ color: "#9e2a2b" }}>*</span>
          </Text>
          <button
            type="button"
            onClick={onOpenKeywordSuggestions}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#64748b",
              fontSize: "12px",
              fontWeight: 400,
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#18181b")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            <span>Get keyword suggestions</span>
            <Icon source={QuestionCircleIcon} tone="subdued" />
          </button>
        </div>

        <KeywordTagCombobox
          tags={keywords}
          onChange={onKeywordsChange}
          hasError={Boolean(error)}
        />

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span style={{ color: "#9e2a2b", display: "flex", alignItems: "center", width: "15px", height: "15px" }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </span>
            <span style={{ color: "#9e2a2b", fontSize: "12px", fontWeight: 400 }}>
              Keyword is required!
            </span>
          </div>
        )}
      </BlockStack>

      {/* Row: Publish date & Refresh Reminder */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {/* Publish date with interactive popover calendar */}
        <BlockStack gap="100">
          <Text variant="bodySm" fontWeight="medium" as="label">
            Publish date
          </Text>
          <StudioDatePicker
            value={publishDate}
            onChange={onPublishDateChange}
          />
        </BlockStack>

        {/* Remind me to refresh after */}
        <Select
          label="Remind me to refresh after"
          options={refreshOptions}
          value={refreshReminder}
          onChange={onRefreshReminderChange}
        />
      </div>
    </BlockStack>
  );
}

export default KeywordAndScheduleSettings;
