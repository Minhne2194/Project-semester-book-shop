/**
 * Import books from Open Library -> Translate to Vietnamese -> MongoDB
 * Usage: 
 * - Mặc định: node scripts/importOpenLibrary.js --limit=20
 * - Ngẫu nhiên: node scripts/importOpenLibrary.js --random --limit=20
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
// [MỚI] Thư viện dịch thuật
const translate = require('@iamtraction/google-translate');

// --- 1. CONFIG ---
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(rootEnvPath)) dotenv.config({ path: rootEnvPath });
else if (fs.existsSync(serverEnvPath)) dotenv.config({ path: serverEnvPath });

if (!process.env.MONGO_URI) {
  console.error('❌ LỖI: Không tìm thấy MONGO_URI.');
  process.exit(1);
}

const Book = require('../models/BookModel');
const { mapCategory } = require('../utils/categoryMap');

// --- 2. CLOUDINARY ---
let cloudinary = null;
const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

if (hasCloudinaryUrl || hasCloudinaryKeys) {
  const cld = require('cloudinary').v2;
  if (hasCloudinaryUrl) cld.config({ secure: true });
  else cld.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  cloudinary = cld;
  console.log('✅ Cloudinary đã sẵn sàng.');
}

// --- 3. XỬ LÝ THAM SỐ ---
const args = process.argv.slice(2).reduce((acc, cur) => {
  if (cur.startsWith('--')) {
    const [key, val] = cur.replace(/^--/, '').split('=');
    acc[key] = val || true;
  }
  return acc;
}, {});

const RANDOM_SUBJECTS = [
  'science_fiction', 'romance', 'mystery', 'horror', 'historical_fiction',
  'fantasy', 'thriller', 'biography', 'history', 'cooking',
  'art', 'music', 'business', 'psychology', 'programming', 'finance'
];

const IS_RANDOM = !!args.random;
const LIMIT = Number(args.limit || 20);
const SHOULD_CLEAR = !!args.clear;

let QUERY = args.q;
let START_PAGE = 1;

if (IS_RANDOM) {
  if (!QUERY) {
    QUERY = RANDOM_SUBJECTS[Math.floor(Math.random() * RANDOM_SUBJECTS.length)];
  }
  START_PAGE = Math.floor(Math.random() * 50) + 1;
} else {
  QUERY = QUERY || 'programming';
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// --- 4. HÀM DỊCH THUẬT (AUTO TRANSLATE) ---
async function toVietnamese(text) {
  if (!text) return '';
  try {
    // Dịch sang tiếng Việt ('vi')
    const res = await translate(text, { to: 'vi' });
    return res.text;
  } catch (err) {
    // Nếu lỗi dịch (do mạng hoặc quá tải), trả về text gốc tiếng Anh
    return text;
  }
}

// --- 5. HÀM FETCH ---
async function fetchFromOpenLibrary() {
  const results = [];
  let page = START_PAGE;

  console.log(`📡 OpenLibrary: Tìm "${QUERY}" (Page: ${page})...`);

  while (results.length < LIMIT) {
    try {
      const url = `https://openlibrary.org/search.json`;
      const { data } = await axios.get(url, {
        params: {
          q: QUERY,
          page: page,
          limit: 20,
          fields: 'title,author_name,cover_i,isbn,first_sentence,subject,ratings_average,ratings_count,key'
        }
      });

      if (!data.docs || data.docs.length === 0) {
        console.log('⚠️ Hết kết quả từ Open Library.');
        break;
      }

      const validBooks = data.docs.filter(doc => doc.cover_i);

      for (const doc of validBooks) {
        if (results.length < LIMIT) {
          if (!results.some(r => r.key === doc.key)) {
            results.push(doc);
          }
        }
      }

      process.stdout.write(`   -> Đã lấy ${results.length}/${LIMIT} cuốn...\r`);
      page++;
      await sleep(1000);

    } catch (error) {
      console.error('\n❌ Lỗi Fetch:', error.message);
      break;
    }
  }
  console.log('');
  return results;
}

// --- 6. HÀM UPLOAD ẢNH ---
async function uploadImage(url) {
  if (!cloudinary || !url) return url;
  try {
    const res = await cloudinary.uploader.upload(url, {
      folder: 'bookshop_covers',
      overwrite: false,
      fetch_format: 'auto',
      quality: 'auto',
      transformation: [{ width: 400, crop: 'scale' }]
    });
    return res.secure_url;
  } catch (err) {
    return url;
  }
}

const randomPrice = () => Math.floor(Math.random() * (300 - 50) + 50) * 1000;

// --- 7. XỬ LÝ & DỊCH & LƯU DB ---
async function processSingleBook(doc) {
  // 1. Xử lý ảnh
  const originalImageUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  const imageUrl = await uploadImage(originalImageUrl);

  // 2. Chuẩn bị dữ liệu thô (Tiếng Anh)
  const rawSubject = doc.subject && doc.subject.length > 0 ? doc.subject[0] : 'General';
  const rawDesc = doc.first_sentence
    ? (Array.isArray(doc.first_sentence) ? doc.first_sentence[0] : doc.first_sentence)
    : `A book about ${QUERY}.`;
  const rawTitle = doc.title;

  // 3. [QUAN TRỌNG] Dịch sang Tiếng Việt
  // Dịch song song để tiết kiệm thời gian
  const [vnTitle, vnDesc, vnCategory] = await Promise.all([
    toVietnamese(rawTitle),
    toVietnamese(rawDesc),
    toVietnamese(rawSubject)
  ]);

  return {
    title: vnTitle || rawTitle,          // Ưu tiên tiếng Việt, lỗi thì dùng tiếng Anh
    author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
    description: vnDesc || rawDesc,      // Mô tả tiếng Việt
    category: mapCategory(vnCategory),   // Category tiếng Việt
    price: randomPrice(),
    image: imageUrl,
    rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : (Math.random() * 2 + 3).toFixed(1),
    numReviews: doc.ratings_count || Math.floor(Math.random() * 50),
    countInStock: Math.floor(Math.random() * 50) + 10,
    isbn: doc.isbn ? doc.isbn[0] : null
  };
}

const translationCache = new Map();

// --- 4. HÀM DỊCH THUẬT (AUTO TRANSLATE) ---
async function toVietnamese(text) {
  if (!text) return '';

  // 1. Kiểm tra xem đã dịch từ này chưa?
  if (translationCache.has(text)) {
    return translationCache.get(text); // Trả về ngay lập tức, không gọi Google
  }

  try {
    // 2. Nếu chưa, gọi Google Translate
    const res = await translate(text, { to: 'vi' });
    const translatedText = res.text;

    // 3. Lưu vào bộ nhớ đệm để dùng lần sau
    translationCache.set(text, translatedText);

    return translatedText;
  } catch (err) {
    return text;
  }
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    if (SHOULD_CLEAR) {
      await Book.deleteMany({});
      console.log('🧹 Đã xóa sách cũ.');
    }

    const rawBooks = await fetchFromOpenLibrary();
    if (rawBooks.length === 0) return process.exit(0);

    console.log('🔄 Đang xử lý ảnh và DỊCH sang Tiếng Việt...');

    const processedBooks = [];
    // Giảm Batch size xuống 3 để tránh Google Translate chặn vì spam request
    const BATCH_SIZE = 3;

    for (let i = 0; i < rawBooks.length; i += BATCH_SIZE) {
      const batch = rawBooks.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(processSingleBook));
      processedBooks.push(...results);

      process.stdout.write('.');
      // Nghỉ 1 chút sau mỗi batch để Google không chặn IP
      await sleep(500);
    }

    await Book.insertMany(processedBooks, { ordered: false });
    console.log(`\n🎉 THÀNH CÔNG: Đã thêm ${processedBooks.length} sách (Tiếng Việt)!`);

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();