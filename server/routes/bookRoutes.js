const express = require('express');
const router = express.Router();
const { getBooks, getBookById, createBook, updateBook, deleteBook, createBookReview } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.route('/')
  .get(getBooks)
  .post(protect, admin, upload.array('image', 5), createBook);

router.route('/:id/reviews').post(protect, createBookReview);

router.route('/:id')
  .get(getBookById)
  .put(protect, admin, upload.array('image'), updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router;