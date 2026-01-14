const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra xem header có gửi kèm Token không (Dạng: Bearer abcxyz...)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token (bỏ chữ Bearer ở đầu)
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'manhbi_secret_key_123');

      // Tìm user trong DB và gán vào req.user (trừ mật khẩu)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };