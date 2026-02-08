import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Image, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const keyword = new URLSearchParams(location.search).get('keyword') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/books', {
          params: keyword ? { keyword } : {},
        });
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

  const bestSellers = [...products]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 8); 

  const expertPicks = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  const addToCartHandler = (product) => {
    if (!product?._id) return;
    dispatch(addToCart({ ...product, product: product._id, qty: 1 }));
    navigate('/cart');
  };

  const openDetail = (product) => {
    if (!product?._id) return;
    navigate(`/product/${product._id}`);
  };

  return (
    <>
      {/* --- HERO SECTION --- */}
      <Row className="align-items-center hero-brown mb-5">
        <Col md={6}>
          <div className="d-flex gap-3 mt-3" style={{fontWeight: 200}}>FamilyBook Store</div>
          <h1 style={{ fontWeight: 700, lineHeight: 1.2, marginBottom: 16 }}>
            Nơi tri thức<br />gắn kết mọi nhà
          </h1>
          <p style={{ maxWidth: 480, color: '#f1e5d8' }}>
            Trải nghiệm bộ sưu tập sách được tuyển chọn kỹ lưỡng
          </p>
          <p style={{ maxWidth: 480, color: '#f1e5d8' }}>
            Khơi dậy niềm đam mê đọc sách cho mọi lứa tuổi
          </p>
          <div className="d-flex gap-3 mt-3">
            <Button variant="light" onClick={() => navigate('/shop')} style={{ color: '#5b4437' }}>
              Xem Sách Ngay
            </Button>
            <Button variant="outline-light" onClick={() => navigate('/blog')}>
              Đọc Blog Nhóm
            </Button>
          </div>
        </Col>
        <Col md={6} className="text-center">
          <Image
            src="https://images.unsplash.com/photo-1473181488821-2d23949a045a?auto=format&fit=crop&w=500&q=80"
            alt="Editorial pick"
            rounded
            style={{ width: 260, boxShadow: '0 18px 45px rgba(0,0,0,0.25)', transform: 'rotate(-2deg)' }}
          />
          <div style={{ marginTop: 10, fontSize: 14, color: '#f1e5d8' }}>
            Gợi ý từ ban biên tập
          </div>
        </Col>
      </Row>

      {/* --- BEST SELLERS SECTION --- */}
      <div className="best-section">
        <h2 className="best-title mb-4" style={{ fontWeight: 700, color: '#111827' }}>Sách Bán Chạy Nhất</h2>
        {loading && <div>Đang tải...</div>}
        {error && <div className='alert alert-danger'>{error}</div>}
        {!loading && bestSellers.length === 0 && <div>Không tìm thấy sách.</div>}

        <Row>
          {bestSellers.map((product) => (
            // Thêm class d-flex justify-content-center để căn giữa thẻ Card trong cột
            <Col key={product._id} xs={12} sm={6} lg={3} xl={3} className="mb-4 d-flex justify-content-center">
              <Card 
                  className="h-100 border-0 shadow-sm" 
                  // SỬA: Thêm width: '286px'
                  style={{ width: '286px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', cursor: 'pointer' }}
                  onClick={() => openDetail(product)}
              >
                {/* Phần hình ảnh */}
                <div className="position-relative">
                  <Card.Img 
                      variant="top" 
                      src={product.image} 
                      // SỬA: Thay height cố định bằng aspectRatio: '2/3'
                      style={{ aspectRatio: '2/3', objectFit: 'cover' }} 
                  />
                  
                  {/* Badge Phổ biến */}
                  {product.numReviews > 50 && (
                    <span 
                      className="position-absolute top-0 end-0 m-3 px-3 py-1 text-white fw-bold"
                      style={{ 
                          backgroundColor: '#ef4444', 
                          borderRadius: '20px', 
                          fontSize: '10px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      Phổ biến
                    </span>
                  )}
                </div>

                {/* Phần nội dung Card */}
                <Card.Body className="d-flex flex-column p-3">
                  {/* Category & Rating */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                      <span 
                          className="text-uppercase fw-bold" 
                          style={{ fontSize: '10px', color: '#d97706', letterSpacing: '0.5px' }}
                      >
                          {product.category || 'VĂN HỌC'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>
                            ⭐ {product.rating || 0}
                      </span>
                  </div>

                  {/* Title */}
                  <Card.Title 
                      className="mb-1"
                      style={{ 
                          fontWeight: 700, 
                          fontSize: '16px', 
                          fontFamily: '"Merriweather", serif',
                          color: '#111827',
                          lineHeight: '1.4'
                      }}
                  >
                      {product.title}
                  </Card.Title>

                  {/* Author */}
                  <div className="mb-3 text-muted" style={{ fontSize: '12px' }}>
                      {product.author}
                  </div>

                  {/* Description */}
                  <Card.Text 
                      className="flex-grow-1" 
                      style={{ 
                          fontSize: '12px', 
                          color: '#6b7280', 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                      }}
                  >
                    {product.description}
                  </Card.Text>
                  
                  {/* Footer Card: Giá & Nút Thêm */}
                  <div 
                    className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top" 
                    style={{ borderColor: '#f1f5f9' }}
                  >
                    <div className="d-flex flex-column">
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                        {Number(product.price).toLocaleString('vi-VN')}&nbsp;₫
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Đánh giá: {product.numReviews}
                      </span>
                    </div>
                    
                    <button
                      className="btn d-flex align-items-center"
                      style={{
                          backgroundColor: '#0f172a',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '13px',
                          fontWeight: 500,
                          border: 'none',
                          transition: 'background-color 0.2s'
                      }}
                      disabled={!product.countInStock}
                      onClick={(e) => { e.stopPropagation(); addToCartHandler(product); }}
                      onMouseOver={(e) => { if(!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#334155'; }}
                      onMouseOut={(e) => { if(!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#0f172a'; }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                      </svg>
                      {product.countInStock ? 'Thêm' : 'Hết'}
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* --- EXPERT PICKS SECTION --- */}
      {expertPicks.length > 0 && (
        <div className="best-section mt-5">
          <h2 className="best-title mb-4" style={{ fontWeight: 700, color: '#111827' }}>
            Gợi ý từ chuyên gia
          </h2>
          <Row>
            {expertPicks.map((product) => (
              // Thêm class d-flex justify-content-center
              <Col key={product._id} xs={12} sm={6} lg={3} xl={3} className="mb-4 d-flex justify-content-center">
                <Card
                  className="h-100 border-0 shadow-sm"
                  // SỬA: Thêm width: '286px'
                  style={{ width: '286px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', cursor: 'pointer' }}
                  onClick={() => openDetail(product)}
                >
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={product.image}
                      // SỬA: Thay height cố định bằng aspectRatio: '2/3'
                      style={{ aspectRatio: '2/3', objectFit: 'cover' }}
                    />
                    <span
                      className="position-absolute top-0 end-0 m-3 px-3 py-1 text-white fw-bold"
                      style={{
                        backgroundColor: '#8b5a2b',
                        borderRadius: '20px',
                        fontSize: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      ★ {product.rating || 0}
                    </span>
                  </div>
                  <Card.Body className="d-flex flex-column p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        className="text-uppercase fw-bold"
                        style={{ fontSize: '10px', color: '#d97706', letterSpacing: '0.5px' }}
                      >
                        {product.category || 'Sách'}
                      </span>
                      <span style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {product.rating || 0}</span>
                    </div>
                    <Card.Title
                      className="mb-1"
                      style={{
                        fontWeight: 700,
                        fontSize: '16px',
                        fontFamily: '"Merriweather", serif',
                        color: '#111827',
                        lineHeight: '1.4',
                      }}
                    >
                      {product.title}
                    </Card.Title>
                    <div className="mb-3 text-muted" style={{ fontSize: '12px' }}>
                      {product.author}
                    </div>
                    <Card.Text
                      className="flex-grow-1"
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    <div
                      className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top"
                      style={{ borderColor: '#f1f5f9' }}
                    >
                      <div className="d-flex flex-column">
                        <span style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                          {Number(product.price).toLocaleString('vi-VN')}&nbsp;đ
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Đánh giá: {product.numReviews}</span>
                      </div>
                      <button
                        className="btn d-flex align-items-center"
                        style={{
                          backgroundColor: '#0f172a',
                          color: 'white',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '13px',
                          fontWeight: 500,
                          border: 'none',
                          transition: 'background-color 0.2s',
                        }}
                        disabled={!product.countInStock}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCartHandler(product);
                        }}
                        onMouseOver={(e) => {
                          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#334155';
                        }}
                        onMouseOut={(e) => {
                          if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#0f172a';
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="me-1"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        {product.countInStock ? 'Thêm' : 'Hết'}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
};

export default HomeScreen;