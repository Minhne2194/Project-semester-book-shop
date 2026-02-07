const express = require('express');
const router = express.Router();
// Import tất cả hàm từ userController tại đây
const { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Đăng ký user mới
router.route('/').post(registerUser);

// Đăng nhập
router.post('/login', authUser);

// Lấy/Sửa thông tin cá nhân (cần đăng nhập)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;