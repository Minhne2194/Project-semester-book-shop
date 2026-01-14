const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const books = require('./data/books');
const User = require('./models/UserModel');
const Book = require('./models/BookModel');
const Order = require('./models/OrderModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // Xóa sạch dữ liệu cũ trước khi nhập mới
        await connectDB();
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        // Nhập User
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id; // Lấy ID của ông Admin

        // Gán Admin là người tạo sách (nếu cần thiết kế chặt chẽ)
        // const sampleBooks = books.map(book => {
        //     return { ...book, user: adminUser }
        // });
        
        // Nhập Sách
        await Book.insertMany(books);

        console.log('Data Imported Success!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Kiểm tra tham số dòng lệnh
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}