const STORAGE_KEY = "blog_genius_saved_keywords";

const DEFAULT_SAVED_KEYWORDS = [
  "Vietnamese gifts",
  "Mother and baby care",
  "organic baby clothes online",
  "postpartum essentials for moms",
  "safe baby skincare products",
  "maternity fashion trends 2026",
];

export function getSavedKeywords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return DEFAULT_SAVED_KEYWORDS;
}

export function saveKeywordsList(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("saved_keywords_updated", { detail: list }));
  } catch (e) {}
}

export function addSavedKeyword(keyword) {
  const trimmed = (keyword || "").trim();
  if (!trimmed) return getSavedKeywords();
  const current = getSavedKeywords();
  if (!current.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
    const next = [...current, trimmed];
    saveKeywordsList(next);
    return next;
  }
  return current;
}

export function addSavedKeywords(keywordsArray) {
  const current = getSavedKeywords();
  const next = [...current];
  keywordsArray.forEach((kw) => {
    const trimmed = (kw || "").trim();
    if (trimmed && !next.some((k) => k.toLowerCase() === trimmed.toLowerCase())) {
      next.push(trimmed);
    }
  });
  saveKeywordsList(next);
  return next;
}

export function removeSavedKeyword(keyword) {
  const current = getSavedKeywords();
  const next = current.filter((k) => k.toLowerCase() !== keyword.toLowerCase());
  saveKeywordsList(next);
  return next;
}

export function isKeywordSaved(keyword) {
  const current = getSavedKeywords();
  return current.some((k) => k.toLowerCase() === (keyword || "").trim().toLowerCase());
}
