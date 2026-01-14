import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../slices/userSlice';
import { listMyOrders } from '../slices/orderSlice'; // Import hàm lấy danh sách đơn

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Email chỉ để hiện, ko cho sửa
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy thông tin user
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Để an toàn và đúng chuẩn Redux trong Store.js bước trước, ta nên check lại store.js.
  // Giả sử bạn đang dùng chung slice 'order', ta lấy state.orderCreate (hoặc state.order nếu bạn đặt tên khác).
  // Nhưng tốt nhất ở bước này, ta dùng biến:
  const { orders, loading: loadingOrders, error: errorOrders } = useSelector((state) => state.orderCreate); 
  // (Lưu ý: Nếu orders undefined, hãy kiểm tra lại orderSlice xem đã có reducer orderListMySuccess chưa)

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      if (!userInfo.name) {
        // Nếu chưa có tên (trường hợp hiếm), load lại (ở đây ta bỏ qua logic phức tạp)
      } else {
        setName(userInfo.name);
        setEmail(userInfo.email);
        // Gọi API lấy danh sách đơn hàng
        dispatch(listMyOrders());
      }
    }
  }, [dispatch, navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp');
    } else {
      // Cập nhật profile
      dispatch(updateUserProfile({ id: userInfo._id, name, password }));
      setMessage('');
    }
  };

  return (
    <Container>
      <Row>
        <Col md={3}>
          <h2>Thông tin cá nhân</h2>
          {message && <div className='alert alert-danger'>{message}</div>}
          
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Tên hiển thị</Form.Label>
              <Form.Control
                type='name'
                placeholder='Nhập tên'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Nhập email'
                value={email}
                disabled // Không cho sửa email
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Đổi Mật khẩu (Bỏ trống nếu không đổi)</Form.Label>
              <Form.Control
                type='password'
                placeholder='Nhập mật khẩu mới'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Nhập lại mật khẩu</Form.Label>
              <Form.Control
                type='password'
                placeholder='Nhập lại mật khẩu'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              Cập nhật
            </Button>
          </Form>
        </Col>

        <Col md={9}>
          <h2>Lịch sử đơn hàng</h2>
          {loadingOrders ? (
            <div>Đang tải...</div>
          ) : errorOrders ? (
            <div className='alert alert-danger'>{errorOrders}</div>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NGÀY MUA</th>
                  <th>TỔNG TIỀN</th>
                  <th>THANH TOÁN</th>
                  <th>GIAO HÀNG</th>
                  <th>CHI TIẾT</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 10)}...</td> {/* Cắt ngắn ID cho đẹp */}
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td>
                      {order.isPaid ? (
                        <span className='text-success'>Đã trả ({order.paidAt.substring(0, 10)})</span>
                      ) : (
                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span className='text-success'>Đã giao ({order.deliveredAt.substring(0, 10)})</span>
                      ) : (
                        <i className='fas fa-times' style={{ color: 'red' }}></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm' variant='light'>
                          Xem
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;