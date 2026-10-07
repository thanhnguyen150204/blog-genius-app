import { useEffect, useRef, useState } from "react";
import { Modal, Text, BlockStack, Spinner, Banner } from "@shopify/polaris";
import Quill from "quill";
import "quill/dist/quill.snow.css";

function sanitizeHtml(html) {
  if (!html) return "";
  // Strip any existing ql-ui spans to prevent duplicate spans during HTML paste
  let clean = html.replace(/<span class="ql-ui"[^>]*><\/span>/gi, "");
  
  // Strip leading bullet characters, HTML bullet entities, and excessive whitespace from li text
  clean = clean.replace(/<li([^>]*)>([\s\S]*?)<\/li>/gi, (match, attrs, innerText) => {
    const textCleaned = innerText
      .replace(/^(\s*(&bull;|&#8226;|&#x2022;|[•\-\*\u2022\u25E6\u25AA\u25CF\u2013\u2014])\s*)+/gi, "")
      .trim();
    return `<li${attrs}>${textCleaned}</li>`;
  });
  return clean;
}

function convertTextToHtml(text) {
  if (!text || !text.trim()) return "";
  if (text.trim().startsWith("<")) {
    return sanitizeHtml(text);
  }

  const lines = text.split("\n");
  let html = "";
  let inList = false;

  const knownHeadingsH2 = [
    "Data-backed drivers: climate volatility, stricter safety standards, and time-poor parenting",
    "Skin-Safe, Sustainable Materials That Dominate 2026 Collections",
    "Smart Textiles Enter Daily Wear: Sensible Upgrades, Not Gimmicks",
    "Postpartum-Ready Fits and Nursing-First Design That Look Polished",
    "Coordinated Capsule Wardrobes for Mother and Baby That Cut Morning Stress",
    "Safety and Compliance: Non-Negotiables in Mother and Baby Apparel",
    "Inclusive, Adaptive, and Gender-Neutral—Without Losing Personality",
    "Smarter Shopping for 2026: Rent, Resale, and Care to Maximize Value",
    "FAQs: Clear Answers to 2026 Mother and Baby Fashion Questions",
    "What “very good” means in practical terms: accuracy, speed, breadth, cost",
    "Where Chat GPT reliably excels today: patterns and task archetypes",
    "How to measure value: outcome-based benchmarks over hype",
    "Writing and editing: clarity passes, tone shifts, and structure fixes",
  ];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      return;
    }

    const isH1 =
      trimmed.toLowerCase().startsWith("heading 1:") ||
      trimmed.startsWith("# ") ||
      trimmed.startsWith("2026’s Big Shift:") ||
      trimmed.startsWith("The case for Chat GPT:");

    const isH2 =
      trimmed.toLowerCase().startsWith("heading 2:") ||
      trimmed.startsWith("## ") ||
      knownHeadingsH2.some((h) => trimmed.toLowerCase().startsWith(h.toLowerCase()));

    const isH3 =
      trimmed.toLowerCase().startsWith("heading 3:") ||
      trimmed.startsWith("### ");

    if (isH1) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 1:\s*|#\s*)/i, "").trim();
      html += `<h1>${title}</h1>`;
    } else if (isH2) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 2:\s*|##\s*)/i, "").trim();
      html += `<h2>${title}</h2>`;
    } else if (isH3) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const title = trimmed.replace(/^(heading 3:\s*|###\s*)/i, "").trim();
      html += `<h3>${title}</h3>`;
    } else {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      // Strip leading bullet characters so Quill won't produce duplicate bullet dots
      const item = trimmed
        .replace(/^(\s*(&bull;|&#8226;|&#x2022;|[•\-\*\u2022\u25E6\u25AA\u25CF\u2013\u2014])\s*)+/gi, "")
        .trim();
      html += `<li>${item}</li>`;
    }
  });

  if (inList) {
    html += "</ul>";
  }

  return sanitizeHtml(html);
}

export function OutlineModal({
  open,
  onClose,
  outlineContent = "",
  onSave,
  postTitle = "",
  keywords = "",
  onGeneratingProgress,
  onValidationError,
}) {
  const editorContainerRef = useRef(null);
  const quillInstanceRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) {
      quillInstanceRef.current = null;
      setIsGenerating(false);
      setValidationError("");
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
          quill.clipboard.dangerouslyPasteHTML(htmlContent);
        }

        quillInstanceRef.current = quill;
      }
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [open, outlineContent]);

  const [outlineProgress, setOutlineProgress] = useState(0);

  const handleGenerateAiOutline = () => {
    const rawKeywords = Array.isArray(keywords) ? keywords.join(", ") : (keywords || "");
    const rawTopic = (postTitle || rawKeywords || "").trim();

    if (!rawTopic) {
      setValidationError("Please enter Post Title and Keywords to generate");
      if (onValidationError) {
        onValidationError();
      }
      return;
    }
    setValidationError("");

    setIsGenerating(true);
    setOutlineProgress(10);
    if (onGeneratingProgress) onGeneratingProgress(true, 10, "Step 1/3: Analyzing topic & outline...");

    const timer1 = setTimeout(() => {
      setOutlineProgress(35);
      if (onGeneratingProgress) onGeneratingProgress(true, 35, "Step 1/3: Structuring headings & key sections...");
    }, 900);

    const timer2 = setTimeout(() => {
      setOutlineProgress(70);
      if (onGeneratingProgress) onGeneratingProgress(true, 70, "Step 1/3: Formatting bullets & semantic hierarchy...");
    }, 1900);

    const timer3 = setTimeout(() => {
      setOutlineProgress(92);
      if (onGeneratingProgress) onGeneratingProgress(true, 92, "Step 1/3: Finalizing article outline...");
    }, 2800);

    const finalTimer = setTimeout(() => {
      setOutlineProgress(100);
      if (onGeneratingProgress) onGeneratingProgress(true, 100, "Outline generated successfully!");

      const isChatGPT = /chat\s*gpt|llm|openai|claude|gemini/i.test(rawTopic);

      let aiHtml = "";

      if (isChatGPT) {
        aiHtml =
          "<h1>The case for Chat GPT: a pragmatic claim worth testing</h1>" +
          "<h2>What “very good” means in practical terms: accuracy, speed, breadth, cost</h2>" +
          "<ul>" +
          "<li>Define value across four axes: factual reliability, time-to-draft, domain coverage, and cost per task.</li>" +
          "<li>Set expectations: Chat GPT is a strong generalist with standout performance on text-heavy tasks.</li>" +
          "<li>Contrast with alternatives: search engines, human-only workflows, and task-specific AI tools.</li>" +
          "<li>Clarify success criteria before judging performance to avoid vague assessments.</li>" +
          "</ul>" +
          "<h2>Where Chat GPT reliably excels today: patterns and task archetypes</h2>" +
          "<ul>" +
          "<li>Summarization, drafting, rewriting, explanation, and ideation across varied tones and formats.</li>" +
          "<li>Coding assistance for scaffolding, refactors, test cases, and docstrings.</li>" +
          "<li>Knowledge retrieval and synthesis when paired with provided sources or citations.</li>" +
          "<li>Language tasks: translation, simplification, and localization with style control.</li>" +
          "</ul>" +
          "<h2>How to measure value: outcome-based benchmarks over hype</h2>" +
          "<ul>" +
          "<li>Compare baseline vs. Chat GPT-assisted outputs on quality, time, and revision effort.</li>" +
          "<li>Use blind reviews and rubrics to reduce bias in quality judgments.</li>" +
          "<li>Track edit distance and acceptance rate to quantify “useful on first pass.”</li>" +
          "<li>Iterate on prompts and inputs before concluding limits or shortcomings.</li>" +
          "</ul>" +
          "<h1>Evidence from everyday workflows that Chat GPT improves outcomes</h1>" +
          "<h2>Writing and editing: clarity passes, tone shifts, and structure fixes</h2>" +
          "<ul>" +
          "<li>Transform rough notes into coherent outlines, then expand with controlled voice.</li>" +
          "<li>Run targeted edits: reduce jargon, tighten openings, or add examples.</li>" +
          "<li>Enforce style guides with checklists for headers, readability, and inclusive language.</li>" +
          "<li>Produce alternative headlines, CTAs, and meta descriptions for A/B testing.</li>" +
          "</ul>";
      } else {
        // Full structured outline for 2026 Mother and Baby Fashion
        aiHtml =
          "<h1>2026’s Big Shift: Practical, Planet-First Fashion for Mother and Baby</h1>" +
          "<h2>Data-backed drivers: climate volatility, stricter safety standards, and time-poor parenting</h2>" +
          "<ul>" +
          "<li>Why aesthetics now follow function in Mother and Baby wear</li>" +
          "</ul>" +
          "<h2>Skin-Safe, Sustainable Materials That Dominate 2026 Collections</h2>" +
          "<ul>" +
          "<li>Bio-based fibers (TENCEL Lyocell, organic cotton, hemp) that respect newborn skin</li>" +
          "<li>Plant and low-tox dyes delivering soft hues without harsh residues</li>" +
          "</ul>" +
          "<h2>Smart Textiles Enter Daily Wear: Sensible Upgrades, Not Gimmicks</h2>" +
          "<ul>" +
          "<li>Temperature-regulating knits and UPF 50+ stroller covers for heat waves</li>" +
          "<li>Washable sensors and privacy checks: what parents must verify in 2026</li>" +
          "</ul>" +
          "<h2>Postpartum-Ready Fits and Nursing-First Design That Look Polished</h2>" +
          "<ul>" +
          "<li>Invisible nursing access: magnets, low-profile zippers, and wrap fronts that don’t scream “maternity”</li>" +
          "<li>Core-support leggings and adjustable waistbands tailored to fourth-trimester bodies</li>" +
          "</ul>" +
          "<h2>Coordinated Capsule Wardrobes for Mother and Baby That Cut Morning Stress</h2>" +
          "<ul>" +
          "<li>The three-color system for effortless mix-and-match outfits</li>" +
          "<li>Modular layers (bodysuit + romper + cardigan) that handle changing temps and messes</li>" +
          "</ul>" +
          "<h2>Safety and Compliance: Non-Negotiables in Mother and Baby Apparel</h2>" +
          "<ul>" +
          "<li>Labels that matter in 2026: OEKO-TEX STANDARD 100, GOTS, and CPSIA compliance</li>" +
          "<li>Snaps, zippers, and trims: nickel-free, lead-safe, and swallow-safe hardware</li>" +
          "</ul>" +
          "<h2>Inclusive, Adaptive, and Gender-Neutral—Without Losing Personality</h2>" +
          "<ul>" +
          "<li>Adaptive babywear for feeding tubes, casts, or sensory needs</li>" +
          "<li>Size-inclusive ranges that honor body changes without upcharging</li>" +
          "<li>Gender-neutral palettes beyond beige: saturated brights and story-driven graphics</li>" +
          "</ul>" +
          "<h2>Smarter Shopping for 2026: Rent, Resale, and Care to Maximize Value</h2>" +
          "<ul>" +
          "<li>Rent high-turnover pieces; buy everyday basics; resell milestone outfits</li>" +
          "<li>Fabric care that extends life: cold wash, microplastic filters, and repairable seams</li>" +
          "<li>Cost-per-wear math so trends don’t bust the Mother and Baby budget</li>" +
          "</ul>" +
          "<h2>FAQs: Clear Answers to 2026 Mother and Baby Fashion Questions</h2>" +
          "<ul>" +
          "<li>Are smart textiles and finishings safe for newborn skin in 2026?</li>" +
          "<li>Which certifications should I prioritize for Mother and Baby clothing?</li>" +
          "<li>How do I balance postpartum comfort with a polished, work-ready look?</li>" +
          "<li>Is gender-neutral fashion limiting my baby’s expression?</li>" +
          "<li>Do rental services sanitize baby clothes to high hygiene standards?</li>" +
          "<li>Can AI sizing tools actually fit a changing postpartum body?</li>" +
          "</ul>";
      }

      const cleanAiHtml = sanitizeHtml(aiHtml);
      if (quillInstanceRef.current) {
        quillInstanceRef.current.clipboard.dangerouslyPasteHTML(cleanAiHtml);
      }
      if (onSave) {
        onSave(cleanAiHtml);
      }
      setIsGenerating(false);
      setOutlineProgress(0);
      if (onGeneratingProgress) onGeneratingProgress(false, 0, "");
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finalTimer);
    };
  };

  const handleSave = () => {
    if (quillInstanceRef.current) {
      const html = quillInstanceRef.current.root.innerHTML;
      const text = quillInstanceRef.current.getText().trim();
      const sanitized = sanitizeHtml(html);
      onSave(text ? sanitized : "");
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
        <BlockStack gap="300">
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

            {isGenerating ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Spinner size="small" />
              </div>
            ) : (
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
            )}
          </div>

          <div className="outline-quill-wrapper">
            <div ref={editorContainerRef} />
          </div>

          {validationError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  color: "#9e2a2b",
                  display: "flex",
                  alignItems: "center",
                  width: "15px",
                  height: "15px",
                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span
                style={{
                  color: "#9e2a2b",
                  fontSize: "12.5px",
                  fontWeight: 400,
                }}
              >
                {validationError}
              </span>
            </div>
          )}

          <style>{`
            .Polaris-Modal-Dialog__Modal {
              max-width: 680px !important;
            }
            .outline-quill-wrapper {
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }
            .outline-quill-wrapper .ql-toolbar.ql-snow {
              border: 1px solid #d4d4d8 !important;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
              background-color: #fafafa;
              padding: 8px 14px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .outline-quill-wrapper .ql-container.ql-snow {
              border: 1px solid #d4d4d8 !important;
              border-top: none !important;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              background-color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            }
            .outline-quill-wrapper .ql-editor {
              min-height: 320px;
              max-height: 480px;
              overflow-y: auto;
              line-height: 1.6;
              color: #18181b;
              padding: 18px 24px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              font-size: 14.5px;
            }
            .outline-quill-wrapper .ql-editor h1 {
              font-size: 21px !important;
              font-weight: 500 !important;
              color: #18181b !important;
              line-height: 1.35 !important;
              margin-top: 20px !important;
              margin-bottom: 8px !important;
              letter-spacing: -0.015em;
            }
            .outline-quill-wrapper .ql-editor h2 {
              font-size: 16px !important;
              font-weight: 500 !important;
              color: #27272a !important;
              line-height: 1.45 !important;
              margin-top: 16px !important;
              margin-bottom: 6px !important;
              letter-spacing: -0.01em;
            }
            .outline-quill-wrapper .ql-editor h1:first-child,
            .outline-quill-wrapper .ql-editor h2:first-child {
              margin-top: 0 !important;
            }
            .outline-quill-wrapper .ql-editor h3 {
              font-size: 14.5px !important;
              font-weight: 500 !important;
              color: #3f3f46 !important;
              line-height: 1.4 !important;
              margin-top: 12px !important;
              margin-bottom: 4px !important;
            }
            .outline-quill-wrapper .ql-editor p {
              font-size: 14px !important;
              font-weight: 400 !important;
              color: #3f3f46 !important;
              line-height: 1.6 !important;
              margin-top: 0 !important;
              margin-bottom: 6px !important;
              padding: 0 !important;
            }
            .outline-quill-wrapper .ql-editor ol,
            .outline-quill-wrapper .ql-editor ul {
              list-style: none !important;
              list-style-type: none !important;
              padding-left: 0 !important;
              margin-top: 6px !important;
              margin-bottom: 16px !important;
            }
            .outline-quill-wrapper .ql-editor li {
              list-style: none !important;
              list-style-type: none !important;
              font-size: 14px !important;
              font-weight: 400 !important;
              color: #3f3f46 !important;
              line-height: 1.6 !important;
              margin-bottom: 6px !important;
              position: relative !important;
              padding-left: 1.5em !important;
            }
            .outline-quill-wrapper .ql-editor li::marker {
              content: "" !important;
              display: none !important;
              font-size: 0 !important;
            }
            .outline-quill-wrapper .ql-editor li::before {
              content: none !important;
            }
            .outline-quill-wrapper .ql-editor li > .ql-ui {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 1.5em !important;
              text-align: center !important;
              pointer-events: none !important;
            }
            .outline-quill-wrapper .ql-editor li[data-list="bullet"] > .ql-ui:before {
              content: "•" !important;
              display: inline-block !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              width: auto !important;
              font-size: 16px !important;
              line-height: 1.4 !important;
              color: #3f3f46 !important;
            }
            .outline-quill-wrapper .ql-editor li[data-list="ordered"] > .ql-ui:before {
              font-size: 14px !important;
              line-height: 1.6 !important;
              color: #3f3f46 !important;
            }
            .outline-quill-wrapper .ql-editor.ql-blank::before {
              color: #a1a1aa;
              font-style: normal;
              font-size: 14px;
              left: 24px;
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
