const asyncHandler = require('express-async-handler');
const Book = require('../models/BookModel');

// Lấy danh sách sách (có tìm kiếm theo từ khóa)
const getBooks = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { author: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    const books = await Book.find(keyword);
    res.json(books);
});

// Lấy chi tiết 1 sách theo ID
const getBookById = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sách');
    }
});

// Tạo sách mới (Admin) - Đã tích hợp Upload ảnh
const createBook = asyncHandler(async (req, res) => {
    const { title, author, description, category, price, countInStock } = req.body;

    // Kiểm tra thông tin bắt buộc
    if (!title || !price || !author) {
        res.status(400);
        throw new Error('Vui lòng điền đầy đủ tên sách, tác giả và giá tiền');
    }

    // Xử lý ảnh: Nếu có ảnh upload lên Cloudinary thì lấy link, không thì dùng ảnh mặc định
    let image = '/images/placeholder.jpg';
    if (req.files && req.files.length > 0) {
        image = req.files[0].path; 
    }

    const book = new Book({
        title,
        author,
        price,
        description,
        category,
        countInStock,
        image, 
        // user: req.user._id, // Bỏ comment dòng này nếu muốn lưu ID người tạo
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
});

// Cập nhật sách (Admin)
const updateBook = asyncHandler(async (req, res) => {
    const { title, author, description, category, price, countInStock } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        book.title = title || book.title;
        book.author = author || book.author;
        book.description = description || book.description;
        book.category = category || book.category;
        book.price = price || book.price;
        book.countInStock = countInStock || book.countInStock;

        // Nếu có upload ảnh mới thì cập nhật, không thì giữ nguyên ảnh cũ
        if (req.files && req.files.length > 0) {
            book.image = req.files[0].path;
        }

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sách');
    }
});

// Xóa sách (Admin)
const deleteBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        await book.deleteOne();
        res.json({ message: 'Đã xóa sách thành công' });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy sách');
    }
});
// @desc    Thêm review cho sách
// @route   POST /api/books/:id/reviews
// @access  Private
const createBookReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Không tìm thấy sách');
  }

  // Kiểm tra đã review chưa
  const alreadyReviewed = book.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Bạn đã đánh giá sách này rồi');
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  book.reviews.push(review);
  book.numReviews = book.reviews.length;
  book.rating = book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length;

  await book.save();
  res.status(201).json({ message: 'Đã thêm đánh giá' });
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, createBookReview };