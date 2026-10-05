import { useState } from "react";
import {
  Modal,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Card,
  Button,
  Divider,
  Banner,
} from "@shopify/polaris";

export function ArticleDetailsModal({
  open,
  post,
  onClose,
  onUpdatePost,
}) {
  const [fixedFaq, setFixedFaq] = useState(false);
  const [fixedAnswerBlock, setFixedAnswerBlock] = useState(false);

  if (!post) return null;

  const handleInjectAnswerBlock = () => {
    setFixedAnswerBlock(true);
    const updated = {
      ...post,
      hasAnswerBlock: true,
      geoScore: Math.min(100, (post.geoScore || 50) + 20),
    };
    onUpdatePost(updated);
  };

  const handleInjectFaqSchema = () => {
    setFixedFaq(true);
    const updated = {
      ...post,
      hasFaqSchema: true,
      geoScore: Math.min(100, (post.geoScore || 50) + 15),
    };
    onUpdatePost(updated);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={post.title}
      size="large"
      secondaryActions={[
        {
          content: "Close",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="400">
          {/* Metadata Row */}
          <InlineStack gap="300" align="space-between" blockAlign="center">
            <InlineStack gap="200" align="center">
              <Badge tone="info">{post.intent || "Informational"}</Badge>
              <Badge tone={post.status === "Published" ? "success" : "attention"}>
                {post.status}
              </Badge>
              <Text variant="bodySm" tone="subdued">
                Author: {post.author}
              </Text>
              <Text variant="bodySm" tone="subdued">
                • {post.lastModified}
              </Text>
            </InlineStack>

            <InlineStack gap="300" align="center">
              <InlineStack gap="100" align="center">
                <Text variant="bodySm" fontWeight="semibold">SEO Score:</Text>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: post.seoScore ? "#16a34a" : "#475569",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {post.seoScore || "—"}
                </div>
              </InlineStack>

              <InlineStack gap="100" align="center">
                <Text variant="bodySm" fontWeight="semibold">GEO Score:</Text>
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: post.geoScore >= 80 ? "#16a34a" : "#ea580c",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {post.geoScore}
                </div>
              </InlineStack>
            </InlineStack>
          </InlineStack>

          <Divider />

          {/* AI GEO Optimization Checklist */}
          <Card>
            <BlockStack gap="300">
              <Text variant="headingSm" as="h3">
                GEO &amp; AI Search Readiness Audit
              </Text>
              <Text variant="bodySm" tone="subdued">
                Optimized for RAG extraction by Google AI Overviews, Perplexity &amp; ChatGPT Search.
              </Text>

              <BlockStack gap="200">
                {/* Answer block check */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    backgroundColor: "var(--p-color-bg-surface-secondary, #f8fafc)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <Text variant="bodySm" fontWeight="medium">
                      Direct Answer Block (40-80 words summary)
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      {post.hasAnswerBlock || fixedAnswerBlock
                        ? "Present at top of the article."
                        : "Missing direct summary answer block."}
                    </Text>
                  </div>
                  {post.hasAnswerBlock || fixedAnswerBlock ? (
                    <Badge tone="success">Passed (+8 pts)</Badge>
                  ) : (
                    <Button size="slim" onClick={handleInjectAnswerBlock}>
                      Auto-Fix with AI
                    </Button>
                  )}
                </div>

                {/* FAQ Schema check */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    backgroundColor: "var(--p-color-bg-surface-secondary, #f8fafc)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <Text variant="bodySm" fontWeight="medium">
                      JSON-LD FAQ Schema
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      {post.hasFaqSchema || fixedFaq
                        ? "Structured FAQ schema injected."
                        : "Missing FAQ Schema for AI question answering."}
                    </Text>
                  </div>
                  {post.hasFaqSchema || fixedFaq ? (
                    <Badge tone="success">Passed (+15 pts)</Badge>
                  ) : (
                    <Button size="slim" onClick={handleInjectFaqSchema}>
                      Auto-Fix with AI
                    </Button>
                  )}
                </div>

                {/* AI Crawlers check */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    backgroundColor: "var(--p-color-bg-surface-secondary, #f8fafc)",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <Text variant="bodySm" fontWeight="medium">
                      AI Search Crawler Access (robots.txt)
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      GPTBot, PerplexityBot, and ClaudeBot allowed.
                    </Text>
                  </div>
                  <Badge tone="success">Passed (+30 pts)</Badge>
                </div>
              </BlockStack>
            </BlockStack>
          </Card>

          {/* Outline Structure */}
          <Card>
            <BlockStack gap="200">
              <Text variant="headingSm" as="h3">
                Article Outline Structure
              </Text>
              {(post.outline || [
                { id: "1", level: "h1", title: post.title, description: "Main Topic" },
                { id: "2", level: "h2", title: "Overview & Definitions", description: "Context" },
              ]).map((item, index) => (
                <div
                  key={item.id || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    backgroundColor: "var(--p-color-bg-surface, #ffffff)",
                    border: "1px solid var(--p-color-border-subdued, #f1f2f4)",
                    borderRadius: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6366f1",
                      backgroundColor: "#eef2ff",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {item.level.toUpperCase()}
                  </span>
                  <Text variant="bodySm" fontWeight="medium">
                    {item.title}
                  </Text>
                </div>
              ))}
            </BlockStack>
          </Card>

          <Banner tone="info">
            <p>
              Changes made in Content Studio synchronize with Shopify Online Store blogs.
            </p>
          </Banner>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default ArticleDetailsModal;
