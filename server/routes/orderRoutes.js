const express = require('express');
const router = express.Router();
const { 
    addOrderItems,
    getMyOrders,
    getOrderById,
    getOrders,              // <--- Import thêm
    updateOrderToDelivered  // <--- Import thêm
 } = require('../controllers/orderController');
 
const { protect, admin } = require('../middleware/authMiddleware'); // <--- Import thêm admin

// Route gốc: Tạo đơn (User) - Xem tất cả (Admin)
router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders); // <--- Thêm get

router.route('/myorders').get(protect, getMyOrders);

// Route theo ID
router.route('/:id').get(protect, getOrderById);

// Route duyệt đơn (Admin)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // <--- Thêm route này

module.exports = router;