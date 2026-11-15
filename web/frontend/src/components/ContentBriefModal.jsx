import React, { useState } from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Card,
  Box,
  Divider,
  Banner,
  Button,
  List,
} from "@shopify/polaris";
import { ClipboardIcon, ExternalIcon, CheckIcon } from "@shopify/polaris-icons";

export function ContentBriefModal({ open, onClose, brief, onUseInStudio, loading = false }) {
  const [copied, setCopied] = useState(false);

  if (!brief) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(brief, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIntentTone = (intent) => {
    switch (intent?.toLowerCase()) {
      case "transactional":
        return "success";
      case "commercial":
        return "magic";
      case "informational":
        return "info";
      case "navigational":
        return "warning";
      default:
        return "subdued";
    }
  };

  const getFunnelTone = (funnel) => {
    switch (funnel?.toUpperCase()) {
      case "BOFU":
        return "critical";
      case "MOFU":
        return "attention";
      case "TOFU":
        return "info";
      default:
        return "subdued";
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <InlineStack gap="200" blockAlign="center">
          <Text variant="headingMd" as="h2">
            SEO & GEO Content Brief
          </Text>
          {brief.source === "qlora" && (
            <Badge tone="magic">Fine-tuned QLoRA</Badge>
          )}
        </InlineStack>
      }
      primaryAction={{
        content: "Use in Content Studio",
        icon: ExternalIcon,
        loading: loading,
        onAction: () => onUseInStudio && onUseInStudio(brief),
      }}
      secondaryActions={[
        {
          content: copied ? "Copied JSON!" : "Copy JSON",
          icon: copied ? CheckIcon : ClipboardIcon,
          onAction: handleCopyJson,
        },
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
      size="large"
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Header Overview Card */}
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center" wrap={false}>
                <BlockStack gap="100">
                  <Text variant="bodySm" tone="subdued">
                    PRIMARY TARGET KEYWORD
                  </Text>
                  <Text variant="headingLg" as="h3" fontWeight="bold">
                    {brief.primary_keyword}
                  </Text>
                </BlockStack>
                <InlineStack gap="200">
                  <Badge tone={getIntentTone(brief.dominant_intent)}>
                    {brief.dominant_intent || "Informational"} Intent
                  </Badge>
                  <Badge tone={getFunnelTone(brief.funnel_stage)}>
                    {brief.funnel_stage || "TOFU"}
                  </Badge>
                </InlineStack>
              </InlineStack>

              {brief.secondary_keywords?.length > 0 && (
                <BlockStack gap="150">
                  <Text variant="bodySm" fontWeight="semibold" tone="subdued">
                    Secondary Keywords:
                  </Text>
                  <InlineStack gap="150" wrap>
                    {brief.secondary_keywords.map((sec, idx) => (
                      <Badge key={idx} tone="info">
                        {sec}
                      </Badge>
                    ))}
                  </InlineStack>
                </BlockStack>
              )}
            </BlockStack>
          </Card>

          {/* Strategy & Audience Grid */}
          <Card>
            <BlockStack gap="300">
              <Text variant="headingSm" as="h4">
                Strategic Parameters
              </Text>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                <Box padding="200" background="bg-surface-secondary" borderRadius="200">
                  <Text variant="bodyXs" tone="subdued">RECOMMENDED CONTENT TYPE</Text>
                  <Text variant="bodyMd" fontWeight="semibold">{brief.recommended_content_type || "Comprehensive Guide"}</Text>
                </Box>
                <Box padding="200" background="bg-surface-secondary" borderRadius="200">
                  <Text variant="bodyXs" tone="subdued">WRITING TONE & STYLE</Text>
                  <Text variant="bodyMd" fontWeight="semibold">
                    {brief.recommended_tone || "Authoritative"} ({brief.recommended_style || "Educational"})
                  </Text>
                </Box>
                <Box padding="200" background="bg-surface-secondary" borderRadius="200">
                  <Text variant="bodyXs" tone="subdued">TARGET WORD COUNT</Text>
                  <Text variant="bodyMd" fontWeight="semibold">{brief.target_word_count || 1800} words</Text>
                </Box>
              </div>

              {brief.target_audience && (
                <BlockStack gap="100">
                  <Text variant="bodySm" fontWeight="semibold" tone="subdued">Target Audience Persona:</Text>
                  <Text variant="bodyMd">{brief.target_audience}</Text>
                </BlockStack>
              )}
            </BlockStack>
          </Card>

          {/* Key Talking Points (E-E-A-T) */}
          {brief.key_talking_points?.length > 0 && (
            <Card>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingSm" as="h4">
                    Key Talking Points (E-E-A-T Backed)
                  </Text>
                  <Badge tone="magic">Citations & Data</Badge>
                </InlineStack>
                <List type="bullet">
                  {brief.key_talking_points.map((point, idx) => (
                    <List.Item key={idx}>
                      <Text variant="bodyMd">{point}</Text>
                    </List.Item>
                  ))}
                </List>
              </BlockStack>
            </Card>
          )}

          {/* GEO Blueprint Card */}
          {brief.geo_blueprint && (
            <Card>
              <BlockStack gap="300">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="150" blockAlign="center">
                    <span style={{ fontSize: "18px" }}>🤖</span>
                    <Text variant="headingSm" as="h4">
                      GEO Blueprint (Generative Engine Optimization)
                    </Text>
                  </InlineStack>
                  <Badge tone="magic">AI Overviews Ready</Badge>
                </InlineStack>

                <Banner tone="info">
                  <BlockStack gap="150">
                    <Text variant="bodySm" fontWeight="bold">
                      Answer Block Focus (Recommended for Direct Snippet Extraction):
                    </Text>
                    <Text variant="bodySm">
                      {brief.geo_blueprint.answer_block_focus}
                    </Text>
                  </BlockStack>
                </Banner>

                {brief.geo_blueprint.comparison_table_idea && (
                  <Box padding="300" background="bg-surface-secondary" borderRadius="200">
                    <BlockStack gap="100">
                      <Text variant="bodySm" fontWeight="semibold" tone="subdued">
                        Structured Comparison Table Idea:
                      </Text>
                      <Text variant="bodyMd">
                        {brief.geo_blueprint.comparison_table_idea}
                      </Text>
                    </BlockStack>
                  </Box>
                )}

                {brief.geo_blueprint.faq_questions?.length > 0 && (
                  <BlockStack gap="150">
                    <Text variant="bodySm" fontWeight="semibold" tone="subdued">
                      FAQ Questions for Schema Markup:
                    </Text>
                    <List type="number">
                      {brief.geo_blueprint.faq_questions.map((faq, idx) => (
                        <List.Item key={idx}>
                          <Text variant="bodyMd">{faq}</Text>
                        </List.Item>
                      ))}
                    </List>
                  </BlockStack>
                )}
              </BlockStack>
            </Card>
          )}

          {/* Suggested Call-to-Action */}
          {brief.suggested_cta && (
            <Card>
              <BlockStack gap="150">
                <Text variant="bodySm" fontWeight="semibold" tone="subdued">
                  RECOMMENDED CALL TO ACTION (CTA)
                </Text>
                <Box padding="200" background="bg-surface-brand-subdued" borderRadius="150">
                  <Text variant="bodyMd" fontWeight="semibold" tone="brand">
                    "{brief.suggested_cta}"
                  </Text>
                </Box>
              </BlockStack>
            </Card>
          )}
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
export default ContentBriefModal;
