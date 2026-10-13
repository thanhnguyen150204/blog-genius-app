import { Card, BlockStack, Text, ProgressBar, InlineStack, Badge, Button, Icon } from "@shopify/polaris";
import { ChevronRightIcon, MagicIcon } from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";

export function ContentByIntentCard({
  posts = [],
  totalPosts = 1,
  informationalCount = 1,
}) {
  const navigate = useNavigate();
  const total = posts && posts.length > 0 ? posts.length : totalPosts;
  const count =
    posts && posts.length > 0
      ? posts.filter((p) => (p.intent || "Informational") === "Informational").length
      : informationalCount;

  const avgGeoScore =
    posts && posts.length > 0
      ? Math.round(posts.reduce((sum, p) => sum + (p.geoScore || 0), 0) / posts.length)
      : 60;

  const optimizedCount =
    posts && posts.length > 0
      ? posts.filter((p) => (p.geoScore || 0) >= 80).length
      : 0;

  return (
    <div className="dashboard-card-stretch">
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
            <BlockStack gap="050">
              <Text variant="headingMd" as="h2">
                Content by intent
              </Text>
              <Text variant="bodySm" tone="subdued">
                Strategic distribution & optimization of {total} informational blog {total === 1 ? "post" : "posts"}
              </Text>
            </BlockStack>
            <InlineStack gap="150" blockAlign="center">
              <Badge tone="info">100% Informational</Badge>
              <Badge tone={avgGeoScore >= 80 ? "success" : "attention"}>
                {avgGeoScore >= 80 ? "High Quality" : "Needs Optimization"}
              </Badge>
            </InlineStack>
          </div>

          <BlockStack gap="150">
            <ProgressBar progress={100} size="small" tone="highlight" />
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack gap="150" blockAlign="center">
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb",
                    display: "inline-block",
                  }}
                />
                <Text variant="bodySm" fontWeight="medium">
                  Informational Blog Posts • {count}
                </Text>
              </InlineStack>
              <Text variant="bodySm" tone="subdued">
                100% of store content
              </Text>
            </InlineStack>
          </BlockStack>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Text variant="bodyXs" tone="subdued" fontWeight="semibold">
                SEARCH OBJECTIVE
              </Text>
              <Text variant="bodySm" fontWeight="bold">
                Authority & Guides
              </Text>
              <Text variant="bodyXs" tone="subdued">
                Targeting buyer search queries
              </Text>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Text variant="bodyXs" tone="subdued" fontWeight="semibold">
                AVG GEO SCORE
              </Text>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Text variant="bodySm" fontWeight="bold">
                  {avgGeoScore} / 100
                </Text>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: avgGeoScore >= 80 ? "#16a34a" : "#f59e0b",
                  }}
                />
              </div>
              <Text variant="bodyXs" tone="subdued">
                {optimizedCount}/{total} post citation-ready
              </Text>
            </div>

            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <Text variant="bodyXs" tone="subdued" fontWeight="semibold">
                AI CITATION READINESS
              </Text>
              <Text variant="bodySm" fontWeight="bold">
                High Potential
              </Text>
              <Text variant="bodyXs" tone="subdued">
                Optimized for ChatGPT & Claude
              </Text>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <InlineStack gap="200" blockAlign="center" wrap={false}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  backgroundColor: "#dcfce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#16a34a",
                  flexShrink: 0,
                }}
              >
                <Icon source={MagicIcon} />
              </div>
              <BlockStack gap="050">
                <Text variant="bodySm" fontWeight="semibold">
                  GEO Strategy Tip
                </Text>
                <Text variant="bodyXs" tone="subdued">
                  Informational posts rank higher in AI responses when they include concise summary answers and FAQ schemas.
                </Text>
              </BlockStack>
            </InlineStack>

            <div style={{ flexShrink: 0 }}>
              <Button
                size="slim"
                variant="plain"
                icon={ChevronRightIcon}
                onClick={() => navigate("/studio")}
              >
                Studio
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ContentByIntentCard;

