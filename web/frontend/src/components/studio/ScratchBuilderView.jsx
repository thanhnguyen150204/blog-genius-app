import { useState, useEffect, useRef } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ScratchTopBar } from "./ScratchBuilder/ScratchTopBar";
import { ScratchLeftRail } from "./ScratchBuilder/ScratchLeftRail";
import { ScratchSidebarPostSettings } from "./ScratchBuilder/ScratchSidebarPostSettings";
import { ScratchSidebarElements } from "./ScratchBuilder/ScratchSidebarElements";
import { ScratchSidebarTableContent } from "./ScratchBuilder/ScratchSidebarTableContent";
import { ScratchSidebarOutline } from "./ScratchBuilder/ScratchSidebarOutline";
import { ScratchSidebarSeo } from "./ScratchBuilder/ScratchSidebarSeo";
import { ScratchSidebarExport } from "./ScratchBuilder/ScratchSidebarExport";
import { ScratchCanvas } from "./ScratchBuilder/ScratchCanvas";
import { ScratchImageLibraryModal } from "./ScratchBuilder/ScratchImageLibraryModal";

export function ScratchBuilderView({
  onBack,
  onCompleteSave,
  initialPost = null,
}) {
  const shopify = useAppBridge();

  useEffect(() => {
    try {
      if (typeof window.shopify?.fullscreen?.enter === "function") {
        window.shopify.fullscreen.enter();
      } else if (typeof shopify?.fullscreen?.enter === "function") {
        shopify.fullscreen.enter();
      } else if (typeof window.shopify?.fullscreen === "function") {
        window.shopify.fullscreen(true);
      } else if (typeof shopify?.fullscreen === "function") {
        shopify.fullscreen(true);
      }
    } catch (e) {}

    return () => {
      try {
        if (typeof window.shopify?.fullscreen?.exit === "function") {
          window.shopify.fullscreen.exit();
        } else if (typeof shopify?.fullscreen?.exit === "function") {
          shopify.fullscreen.exit();
        } else if (typeof window.shopify?.fullscreen === "function") {
          window.shopify.fullscreen(false);
        } else if (typeof shopify?.fullscreen === "function") {
          shopify.fullscreen(false);
        }
      } catch (e) {}
    };
  }, [shopify]);

  const initialPostData = {
    id: initialPost?.id || `post-${Date.now()}`,
    title: initialPost?.title || "This is the blog post title 4",
    status: initialPost?.status || "Draft",
    visibility: initialPost?.visibility || "visible",
    setVisibilityDate: initialPost?.setVisibilityDate ?? true,
    visibilityDate: initialPost?.visibilityDate || "October 8, 2026",
    visibilityTime: initialPost?.visibilityTime || "12:00 PM",
    visibilityTimezone: initialPost?.visibilityTimezone || "GMT+7",
    featuredImage: initialPost?.featuredImage || null,
    imageAlt: initialPost?.imageAlt || "",
    imageScope: "All devices",
    imageSize: "original",
    excerpt: initialPost?.excerpt || "",
    author: initialPost?.author || "Default (Store Default)",
    blogCategory: initialPost?.blogCategory || "News",
    keyword: initialPost?.keyword || "",
    tags: initialPost?.tags || "",
    internalLinks: initialPost?.internalLinks || [],
    seoTitle: initialPost?.seoTitle || initialPost?.title || "This is the blog post title 4",
    metaDescription: initialPost?.metaDescription || "Blog information",
    handle: initialPost?.handle || "this-is-the-blog-post-title-4",
    language: "en",
    seoScore: initialPost?.seoScore ?? 85,
    geoScore: initialPost?.geoScore ?? 88,
    tableOfContents: initialPost?.tableOfContents || {
      enabled: true,
      title: "Table of Contents",
      textColor: "#000000",
      listStyle: "none",
      indentation: "hierarchical",
      layout: "1-col",
      collapsible: false,
      excludedHeadingTypes: [],
    },
  };

  const parseOutlineToBlocks = (post) => {
    if (Array.isArray(post?.blocks) && post.blocks.length > 0) {
      return post.blocks;
    }

    const formatCombinedParagraph = (lines) => {
      if (!lines || lines.length === 0) return "";
      return lines
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`))
        .join(" ");
    };

    if (typeof post?.outline === "string" && post.outline.trim()) {
      const outlineStr = post.outline.trim();
      if (outlineStr.includes("<")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(outlineStr, "text/html");
        const elements = doc.body.childNodes;
        const parsed = [];
        let bIdx = 1;
        let currentLines = [];

        const flushLines = () => {
          const combined = formatCombinedParagraph(currentLines);
          if (combined) {
            parsed.push({
              id: `b-${bIdx++}`,
              type: "paragraph",
              text: combined,
            });
          }
          currentLines = [];
        };

        elements.forEach((node) => {
          const tag = node.nodeName?.toLowerCase();
          const text = (node.textContent || "").trim();
          if (!text) return;
          if (tag === "h1" || tag === "h2" || tag === "h3") {
            flushLines();
            parsed.push({
              id: `b-${bIdx++}`,
              type: "heading",
              level: tag,
              text: text,
            });
          } else if (tag === "ul" || tag === "ol") {
            node.querySelectorAll("li").forEach((li) => {
              const liText = (li.textContent || "").trim();
              if (liText) {
                currentLines.push(liText);
              }
            });
          } else if (tag === "li" || tag === "p") {
            currentLines.push(text);
          }
        });
        flushLines();
        if (parsed.length > 0) return parsed;
      } else {
        const lines = outlineStr.split("\n");
        const parsed = [];
        let bIdx = 1;
        let currentLines = [];

        const flushLines = () => {
          const combined = formatCombinedParagraph(currentLines);
          if (combined) {
            parsed.push({
              id: `b-${bIdx++}`,
              type: "paragraph",
              text: combined,
            });
          }
          currentLines = [];
        };

        lines.forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          if (trimmed.toLowerCase().startsWith("heading 1:") || trimmed.startsWith("# ")) {
            flushLines();
            parsed.push({
              id: `b-${bIdx++}`,
              type: "heading",
              level: "h1",
              text: trimmed.replace(/^(heading 1:\s*|#\s*)/i, "").trim(),
            });
          } else if (trimmed.toLowerCase().startsWith("heading 2:") || trimmed.startsWith("## ")) {
            flushLines();
            parsed.push({
              id: `b-${bIdx++}`,
              type: "heading",
              level: "h2",
              text: trimmed.replace(/^(heading 2:\s*|##\s*)/i, "").trim(),
            });
          } else if (trimmed.toLowerCase().startsWith("heading 3:") || trimmed.startsWith("### ")) {
            flushLines();
            parsed.push({
              id: `b-${bIdx++}`,
              type: "heading",
              level: "h3",
              text: trimmed.replace(/^(heading 3:\s*|###\s*)/i, "").trim(),
            });
          } else {
            currentLines.push(trimmed.replace(/^[•\-\*]\s*/, "").trim());
          }
        });
        flushLines();
        if (parsed.length > 0) return parsed;
      }
    }
    if (Array.isArray(post?.outline) && post.outline.length > 0) {
      return post.outline.map((o, idx) => ({
        id: `b-${idx + 1}`,
        type: "heading",
        level: o.level || "h2",
        text: o.title || o.text || "Heading",
      }));
    }
    const postTitle = post?.title || "Strategic Overview & Key Insights";
    return [
      {
        id: "b-1",
        type: "heading",
        level: "h1",
        text: postTitle,
      },
      {
        id: "b-2",
        type: "heading",
        level: "h2",
        text: "1. Core Strategic Objectives & Context",
      },
      {
        id: "b-3",
        type: "paragraph",
        text: `This article provides an in-depth analysis of ${postTitle}, exploring key industry trends, tactical execution, and actionable benchmarks.`,
      },
      {
        id: "b-4",
        type: "heading",
        level: "h2",
        text: "2. Key Tactics & Implementation",
      },
      {
        id: "b-5",
        type: "paragraph",
        text: "Focusing on search intent, structured data hierarchy, and seamless user experiences ensures maximum reader engagement and optimal AI search visibility.",
      },
    ];
  };

  const initialBlocks = parseOutlineToBlocks(initialPost);

  const [postData, setPostData] = useState(initialPostData);
  const [blocks, setBlocks] = useState(initialBlocks);
  const savedStateRef = useRef({ postData: initialPostData, blocks: initialBlocks });
  const [isDirty, setIsDirty] = useState(false);

  const [history, setHistory] = useState([
    {
      postData: initialPostData,
      blocks: initialBlocks,
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [activeTab, setActiveTab] = useState("post");
  const [viewport, setViewport] = useState("desktop");
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isAiImageModalOpen, setIsAiImageModalOpen] = useState(false);

  const pushHistory = (newPostData, newBlocks) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { postData: newPostData, blocks: newBlocks }];
    });
    setHistoryIndex((prev) => prev + 1);
    setIsDirty(true);
  };

  const handlePostDataChange = (patch) => {
    setPostData((prev) => {
      const updated = { ...prev, ...patch };
      pushHistory(updated, blocks);
      return updated;
    });
  };

  const handleDiscard = () => {
    setPostData(savedStateRef.current.postData);
    setBlocks(savedStateRef.current.blocks);
    setHistory((prev) => [
      ...prev,
      {
        postData: savedStateRef.current.postData,
        blocks: savedStateRef.current.blocks,
      },
    ]);
    setHistoryIndex((prev) => prev + 1);
    setIsDirty(false);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setPostData(history[nextIndex].postData);
      setBlocks(history[nextIndex].blocks);
      setIsDirty(true);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setPostData(history[nextIndex].postData);
      setBlocks(history[nextIndex].blocks);
      setIsDirty(true);
    }
  };

  const handleInsertBlock = (payload) => {
    const newBlock = { ...payload, id: `block-${Date.now()}` };
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    pushHistory(postData, updatedBlocks);
  };

  const handleUpdateBlock = (index, updatedBlock) => {
    const updatedBlocks = blocks.map((b, i) => (i === index ? updatedBlock : b));
    setBlocks(updatedBlocks);
    pushHistory(postData, updatedBlocks);
  };

  const handleDeleteBlock = (index) => {
    const updatedBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(updatedBlocks);
    pushHistory(postData, updatedBlocks);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setBlocks(updated);
    pushHistory(postData, updated);
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setBlocks(updated);
    pushHistory(postData, updated);
  };

  const handleToggleStatus = () => {
    const nextStatus = postData.status === "Published" ? "Draft" : "Published";
    handlePostDataChange({ status: nextStatus });
  };

  const handleSave = () => {
    savedStateRef.current = { postData, blocks };
    setIsDirty(false);

    const compiledHtml = blocks
      .map((b) => {
        if (b.type === "heading") return `<${b.level}>${b.text}</${b.level}>`;
        if (b.type === "answer-block")
          return `<div class="geo-answer-block"><p><strong>Direct Summary:</strong> ${b.text}</p></div>`;
        if (b.type === "product")
          return `<div class="product-card"><h3>${b.title}</h3><p>${b.price}</p></div>`;
        if (b.type === "faq")
          return `<div class="faq-item"><h4>Q: ${b.question}</h4><p>A: ${b.answer}</p></div>`;
        if (b.type === "callout")
          return `<div class="callout-box"><strong>${b.title}</strong><p>${b.text}</p></div>`;
        return `<p>${b.text}</p>`;
      })
      .join("\n");

    const outlineSections = blocks
      .filter((b) => b.type === "heading" || b.type === "answer-block")
      .map((b, i) => ({
        id: String(i + 1),
        level: b.level || "h2",
        title: b.title || b.text,
      }));

    const savedPost = {
      ...initialPost,
      ...postData,
      mode: "scratch",
      isAiGenerated: false,
      creationMode: "scratch",
      outline: outlineSections.length > 0 ? outlineSections : initialPost?.outline || [],
      bodyHtml: compiledHtml || "<p>This is a sample paragraph</p>",
      lastModified: "Just now",
      isNew: initialPost ? initialPost.isNew : true,
    };

    onCompleteSave(savedPost);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Floating Unsaved Changes Contextual Save Bar matching Shopify standard */}
      {isDirty && (
        <div
          style={{
            position: "fixed",
            top: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000001,
            backgroundColor: "#000000",
            color: "#ffffff",
            padding: "4px 6px 4px 16px",
            borderRadius: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 18px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: "500", color: "#ffffff" }}>
            Unsaved changes
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={handleDiscard}
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                padding: "4px 10px",
                borderRadius: "14px",
              }}
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "none",
                fontSize: "13px",
                fontWeight: "700",
                cursor: "pointer",
                padding: "4px 14px",
                borderRadius: "14px",
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      <ScratchTopBar
        title={postData.title}
        onTitleChange={(val) => handlePostDataChange({ title: val })}
        status={postData.status}
        onToggleStatus={handleToggleStatus}
        viewport={viewport}
        onViewportChange={setViewport}
        onPreview={handleSave}
        onSave={handleSave}
        onBack={onBack}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <ScratchLeftRail activeTab={activeTab} onSelectTab={setActiveTab} />

        {activeTab === "post" && (
          <ScratchSidebarPostSettings
            postData={postData}
            onChange={handlePostDataChange}
            onOpenLibraryModal={() => setIsLibraryModalOpen(true)}
            onOpenAiImageModal={() => setIsAiImageModalOpen(true)}
            isEditMode={Boolean(initialPost)}
          />
        )}

        {activeTab === "elements" && (
          <ScratchSidebarElements onInsertBlock={handleInsertBlock} />
        )}

        {(activeTab === "toc" || activeTab === "layout") && (
          <ScratchSidebarTableContent
            postData={postData}
            onChange={handlePostDataChange}
            blocks={blocks}
          />
        )}

        {activeTab === "seo" && (
          <ScratchSidebarSeo postData={postData} blocks={blocks} />
        )}

        {activeTab === "export" && (
          <ScratchSidebarExport
            postData={postData}
            onChange={handlePostDataChange}
            onSave={handleSave}
          />
        )}

        <ScratchCanvas
          postData={postData}
          onPostDataChange={handlePostDataChange}
          blocks={blocks}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          onInsertBlock={handleInsertBlock}
          onOpenLibraryModal={() => setIsLibraryModalOpen(true)}
          onOpenAiImageModal={() => setIsAiImageModalOpen(true)}
          viewport={viewport}
        />
      </div>

      <ScratchImageLibraryModal
        open={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onSelectImage={(url) => handlePostDataChange({ featuredImage: url })}
        isAiMode={false}
      />

      <ScratchImageLibraryModal
        open={isAiImageModalOpen}
        onClose={() => setIsAiImageModalOpen(false)}
        onSelectImage={(url) => handlePostDataChange({ featuredImage: url })}
        isAiMode={true}
      />
    </div>
  );
}

export default ScratchBuilderView;
