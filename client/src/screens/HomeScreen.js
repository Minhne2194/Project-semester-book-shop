import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/books');
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Curated: lấy ngẫu nhiên 4 cuốn
  const curatedBooks = React.useMemo(() => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products]);

  // Best sellers: sắp xếp theo số lượng đánh giá
  const bestSellerBooks = React.useMemo(() => {
    return [...products].sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0)).slice(0, 4);
  }, [products]);

  return (
    <>
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <section className="mb-5">
            <div className="p-5 rounded bg-light text-center mb-4">
              <h1 className="display-5">FamilyBook</h1>
              <p className="lead">Chọn những cuốn sách hay nhất cho gia đình bạn.</p>
            </div>

            <h2 className="mb-3">Góc Nhìn Chuyên Gia</h2>
            <Row>
              {curatedBooks.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={3} className="mb-4">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </section>

          <section className="mt-5">
            <h2 className="mb-3">Sách Bán Chạy Nhất</h2>
            <Row>
              {bestSellerBooks.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={3} className="mb-4">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </section>
        </>
      )}
    </>
  );
};

export default HomeScreen;