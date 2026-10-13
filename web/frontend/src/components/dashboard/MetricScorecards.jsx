import { Grid, Card, BlockStack, Text, Badge, Icon } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ArrowDiagonalIcon } from "@shopify/polaris-icons";

export function MetricScorecards({
  geoHealthScore = 60,
  publishedCount = 1,
  totalPosts = 1,
  scheduledCount = 0,
  postsNeedingRefresh = 0,
  onOpenAiCitations,
  onOpenFreshness,
}) {
  const navigate = useNavigate();
  const shopify = useAppBridge();

  const handleKeyDown = (callback) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <Grid>
      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <div
          role="button"
          tabIndex={0}
          className="polaris-metric-card"
          onClick={onOpenAiCitations}
          onKeyDown={handleKeyDown(onOpenAiCitations)}
        >
          <Card>
            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">
                AI citations (30 days)
              </Text>
              <Text variant="heading2xl" as="p">
                0
              </Text>
              <div style={{ minHeight: "24px", display: "flex", alignItems: "center" }}>
                <Text variant="bodyXs" tone="subdued">
                  Click to view AI breakdown
                </Text>
                <Icon source={ArrowDiagonalIcon} tone="subdued"/>
              </div>
            </BlockStack>
          </Card>
        </div>
      </Grid.Cell>

      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <div
          role="button"
          tabIndex={0}
          className="polaris-metric-card"
          onClick={() => navigate("/studio")}
          onKeyDown={handleKeyDown(() => navigate("/studio"))}
        >
          <Card>
            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">
                Published posts
              </Text>
              <Text variant="heading2xl" as="p">
                {publishedCount} / {totalPosts}
              </Text>
              <div style={{ minHeight: "24px", display: "flex", alignItems: "center" }}>
                <Text variant="bodyXs" tone="subdued">
                  {scheduledCount} posts scheduled
                </Text>
              </div>
            </BlockStack>
          </Card>
        </div>
      </Grid.Cell>

      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <div
          role="button"
          tabIndex={0}
          className="polaris-metric-card"
          onClick={() => {
            shopify.toast?.show("GEO Health Score reflects citation readiness by DeepSeek & Qwen.");
          }}
          onKeyDown={handleKeyDown(() => {
            shopify.toast?.show("GEO Health Score reflects citation readiness by DeepSeek & Qwen.");
          })}
        >
          <Card>
            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">
                GEO health score
              </Text>
              <Text
                variant="heading2xl"
                as="p"
                tone={geoHealthScore >= 80 ? "success" : "caution"}
              >
                {geoHealthScore}%
              </Text>
              <div style={{ minHeight: "24px", display: "flex", alignItems: "center" }}>
                <Badge tone={geoHealthScore >= 80 ? "success" : "warning"}>
                  {geoHealthScore >= 80 ? "Optimal health" : "Needs attention"}
                </Badge>
              </div>
            </BlockStack>
          </Card>
        </div>
      </Grid.Cell>

      <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <div
          role="button"
          tabIndex={0}
          className="polaris-metric-card"
          onClick={onOpenFreshness}
          onKeyDown={handleKeyDown(onOpenFreshness)}
        >
          <Card>
            <BlockStack gap="150">
              <Text variant="bodySm" tone="subdued">
                Posts needing refresh
              </Text>
              <Text variant="heading2xl" as="p">
                {postsNeedingRefresh}
              </Text>
              <div style={{ minHeight: "24px", display: "flex", alignItems: "center" }}>
                <Text variant="bodyXs" tone="subdued">
                  All posts up to date
                </Text>
                <Icon source={ArrowDiagonalIcon} tone="subdued" />
              </div>
            </BlockStack>
          </Card>
        </div>
      </Grid.Cell>
    </Grid>
  );
}

export default MetricScorecards;
