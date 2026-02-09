import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = userInfo
    ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
    : {};

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const markDelivered = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { isDelivered: true }, config);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const markPaid = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { isPaid: true }, config);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container>
      <h2>Quản lý đơn hàng</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách</th>
              <th>Ngày</th>
              <th>Tổng</th>
              <th>Thanh toán</th>
              <th>Giao hàng</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}...</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>{Number(order.totalPrice || 0).toLocaleString('vi-VN')} đ</td>
                <td>
                  {order.isPaid ? (
                    <span className="text-success">Đã trả</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => markPaid(order._id)}
                    >
                      Đánh dấu đã trả
                    </Button>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <span className="text-success">Đã giao</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => markDelivered(order._id)}
                    >
                      Đánh dấu đã giao
                    </Button>
                  )}
                </td>
                <td className="text-end">
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Chi tiết
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
