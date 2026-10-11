import { useState } from "react";
import {
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Icon,
  TextField,
  Collapsible,
  Box,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";

export default function KnowledgeBaseSection({
  knowledgeBase,
  setKnowledgeBase,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Layout.AnnotatedSection
      id="knowledge-base"
      title="Knowledge Base"
      description="AI-generated store context used for blog content creation"
    >
      <Card>
        <BlockStack gap="300">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsOpen(!isOpen);
              }
            }}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <InlineStack align="space-between" blockAlign="start">
              <BlockStack gap="050">
                <Text variant="bodyMd" fontWeight="semibold">
                  Store knowledge base content
                </Text>
                <Text variant="bodySm" tone="subdued">
                  This content helps AI understand your store when generating blog posts
                </Text>
              </BlockStack>
              <Icon
                source={isOpen ? ChevronUpIcon : ChevronDownIcon}
                tone="subdued"
              />
            </InlineStack>
          </div>

          <Collapsible
            id="knowledge-base-collapsible"
            open={isOpen}
            transition={{ duration: "200ms", timingFunction: "ease-in-out" }}
          >
            <Box paddingBlockStart="200">
              <TextField
                label="Store knowledge base content"
                labelHidden
                value={knowledgeBase}
                onChange={setKnowledgeBase}
                multiline={8}
                autoComplete="off"
                placeholder="Enter or paste store knowledge base context here..."
              />
            </Box>
          </Collapsible>
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
