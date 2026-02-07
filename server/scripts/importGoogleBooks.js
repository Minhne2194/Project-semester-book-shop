/**
 * Import books from Google Books -> MongoDB
 * Usage: node scripts/importGoogleBooks.js --q="văn học" --limit=50 --clear
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// --- 1. CẤU HÌNH LOAD FILE .ENV ---
// Do file script nằm ở server/scripts/, nên phải lùi 2 cấp (../../) mới ra được Root
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');

// Ưu tiên tìm ở Root trước, nếu không thấy thì tìm ở Server
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
  console.log(`✅ Đã load cấu hình từ Root: ${rootEnvPath}`);
} else if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
  console.log(`✅ Đã load cấu hình từ Server: ${serverEnvPath}`);
} else {
  console.error('❌ LỖI: Không tìm thấy file .env ở cả Root lẫn Server!');
  process.exit(1);
}

// Kiểm tra biến MONGO_URI ngay lập tức
if (!process.env.MONGO_URI) {
  console.error('❌ LỖI: Đã tìm thấy file .env nhưng không đọc được MONGO_URI.');
  console.error('👉 Kiểm tra lại file .env xem đã lưu chưa (Ctrl+S).');
  process.exit(1);
}

const Book = require('../models/BookModel');
const { mapCategory } = require('../utils/categoryMap');

// --- 2. CẤU HÌNH CLOUDINARY ---
let cloudinary = null;
const hasCloudinaryUrl = !!process.env.CLOUDINARY_URL;
const hasCloudinaryKeys = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

if (hasCloudinaryUrl || hasCloudinaryKeys) {
  const cld = require('cloudinary').v2;
  
  if (hasCloudinaryUrl) {
    // Cách 1: Dùng biến gộp URL
    cld.config({ secure: true });
  } else {
    // Cách 2: Dùng 3 biến rời (Cloud Name, Key, Secret)
    cld.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
  cloudinary = cld;
  console.log('✅ Cloudinary đã được cấu hình.');
} else {
  console.log('⚠️ Không tìm thấy cấu hình Cloudinary (Sẽ dùng ảnh gốc từ Google).');
}

// --- 3. XỬ LÝ THAM SỐ DÒNG LỆNH ---
const args = process.argv.slice(2).reduce((acc, cur) => {
  if (cur.startsWith('--')) {
    const [key, val] = cur.replace(/^--/, '').split('=');
    acc[key] = val || true;
  }
  return acc;
}, {});

const QUERY = args.q || 'văn học';
const LIMIT = Number(args.limit || 40);
const SHOULD_CLEAR = !!args.clear;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// --- CÁC HÀM XỬ LÝ ---

async function fetchBooksFromGoogle() {
  const results = [];
  let startIndex = 0;
  const maxPerPage = 40;

  console.log(`📡 Đang tìm kiếm: "${QUERY}" (Mục tiêu: ${LIMIT} sách)...`);

  while (results.length < LIMIT) {
    const remaining = LIMIT - results.length;
    const maxResults = Math.min(remaining, maxPerPage);

    try {
      const { data } = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: QUERY,
          startIndex,
          maxResults,
          langRestrict: 'vi',
          printType: 'books',
          key: GOOGLE_API_KEY,
        },
      });

      if (!data.items || data.items.length === 0) {
        console.log('⚠️ Không còn kết quả nào từ Google.');
        break;
      }

      results.push(...data.items);
      startIndex += data.items.length;
      // In tiến độ ghi đè dòng cũ (\r) để gọn terminal
      process.stdout.write(`   -> Đã tải ${results.length} cuốn...\r`);

      await sleep(1500);

    } catch (err) {
      if (err.response && err.response.status === 429) {
        console.warn('\n🛑 Bị Google chặn (429). Đang chờ 10 giây rồi thử lại...');
        await sleep(10000); 
        continue;
      } else {
        console.error('\n❌ Lỗi API:', err.message);
        break;
      }
    }
  }
  console.log('');
  return results.slice(0, LIMIT);
}

async function uploadImage(url) {
  if (!cloudinary || !url) return url;
  if (!url.startsWith('http')) return url;

  try {
    const res = await cloudinary.uploader.upload(url, {
      folder: 'bookshop_covers',
      overwrite: false,
      fetch_format: 'auto',
      quality: 'auto',
      transformation: [{ width: 400, crop: 'scale' }],
    });
    return res.secure_url;
  } catch (err) {
    return url; 
  }
}

const randomPrice = () => Math.floor(Math.random() * (300 - 50) + 50) * 1000;

async function processSingleBook(item) {
  const info = item.volumeInfo || {};
  const sale = item.saleInfo || {};

  let thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
  if (thumb && thumb.startsWith('http:')) thumb = thumb.replace('http:', 'https:');

  const imageUrl = thumb ? await uploadImage(thumb) : 'https://placehold.co/400x600?text=No+Cover';

  return {
    title: info.title || 'Sách không tiêu đề',
    author: (info.authors && info.authors[0]) || 'Nhiều tác giả',
    description: info.description ? info.description.substring(0, 1000) : 'Đang cập nhật mô tả...',
    category: mapCategory((info.categories && info.categories[0]) || 'Văn học'),
    price: sale.listPrice?.amount || randomPrice(),
    image: imageUrl,
    rating: info.averageRating || (Math.random() * 2 + 3).toFixed(1),
    numReviews: info.ratingsCount || Math.floor(Math.random() * 100),
    countInStock: Math.floor(Math.random() * 50) + 10,
  };
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ...${process.env.MONGO_URI.slice(-20)}`);

    if (SHOULD_CLEAR) {
      await Book.deleteMany({});
      console.log('🧹 Đã xóa toàn bộ sách cũ.');
    }

    const rawBooks = await fetchBooksFromGoogle();
    if (rawBooks.length === 0) return process.exit(0);

    console.log('🔄 Đang xử lý và upload ảnh (Batch size: 5)...');
    const processedBooks = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < rawBooks.length; i += BATCH_SIZE) {
      const batch = rawBooks.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(book => processSingleBook(book)));
      processedBooks.push(...results);
      process.stdout.write(`.`); 
    }
    
    await Book.insertMany(processedBooks);
    console.log(`\n🎉 THÀNH CÔNG: Đã import ${processedBooks.length} sách vào Database!`);

  } catch (error) {
    console.error('\n❌ Lỗi Import:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
