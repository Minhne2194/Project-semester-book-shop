// scripts/exportData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Book = require('../models/BookModel');

// Cấu hình đường dẫn .env
const rootEnvPath = path.resolve(__dirname, '../../.env');
const serverEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) dotenv.config({ path: rootEnvPath });
else if (fs.existsSync(serverEnvPath)) dotenv.config({ path: serverEnvPath });

const exportData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Đã kết nối MongoDB...');

        // Lấy tất cả sách, bỏ qua trường _id và __v để file sạch sẽ (hoặc giữ lại nếu muốn giữ ID cũ)
        const books = await Book.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });

        if (books.length === 0) {
            console.log('⚠️ Database trống, không có gì để xuất!');
            process.exit();
        }

        // Tạo thư mục data nếu chưa có
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // Ghi ra file JSON
        const filePath = path.join(dataDir, 'books.json');
        fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

        console.log(`✅ Đã xuất thành công ${books.length} cuốn sách ra file: data/books.json`);

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

exportData();