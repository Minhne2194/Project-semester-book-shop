/**
 * Import DIVERSE books from Open Library -> Translate -> MongoDB
 * Logic: Chọn ngẫu nhiên 5 chủ đề -> Mỗi chủ đề lấy 20 cuốn -> Tổng 100 cuốn.
 * Usage: node scripts/importDiverseBooks.js
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const translate = require('@iamtraction/google-translate');

// --- 1. CONFIG ---
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) dotenv.config({ path: rootEnvPath });
else if (fs.existsSync(serverEnvPath)) dotenv.config({ path: serverEnvPath });

const Book = require('../models/BookModel');
const { mapCategory } = require('../utils/categoryMap');

// --- 2. CLOUDINARY ---
let cloudinary = null;
if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)) {
  const cld = require('cloudinary').v2;
  cld.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  cloudinary = cld;
}

// --- 3. DANH SÁCH CHỦ ĐỀ ---
const ALL_SUBJECTS = [
    'science_fiction', 'romance', 'mystery', 'horror', 'historical_fiction', 
    'fantasy', 'thriller', 'biography', 'history', 'cooking', 
    'art', 'music', 'business', 'psychology', 'programming', 
    'finance', 'health', 'travel', 'science', 'chemistry'
];

// Hàm chọn ngẫu nhiên N phần tử từ mảng
function getRandomSubjects(arr, n) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const translationCache = new Map();

// --- 4. HÀM DỊCH THUẬT ---
async function toVietnamese(text) {
    if (!text) return '';
    if (translationCache.has(text)) return translationCache.get(text);
    try {
        const res = await translate(text, { to: 'vi' });
        translationCache.set(text, res.text);
        return res.text;
    } catch (err) {
        return text;
    }
}

// --- 5. HÀM FETCH CHO 1 CHỦ ĐỀ ---
async function fetchBooksBySubject(subject) {
  const results = [];
  let page = Math.floor(Math.random() * 10) + 1; // Random page đầu để không trùng
  const LIMIT_PER_SUBJECT = 20;

  console.log(`\n📡 Đang tìm chủ đề: "${subject}" (Page: ${page})...`);

  while (results.length < LIMIT_PER_SUBJECT) {
    try {
      const { data } = await axios.get(`https://openlibrary.org/search.json`, {
        params: {
          q: subject,
          page: page,
          limit: 20, 
          fields: 'title,author_name,cover_i,isbn,first_sentence,subject,ratings_average,ratings_count,key'
        }
      });

      if (!data.docs || data.docs.length === 0) break;

      const validBooks = data.docs.filter(doc => doc.cover_i);
      
      for (const doc of validBooks) {
          if (results.length < LIMIT_PER_SUBJECT) {
              // Kiểm tra xem sách này đã có trong DB chưa (tránh trùng lặp toàn cục)
              // Tuy nhiên ở đây chỉ check trong mẻ hiện tại cho nhanh
              if (!results.some(r => r.key === doc.key)) {
                  results.push(doc);
              }
          }
      }
      page++;
      await sleep(500);
    } catch (error) {
      console.error(`❌ Lỗi chủ đề ${subject}:`, error.message);
      break;
    }
  }
  return results;
}

// --- 6. HÀM UPLOAD ---
async function uploadImage(url) {
  if (!cloudinary || !url) return url;
  try {
    return (await cloudinary.uploader.upload(url, {
      folder: 'bookshop_covers',
      fetch_format: 'auto',
      quality: 'auto',
      transformation: [{ width: 400, crop: 'scale' }]
    })).secure_url;
  } catch (err) { return url; }
}

const randomPrice = () => Math.floor(Math.random() * (300 - 50) + 50) * 1000;

// --- 7. XỬ LÝ SÁCH ---
async function processSingleBook(doc, subjectContext) {
  const originalImageUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  const imageUrl = await uploadImage(originalImageUrl);

  const rawSubject = doc.subject && doc.subject.length > 0 ? doc.subject[0] : subjectContext;
  const rawDesc = doc.first_sentence 
    ? (Array.isArray(doc.first_sentence) ? doc.first_sentence[0] : doc.first_sentence) 
    : `A book about ${subjectContext}.`;

  // Dịch
  const [vnTitle, vnDesc, vnCategory] = await Promise.all([
      toVietnamese(doc.title),
      toVietnamese(rawDesc),
      toVietnamese(rawSubject)
  ]);

  return {
    title: vnTitle || doc.title,
    author: doc.author_name ? doc.author_name[0] : 'Unknown',
    description: vnDesc || rawDesc,
    category: mapCategory(vnCategory),
    price: randomPrice(), 
    image: imageUrl,
    rating: doc.ratings_average ? doc.ratings_average.toFixed(1) : (Math.random() * 2 + 3).toFixed(1),
    numReviews: doc.ratings_count || Math.floor(Math.random() * 50),
    countInStock: Math.floor(Math.random() * 50) + 10,
    isbn: doc.isbn ? doc.isbn[0] : null
  };
}

// --- MAIN RUN ---
async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Chọn ngẫu nhiên 5 chủ đề
    const selectedSubjects = getRandomSubjects(ALL_SUBJECTS, 5);
    console.log('🎯 5 Chủ đề được chọn:', selectedSubjects.join(', '));

    let totalImported = 0;

    // Chạy vòng lặp qua từng chủ đề
    for (const subject of selectedSubjects) {
        // 1. Fetch
        const rawBooks = await fetchBooksBySubject(subject);
        if (rawBooks.length === 0) continue;

        console.log(`   -> Tìm thấy ${rawBooks.length} cuốn cho "${subject}". Đang xử lý & dịch...`);

        // 2. Process & Translate
        const processedBooks = [];
        const BATCH_SIZE = 3;
        for (let i = 0; i < rawBooks.length; i += BATCH_SIZE) {
            const batch = rawBooks.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(b => processSingleBook(b, subject)));
            processedBooks.push(...results);
            process.stdout.write('.');
            await sleep(300); // Nghỉ tránh google ban
        }
        
        // 3. Save to DB
        try {
            await Book.insertMany(processedBooks, { ordered: false });
            console.log(`\n   ✅ Đã lưu xong ${processedBooks.length} cuốn chủ đề "${subject}"!`);
            totalImported += processedBooks.length;
        } catch (e) {
            console.log(`\n   ⚠️ Một số sách bị trùng.`);
        }
    }

    console.log(`\n🎉 TỔNG KẾT: Đã thêm thành công ${totalImported} cuốn sách đa dạng!`);

  } catch (error) {
    console.error('\n❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();