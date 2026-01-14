const express = require('express');
const router = express.Router();
const { getBooks, getBookById } = require('../controllers/bookController');

// Khi người dùng vào đường dẫn gốc (/) thì gọi hàm getBooks
router.route('/').get(getBooks);

// Khi người dùng vào đường dẫn có ID (/:id) thì gọi hàm getBookById
router.route('/:id').get(getBookById);

module.exports = router;