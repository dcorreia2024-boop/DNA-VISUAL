import SECTIONS from '../data/sections';

export function simAnalysis(content) {
  const lower = content.toLowerCase();
  const results = {};

  SECTIONS.forEach((sec) => {
    const sectionResults = {};
    sec.fields.forEach((f) => {
      const keywords = f.label
        .toLowerCase()
        .replace(/[^\w\s\u00C0-\u024F]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
        .slice(0, 5);

      let found = '';
      keywords.forEach((kw) => {
        if (lower.includes(kw) && !found) {
          const idx = lower.indexOf(kw);
          found = content.substring(Math.max(0, idx - 20), Math.min(content.length, idx + kw.length + 150)).trim();
        }
      });
      sectionResults[f.key] = found;
    });
    results[sec.id] = sectionResults;
  });

  return results;
}
