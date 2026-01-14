const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    phone: { type: String },
    address: { type: String }
}, {
    timestamps: true // Tự động tạo trường createdAt và updatedAt
});

const User = mongoose.model('User', userSchema);
module.exports = User;