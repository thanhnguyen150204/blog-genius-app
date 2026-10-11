import {
  Layout,
  Card,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Box,
  DataTable,
  Text,
} from "@shopify/polaris";

function parseLogItem(log) {
  if (!log) return { date: "-", activity: "-", feature: "Blog Builder", credits: "0" };
  if (typeof log === "object") {
    return {
      date: log.date || log.timestamp || "-",
      activity: log.activity || log.action || log.title || "-",
      feature: log.feature || log.module || "Blog Builder",
      credits: log.credits !== undefined ? `${log.credits}` : "0",
    };
  }

  const match = log.match(/^([\d-]+\s+[\d:]+):\s*(.*?)\s*-\s*(.*?):\s*([+-]?\d+)\s*credits?/i);
  if (match) {
    return {
      date: match[1].trim(),
      activity: match[2].trim(),
      feature: match[3].trim(),
      credits: match[4].trim(),
    };
  }

  const colonParts = log.split(":");
  if (colonParts.length >= 4) {
    const date = `${colonParts[0]}:${colonParts[1]}:${colonParts[2].slice(0, 2)}`.trim();
    const remaining = log.slice(date.length + 1).trim();
    const dashParts = remaining.split("-");
    const creditsMatch = remaining.match(/([+-]?\d+)\s*credits?/i);
    return {
      date,
      activity: dashParts[0]?.trim() || remaining,
      feature: dashParts[1]?.split(":")[0]?.trim() || "Blog Builder",
      credits: creditsMatch ? creditsMatch[1] : "-",
    };
  }

  return {
    date: "-",
    activity: log,
    feature: "Blog Builder",
    credits: "-",
  };
}

export default function CreditHistorySection({
  monthlyCredits,
  lifetimeCredits,
  logs,
  onOpenBuyCreditsModal,
}) {
  const rows = (logs || []).map((log, idx) => {
    const item = parseLogItem(log);
    const creditsNum = parseInt(item.credits, 10);
    const isDeduction = !isNaN(creditsNum) && creditsNum <= 0;

    return [
      <Text key={`dt-${idx}`} variant="bodySm" tone="subdued" as="span">
        {item.date}
      </Text>,
      <Text key={`act-${idx}`} variant="bodySm" fontWeight="medium" as="span">
        {item.activity}
      </Text>,
      <Badge key={`feat-${idx}`} tone="info" size="small">
        {item.feature}
      </Badge>,
      <Badge
        key={`cred-${idx}`}
        tone={isDeduction ? "critical" : "success"}
        size="small"
      >
        {item.credits.includes("credit") ? item.credits : `${item.credits} credits`}
      </Badge>,
    ];
  });

  return (
    <Layout.AnnotatedSection
      id="credit-history"
      title="Credit history"
      description="Track your monthly and lifetime AI credit balances and usage activity."
    >
      <Card>
        <BlockStack gap="400">
          <InlineStack align="space-between" blockAlign="center" wrap gap="200">
            <InlineStack gap="200" blockAlign="center">
              <Badge tone="info">{monthlyCredits} monthly credits</Badge>
              <Badge tone="success">{lifetimeCredits} lifetime credits</Badge>
            </InlineStack>
            <Button
              variant="primary"
              onClick={onOpenBuyCreditsModal}
            >
              Buy more
            </Button>
          </InlineStack>

          <Box
            borderRadius="200"
            borderWidth="025"
            borderColor="border"
            overflow="hidden"
            background="bg-surface"
          >
            {rows.length === 0 ? (
              <Box padding="600">
                <Text tone="subdued" alignment="center">
                  No credit activity recorded yet.
                </Text>
              </Box>
            ) : (
              <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                <DataTable
                  columnContentTypes={["text", "text", "text", "text"]}
                  headings={["Date & Time", "Activity", "Feature", "Credits"]}
                  rows={rows}
                  hoverable
                />
              </div>
            )}
          </Box>
        </BlockStack>
      </Card>
    </Layout.AnnotatedSection>
  );
}
