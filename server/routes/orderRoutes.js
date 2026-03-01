const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);

module.exports = router;