const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Ai tạo sách này (Admin nào)
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true }, // Văn học, Kinh tế, IT...
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;