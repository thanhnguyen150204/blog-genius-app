import { useEffect, useRef } from "react";
import { Modal, Text, BlockStack } from "@shopify/polaris";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Helper to convert plain text with headings and bullets to Quill HTML
function convertTextToHtml(text) {
  if (!text || !text.trim()) return "";
  if (text.trim().startsWith("<")) return text;

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      return;
    }

    if (trimmed.toLowerCase().startsWith("heading 2:") || trimmed.startsWith("## ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 2:\s*|##\s*)/i, "");
      html += `<h2>${title}</h2>`;
    } else if (trimmed.toLowerCase().startsWith("heading 3:") || trimmed.startsWith("### ")) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 3:\s*|###\s*)/i, "");
      html += `<h3>${title}</h3>`;
    } else if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      const item = trimmed.replace(/^[•\-*]\s*/, "");
      html += `<li>${item}</li>`;
    } else {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      html += `<p>${trimmed}</p>`;
    }
  });

  if (inList) {
    html += "</ul>";
  }

  return html;
}

export function OutlineModal({
  open,
  onClose,
  outlineContent = "",
  onSave,
  postTitle = "",
  keywords = "",
}) {
  const editorContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);

  // Initialize Quill when modal opens
  useEffect(() => {
    if (!open) {
      quillInstanceRef.current = null;
      return;
    }

    const timer = setTimeout(() => {
      if (editorContainerRef.current && !quillInstanceRef.current) {
        editorContainerRef.current.innerHTML = "";
        
        const quill = new Quill(editorContainerRef.current, {
          theme: "snow",
          placeholder: "Enter your article outline, headings, and bullet points...",
          modules: {
            toolbar: [
              [{ header: [2, 3, false] }],
              [{ list: "bullet" }],
            ],
          },
        });

        // Set initial content if available
        if (outlineContent) {
          const htmlContent = convertTextToHtml(outlineContent);
          quill.root.innerHTML = htmlContent;
        }

        quillInstanceRef.current = quill;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [open, outlineContent]);

  // Generate AI Outline into Quill
  const handleGenerateAiOutline = () => {
    const topic =
      postTitle.trim() ||
      (Array.isArray(keywords) ? keywords.join(", ") : keywords) ||
      "Shopify Ecommerce & GEO Optimization";

    const aiHtml = `
      <h2>1. Overview & Fundamentals of ${topic}</h2>
      <ul>
        <li>Core principles and strategic background</li>
        <li>Direct answer summary block for AI engines</li>
      </ul>
      <h2>2. Actionable Implementation Strategies</h2>
      <ul>
        <li>Practical step-by-step roadmap</li>
        <li>Recommended tools and best practices</li>
      </ul>
      <h3>Key Pitfalls to Avoid</h3>
      <ul>
        <li>Common mistakes and solutions</li>
      </ul>
      <h2>3. GEO & AI Overview Optimization</h2>
      <ul>
        <li>FAQ Schema and structured data</li>
        <li>Citation readiness for Perplexity & ChatGPT</li>
      </ul>
    `;

    if (quillInstanceRef.current) {
      quillInstanceRef.current.root.innerHTML = aiHtml.trim();
    }
  };

  // Save content
  const handleSave = () => {
    if (quillInstanceRef.current) {
      const html = quillInstanceRef.current.root.innerHTML;
      // If empty editor, save empty string
      const text = quillInstanceRef.current.getText().trim();
      onSave(text ? html : "");
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Outline"
      primaryAction={{
        content: "Save",
        onAction: handleSave,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="200">
          {/* Header Row: Outline label on left, Generate outline on right */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2px",
            }}
          >
            <Text variant="bodySm" fontWeight="medium" as="label">
              Outline
            </Text>

            <button
              type="button"
              onClick={handleGenerateAiOutline}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Generate outline</span>
            </button>
          </div>

          {/* Quill Editor Container */}
          <div className="outline-quill-wrapper">
            <div ref={editorContainerRef} />
          </div>

          {/* Style Overrides for Quill */}
          <style>{`
            .Polaris-Modal-Dialog__Modal {
              max-width: 560px !important;
            }
            .outline-quill-wrapper .ql-toolbar.ql-snow {
              border: 1px solid #d4d4d8;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              background-color: #ffffff;
              padding: 6px 10px;
            }
            .outline-quill-wrapper .ql-container.ql-snow {
              border: 1px solid #d4d4d8;
              border-top: none;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              font-family: inherit;
              font-size: 13px;
              background-color: #ffffff;
            }
            .outline-quill-wrapper .ql-editor {
              min-height: 130px;
              max-height: 240px;
              line-height: 1.5;
              color: #18181b;
              padding: 10px 12px;
            }
            .outline-quill-wrapper .ql-editor.ql-blank::before {
              color: #a1a1aa;
              font-style: normal;
              font-size: 13px;
              left: 12px;
            }
            /* Label and Item naming for Header picker in Quill */
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label:not([data-value])::before,
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item:not([data-value])::before {
              content: 'Paragraph' !important;
            }
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
              content: 'Heading 2' !important;
            }
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
              content: 'Heading 3' !important;
            }
            .outline-quill-wrapper .ql-picker-options {
              background-color: #ffffff !important;
              border-radius: 6px !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
              padding: 4px 8px !important;
            }
          `}</style>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}

export default OutlineModal;
