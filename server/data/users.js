const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10), // Mật khẩu là 123456
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'user@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    }
];

module.exports = users;