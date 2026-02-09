import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import { createOrder, orderCreateReset } from '../../slices/orderSlice';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy state từ Redux và tạo bản sao để tránh lỗi "not extensible"
  const cartState = useSelector((state) => state.cart);
  const cart = { ...cartState };
  
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  // --- TÍNH TOÁN TIỀN ---
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(0);
  };

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  
  cart.shippingPrice = addDecimals(cart.itemsPrice > 1000000 ? 0 : 30000);
  cart.taxPrice = addDecimals(Number((0.1 * cart.itemsPrice).toFixed(0)));
  
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(0);

  useEffect(() => {
      if (success) {
        navigate(`/order/${order._id}`);
        dispatch(orderCreateReset());
      }
    }, [navigate, success, dispatch, order]);

  // --- HÀM XỬ LÝ ĐẶT HÀNG (ĐÃ SỬA) ---
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        // Map lại dữ liệu: Lấy 'title' của sách gán vào 'name' của đơn hàng
        orderItems: cart.cartItems.map((item) => ({
             product: item.product,
             name: item.title,  // <--- QUAN TRỌNG: Backend cần 'name'
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
      })
    );
  };

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Giao hàng tới</h2>
              <p>
                <strong>Địa chỉ: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.phone}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Phương thức thanh toán</h2>
              <strong>Phương thức: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

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
                          {item.qty} x {item.price.toLocaleString('vi-VN')} đ ={' '}
                          {(item.qty * item.price).toLocaleString('vi-VN')} đ
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
              <ListGroup.Item>
                <h2>Tổng đơn hàng</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tiền sách</Col>
                  <Col>{Number(cart.itemsPrice).toLocaleString('vi-VN')} đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Phí Ship</Col>
                  <Col>{Number(cart.shippingPrice).toLocaleString('vi-VN')} đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Thuế (10%)</Col>
                  <Col>{Number(cart.taxPrice).toLocaleString('vi-VN')} đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tổng cộng</Col>
                  <Col><strong>{Number(cart.totalPrice).toLocaleString('vi-VN')} đ</strong></Col>
                </Row>
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