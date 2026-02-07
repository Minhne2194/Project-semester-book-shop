const express = require('express');
const router = express.Router();
const { addOrderItems,
        getMyOrders,
        getOrderById,
        getOrders,
        updateOrderStatus,
 } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus);

module.exports = router;
