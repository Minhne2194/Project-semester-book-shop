import React, { useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails } from '../slices/orderSlice';

const OrderScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderState = useSelector((state) => state.orderCreate);
  const { order, loading, error } = orderState;

  useEffect(() => {
    // Nếu chưa có order hoặc ID order không khớp với URL thì gọi API lấy lại
    if (!order || order._id !== id) {
        dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, order]);

  // --- 1. MÀN HÌNH ĐANG TẢI ---
  if (loading) {
      return (
          <Container className="text-center mt-5">
              <h2>Đang tải thông tin đơn hàng...</h2>
          </Container>
      );
  }

  // --- 2. MÀN HÌNH LỖI ---
  if (error) {
      return (
        <Container className="mt-5">
            <div className='alert alert-danger'>{error}</div>
        </Container>
      );
  }

  // --- 3. KIỂM TRA DỮ LIỆU RỖNG (Quan trọng để tránh lỗi toLocaleString) ---
  if (!order) {
      return <Container className="mt-5"><h4>Không tìm thấy đơn hàng</h4></Container>;
  }

  return (
    <Container>
      <h1>Đơn hàng: <small>{order._id}</small></h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Giao tới</h2>
              <p><strong>Tên: </strong> {order.user?.name}</p>
              <p><strong>Email: </strong> <a href={`mailto:${order.user?.email}`}>{order.user?.email}</a></p>
              <p>
                <strong>Địa chỉ: </strong>
                {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.phone}
              </p>
              {order.isDelivered ? (
                <div className='alert alert-success'>Đã giao hàng lúc {order.deliveredAt}</div>
              ) : (
                <div className='alert alert-danger'>Chưa giao hàng</div>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Thanh toán</h2>
              <p><strong>Phương thức: </strong> {order.paymentMethod}</p>
              {order.isPaid ? (
                <div className='alert alert-success'>Đã thanh toán lúc {order.paidAt}</div>
              ) : (
                <div className='alert alert-danger'>Chưa thanh toán (COD)</div>
              )}
            </ListGroup.Item>

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
                            {item.qty} x {(item.price || 0).toLocaleString('vi-VN')} đ ={' '}
                            {(item.qty * (item.price || 0)).toLocaleString('vi-VN')} đ
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
              <ListGroup.Item><h2>Tổng tiền</h2></ListGroup.Item>
              <ListGroup.Item>
                <Row>
                    <Col>Tiền hàng</Col>
                    {/* Thêm || 0 để tránh lỗi nếu dữ liệu chưa kịp về */}
                    <Col>{(order.itemsPrice || 0).toLocaleString('vi-VN')} đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                    <Col>Phí Ship</Col>
                    <Col>{(order.shippingPrice || 0).toLocaleString('vi-VN')} đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                    <Col>Tổng cộng</Col>
                    <Col><strong>{(order.totalPrice || 0).toLocaleString('vi-VN')} đ</strong></Col>
                </Row>
              </ListGroup.Item>
              {/* Nút thanh toán (Nếu muốn phát triển thêm Momo/Paypal sau này) */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderScreen;