const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// --- 1. CONFIG ENV ---
const rootEnvPath = path.resolve(__dirname, '../.env');
const serverEnvPath = path.resolve(__dirname, '.env');

if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
    console.log(`✅ Loaded config from Root Project: ${rootEnvPath}`);
} else if (fs.existsSync(serverEnvPath)) {
    dotenv.config({ path: serverEnvPath });
    console.log(`✅ Loaded config from Server folder: ${serverEnvPath}`);
} else {
    console.error('❌ ERROR: .env not found!');
    process.exit(1);
}

// --- 2. IMPORT MODELS ---
const User = require('./models/UserModel');
const Book = require('./models/BookModel');
const Order = require('./models/OrderModel');

// --- 3. HELPER FUNCTIONS ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate random date within the last 12 months
const randomDateInPastYear = () => {
    const now = new Date();
    const pastYear = new Date();
    pastYear.setFullYear(now.getFullYear() - 1);
    
    // Bias towards more recent dates
    const timeDiff = now.getTime() - pastYear.getTime();
    const randomTime = pastYear.getTime() + (Math.random() * Math.random() * timeDiff); 
    
    return new Date(randomTime);
};

// --- 4. SEED ORDERS FUNCTION ---
const importDemoOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected for seeding orders...');

        // Verify we have users and books to create orders for
        const users = await User.find({});
        const books = await Book.find({});

        if (users.length === 0 || books.length === 0) {
            console.error('❌ Please seed users and books first (npm run data:import)');
            process.exit(1);
        }

        // Keep existing orders or clear them? We'll leave them and add more to not destroy user data
        // await Order.deleteMany(); 
        
        console.log('🔄 Generating demo order data...');
        
        const demoOrders = [];
        const numOrdersToGenerate = 80; // Generate 80 random orders

        for (let i = 0; i < numOrdersToGenerate; i++) {
            // Pick a random user (non-admin often)
            const customers = users.filter(u => !u.isAdmin);
            const user = randomItem(customers.length > 0 ? customers : users);
            
            // Generate 1 to 4 items for this order
            const numItems = randomInt(1, 4);
            const orderItems = [];
            let itemsPrice = 0;

            for (let j = 0; j < numItems; j++) {
                const book = randomItem(books);
                const qty = randomInt(1, 3);
                
                // Avoid duplicates in the same order
                if (!orderItems.find(item => item.product.toString() === book._id.toString())) {
                    orderItems.push({
                        name: book.title,
                        qty: qty,
                        image: book.image || '/images/sample.jpg',
                        price: book.price,
                        product: book._id
                    });
                    itemsPrice += book.price * qty;
                }
            }

            if (orderItems.length === 0) continue; // Skip if no items were added

            const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
            const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            // Generate timestamps
            const createdAt = randomDateInPastYear();
            
            // Most orders should be paid and delivered, some recent ones pending
            const isRecent = (new Date().getTime() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000); // last 7 days
            
            let isPaid = false;
            let paidAt = null;
            let isDelivered = false;
            let deliveredAt = null;

            // Status logic:
            // 85% chance paid
            if (Math.random() > 0.15) {
                isPaid = true;
                // Paid 1-2 hours after creation
                paidAt = new Date(createdAt.getTime() + randomInt(1, 2) * 60 * 60 * 1000);
                
                // If paid and not strictly recent, high chance delivered
                if (!isRecent || Math.random() > 0.5) {
                    isDelivered = true;
                    // Delivered 2-5 days after payment
                    deliveredAt = new Date(paidAt.getTime() + randomInt(2, 5) * 24 * 60 * 60 * 1000);
                    
                    // Don't set delivery date in future
                    if (deliveredAt > new Date()) {
                        deliveredAt = new Date();
                    }
                }
            }

            const order = {
                user: user._id,
                orderItems,
                shippingAddress: {
                    address: `${randomInt(1, 999)} Main St`,
                    city: randomItem(['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng']),
                    phone: `09${randomInt(10000000, 99999999)}`
                },
                paymentMethod: randomItem(['PayPal', 'COD', 'Bank Transfer']),
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                isPaid,
                paidAt,
                isDelivered,
                deliveredAt,
                createdAt,
                updatedAt: deliveredAt || paidAt || createdAt
            };
            
            demoOrders.push(order);
        }

        const insertedOrders = await Order.insertMany(demoOrders);
        console.log(`✅ SUCCESS! Added ${insertedOrders.length} demo orders to the database.`);
        
        process.exit();

    } catch (error) {
        console.error(`❌ Error seederOrders: ${error.message}`);
        process.exit(1);
    }
};

