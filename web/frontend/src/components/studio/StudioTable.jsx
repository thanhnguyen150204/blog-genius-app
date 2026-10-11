import {
  IndexTable,
  Badge,
  Text,
  Icon,
  InlineStack,
  EmptySearchResult,
} from "@shopify/polaris";
import { MagicIcon, BlogIcon } from "@shopify/polaris-icons";
import { ArticleActionsMenu } from "./ArticleActionsMenu";

export function StudioTable({
  posts = [],
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
  onEditPost,
  onViewPost,
  onDuplicatePost,
  onDeletePost,
  onBulkPublish,
  onBulkUnpublish,
  onBulkEditAuthor,
  onBulkDelete,
}) {
  const isAllSelected = posts.length > 0 && posts.every((p) => selectedIds.includes(p.id));

  const selectedPosts = posts.filter((p) => selectedIds.includes(p.id));
  const hasDraft = selectedPosts.some((p) => (p.status || "").toLowerCase() === "draft");
  const hasPublished = selectedPosts.some((p) => (p.status || "").toLowerCase() === "published");

  const showUnpublish = hasPublished && !hasDraft;
  const showPublish = !showUnpublish;

  const resourceName = {
    singular: "article",
    plural: "articles",
  };

  const promotedBulkActions = [
    showPublish
      ? {
          content: "Publish",
          onAction: onBulkPublish,
        }
      : {
          content: "Unpublish",
          onAction: onBulkUnpublish,
        },
    {
      content: "Edit author",
      onAction: onBulkEditAuthor,
    },
  ];

  const bulkActions = [
    {
      content: "Delete articles",
      destructive: true,
      onAction: onBulkDelete,
    },
  ];

  const headings = [
    { title: "Title" },
    { title: "Type" },
    { title: "Author" },
    { title: "Last modified" },
    { title: "SEO" },
    { title: "GEO" },
    { title: "Status" },
    { title: "Action", alignment: "end" },
  ];

  const handleSelectionChange = (selectionType, isSelecting, id) => {
    if (selectionType === "all" || selectionType === "page") {
      onToggleSelectAll();
    } else if (id) {
      onToggleSelect(id);
    }
  };

  const getTypeTone = (type) => {
    switch (type) {
      case "Informational":
        return "info";
      case "Buyer's guide":
        return "warning";
      case "How-to":
        return "success";
      case "FAQ":
        return "attention";
      case "Trust / About":
        return "info";
      case "Company Facts":
        return "critical";
      default:
        return "info";
    }
  };

  const renderStatusBadge = (status, post) => {
    const s = (status || "").toLowerCase();
    if (s.includes("generating")) {
      const progressVal = post?.progress !== undefined ? post.progress : 14;
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#fef08a",
            color: "#713f12",
            padding: "3px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              border: "2px solid #713f12",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          {progressVal}% Generating
        </span>
      );
    }

    if (s === "published") {
      return (
        <Badge tone="success" size="small">
          Published
        </Badge>
      );
    }

    if (s === "draft") {
      return (
        <Badge tone="subdued" size="small">
          Draft
        </Badge>
      );
    }

    if (s === "scheduled") {
      return (
        <Badge tone="info" size="small">
          Scheduled
        </Badge>
      );
    }

    return (
      <Badge tone="subdued" size="small">
        {status}
      </Badge>
    );
  };

  const renderScorePill = (score) => {
    const val = parseInt(score, 10) || 85;
    const tone = val >= 80 ? "success" : val >= 60 ? "warning" : "critical";

    return (
      <Badge tone={tone} size="small">
        {`${val}`}
      </Badge>
    );
  };

  const emptyStateMarkup = (
    <EmptySearchResult
      title="No articles found"
      description="Try changing the filters or search term"
      withIllustration
    />
  );

  return (
    <IndexTable
      resourceName={resourceName}
      itemCount={posts.length}
      selectedItemsCount={isAllSelected ? "All" : selectedIds.length}
      onSelectionChange={handleSelectionChange}
      headings={headings}
      promotedBulkActions={promotedBulkActions}
      bulkActions={bulkActions}
      emptyState={emptyStateMarkup}
    >
      {posts.map((post, index) => {
        const isSelected = selectedIds.includes(post.id);

        return (
          <IndexTable.Row
            id={post.id}
            key={post.id}
            selected={isSelected}
            position={index}
          >
            <IndexTable.Cell>
              <div
                style={{
                  width: "300px",
                  maxWidth: "320px",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }}
              >
                <InlineStack gap="200" blockAlign="start" wrap={false}>
                  <div style={{ marginTop: "2px", flexShrink: 0 }}>
                    <Icon
                      source={post.type === "How-to" ? MagicIcon : BlogIcon}
                      tone="subdued"
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: "1.4",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      {post.title}
                    </Text>
                  </div>
                </InlineStack>
              </div>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Badge tone={getTypeTone(post.type)} size="small">
                {post.type || "Informational"}
              </Badge>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <Text variant="bodySm" tone="subdued" as="span">
                {post.author || "Thành Nguyễn"}
              </Text>
            </IndexTable.Cell>

            <IndexTable.Cell>
              <span style={{ whiteSpace: "nowrap" }}>
                <Text variant="bodySm" tone="subdued" as="span">
                  {post.lastModified || "Oct 5, 2026, 08:40 PM"}
                </Text>
              </span>
            </IndexTable.Cell>

            <IndexTable.Cell>
              {renderScorePill(post.seoScore)}
            </IndexTable.Cell>

            <IndexTable.Cell>
              {renderScorePill(post.geoScore)}
            </IndexTable.Cell>

            <IndexTable.Cell>
              {renderStatusBadge(post.status, post)}
            </IndexTable.Cell>

            <IndexTable.Cell>
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ArticleActionsMenu
                  post={post}
                  onEdit={onEditPost}
                  onView={onViewPost}
                  onDuplicate={onDuplicatePost}
                  onDelete={onDeletePost}
                />
              </div>
            </IndexTable.Cell>
          </IndexTable.Row>
        );
      })}
    </IndexTable>
  );
}

export default StudioTable;
