const mongoose = require('mongoose');
const dotenv = require('dotenv');
// Import các models và data
const users = require('./data/users');
const books = require('./data/books');
const User = require('./models/UserModel');
const Book = require('./models/BookModel');
const Order = require('./models/OrderModel');
const connectDB = require('./config/db');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();
        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        await Book.insertMany(books);

        console.log('✅ Data Imported Success to BookShopDB!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB(); // Kết nối database

        await Order.deleteMany();
        await Book.deleteMany();
        await User.deleteMany();

        console.log('🔥 Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}