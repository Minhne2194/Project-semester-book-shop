import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Container } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const continueShoppingHandler = () => {
    navigate('/');
  };

  // Tính tổng tiền
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  // Mã màu chủ đạo từ ảnh mẫu (Hồng/Đỏ đậm)
  const primaryColor = '#d9275c';

  return (
    <Container className="mt-3 mb-4">
      {/* Header & Gift Card Link */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-2">
        <h2 className="mb-0 fw-normal" style={{ fontFamily: 'serif', fontSize: '2rem', color: '#1a1a4b' }}>
          Giỏ hàng
        </h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="alert alert-info text-center mt-3">
          Giỏ hàng của bạn đang trống. <Link to='/'>Quay lại mua sắm</Link>
        </div>
      ) : (
        <>
          {/* Tiêu đề Cột (Chỉ hiện trên màn hình md trở lên) */}
          <Row className="border-bottom pb-2 mb-2 fw-bold d-none d-md-flex" style={{ fontSize: '0.75rem' }}>
            <Col md={8}>Sản phẩm</Col>
            <Col md={2} className="text-center">Số lượng</Col>
            <Col md={2} className="text-end">Giá</Col>
          </Row>

          {/* Danh sách Sản phẩm */}
          <ListGroup variant="flush" className="border-bottom mb-3 pb-2">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className="px-0 py-2 border-0">
                <Row className="align-items-start">
                  {/* Cột Ảnh & Thông tin */}
                  <Col md={8} className="d-flex">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fluid
                      className="shadow-sm me-3"
                      style={{ width: '95px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="mb-1" style={{ fontFamily: 'serif' }}>
                        <Link to={`/product/${item.product}`} className="text-decoration-none text-dark">
                          {item.title}
                        </Link>
                      </h6>

                      {/* Trạng thái kho hàng */}
                      <div className="fw-bold" style={{ color: '#178c82', fontSize: '0.75rem' }}>
                        <i className="far fa-check-square me-1"></i> CÓ SẴN
                      </div>
                    </div>
                  </Col>

                  {/* Cột Số lượng */}
                  <Col md={2} xs={6} className="mt-2 mt-md-0 d-flex justify-content-md-center">
                    <Form.Control
                      size="sm"
                      type="number"
                      min="1"
                      max={item.countInStock}
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      style={{ width: '55px', textAlign: 'center' }}
                      className="shadow-sm"
                    />
                  </Col>

                  {/* Cột Giá & Nút Xóa */}
                  <Col md={2} xs={6} className="mt-2 mt-md-0 d-flex justify-content-end align-items-start">
                    <div className="text-end me-2">
                      <div className="text-muted text-decoration-line-through" style={{ fontSize: '0.75rem' }}>
                        {(item.price * 1.1).toLocaleString('vi-VN')} đ
                      </div>
                      <div className="fw-bold fs-6" style={{ color: primaryColor }}>
                        {item.price.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="text-dark p-0"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="far fa-trash-alt fs-6"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Phần Footer của Giỏ hàng */}
          <Row className="align-items-end">
            {/* Cột Trái: Nút Quay lại & Làm trống */}
            <Col md={6} className="order-2 order-md-1 mt-3 mt-md-0">
              <div className="d-flex">
                <Button
                  size="sm"
                  variant="light"
                  className="rounded-pill fw-bold me-2 text-secondary px-3 shadow-sm"
                  style={{ backgroundColor: '#e2e2e2', fontSize: '0.8rem' }}
                  onClick={() => alert('Chức năng làm trống giỏ hàng có thể tích hợp sau!')}
                >
                  LÀM TRỐNG GIỎ HÀNG
                </Button>
                <Button
                  size="sm"
                  className="rounded-pill fw-bold border-0 px-3 shadow-sm"
                  style={{ backgroundColor: primaryColor, fontSize: '0.8rem' }}
                  onClick={continueShoppingHandler}
                >
                  TIẾP TỤC MUA SẮM
                </Button>
              </div>
            </Col>

            {/* Cột Phải: Tổng tiền & Thanh toán */}
            <Col md={6} className="order-1 order-md-2 text-md-end">
              <div className="mb-2 d-flex justify-content-md-end align-items-center">
                <span className="text-muted me-2 fs-6">Tổng cộng:</span>
                <span className="fw-bold fs-4">{totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="d-flex justify-content-md-end mb-2">
                <Button
                  size="sm"
                  variant="outline-danger"
                  className="rounded-pill fw-bold px-3 me-2"
                  style={{ color: primaryColor, borderColor: primaryColor, fontSize: '0.8rem' }}
                >
                  CẬP NHẬT
                </Button>
                <Button
                  size="sm"
                  className="rounded-pill fw-bold border-0 px-4 shadow-sm"
                  style={{ backgroundColor: primaryColor, fontSize: '0.8rem' }}
                  onClick={checkoutHandler}
                >
                  THANH TOÁN
                </Button>
              </div>

              {/* Thông tin thanh toán an toàn */}
              <div className="d-flex flex-column align-items-md-end mt-3">
                <div className="mb-1 text-dark fw-bold d-flex align-items-center" style={{ fontSize: '0.75rem' }}>
                  <i className="fas fa-lock me-2 fs-6"></i> Thanh toán an toàn & bảo mật
                  <span className="ms-2 badge bg-dark text-white" style={{ padding: '0.2rem' }}>Powered by Stripe</span>
                </div>
                <div className="d-flex gap-2 text-primary fs-4">
                  <i className="fab fa-cc-visa"></i>
                  <i className="fab fa-cc-mastercard text-danger"></i>
                  <i className="fab fa-cc-amex text-info"></i>
                  <i className="fab fa-cc-jcb text-success"></i>
                  <i className="fab fa-cc-discover text-warning"></i>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CartScreen;