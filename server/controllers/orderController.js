const asyncHandler = require('express-async-handler');
const Order = require('../models/OrderModel');

// @desc    Tạo đơn hàng mới
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Lấy đơn hàng theo ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Lấy danh sách đơn hàng của tôi
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// --- THÊM: Lấy tất cả đơn hàng (Admin) ---
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// --- THÊM: Duyệt đơn hàng (Admin) ---
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// EXPORT ĐỦ 5 HÀM
module.exports = { 
    addOrderItems, 
    getOrderById, 
    getMyOrders, 
    getOrders, 
    updateOrderToDelivered 
};