import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { listOrders } from '../slices/orderSlice';

const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy danh sách đơn từ Redux
  const orderList = useSelector((state) => state.orderCreate); 
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <Container>
      <h1>Quản Lý Đơn Hàng</h1>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className='alert alert-danger'>{error}</div>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>KHÁCH HÀNG</th>
              <th>NGÀY</th>
              <th>TỔNG TIỀN</th>
              <th>GIAO HÀNG</th>
              <th>CHI TIẾT</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toLocaleString('vi-VN')} đ</td>
                <td>
                  {order.isDelivered ? (
                    <span className='text-success'>Đã giao</span>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Xem
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderListScreen;