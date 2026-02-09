import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Hook để lấy dữ liệu từ Redux
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import { addToCart, removeFromCart } from '../../slices/cartSlice'; // Import các hành động

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy danh sách sách trong giỏ từ Redux Store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Hàm xử lý khi thay đổi số lượng
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // Hàm xử lý khi bấm nút xóa
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  // Hàm xử lý khi bấm nút "Tiến hành thanh toán"
  const checkoutHandler = () => {
    // Tạm thời chuyển hướng về login, sau này sẽ chuyển sang trang Shipping
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <div className='alert alert-info'>
            Giỏ hàng của bạn đang trống. <Link to='/'>Quay lại mua sắm</Link>
          </div>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  {/* Cột 1: Ảnh nhỏ */}
                  <Col md={2}>
                    <Image src={item.image} alt={item.title} fluid rounded />
                  </Col>
                  
                  {/* Cột 2: Tên sách */}
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.title}</Link>
                  </Col>
                  
                  {/* Cột 3: Giá */}
                  <Col md={2}>{item.price.toLocaleString('vi-VN')} đ</Col>
                  
                  {/* Cột 4: Chọn lại số lượng */}
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].slice(0, 10).map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  
                  {/* Cột 5: Nút xóa */}
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      {/* Cột bên phải: Tổng tiền */}
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Tổng cộng ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) cuốn
              </h2>
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString('vi-VN')}{' '}
              đ
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block w-100' // w-100 để nút dài ra full chiều ngang
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Tiến hành thanh toán
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;