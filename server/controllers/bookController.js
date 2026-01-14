const asyncHandler = require('express-async-handler');
const Book = require('../models/BookModel');

// @desc    Lấy tất cả sách
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({}); // Lấy tất cả bản ghi trong bảng Book
    res.json(books); // Trả về dạng JSON
});

// @desc    Lấy 1 sách theo ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

module.exports = {
    getBooks,
    getBookById,
};