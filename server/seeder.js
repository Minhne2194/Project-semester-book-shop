const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// --- 1. CẤU HÌNH LOAD FILE .ENV (SỬA LẠI ĐỂ TÌM Ở ROOT) ---

// Đường dẫn ra thư mục cha (Root của dự án)
const rootEnvPath = path.resolve(__dirname, '../.env');
// Đường dẫn tại thư mục hiện tại (Server) - để dự phòng
const serverEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
    // Trường hợp 1: Tìm thấy ở Root (Đúng ý bạn)
    dotenv.config({ path: rootEnvPath });
    console.log(`✅ Đã load cấu hình từ Root Project: ${rootEnvPath}`);
} else if (fs.existsSync(serverEnvPath)) {
    // Trường hợp 2: Tìm thấy ở Server (Dự phòng)
    dotenv.config({ path: serverEnvPath });
    console.log(`✅ Đã load cấu hình từ Server folder: ${serverEnvPath}`);
} else {
    // Trường hợp 3: Không thấy đâu cả
    console.error('❌ LỖI: Không tìm thấy file .env ở cả Root lẫn Server!');
    console.error(`👉 Đã tìm tại: ${rootEnvPath}`);
    console.error(`👉 Và tại: ${serverEnvPath}`);
    process.exit(1);
}

// Kiểm tra biến MONGO_URI
if (!process.env.MONGO_URI) {
    console.error('❌ LỖI: Đã tìm thấy file .env nhưng không đọc được MONGO_URI.');
    console.error('👉 Kiểm tra lại file .env xem đã lưu chưa (Ctrl+S).');
    process.exit(1);
}

// --- 2. IMPORT MODELS VÀ DATA ---
const User = require('./models/UserModel');
const Book = require('./models/BookModel');
const Order = require('./models/OrderModel');
const connectDB = require('./config/db');

const users = require('./data/users');
const defaultBooks = require('./data/books'); 

// --- 3. HÀM IMPORT DỮ LIỆU ---
const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected...');

        // Xóa sạch dữ liệu cũ
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        // 1. Tạo Users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        // 2. Xác định nguồn sách
        let booksToImport = defaultBooks;
        
        // Kiểm tra cờ -json (Backup file)
        if (process.argv[2] === '-json') {
            // File backup nằm trong server/data/books.json
            const jsonPath = path.join(__dirname, 'data/books.json');
            
            if (fs.existsSync(jsonPath)) {
                const jsonData = fs.readFileSync(jsonPath, 'utf-8');
                booksToImport = JSON.parse(jsonData);
                console.log(`📂 Đang nạp ${booksToImport.length} cuốn từ file Backup (books.json)...`);
            } else {
                console.log('⚠️ Không tìm thấy file books.json. Đang dùng dữ liệu mặc định.');
            }
        } else {
            console.log('📂 Đang nạp dữ liệu mặc định (books.js)...');
        }

        // 3. Import Sách
        await Book.insertMany(booksToImport);

        console.log(`✅ THÀNH CÔNG! Đã nạp ${booksToImport.length} cuốn sách vào Database.`);
        process.exit();
    } catch (error) {
        console.error(`❌ Error Import: ${error.message}`);
        process.exit(1);
    }
};

// --- 4. HÀM XÓA DỮ LIỆU ---
const destroyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        console.log('🔥 Đã xóa sạch dữ liệu!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error Destroy: ${error.message}`);
        process.exit(1);
    }
};

// --- 5. CHẠY SCRIPT ---
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}