import { useEffect, useRef } from "react";
import { Modal, Text, BlockStack } from "@shopify/polaris";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function convertTextToHtml(text) {
  if (!text || !text.trim()) return "";
  if (text.trim().startsWith("<")) {
    return text.replace(/<p><br><\/p>/gi, "").replace(/\n+/g, "");
  }

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

    if (
      trimmed.toLowerCase().startsWith("heading 1:") ||
      trimmed.startsWith("# ")
    ) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 1:\s*|#\s*)/i, "");
      html += `<h1>${title}</h1>`;
    } else if (
      trimmed.toLowerCase().startsWith("heading 2:") ||
      trimmed.startsWith("## ")
    ) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 2:\s*|##\s*)/i, "");
      html += `<h2>${title}</h2>`;
    } else if (
      trimmed.toLowerCase().startsWith("heading 3:") ||
      trimmed.startsWith("### ")
    ) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 3:\s*|###\s*)/i, "");
      html += `<h3>${title}</h3>`;
    } else if (
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("*")
    ) {
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
              [{ header: [1, 2, 3, false] }],
              [{ list: "bullet" }],
            ],
          },
        });

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

  const handleGenerateAiOutline = () => {
    const rawTopic =
      postTitle.trim() ||
      (Array.isArray(keywords) ? keywords.join(", ") : keywords) ||
      "";

    const isEcommerce =
      /shopify|ecommerce|seo|geo|store|product|marketing|ranking|audit|conversion/i.test(
        rawTopic
      );

    let aiHtml = "";

    if (isEcommerce) {
      aiHtml =
        "<h2>1. Strategic Foundation: The Evolution of Generative Engine Optimization (GEO)</h2>" +
        "<p>Why traditional keyword stuffing fails in the era of Google AI Overviews, Perplexity, and ChatGPT Search</p>" +
        "<p>The shift from ten blue links to synthesized AI answer cards and citation authority</p>" +
        "<p>Core algorithmic factors determining whether your Shopify store is cited as the primary authority</p>" +
        "<h2>2. Direct Answer Architecture: Crafting High-Authority Summary Blocks</h2>" +
        "<p>Formula for writing 40-80 word direct answer blocks matching conversational search intent</p>" +
        "<p>Structuring semantic H2/H3 hierarchies with immediate clarity for LLM token extraction</p>" +
        "<p>Case study: How concise definition blocks increased AI overview citation rate by 340%</p>" +
        "<h2>3. Schema Markup & Structured Data Integration for Ecommerce</h2>" +
        "<p>Step-by-step implementation of JSON-LD FAQPage, Article, and Product schema</p>" +
        "<p>Validating entity relationships with Google Rich Results and Schema Validator</p>" +
        "<p>Connecting price metadata, inventory status, and verified reviews directly to generative parsers</p>" +
        "<h2>4. On-Page Conversion & Interactive Product Spotlights</h2>" +
        "<p>Seamlessly embedding contextual product cards and dynamic collection spotlights</p>" +
        "<p>Balancing high-value educational content with clear, non-intrusive purchase triggers</p>" +
        "<p>Mobile viewport optimization and Core Web Vitals impact on search indexation speed</p>" +
        "<h2>5. Content Freshness, Refresh Cycles & Technical AI Crawler Readiness</h2>" +
        "<p>Setting automated 30-day and 60-day content audit alerts to prevent ranking decay</p>" +
        "<p>Configuring robots.txt and server headers for GPTBot, ClaudeBot, and PerplexityBot access</p>" +
        "<p>Monitoring AI search referrals and brand mentions using modern search console metrics</p>" +
        "<h2>6. Frequently Asked Questions (FAQ) Schema</h2>" +
        "<p>How do AI engines choose which Shopify blog posts to cite in conversational answers?</p>" +
        "<p>What is the optimal word count and reading grade level for generative search visibility?</p>" +
        "<p>Can automated AI content generation replace human editorial review and domain expertise?</p>";
    } else {
      aiHtml =
        "<h2>The Case for Calling Viet Nam a Champion Travel Destination</h2>" +
        '<p>What "champion" means for travelers: value, variety, and ease in one itinerary</p>' +
        "<p>How Viet Nam outcompetes regional favorites without the crowds</p>" +
        "<h2>Hard-to-Beat Value: What Your Budget Actually Buys in Viet Nam</h2>" +
        "<p>Realistic daily budgets for backpackers, mid-range, and boutique travelers</p>" +
        "<p>Where to splurge for maximum payoff: bay cruises, cave expeditions, and tailor-made outfits</p>" +
        "<p>Currency, ATMs, tipping norms, and bargaining etiquette that keep costs predictable</p>" +
        "<h2>One Country, Many Worlds: Landscapes That Justify the Hype</h2>" +
        "<p>Northern highlands and karst country: Ha Giang loops, terraced valleys, and limestone peaks</p>" +
        "<p>Central coast contrasts: imperial Hue, lantern-lit Hoi An, and Da Nang's beaches and peaks</p>" +
        "<p>Southern dynamism: Ho Chi Minh City's energy, the Mekong Delta's waterways, and island escapes</p>" +
        "<h2>A Culinary Capital in the Street and the Kitchen</h2>" +
        "<p>From pho and banh mi to Hue's spicy noodle soup: why regional dishes matter</p>" +
        "<p>Street food safety: how to spot clean, high-turnover stalls and avoid stomach woes</p>" +
        "<p>Coffee culture, night markets, and cooking classes that deepen your palate</p>" +
        "<h2>Culture and History You Can Touch, Not Just Read About</h2>" +
        "<p>War-era context with care: Cu Chi Tunnels, War Remnants Museum, and DMZ routes</p>" +
        "<p>Imperial legacies and architecture: Hue's Citadel, Hoi An's merchant houses, and pagodas</p>" +
        "<p>Festivals, craft villages, and ethical homestays for meaningful local exchange</p>" +
        "<h2>Practical Playbook: Visas, Best Timing, and Staying Connected</h2>" +
        "<p>E-visa rules, entry ports, and simple hacks to breeze through immigration</p>" +
        "<p>Seasonal microclimates: how to pack for cool northern mists and sunny southern beaches</p>" +
        "<p>SIM cards, eSIMs, and ride-hailing apps for effortless on-the-ground navigation</p>";
    }

    if (quillInstanceRef.current) {
      quillInstanceRef.current.root.innerHTML = aiHtml;
    }
  };

  const handleSave = () => {
    if (quillInstanceRef.current) {
      const html = quillInstanceRef.current.root.innerHTML;
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
      size="large"
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "4px",
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
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Generate outline</span>
            </button>
          </div>

          <div className="outline-quill-wrapper">
            <div ref={editorContainerRef} />
          </div>

          <style>{`
            .Polaris-Modal-Dialog__Modal {
              max-width: 640px !important;
            }
            .outline-quill-wrapper .ql-toolbar.ql-snow {
              border: 1px solid #d4d4d8;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              background-color: #ffffff;
              padding: 8px 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .outline-quill-wrapper .ql-container.ql-snow {
              border: 1px solid #d4d4d8;
              border-top: none;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              background-color: #ffffff;
            }
            .outline-quill-wrapper .ql-editor {
              min-height: 280px;
              max-height: 440px;
              overflow-y: auto;
              line-height: 1.45;
              color: #202223;
              padding: 14px 18px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            .outline-quill-wrapper .ql-editor h1 {
              font-size: 20px !important;
              font-weight: 500 !important;
              color: #202223 !important;
              line-height: 1.35 !important;
              margin-top: 14px !important;
              margin-bottom: 4px !important;
              letter-spacing: -0.01em;
            }
            .outline-quill-wrapper .ql-editor h2 {
              font-size: 17.5px !important;
              font-weight: 500 !important;
              color: #202223 !important;
              line-height: 1.35 !important;
              margin-top: 14px !important;
              margin-bottom: 4px !important;
              letter-spacing: -0.01em;
            }
            .outline-quill-wrapper .ql-editor h2:first-child,
            .outline-quill-wrapper .ql-editor h1:first-child {
              margin-top: 0 !important;
            }
            .outline-quill-wrapper .ql-editor h3 {
              font-size: 15px !important;
              font-weight: 500 !important;
              color: #303030 !important;
              line-height: 1.35 !important;
              margin-top: 10px !important;
              margin-bottom: 3px !important;
            }
            .outline-quill-wrapper .ql-editor p {
              font-size: 13.5px !important;
              font-weight: 400 !important;
              color: #374151 !important;
              line-height: 1.45 !important;
              margin-top: 0 !important;
              margin-bottom: 3px !important;
              padding: 0 !important;
            }
            .outline-quill-wrapper .ql-editor ul,
            .outline-quill-wrapper .ql-editor ol {
              padding-left: 20px !important;
              margin-bottom: 6px !important;
            }
            .outline-quill-wrapper .ql-editor li {
              font-size: 13.5px !important;
              color: #374151 !important;
              line-height: 1.45 !important;
              margin-bottom: 2px !important;
            }
            .outline-quill-wrapper .ql-editor.ql-blank::before {
              color: #a1a1aa;
              font-style: normal;
              font-size: 13.5px;
              left: 18px;
            }
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header {
              width: 130px;
            }
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label:not([data-value])::before,
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item:not([data-value])::before {
              content: 'Paragraph' !important;
            }
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
            .outline-quill-wrapper .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
              content: 'Heading 1' !important;
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
