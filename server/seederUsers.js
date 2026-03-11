const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

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

// --- 3. HELPER FUNCTIONS ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const firstNames = ['Anh', 'Bảo', 'Châu', 'Dương', 'Hải', 'Huy', 'Khoa', 'Linh', 'Minh', 'Ngọc', 'Phước', 'Quỳnh', 'Sơn', 'Thảo', 'Thủy', 'Tuấn', 'Vũ', 'Yến'];
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];

// --- 4. SEED USERS FUNCTION ---
const importDemoUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 MongoDB Connected for seeding users...');
        
        console.log('🔄 Generating demo users data...');
        
        const demoUsers = [];
        const numUsersToGenerate = 30; // Generate 30 fake users
        const passwordHash = bcrypt.hashSync('123456', 10); // same password for all for testing

        for (let i = 0; i < numUsersToGenerate; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);
            
            // Randomly decide if they have a middle name
            const fullName = Math.random() > 0.5 
                ? `${lastName} ${firstName}`
                : `${lastName} ${randomItem(firstNames)} ${firstName}`;

            // Create email based on name
            const emailPrefix = `${firstName.toLowerCase()}${randomInt(1, 9999)}`;
            const emailDomain = randomItem(['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']);
            
            const user = {
                name: fullName,
                email: `${emailPrefix}@${emailDomain}`,
                password: passwordHash,
                isAdmin: false,
                // We could add dummy created dates if user schema supports dates well
            };
            
            demoUsers.push(user);
        }

        const insertedUsers = await User.insertMany(demoUsers);
        console.log(`✅ SUCCESS! Added ${insertedUsers.length} demo users to the database.`);
        
        process.exit();

    } catch (error) {
        console.error(`❌ Error seederUsers: ${error.message}`);
        process.exit(1);
    }
};

const destroyDemoUsers = async () => {
     try {
        await mongoose.connect(process.env.MONGO_URI);
        // Be careful not to delete admin users
        await User.deleteMany({ isAdmin: false });
        console.log('🔥 Destroyed all non-admin users!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Route handler for API trigger
const importDemoUsersRoute = async (req, res) => {
    try {
        console.log('🔌 Triggered user seeding from Route...');
        
        const demoUsers = [];
        const numUsersToGenerate = 30;
        const passwordHash = bcrypt.hashSync('123456', 10);

        for (let i = 0; i < numUsersToGenerate; i++) {
            const firstName = randomItem(firstNames);
            const lastName = randomItem(lastNames);
            const fullName = Math.random() > 0.5 
                ? `${lastName} ${firstName}`
                : `${lastName} ${randomItem(firstNames)} ${firstName}`;

            const emailPrefix = `${firstName.toLowerCase()}${randomInt(1, 9999)}`;
            const emailDomain = randomItem(['gmail.com', 'yahoo.com', 'outlook.com', 'example.com']);
            
            demoUsers.push({
                name: fullName,
                email: `${emailPrefix}@${emailDomain}`,
                password: passwordHash,
                isAdmin: false,
            });
        }

        const insertedUsers = await User.insertMany(demoUsers);
        console.log(`✅ SUCCESS! Added ${insertedUsers.length} demo users.`);
        res.json({ message: `Thành công! Đã thêm ${insertedUsers.length} người dùng fake. Mật khẩu mặc định là '123456'.`});

    } catch (error) {
        console.error(`❌ Error seederUsers route: ${error.message}`);
        res.status(500).json({ message: 'Lỗi server khi tạo Fake Users', error: error.message });
    }
};

if (require.main === module) {
    if (process.argv[2] === '-d') {
        destroyDemoUsers();
    } else {
        importDemoUsers();
    }
}

module.exports = { importDemoUsers, destroyDemoUsers, importDemoUsersRoute };
