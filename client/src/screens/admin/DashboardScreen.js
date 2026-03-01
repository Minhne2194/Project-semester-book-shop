import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DashboardScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get('/api/orders/stats', {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, [userInfo]);

  if (loading) return <p>Đang tải thống kê...</p>;

  const chartData = stats.months.map((month, i) => ({
    month,
    doanhThu: Math.round(stats.monthlyRevenue[i]),
    donHang: stats.monthlyOrders[i],
  }));

  return (
    <div>
      <h2 className="mb-4">Thống kê doanh thu</h2>

      {/* Thẻ thống kê */}
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="primary" text="white" className="text-center p-3">
            <h6>Tổng Doanh Thu</h6>
            <h4>{stats.totalRevenue.toLocaleString('vi-VN')}đ</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white" className="text-center p-3">
            <h6>Tổng Đơn Hàng</h6>
            <h4>{stats.totalOrders}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="warning" text="white" className="text-center p-3">
            <h6>Đã Thanh Toán</h6>
            <h4>{stats.paidOrders}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="danger" text="white" className="text-center p-3">
            <h6>Chờ Thanh Toán</h6>
            <h4>{stats.pendingOrders}</h4>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Card className="p-3 mb-4">
        <h5>Doanh Thu 12 Tháng Gần Nhất</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString('vi-VN') + 'đ'} />
            <Bar dataKey="doanhThu" fill="#0d6efd" name="Doanh Thu" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Biểu đồ đơn hàng */}
      <Card className="p-3">
        <h5>Số Đơn Hàng 12 Tháng Gần Nhất</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="donHang" stroke="#198754" name="Đơn Hàng" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DashboardScreen;