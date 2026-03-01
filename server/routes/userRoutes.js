const express = require('express');
const router = express.Router();
const { authUser, getUserProfile, updateUserProfile, registerUser, getUsers, deleteUser, updateUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/')
  .post(registerUser)
  .get(protect, admin, getUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

module.exports = router;