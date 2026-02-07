// Define normalized categories and mapping keywords
const NORMALIZED_CATEGORIES = [
  'Văn Học',
  'Công Nghệ',
  'Kinh Tế',
  'Kỹ Năng Sống',
  'Tâm Lý - Tâm Linh',
  'Thiếu Nhi',
  'Khoa Học',
  'Đời Sống',
];

// Keywords to detect
const KEYWORDS = [
  { target: 'Công Nghệ', includes: ['technology', 'program', 'computer', 'it', 'software', 'network'] },
  { target: 'Kinh Tế', includes: ['business', 'finance', 'econom', 'management', 'marketing'] },
  { target: 'Kỹ Năng Sống', includes: ['self-help', 'self help', 'personal development', 'skill', 'communication'] },
  { target: 'Tâm Lý - Tâm Linh', includes: ['psychology', 'spiritual', 'mind', 'meditation'] },
  { target: 'Văn Học', includes: ['fiction', 'literature', 'novel', 'poetry', 'romance', 'thriller'] },
  { target: 'Thiếu Nhi', includes: ['children', 'kids', 'young adult', 'juvenile'] },
  { target: 'Khoa Học', includes: ['science', 'physics', 'chemistry', 'biology', 'math'] },
  { target: 'Đời Sống', includes: ['cooking', 'health', 'travel', 'lifestyle', 'home'] },
];

/**
 * Map raw category string to normalized categories.
 * @param {string} raw
 * @returns {string}
 */
function mapCategory(raw = '') {
  const lower = raw.toLowerCase();
  for (const rule of KEYWORDS) {
    if (rule.includes.some((kw) => lower.includes(kw))) {
      return rule.target;
    }
  }
  return 'Văn Học'; // fallback
}

module.exports = { mapCategory, NORMALIZED_CATEGORIES };
