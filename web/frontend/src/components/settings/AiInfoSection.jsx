import {
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Button,
  Select,
  TextField,
} from "@shopify/polaris";
import { MagicIcon } from "@shopify/polaris-icons";
import { LANGUAGE_OPTIONS, TARGET_MARKET_OPTIONS } from "./SettingsHelpers";

export default function AiInfoSection({
  businessDesc,
  setBusinessDesc,
  businessDescLang,
  setBusinessDescLang,
  targetCustomer,
  setTargetCustomer,
  targetCustomerLang,
  setTargetCustomerLang,
  brandVoice,
  setBrandVoice,
  targetMarket,
  setTargetMarket,
  onAutoSuggestAI,
}) {
  return (
    <Layout.AnnotatedSection
      id="ai-info"
      title="Useful information for AI"
      description="This information provides AI with business context to generate more tailored and relevant content for your blog posts."
    >
      <Card>
        <BlockStack gap="400">
          {/* Business description */}
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" fontWeight="semibold">
                Business description
              </Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ width: "135px" }}>
                  <Select
                    label="Language"
                    labelHidden
                    options={LANGUAGE_OPTIONS}
                    value={businessDescLang}
                    onChange={setBusinessDescLang}
                  />
                </div>
                <Button
                  variant="plain"
                  icon={MagicIcon}
                  onClick={() => onAutoSuggestAI("businessDesc")}
                  accessibilityLabel="Generate description with AI"
                />
              </InlineStack>
            </InlineStack>
            <TextField
              label="Business description"
              labelHidden
              multiline={3}
              value={businessDesc}
              onChange={(val) => setBusinessDesc(val.slice(0, 500))}
              placeholder="Enter your business description"
              autoComplete="off"
              maxLength={500}
              showCharacterCount
            />
          </BlockStack>

          {/* Target customer */}
          <BlockStack gap="200">
            <InlineStack align="space-between" blockAlign="center">
              <Text variant="bodyMd" fontWeight="semibold">
                Target customer
              </Text>
              <InlineStack gap="200" blockAlign="center">
                <div style={{ width: "135px" }}>
                  <Select
                    label="Language"
                    labelHidden
                    options={LANGUAGE_OPTIONS}
                    value={targetCustomerLang}
                    onChange={setTargetCustomerLang}
                  />
                </div>
                <Button
                  variant="plain"
                  icon={MagicIcon}
                  onClick={() => onAutoSuggestAI("targetCustomer")}
                  accessibilityLabel="Generate target customer with AI"
                />
              </InlineStack>
            </InlineStack>
            <TextField
              label="Target customer"
              labelHidden
              multiline={3}
              value={targetCustomer}
              onChange={(val) => setTargetCustomer(val.slice(0, 500))}
              placeholder="Enter your target customer description"
              autoComplete="off"
              maxLength={500}
              showCharacterCount
            />
          </BlockStack>

          {/* Brand voice */}
          <BlockStack gap="200">
            <Text variant="bodyMd" fontWeight="semibold">
              Brand voice
            </Text>
            <TextField
              label="Brand voice"
              labelHidden
              multiline={3}
              value={brandVoice}
              onChange={(val) => setBrandVoice(val.slice(0, 500))}
              placeholder="Enter your brand voice"
              autoComplete="off"
              maxLength={500}
              showCharacterCount
            />
          </BlockStack>

          {/* Target market */}
          <Select
            label="Target market"
            options={TARGET_MARKET_OPTIONS}
            value={targetMarket}
            onChange={setTargetMarket}
          />
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
