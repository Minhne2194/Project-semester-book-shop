// Define normalized categories
const NORMALIZED_CATEGORIES = [
  'Văn Học',
  'Công Nghệ',
  'Kinh Tế',
  'Kỹ Năng Sống',
  'Tâm Lý - Tâm Linh',
  'Thiếu Nhi',
  'Khoa Học',
  'Đời Sống',
  'Lịch Sử',      // Thêm mới cho phong phú
  'Nghệ Thuật'    // Thêm mới
];

// Keywords to detect (Cập nhật cả Tiếng Anh + Tiếng Việt)
const KEYWORDS = [
  { 
    target: 'Công Nghệ', 
    includes: ['technology', 'computer', 'software', 'programming', 'code', 'data', 'công nghệ', 'lập trình', 'máy tính', 'phần mềm', 'kỹ thuật'] 
  },
  { 
    target: 'Kinh Tế', 
    includes: ['business', 'finance', 'marketing', 'economics', 'startup', 'money', 'kinh tế', 'tài chính', 'kinh doanh', 'thương mại', 'tiền tệ', 'đầu tư'] 
  },
  { 
    target: 'Kỹ Năng Sống', 
    includes: ['self-help', 'skill', 'communication', 'leadership', 'kỹ năng', 'phát triển bản thân', 'giao tiếp', 'lãnh đạo', 'tư duy'] 
  },
  { 
    target: 'Tâm Lý - Tâm Linh', 
    includes: ['psychology', 'spiritual', 'mind', 'meditation', 'tâm lý', 'tâm linh', 'thiền', 'tôn giáo', 'tinh thần'] 
  },
  { 
    target: 'Thiếu Nhi', 
    includes: ['children', 'kids', 'fairy', 'comic', 'thiếu nhi', 'trẻ em', 'truyện tranh', 'cổ tích', 'nhỏ tuổi'] 
  },
  { 
    target: 'Khoa Học', 
    includes: ['science', 'physics', 'chemistry', 'biology', 'math', 'astronomy', 'khoa học', 'vật lý', 'hóa học', 'sinh học', 'toán', 'vũ trụ'] 
  },
  { 
    target: 'Đời Sống', 
    includes: ['cooking', 'health', 'travel', 'lifestyle', 'food', 'garden', 'nấu ăn', 'sức khỏe', 'du lịch', 'đời sống', 'ẩm thực', 'làm vườn'] 
  },
  { 
    target: 'Lịch Sử', 
    includes: ['history', 'war', 'ancient', 'biography', 'lịch sử', 'chiến tranh', 'cổ đại', 'tiểu sử', 'nhân vật'] 
  },
  { 
    target: 'Nghệ Thuật', 
    includes: ['art', 'music', 'cinema', 'design', 'photo', 'nghệ thuật', 'âm nhạc', 'điện ảnh', 'thiết kế', 'nhiếp ảnh'] 
  },
  { 
    // Văn học thường là loại rộng nhất, nên để check cuối cùng hoặc làm fallback
    target: 'Văn Học', 
    includes: ['fiction', 'novel', 'poetry', 'romance', 'thriller', 'literature', 'tiểu thuyết', 'truyện', 'thơ', 'văn học', 'lãng mạn', 'trinh thám'] 
  }
];

/**
 * Map raw category string to normalized categories.
 * @param {string} raw
 * @returns {string}
 */
function mapCategory(raw = '') {
  if (!raw) return 'Văn Học';
  
  const lower = raw.toLowerCase();
  
  // 1. Kiểm tra chính xác (Ưu tiên cao nhất)
  if (NORMALIZED_CATEGORIES.includes(raw)) {
      return raw;
  }

  // 2. Kiểm tra theo từ khóa
  for (const rule of KEYWORDS) {
    if (rule.includes.some((kw) => lower.includes(kw))) {
      return rule.target;
    }
  }

  // 3. Fallback mặc định
  return 'Văn Học'; 
}

module.exports = { mapCategory, NORMALIZED_CATEGORIES };