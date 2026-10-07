import { useState, useMemo, useRef, useEffect } from "react";
import {
  Page,
  BlockStack,
  InlineStack,
  Text,
  Card,
  Modal,
  TextField,
  Select,
  ProgressBar,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  StudioHeader,
  StudioTableSubNav,
  StudioTable,
  StudioPagination,
  CreatePostTypeModal,
  ArticleDetailsModal,
  AiGeneratorSetupView,
  ScratchBuilderView,
} from "../components/studio";
import { initialStudioPosts } from "../mock/studioData";

export default function Studio() {
  const shopify = useAppBridge();

  // Navigation / view mode: 'list' | 'ai-setup' | 'scratch-builder'
  const [viewMode, setViewMode] = useState("list");

  const [posts, setPosts] = useState(initialStudioPosts);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Active AI generation state (for floating progress card & live row update)
  const [activeGeneration, setActiveGeneration] = useState(null);
  const genTimersRef = useRef([]);

  useEffect(() => {
    return () => {
      genTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Modals state
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState(null);
  const [editingScratchPost, setEditingScratchPost] = useState(null);
  const [isBulkAuthorModalOpen, setIsBulkAuthorModalOpen] = useState(false);
  const [bulkAuthorOption, setBulkAuthorOption] = useState("Default (Store Default)");
  const [bulkCustomAuthor, setBulkCustomAuthor] = useState("");

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by status
      if (selectedStatus !== "all") {
        if (selectedStatus === "published" && post.status.toLowerCase() !== "published") {
          return false;
        }
        if (selectedStatus === "drafts" && post.status.toLowerCase() !== "draft") {
          return false;
        }
        if (selectedStatus === "scheduled" && post.status.toLowerCase() !== "scheduled") {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = post.title.toLowerCase().includes(query);
        const matchAuthor = (post.author || "").toLowerCase().includes(query);
        const matchKeyword = (post.keyword || "").toLowerCase().includes(query);
        if (!matchTitle && !matchAuthor && !matchKeyword) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedStatus, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredPosts.length / pageSize) || 1;
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredPosts.slice(startIndex, startIndex + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  // Selection handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    const visibleIds = paginatedPosts.map((p) => p.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Bulk Actions
  const handleBulkPublish = () => {
    if (selectedIds.length === 0) return;
    setPosts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "Published" } : p))
    );
    shopify.toast?.show(`Published ${selectedIds.length} article(s)`);
    setSelectedIds([]);
  };

  const handleBulkUnpublish = () => {
    if (selectedIds.length === 0) return;
    setPosts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: "Draft" } : p))
    );
    shopify.toast?.show(`Unpublished ${selectedIds.length} article(s)`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setPosts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    shopify.toast?.show(`Deleted ${count} article(s)`);
    setSelectedIds([]);
  };

  const handleOpenBulkAuthor = () => {
    setBulkAuthorOption("Default (Store Default)");
    setBulkCustomAuthor("");
    setIsBulkAuthorModalOpen(true);
  };

  const handleSaveBulkAuthor = () => {
    const finalAuthor =
      bulkAuthorOption === "custom"
        ? bulkCustomAuthor.trim() || "Default (Store Default)"
        : bulkAuthorOption;

    setPosts((prev) =>
      prev.map((p) => (selectedIds.includes(p.id) ? { ...p, author: finalAuthor } : p))
    );
    shopify.toast?.show(`Updated author for ${selectedIds.length} article(s)`);
    setIsBulkAuthorModalOpen(false);
    setSelectedIds([]);
  };

  // Row click -> opens article details & SEO/GEO audit modal
  const handleRowClick = (post) => {
    setActiveDetailPost(post);
  };

  // Action handlers
  const handleCompleteAiGeneration = (newPost) => {
    genTimersRef.current.forEach(clearTimeout);
    genTimersRef.current = [];

    const initialGeneratingPost = {
      ...newPost,
      status: "Generating",
      progress: 14,
      isNew: false,
      seoScore: null,
      geoScore: null,
    };

    setPosts((prev) => [initialGeneratingPost, ...prev]);
    setViewMode("list");
    setSelectedStatus("all");
    setCurrentPage(1);

    setActiveGeneration({
      id: newPost.id,
      title: newPost.title,
      progress: 14,
      stepText: "Step 1/3: Analyzing topic & outline...",
    });

    const t1 = setTimeout(() => {
      setActiveGeneration((prev) =>
        prev ? { ...prev, progress: 38, stepText: "Step 2/3: Generating content & headings..." } : null
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === newPost.id ? { ...p, progress: 38 } : p))
      );
    }, 1100);

    const t2 = setTimeout(() => {
      setActiveGeneration((prev) =>
        prev ? { ...prev, progress: 72, stepText: "Step 3/3: Optimizing SEO schema & featured image..." } : null
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === newPost.id ? { ...p, progress: 72 } : p))
      );
    }, 2300);

    const t3 = setTimeout(() => {
      setActiveGeneration((prev) =>
        prev ? { ...prev, progress: 94, stepText: "Step 3/3: Finalizing article draft..." } : null
      );
      setPosts((prev) =>
        prev.map((p) => (p.id === newPost.id ? { ...p, progress: 94 } : p))
      );
    }, 3400);

    const t4 = setTimeout(() => {
      setActiveGeneration((prev) =>
        prev ? { ...prev, progress: 100, stepText: "Generation complete!" } : null
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === newPost.id
            ? {
                ...p,
                status: "Draft",
                isNew: true,
                seoScore: newPost.seoScore || 78,
                geoScore: newPost.geoScore || 70,
                progress: 100,
              }
            : p
        )
      );
      shopify.toast?.show(`AI generation complete for "${newPost.title}"!`);

      const tDismiss = setTimeout(() => {
        setActiveGeneration(null);
      }, 2000);
      genTimersRef.current.push(tDismiss);
    }, 4200);

    genTimersRef.current.push(t1, t2, t3, t4);
  };

  const handleCompleteScratchSave = (savedPost) => {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === savedPost.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPost.id ? savedPost : p));
      }
      return [savedPost, ...prev];
    });
    setEditingScratchPost(null);
    setViewMode("list");
    shopify.toast?.show(`Saved "${savedPost.title}"`);
  };

  const handleEditPost = (post) => {
    setEditingScratchPost(post);
    setViewMode("scratch-builder");
  };

  const handleViewPost = (post) => {
    setActiveDetailPost(post);
  };

  const handleDuplicatePost = (post) => {
    const duplicated = {
      ...post,
      id: `post-${Date.now()}`,
      title: `${post.title} (Copy)`,
      status: "Draft",
      lastModified: "Just now",
      isNew: true,
    };
    setPosts((prev) => [duplicated, ...prev]);
    shopify.toast?.show(`Duplicated "${post.title}"`);
  };

  const handleDeletePost = (post) => {
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    setSelectedIds((prev) => prev.filter((id) => id !== post.id));
    shopify.toast?.show(`Deleted "${post.title}"`);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    setActiveDetailPost(updatedPost);
    shopify.toast?.show(`Updated "${updatedPost.title}"`);
  };

  // Render AI Generator Setup Screen
  if (viewMode === "ai-setup") {
    return (
      <Page>
        <AiGeneratorSetupView
          onBack={() => setViewMode("list")}
          onCompleteGeneration={handleCompleteAiGeneration}
        />
      </Page>
    );
  }

  // Render Scratch Builder Screen
  if (viewMode === "scratch-builder") {
    return (
      <ScratchBuilderView
        initialPost={editingScratchPost}
        onBack={() => {
          setEditingScratchPost(null);
          setViewMode("list");
        }}
        onCompleteSave={handleCompleteScratchSave}
      />
    );
  }

  // Default: Table List View exactly matching Image 2
  return (
    <Page>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          paddingBottom: "32px",
          position: "relative",
        }}
      >
        {/* Floating AI Generation Progress Widget exactly matching Image 2 */}
        {activeGeneration && (
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "40px",
              width: "350px",
              backgroundColor: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "10px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
              padding: "14px 16px",
              zIndex: 9999,
              transition: "all 0.3s ease",
            }}
          >
            <BlockStack gap="150">
              <InlineStack align="space-between" blockAlign="center">
                <Text variant="bodySm" fontWeight="medium" tone="base">
                  {activeGeneration.stepText}
                </Text>
                <InlineStack gap="150" align="center">
                  <Text variant="bodySm" tone="subdued">
                    {activeGeneration.progress}%
                  </Text>
                  <button
                    type="button"
                    onClick={() => setActiveGeneration(null)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#71717a",
                      cursor: "pointer",
                      fontSize: "14px",
                      lineHeight: "1",
                      padding: "0 2px",
                    }}
                    title="Dismiss"
                  >
                    —
                  </button>
                </InlineStack>
              </InlineStack>

              <ProgressBar
                progress={activeGeneration.progress}
                size="small"
                tone="primary"
              />

              <Text variant="bodyXs" tone="subdued">
                {activeGeneration.title}
              </Text>
            </BlockStack>
          </div>
        )}
        <BlockStack gap="400">
          {/* Header */}
          <StudioHeader onCreateContent={() => setIsTypeModalOpen(true)} />

          {/* Main Table Card + Pagination */}
          <div>
            <Card padding="0">
              <BlockStack gap="0">
                <StudioTableSubNav
                  selectedStatus={selectedStatus}
                  onSelectStatus={(status) => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={(val) => {
                    setSearchQuery(val);
                    setCurrentPage(1);
                  }}
                  posts={posts}
                />

                <StudioTable
                  posts={paginatedPosts}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  onToggleSelectAll={handleToggleSelectAll}
                  onRowClick={handleRowClick}
                  onEditPost={handleEditPost}
                  onViewPost={handleViewPost}
                  onDuplicatePost={handleDuplicatePost}
                  onDeletePost={handleDeletePost}
                  onBulkPublish={handleBulkPublish}
                  onBulkUnpublish={handleBulkUnpublish}
                  onBulkEditAuthor={handleOpenBulkAuthor}
                  onBulkDelete={handleBulkDelete}
                />
              </BlockStack>
            </Card>

            {/* Pagination directly below card */}
            {filteredPosts.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <StudioPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPreviousPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                />
              </div>
            )}
          </div>
        </BlockStack>

        {/* 2-Choice Creation Modal */}
        <CreatePostTypeModal
          open={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSelectAiGenerate={() => {
            setIsTypeModalOpen(false);
            setViewMode("ai-setup");
          }}
          onSelectScratch={() => {
            setEditingScratchPost(null);
            setIsTypeModalOpen(false);
            setViewMode("scratch-builder");
          }}
        />

        {/* Article Details & Quick Audit Modal */}
        <ArticleDetailsModal
          open={Boolean(activeDetailPost)}
          post={activeDetailPost}
          onClose={() => setActiveDetailPost(null)}
          onUpdatePost={handleUpdatePost}
        />

        {/* Bulk Edit Author Modal */}
        <Modal
          open={isBulkAuthorModalOpen}
          onClose={() => setIsBulkAuthorModalOpen(false)}
          title={`Edit author for ${selectedIds.length} article(s)`}
          primaryAction={{
            content: "Save",
            onAction: handleSaveBulkAuthor,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setIsBulkAuthorModalOpen(false),
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="300">
              <Select
                label="Author"
                options={[
                  { label: "Default (Store Default)", value: "Default (Store Default)" },
                  { label: "Tapita", value: "Tapita" },
                  { label: "Custom author...", value: "custom" },
                ]}
                value={bulkAuthorOption}
                onChange={(val) => setBulkAuthorOption(val)}
              />

              {bulkAuthorOption === "custom" && (
                <TextField
                  label="Custom Author Name"
                  value={bulkCustomAuthor}
                  onChange={(val) => setBulkCustomAuthor(val)}
                  placeholder="Enter author name"
                  autoComplete="off"
                />
              )}
            </BlockStack>
          </Modal.Section>
        </Modal>
      </div>
    </Page>
  );
}

