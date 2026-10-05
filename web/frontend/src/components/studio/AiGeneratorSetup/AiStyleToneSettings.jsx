import { Select } from "@shopify/polaris";
import { FieldNoteTooltip } from "./FieldNoteTooltip";

export const WRITING_STYLES = [
  { label: "Default", value: "Default", note: "Standard natural editorial writing style." },
  { label: "Academic", value: "Academic", note: "Formal tone, structured arguments, and objective references." },
  { label: "Analytical", value: "Analytical", note: "Logical breakdown of data, facts, and systematic points." },
  { label: "Argumentative", value: "Argumentative", note: "Persuasive positions addressing opposing views." },
  { label: "Conversational", value: "Conversational", note: "Approachable and friendly, like chatting with a peer." },
  { label: "Creative", value: "Creative", note: "Engaging, imaginative storytelling and vivid expressions." },
  { label: "Critical", value: "Critical", note: "In-depth evaluation assessing strengths and weaknesses." },
  { label: "Descriptive", value: "Descriptive", note: "Sensory, detailed depictions of features and scenarios." },
  { label: "Epigrammatic", value: "Epigrammatic", note: "Concise, witty, memorable and punchy sentences." },
  { label: "Epistolary", value: "Epistolary", note: "Written in the form of letters or direct correspondence for future generations!" },
  { label: "Expository", value: "Expository", note: "Clear educational explanation of concepts without bias." },
  { label: "Informative", value: "Informative", note: "Rich in practical details, facts, and actionable insights." },
  { label: "Instructive", value: "Instructive", note: "Step-by-step guidance designed for tutorials and how-tos." },
  { label: "Journalistic", value: "Journalistic", note: "News-style reporting covering who, what, when, and why." },
  { label: "Metaphorical", value: "Metaphorical", note: "Rich analogies and figurative comparisons." },
  { label: "Narrative", value: "Narrative", note: "Story-driven progression with introduction, climax, and takeaway." },
  { label: "Persuasive", value: "Persuasive", note: "Compelling call-to-actions tailored to drive conversions." },
  { label: "Poetic", value: "Poetic", note: "Rhythmic and expressive language creating strong moods." },
  { label: "Satirical", value: "Satirical", note: "Clever humor and irony highlighting industry conventions." },
  { label: "Technical", value: "Technical", note: "Specialized terminology for developers and domain experts." },
];

export const VOICE_TONES = [
  { label: "Default", value: "Default", note: "Balanced, natural brand voice." },
  { label: "Authoritative", value: "Authoritative", note: "Confident, thought-leader perspective demonstrating mastery." },
  { label: "Caring", value: "Caring", note: "Empathetic, supportive, and customer-first focus." },
  { label: "Casual", value: "Casual", note: "Relaxed, informal, and everyday language." },
  { label: "Cheerful", value: "Cheerful", note: "Positive, upbeat, and motivating tone." },
  { label: "Coarse", value: "Coarse", note: "Raw, unvarnished, and gritty directness." },
  { label: "Conservative", value: "Conservative", note: "Prudent, formal perspective preserving traditional brand credibility." },
  { label: "Conversational", value: "Conversational", note: "Dialogue-driven, relatable, and authentic." },
  { label: "Creative", value: "Creative", note: "Inspiring, out-of-the-box phrasing." },
  { label: "Dry", value: "Dry", note: "Understated, straightforward, and no-fluff delivery." },
  { label: "Edgy", value: "Edgy", note: "Bold, provocative, and trend-setting." },
  { label: "Enthusiastic", value: "Enthusiastic", note: "High energy, passionate, and vibrant." },
  { label: "Expository", value: "Expository", note: "Educational and illustrative." },
  { label: "Formal", value: "Formal", note: "Professional, polite, and strictly corporate." },
  { label: "Frank", value: "Frank", note: "Candid, transparent, and straight to the point." },
  { label: "Friendly", value: "Friendly", note: "Warm, welcoming, and inviting tone." },
  { label: "Fun", value: "Fun", note: "Lighthearted, playful, and entertaining." },
  { label: "Funny", value: "Funny", note: "Humorous with tasteful jokes and witty remarks." },
  { label: "Humorous", value: "Humorous", note: "Charming comedy and clever entertainment." },
  { label: "Informative", value: "Informative", note: "Data-focused and fact-oriented." },
];

export const COMPLEXITIES = [
  { label: "Default", value: "Default", note: "Standard balanced readability (grade 8-10 level)." },
  { label: "Simple", value: "Simple", note: "Clear, short sentences accessible to broad consumer audiences (grade 6 level)." },
  { label: "Complex", value: "Complex", note: "Sophisticated vocabulary and deep technical explanations for specialists." },
];

export const LANGUAGES = [
  { label: "English(US)", value: "English(US)", note: "US English spelling and regional phrasing conventions." },
  { label: "English(UK)", value: "English(UK)", note: "British English spelling and terminology." },
  { label: "Vietnamese (Tiếng Việt)", value: "Vietnamese", note: "Tiếng Việt chuẩn văn phong chuyên nghiệp." },
  { label: "French (Français)", value: "French", note: "French language tailored for European & Canadian markets." },
  { label: "German (Deutsch)", value: "German", note: "German language for DACH region readers." },
  { label: "Spanish (Español)", value: "Spanish", note: "Spanish language with global clarity." },
];

export function AiStyleToneSettings({
  language,
  onLanguageChange,
  writingStyle,
  onWritingStyleChange,
  voiceTone,
  onVoiceToneChange,
  complexity,
  onComplexityChange,
}) {
  const currentLangNote = LANGUAGES.find((l) => l.value === language)?.note;
  const currentStyleNote = WRITING_STYLES.find((s) => s.value === writingStyle)?.note;
  const currentToneNote = VOICE_TONES.find((t) => t.value === voiceTone)?.note;
  const currentComplexityNote = COMPLEXITIES.find((c) => c.value === complexity)?.note;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        width: "100%",
      }}
    >
      {/* Language */}
      <FieldNoteTooltip text={currentLangNote}>
        <Select
          label="Language"
          options={LANGUAGES.map((l) => ({ label: l.label, value: l.value }))}
          value={language}
          onChange={onLanguageChange}
        />
      </FieldNoteTooltip>

      {/* Writing style */}
      <FieldNoteTooltip text={currentStyleNote}>
        <Select
          label="Writing style"
          options={WRITING_STYLES.map((s) => ({ label: s.label, value: s.value }))}
          value={writingStyle}
          onChange={onWritingStyleChange}
        />
      </FieldNoteTooltip>

      {/* Voice tone */}
      <FieldNoteTooltip text={currentToneNote}>
        <Select
          label="Voice tone"
          options={VOICE_TONES.map((t) => ({ label: t.label, value: t.value }))}
          value={voiceTone}
          onChange={onVoiceToneChange}
        />
      </FieldNoteTooltip>

      {/* Complexity */}
      <FieldNoteTooltip text={currentComplexityNote}>
        <Select
          label="Complexity"
          options={COMPLEXITIES.map((c) => ({ label: c.label, value: c.value }))}
          value={complexity}
          onChange={onComplexityChange}
        />
      </FieldNoteTooltip>
    </div>
  );
}

export default AiStyleToneSettings;
