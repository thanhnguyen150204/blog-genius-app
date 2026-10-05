import { useState, useMemo } from "react";
import { Page, BlockStack, Card } from "@shopify/polaris";
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

  // Modals state
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [activeDetailPost, setActiveDetailPost] = useState(null);
  const [editingScratchPost, setEditingScratchPost] = useState(null);

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

  // Row click -> opens scratch builder
  const handleRowClick = (post) => {
    setEditingScratchPost(post);
    setViewMode("scratch-builder");
  };

  // Action handlers
  const handleCompleteAiGeneration = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setViewMode("list");
    shopify.toast?.show(`AI successfully generated "${newPost.title}"!`);
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
      <Page>
        <ScratchBuilderView
          initialPost={editingScratchPost}
          onBack={() => {
            setEditingScratchPost(null);
            setViewMode("list");
          }}
          onCompleteSave={handleCompleteScratchSave}
        />
      </Page>
    );
  }

  // Default: Table List View exactly matching Image 2
  return (
    <Page>
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", paddingBottom: "32px" }}>
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
      </div>
    </Page>
  );
}
