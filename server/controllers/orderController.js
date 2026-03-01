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
// @desc    Thống kê doanh thu (admin)
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  // Tổng doanh thu
  const totalRevenue = orders
    .filter(o => o.isPaid)
    .reduce((acc, o) => acc + o.totalPrice, 0);

  // Tổng đơn hàng
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.isPaid).length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;
  const pendingOrders = orders.filter(o => !o.isPaid).length;

  // Doanh thu theo tháng (12 tháng gần nhất)
  const monthlyRevenue = Array(12).fill(0);
  const monthlyOrders = Array(12).fill(0);
  const now = new Date();

  orders.filter(o => o.isPaid).forEach(o => {
    const paidDate = new Date(o.paidAt);
    const monthDiff = (now.getFullYear() - paidDate.getFullYear()) * 12 + now.getMonth() - paidDate.getMonth();
    if (monthDiff >= 0 && monthDiff < 12) {
      monthlyRevenue[11 - monthDiff] += o.totalPrice;
      monthlyOrders[11 - monthDiff]++;
    }
  });

  // Label tháng
  const months = Array(12).fill(0).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return `T${d.getMonth() + 1}/${d.getFullYear()}`;
  });

  res.json({
    totalRevenue,
    totalOrders,
    paidOrders,
    deliveredOrders,
    pendingOrders,
    monthlyRevenue,
    monthlyOrders,
    months,
  });
});

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus, getOrderStats };