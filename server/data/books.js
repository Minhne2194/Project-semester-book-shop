const books = [
    {
        title: 'Nhà Giả Kim',
        image: '/images/nha-gia-kim.jpg', // Tạm thời để đường dẫn giả
        description: 'Tiểu thuyết kinh điển của Paulo Coelho.',
        author: 'Paulo Coelho',
        category: 'Văn học',
        price: 79000,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
    },
    {
        title: 'Đắc Nhân Tâm',
        image: '/images/dac-nhan-tam.jpg',
        description: 'Nghệ thuật ứng xử cơ bản.',
        author: 'Dale Carnegie',
        category: 'Kỹ năng sống',
        price: 85000,
        countInStock: 7,
        rating: 4.8,
        numReviews: 15,
    },
    {
        title: 'Clean Code',
        image: '/images/clean-code.jpg',
        description: 'Sách gối đầu giường cho Coder.',
        author: 'Robert C. Martin',
        category: 'Công nghệ thông tin',
        price: 300000,
        countInStock: 5,
        rating: 5,
        numReviews: 10,
    },
    // Bạn có thể copy paste thêm nhiều sách khác ở đây
];

module.exports = books;