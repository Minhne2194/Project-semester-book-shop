const asyncHandler = require('express-async-handler');
const Order = require('../models/OrderModel');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id, // Lấy ID từ middleware protect
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save(); // Lưu vào MongoDB

    res.status(201).json(createdOrder);
  }
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email');
  res.json(orders);
});

// @desc    Update order status (paid / delivered) - admin
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Allow toggling fields if provided
  if (req.body.isPaid !== undefined) {
    order.isPaid = req.body.isPaid;
    order.paidAt = req.body.isPaid ? Date.now() : null;
  }

  if (req.body.isDelivered !== undefined) {
    order.isDelivered = req.body.isDelivered;
    order.deliveredAt = req.body.isDelivered ? Date.now() : null;
  }

  const updated = await order.save();
  res.json(updated);
});

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
