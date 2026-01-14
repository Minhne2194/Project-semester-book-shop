const express = require('express');
const router = express.Router();
const { authUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { registerUser } = require('../controllers/userController')

router.post('/login', authUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.route('/').post(registerUser);
module.exports = router;