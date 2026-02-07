// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Import cấu hình upload
const upload = require('../config/cloudinary'); 

router.route('/')
  .get(getBooks)
  // 2. Thêm middleware upload.array('image') vào đây
  // 'image' là tên key trong Form-Data
  .post(protect, admin, upload.array('image', 5), createBook); 

router.route('/:id')
  .get(getBookById)
  .put(protect, admin, upload.array('image'), updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router;