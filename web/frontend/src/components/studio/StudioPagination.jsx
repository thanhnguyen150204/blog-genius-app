import { Icon } from "@shopify/polaris";
import { ChevronLeftIcon, ChevronRightIcon } from "@shopify/polaris-icons";

export function StudioPagination({
  currentPage = 1,
  totalPages = 1,
  onPreviousPage,
  onNextPage,
}) {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        paddingTop: "6px",
        paddingLeft: "2px",
      }}
    >
      <button
        type="button"
        disabled={isFirstPage}
        onClick={onPreviousPage}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: isFirstPage ? "#ebeef2" : "#ebeef2",
          color: isFirstPage ? "#a1a1aa" : "#3f3f46",
          cursor: isFirstPage ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          opacity: isFirstPage ? 0.7 : 1,
        }}
        aria-label="Previous page"
      >
        <Icon source={ChevronLeftIcon} tone={isFirstPage ? "subdued" : "base"} />
      </button>

      <span style={{ fontSize: "13px", color: "#334155", fontWeight: 500, userSelect: "none" }}>
        {currentPage} / {Math.max(1, totalPages)}
      </span>

      <button
        type="button"
        disabled={isLastPage}
        onClick={onNextPage}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: isLastPage ? "#ebeef2" : "#ebeef2",
          color: isLastPage ? "#a1a1aa" : "#3f3f46",
          cursor: isLastPage ? "not-allowed" : "pointer",
          transition: "all 0.15s ease",
          opacity: isLastPage ? 0.7 : 1,
        }}
        aria-label="Next page"
      >
        <Icon source={ChevronRightIcon} tone={isLastPage ? "subdued" : "base"} />
      </button>
    </div>
  );
}

export default StudioPagination;
