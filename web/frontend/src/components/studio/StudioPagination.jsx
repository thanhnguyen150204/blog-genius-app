import { Pagination, InlineStack } from "@shopify/polaris";

export function StudioPagination({
  currentPage = 1,
  totalPages = 1,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <InlineStack align="center">
      <Pagination
        hasPrevious={currentPage > 1}
        onPrevious={onPreviousPage}
        hasNext={currentPage < totalPages}
        onNext={onNextPage}
        label={`${currentPage} / ${Math.max(1, totalPages)}`}
      />
    </InlineStack>
  );
}

export default StudioPagination;