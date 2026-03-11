import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import { createOrder, orderCreateReset } from '../../slices/orderSlice';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart);
  const cart = { ...cartState };

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(0);

  cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  cart.shippingPrice = addDecimals(cart.itemsPrice > 1000000 ? 0 : 30000);
  cart.taxPrice = addDecimals(Number((0.1 * cart.itemsPrice).toFixed(0)));
  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(0);

  const qrUrl = `https://img.vietqr.io/image/970407-19037297389019-compact2.png?amount=${cart.totalPrice}&addInfo=Thanh%20toan%20don%20hang&accountName=DANG%20THANH%20UYEN`;

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch(orderCreateReset());
    }
  }, [navigate, success, dispatch, order]);

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems: cart.cartItems.map((item) => ({
        product: item.product,
        name: item.title,
        qty: item.qty,
        image: item.image,
        price: item.price
      })),
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    }));
  };

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>

            <ListGroup.Item>
              <h2>Giao hàng tới</h2>
              <p><strong>Địa chỉ: </strong>{cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.phone}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Phương thức thanh toán</h2>
              <strong>Phương thức: </strong>
              {cart.paymentMethod === 'BankTransfer' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng (COD)'}
            </ListGroup.Item>

            {/* Hiện QR nếu chọn BankTransfer */}
           {cart.paymentMethod === 'BankTransfer' && (
  <ListGroup.Item>
    <h2>Quét mã QR để thanh toán</h2>
    <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
      <p style={{ color: '#0d6efd', fontWeight: 600, fontSize: '16px', marginBottom: '12px' }}>
        Số tiền cần thanh toán: <span style={{ color: '#dc3545', fontSize: '20px' }}>{Number(cart.totalPrice).toLocaleString('vi-VN')}đ</span>
      </p>
      <img src={qrUrl} alt='QR Thanh Toán' style={{ width: '220px', borderRadius: '8px', border: '2px solid #dee2e6' }} />
      <div style={{ marginTop: '16px', background: 'white', borderRadius: '8px', padding: '12px', textAlign: 'left' }}>
        <Row>
          <Col xs={6}><p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>Ngân hàng</p><p style={{ margin: 0, fontWeight: 600 }}>Techcombank</p></Col>
          <Col xs={6}><p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>Số tài khoản</p><p style={{ margin: 0, fontWeight: 600 }}>19037297389019</p></Col>
        </Row>
        <hr style={{ margin: '10px 0' }} />
        <Row>
          <Col xs={6}><p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>Chủ tài khoản</p><p style={{ margin: 0, fontWeight: 600 }}>DANG THANH UYEN</p></Col>
          <Col xs={6}><p style={{ margin: 0, color: '#6c757d', fontSize: '13px' }}>Nội dung CK</p><p style={{ margin: 0, fontWeight: 600 }}>Thanh toan don hang</p></Col>
        </Row>
      </div>
      <div style={{ marginTop: '12px', background: '#fff3cd', borderRadius: '8px', padding: '10px', fontSize: '13px', color: '#856404' }}>
        ⚠️ Quét mã xong rồi bấm <strong>ĐẶT HÀNG</strong> để xác nhận đơn!
      </div>
    </div>
  </ListGroup.Item>
)}
            <ListGroup.Item>
              <h2>Sản phẩm đặt mua</h2>
              {cart.cartItems.length === 0 ? (
                <div>Giỏ hàng trống</div>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.title} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.title}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price.toLocaleString('vi-VN')}đ = {(item.qty * item.price).toLocaleString('vi-VN')}đ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>

          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Tổng đơn hàng</h2></ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Tiền sách</Col><Col>{Number(cart.itemsPrice).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Phí Ship</Col><Col>{Number(cart.shippingPrice).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Thuế (10%)</Col><Col>{Number(cart.taxPrice).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Tổng cộng</Col><Col><strong>{Number(cart.totalPrice).toLocaleString('vi-VN')}đ</strong></Col></Row>
              </ListGroup.Item>
              {error && <ListGroup.Item className='text-danger'>{error}</ListGroup.Item>}
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block w-100'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  ĐẶT HÀNG
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderScreen;