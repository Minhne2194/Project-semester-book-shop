import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../../slices/cartSlice';

const SearchScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      if (!keyword) { setProducts([]); return; }
      try {
        setLoading(true);
        const { data } = await axios.get('/api/books', { params: { keyword } });
        setProducts(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
    navigate('/cart');
  };

  return (
    <div className="section">
      <h2 className="best-title mb-3" style={{ fontWeight: 700 }}>Kết quả tìm kiếm cho “{keyword}”</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && products.length === 0 && <div>Không tìm thấy sách.</div>}

      <Row>
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} lg={3} xl={3} className="mb-4">
            <Card
              className="h-100 border-0 shadow-sm"
              style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="position-relative">
                <Card.Img variant="top" src={product.image} style={{ height: 200, objectFit: 'cover' }} />
                {product.numReviews > 50 && (
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">Phổ biến</Badge>
                )}
              </div>
              <Card.Body className="d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-uppercase fw-bold" style={{ fontSize: '10px', color: '#d97706', letterSpacing: '0.5px' }}>
                    {product.category || 'Sách'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {product.rating || 0}</span>
                </div>
                <Card.Title className="mb-1" style={{ fontWeight: 700, fontSize: '16px', fontFamily: '"Merriweather", serif', color: '#111827', lineHeight: '1.4' }}>
                  {product.title}
                </Card.Title>
                <div className="mb-3 text-muted" style={{ fontSize: '12px' }}>{product.author}</div>
                <Card.Text className="flex-grow-1" style={{ fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                  <div className="d-flex flex-column">
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                      {Number(product.price).toLocaleString('vi-VN')}&nbsp;đ
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Đánh giá: {product.numReviews}</span>
                  </div>
                  <button
                    className="btn d-flex align-items-center"
                    style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: 500, border: 'none' }}
                    disabled={!product.countInStock}
                    onClick={(e) => { e.stopPropagation(); addToCartHandler(product); }}
                  >
                    + Thêm
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SearchScreen;
