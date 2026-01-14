import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  // Hàm này chạy ngay khi trang web được tải
  useEffect(() => {
    const fetchProducts = async () => {
      // Gọi API từ Backend
      const { data } = await axios.get('/api/books');
      setProducts(data); // Lưu dữ liệu lấy được vào state
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1>Sách Mới Nhất</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;