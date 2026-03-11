import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails } from '../../slices/orderSlice';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.orderCreate);
  const { order, loading, error } = orderState;

  useEffect(() => {
    dispatch(getOrderDetails(id));
}, [dispatch, id]);
  if (loading) return <Container className="text-center mt-5"><h2>Đang tải...</h2></Container>;
  if (error) return <Container className="mt-5"><div className='alert alert-danger'>{error}</div></Container>;
  if (!order) return <Container className="mt-5"><h4>Không tìm thấy đơn hàng</h4></Container>;

  return (
    <Container>
      <h1>Đơn hàng: <small style={{fontSize: '0.6em'}}>{order._id}</small></h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>

            {/* GIAO HÀNG */}
            <ListGroup.Item>
              <h2>Giao tới</h2>
              <p><strong>Tên: </strong>{order.user?.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user?.email}`}>{order.user?.email}</a></p>
              <p><strong>Địa chỉ: </strong>{order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.phone}</p>
              {order.isDelivered ? (
                <div className='alert alert-success'>✅ Đã giao hàng lúc {new Date(order.deliveredAt).toLocaleString('vi-VN')}</div>
              ) : order.isPaid ? (
                <div className='alert alert-warning'>🚚 Đang chuẩn bị và giao hàng</div>
              ) : (
                <div className='alert alert-secondary'>📦 Chờ xác nhận thanh toán trước khi giao hàng</div>
              )}
            </ListGroup.Item>

            {/* THANH TOÁN */}
            <ListGroup.Item>
              <h2>Thanh toán</h2>
              <p><strong>Phương thức: </strong>
                {order.paymentMethod === 'BankTransfer' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng (COD)'}
              </p>

              {/* Hiện QR nếu BankTransfer và chưa thanh toán */}
              {order.paymentMethod === 'BankTransfer' && !order.isPaid && (
                <div className='text-center my-3 p-3 border rounded'>
                  <div className='alert alert-info'>
                    Quét mã QR để thanh toán <strong>{Number(order.totalPrice || 0).toLocaleString('vi-VN')}đ</strong>
                  </div>
                  <img
                    src={`https://img.vietqr.io/image/970407-19037297389019-compact2.png?amount=${order.totalPrice}&addInfo=Thanh%20toan%20${order._id}&accountName=DANG%20THANH%20UYEN`}
                    alt='QR Thanh Toán'
                    style={{ width: '250px' }}
                  />
                  <div className='mt-3 text-start'>
                    <p><strong>Ngân hàng:</strong> Techcombank</p>
                    <p><strong>Số TK:</strong> 19037297389019</p>
                    <p><strong>Chủ TK:</strong> DANG THANH UYEN</p>
                    <p><strong>Số tiền:</strong> {Number(order.totalPrice || 0).toLocaleString('vi-VN')}đ</p>
                    <p><strong>Nội dung:</strong> Thanh toan {order._id}</p>
                  </div>
                  <div className='alert alert-warning mt-2'>
                    ⚠️ Sau khi chuyển khoản, Admin sẽ xác nhận trong vòng 15 phút.
                  </div>
                </div>
              )}

              {order.isPaid ? (
                <div className='alert alert-success'>✅ Đã thanh toán lúc {new Date(order.paidAt).toLocaleString('vi-VN')}</div>
              ) : order.paymentMethod === 'BankTransfer' ? (
                <div className='alert alert-warning'>⏳ Chờ xác nhận chuyển khoản</div>
              ) : (
                <div className='alert alert-info'>💵 Thanh toán khi nhận hàng (COD)</div>
              )}
            </ListGroup.Item>

            {/* SẢN PHẨM */}
            <ListGroup.Item>
              <h2>Sản phẩm</h2>
              {order.orderItems?.length === 0 ? (
                <div>Đơn hàng không có sản phẩm</div>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems?.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {(item.price || 0).toLocaleString('vi-VN')}đ = {(item.qty * (item.price || 0)).toLocaleString('vi-VN')}đ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>

          </ListGroup>
        </Col>

        {/* TỔNG TIỀN */}
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Tổng tiền</h2></ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Tiền hàng</Col><Col>{(order.itemsPrice || 0).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Phí Ship</Col><Col>{(order.shippingPrice || 0).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Thuế (10%)</Col><Col>{(order.taxPrice || 0).toLocaleString('vi-VN')}đ</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Tổng cộng</Col><Col><strong>{(order.totalPrice || 0).toLocaleString('vi-VN')}đ</strong></Col></Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderScreen;