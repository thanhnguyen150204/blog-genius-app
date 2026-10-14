import { useState, useEffect } from "react";
import {
  Card,
  IndexTable,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Button,
  Icon,
  Box,
  Select,
  Pagination,
  EmptySearchResult,
} from "@shopify/polaris";
import {
  MagicIcon,
  ViewIcon,
  StarFilledIcon,
  StarIcon,
  ProductIcon,
} from "@shopify/polaris-icons";

export function ContentIdeasTable({
  items,
  onDraftInStudio,
  onInspectIdea,
  onToggleBookmark,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const headings = [
    { title: "Opportunity & Search Query" },
    { title: "Buyer Intent" },
    { title: "Volume & Growth", alignment: "end" },
    { title: "GEO AI Score", alignment: "center" },
    { title: "Store Catalog Match" },
    { title: "Action", alignment: "end" },
  ];

  // Reset to page 1 whenever items length changes or filter is applied
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalItems = items ? items.length : 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentItems = items ? items.slice(startIndex, endIndex) : [];

  const getIntentBadgeTone = (intent) => {
    switch (intent) {
      case "Transactional":
        return "success";
      case "Commercial":
        return "attention";
      default:
        return "info";
    }
  };

  const getDifficultyTone = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "attention";
      default:
        return "critical";
    }
  };

  if (!items || items.length === 0) {
    return (
      <Card>
        <EmptySearchResult
          title="No content ideas match your filter"
          description="Try clearing some filter options or searching for different product keywords."
        />
      </Card>
    );
  }

  return (
    <Card padding="0">
      <IndexTable
        resourceName={{ singular: "content idea", plural: "content ideas" }}
        itemCount={currentItems.length}
        headings={headings}
        selectable={false}
      >
        {currentItems.map((item, index) => (
          <IndexTable.Row id={item.id} key={item.id} position={index}>
            {/* 1. Opportunity & Query */}
            <IndexTable.Cell>
              <Box maxWidth="320px" minWidth="240px">
                <BlockStack gap="100">
                  <Text variant="bodyMd" fontWeight="semibold" truncate>
                    {item.title}
                  </Text>
                  <InlineStack gap="150" blockAlign="center" wrap={false}>
                    <Text variant="bodyXs" tone="subdued" truncate>
                      {item.query}
                    </Text>
                    <Text variant="bodyXs" tone="subdued">
                      •
                    </Text>
                    <Badge tone="info" size="small">
                      {item.category}
                    </Badge>
                    <Badge tone="magic" size="small">
                      {item.aiEngine}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              </Box>
            </IndexTable.Cell>

            {/* 2. Buyer Intent & Funnel */}
            <IndexTable.Cell>
              <BlockStack gap="050">
                <InlineStack gap="100" blockAlign="center">
                  <Badge tone={getIntentBadgeTone(item.buyerIntent)} size="small">
                    {item.buyerIntent}
                  </Badge>
                  <Badge size="small">{item.funnelStage}</Badge>
                </InlineStack>
                <InlineStack gap="100" blockAlign="center">
                  <Text variant="bodyXs" tone="subdued">
                    Difficulty:
                  </Text>
                  <Badge tone={getDifficultyTone(item.difficulty)} size="small">
                    {item.difficulty}
                  </Badge>
                </InlineStack>
              </BlockStack>
            </IndexTable.Cell>

            {/* 3. Volume & Growth */}
            <IndexTable.Cell>
              <Box textAlign="right">
                <BlockStack gap="050" inlineAlign="end">
                  <Text variant="bodySm" fontWeight="bold">
                    {item.volume}
                  </Text>
                  <Badge tone={item.isBreakout ? "success" : "info"} size="small">
                    {item.growth}
                  </Badge>
                </BlockStack>
              </Box>
            </IndexTable.Cell>

            {/* 4. GEO AI Score */}
            <IndexTable.Cell>
              <Box textAlign="center">
                <BlockStack gap="050" inlineAlign="center">
                  <Text variant="bodySm" fontWeight="bold">
                    {item.geoScore}%
                  </Text>
                  <Badge tone="magic" size="small">
                    Citation Odds
                  </Badge>
                </BlockStack>
              </Box>
            </IndexTable.Cell>

            {/* 5. Matched Product in Store */}
            <IndexTable.Cell>
              <Box maxWidth="220px">
                <InlineStack gap="150" blockAlign="start" wrap={false}>
                  <Box color="text-subdued">
                    <Icon source={ProductIcon} />
                  </Box>
                  <BlockStack gap="050">
                    <Text variant="bodyXs" fontWeight="medium" truncate>
                      {item.matchedProduct}
                    </Text>
                    <Text variant="bodyXs" tone="subdued" truncate>
                      {item.matchedCollection}
                    </Text>
                  </BlockStack>
                </InlineStack>
              </Box>
            </IndexTable.Cell>

            {/* 6. Action Buttons */}
            <IndexTable.Cell>
              <InlineStack gap="150" align="end" blockAlign="center">
                <Button
                  size="slim"
                  variant="plain"
                  icon={item.isSaved ? StarFilledIcon : StarIcon}
                  accessibilityLabel="Save idea"
                  onClick={() => onToggleBookmark(item.id)}
                />

                <Button
                  size="slim"
                  variant="secondary"
                  icon={ViewIcon}
                  onClick={() => onInspectIdea(item)}
                >
                  Inspect
                </Button>

                <Button
                  size="slim"
                  variant="primary"
                  icon={MagicIcon}
                  onClick={() => onDraftInStudio(item)}
                >
                  Draft
                </Button>
              </InlineStack>
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>

      {/* Polaris Table Pagination Footer */}
      {totalItems > 0 && (
        <Box padding="300" borderBlockStartWidth="025" borderColor="border-subdued">
          <InlineStack align="space-between" blockAlign="center" wrap gap="300">
            {/* Left: Range and total count info */}
            <Text variant="bodySm" tone="subdued">
              Showing <Text as="span" fontWeight="bold">{startIndex + 1}</Text>–<Text as="span" fontWeight="bold">{endIndex}</Text> of <Text as="span" fontWeight="bold">{totalItems}</Text> opportunities
            </Text>

            {/* Right: Page size selector and Polaris Pagination */}
            <InlineStack gap="300" blockAlign="center">
              <InlineStack gap="150" blockAlign="center">
                <Text variant="bodyXs" tone="subdued">Rows per page:</Text>
                <Box width="110px">
                  <Select
                    label="Rows per page"
                    labelHidden
                    options={[
                      { label: "5 rows", value: "5" },
                      { label: "10 rows", value: "10" },
                      { label: "20 rows", value: "20" },
                    ]}
                    value={String(pageSize)}
                    onChange={(val) => {
                      setPageSize(Number(val));
                      setCurrentPage(1);
                    }}
                  />
                </Box>
              </InlineStack>

              <Pagination
                hasPrevious={currentPage > 1}
                onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
                hasNext={currentPage < totalPages}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                label={`Page ${currentPage} of ${totalPages}`}
              />
            </InlineStack>
          </InlineStack>
        </Box>
      )}
    </Card>
  );
}

export default ContentIdeasTable;