const destroyDemoOrders = async () => {
     try {
        await mongoose.connect(process.env.MONGO_URI);
        // We shouldn't drop all orders as real user might have real orders, 
        // to be safe we just delete Many. To be precise we could tag demo orders, 
        // but for a dev script this is fine.
        await Order.deleteMany();
        console.log('🔥 Destroyed all orders!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Convert to an express route handler
const importDemoOrdersRoute = async (req, res) => {
    try {
        console.log('🔌 Triggered MongoDB seeding from Route...');

        const users = await User.find({});
        const books = await Book.find({});

        if (users.length === 0 || books.length === 0) {
            return res.status(400).json({ message: 'Lỗi: Vui lòng nạp dummy User và Book trước' });
        }
        
        console.log('🔄 Generating demo order data...');
        const demoOrders = [];
        const numOrdersToGenerate = 80;

        for (let i = 0; i < numOrdersToGenerate; i++) {
            const customers = users.filter(u => !u.isAdmin);
            const user = randomItem(customers.length > 0 ? customers : users);
            
            const numItems = randomInt(1, 4);
            const orderItems = [];
            let itemsPrice = 0;

            for (let j = 0; j < numItems; j++) {
                const book = randomItem(books);
                const qty = randomInt(1, 3);
                
                if (!orderItems.find(item => item.product.toString() === book._id.toString())) {
                    orderItems.push({
                        name: book.title,
                        qty: qty,
                        image: book.image || '/images/sample.jpg',
                        price: book.price,
                        product: book._id
                    });
                    itemsPrice += book.price * qty;
                }
            }

            if (orderItems.length === 0) continue;

            const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
            const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
            const totalPrice = itemsPrice + shippingPrice + taxPrice;

            const createdAt = randomDateInPastYear();
            const isRecent = (new Date().getTime() - createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000);
            
            let isPaid = false;
            let paidAt = null;
            let isDelivered = false;
            let deliveredAt = null;

            if (Math.random() > 0.15) {
                isPaid = true;
                paidAt = new Date(createdAt.getTime() + randomInt(1, 2) * 60 * 60 * 1000);
                
                if (!isRecent || Math.random() > 0.5) {
                    isDelivered = true;
                    deliveredAt = new Date(paidAt.getTime() + randomInt(2, 5) * 24 * 60 * 60 * 1000);
                    if (deliveredAt > new Date()) {
                        deliveredAt = new Date();
                    }
                }
            }

            const order = {
                user: user._id,
                orderItems,
                shippingAddress: {
                    address: `${randomInt(1, 999)} Main St`,
                    city: randomItem(['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng']),
                    phone: `09${randomInt(10000000, 99999999)}`
                },
                paymentMethod: randomItem(['PayPal', 'COD', 'Bank Transfer']),
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                isPaid,
                paidAt,
                isDelivered,
                deliveredAt,
                createdAt,
                updatedAt: deliveredAt || paidAt || createdAt
            };
            demoOrders.push(order);
        }

        const insertedOrders = await Order.insertMany(demoOrders);
        console.log(`✅ SUCCESS! Added ${insertedOrders.length} demo orders.`);
        res.json({ message: `Thành công! Đã thêm ${insertedOrders.length} đơn hàng fake.`});

    } catch (error) {
        console.error(`❌ Error seederOrders: ${error.message}`);
        res.status(500).json({ message: 'Lỗi server khi tạo Fake Orders', error: error.message });
    }
}

if (require.main === module) {
    if (process.argv[2] === '-d') {
        destroyDemoOrders();
    } else {
        importDemoOrders();
    }
}

module.exports = { importDemoOrders, destroyDemoOrders, importDemoOrdersRoute };
