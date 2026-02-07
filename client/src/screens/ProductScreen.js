import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Row, Col, Image, Card, Button, Container, Badge } from 'react-bootstrap';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: prod }, { data: list }] = await Promise.all([
          axios.get(`/api/books/${id}`),
          axios.get('/api/books'),
        ]);
        setProduct(prod);
        setAllProducts(list);
        setQty(1);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, [id]);

  const related = useMemo(() => {
    if (!allProducts.length || !product.category) return [];
    return allProducts
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 4);
  }, [allProducts, product]);

  const handleQtyChange = (amount) => {
    const newQty = qty + amount;
    if (newQty >= 1 && newQty <= (product.countInStock || 10)) {
      setQty(newQty);
    }
  };

  const addToCartHandler = () => {
    if (!product._id) return;
    dispatch(addToCart({ ...product, product: product._id, qty }));
    navigate('/cart');
  };

  if (!product._id) return <div className="text-center py-5">Đang tải dữ liệu...</div>;

  // Component Icon Chevron Right (Mũi tên)
  const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af', margin: '0 8px', flexShrink: 0 }}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  return (
    <Container className="py-4">
      
      {/* --- BREADCRUMB CUSTOM (CẬP NHẬT: Thêm Tên Sách) --- */}
      <nav 
        className="d-flex align-items-center mb-4 text-muted select-none" 
        style={{ fontSize: '14px', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}
      >
        {/* 1. Trang chủ */}
        <span 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = '#9a3412'}
          onMouseOut={(e) => e.target.style.color = 'inherit'}
        >
          Trang chủ
        </span>
        
        <ChevronRight />
        
        {/* 2. Cửa hàng */}
        <span 
          onClick={() => navigate('/shop')} 
          style={{ cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = '#9a3412'}
          onMouseOut={(e) => e.target.style.color = 'inherit'}
        >
          Cửa hàng sách
        </span>

        {/* 3. Danh mục (nếu có) */}
        {product.category && (
          <>
            <ChevronRight />
            <span style={{ color: '#6b7280' }}>
              {product.category}
            </span>
          </>
        )}

        {/* 4. Tên sách (MỚI THÊM) */}
        {product.title && (
          <>
            <ChevronRight />
            <span 
              className="text-dark fw-bold" 
              style={{ 
                maxWidth: '250px',       // Giới hạn chiều dài tên sách
                overflow: 'hidden',      // Ẩn phần thừa
                textOverflow: 'ellipsis' // Thêm dấu ...
              }}
              title={product.title}      // Hover vào sẽ hiện full tên
            >
              {product.title}
            </span>
          </>
        )}
      </nav>

      {/* --- PRODUCT MAIN CARD --- */}
      <Card className="shadow-sm border-0 mb-5" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Row className="g-0">
          {/* Cột Trái: Ảnh */}
          <Col md={5} className="d-flex align-items-center justify-content-center bg-white p-5">
            <div style={{ maxWidth: '350px', width: '100%' }}>
              <Image 
                src={product.image} 
                alt={product.title} 
                fluid 
                className="shadow rounded"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Col>

          {/* Cột Phải: Thông tin */}
          <Col md={7} style={{ backgroundColor: '#fcfaf9' }}>
            <div className="p-4 p-md-5 h-100 d-flex flex-column">
              <div>
                <Badge bg="transparent" className="mb-2 text-uppercase px-0 fw-bold" style={{ color: '#d97706', fontSize: '12px', letterSpacing: '1px' }}>
                  {product.category || 'SÁCH'}
                </Badge>
                
                <h1 className="fw-bold mb-3" style={{ fontSize: '2rem', color: '#111827', fontFamily: '"Merriweather", serif' }}>
                  {product.title}
                </h1>

                {/* Rating */}
                <div className="d-flex align-items-center mb-4">
                  <span style={{ color: '#f59e0b', fontSize: '1.1rem', marginRight: '8px' }}>
                    {'★'.repeat(Math.floor(product.rating || 0)) + '☆'.repeat(5 - Math.floor(product.rating || 0))}
                  </span>
                  <span className="text-muted small border-start ps-2" style={{ lineHeight: 1 }}>
                    {product.numReviews} đánh giá &nbsp;|&nbsp; Tác giả: <strong>{product.author}</strong>
                  </span>
                </div>

                {/* Giá */}
                <div className="mb-4" style={{ fontSize: '2rem', fontWeight: 800, color: '#9a3412' }}>
                  {Number(product.price).toLocaleString('vi-VN')} ₫
                </div>

                {/* Mô tả ngắn */}
                <p className="text-secondary mb-4" style={{ lineHeight: '1.6', fontSize: '15px' }}>
                  {product.description ? product.description.substring(0, 180) + '...' : 'Đang cập nhật mô tả.'}
                </p>
              </div>

              <div className="mt-auto pt-4 border-top" style={{ borderColor: '#e5e7eb' }}>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {product.countInStock > 0 ? (
                    <>
                      {/* Bộ chọn số lượng */}
                      <div className="d-flex align-items-center bg-white border rounded px-2" style={{ height: '48px' }}>
                        <Button 
                          variant="link" 
                          className="text-dark text-decoration-none px-2 fw-bold"
                          onClick={() => handleQtyChange(-1)}
                          disabled={qty <= 1}
                        >-</Button>
                        <span className="px-3 fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>{qty}</span>
                        <Button 
                          variant="link" 
                          className="text-dark text-decoration-none px-2 fw-bold"
                          onClick={() => handleQtyChange(1)}
                          disabled={qty >= product.countInStock}
                        >+</Button>
                      </div>

                      <Button 
                        style={{ backgroundColor: '#0f172a', border: 'none', height: '48px' }}
                        className="px-4 fw-bold flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={addToCartHandler}
                      >
                         <span>Thêm vào giỏ</span>
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" size="lg" disabled className="w-100" style={{ height: '48px' }}>
                      Hết hàng
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* --- TABS --- */}
        <div className="border-top">
          <div className="d-flex bg-white border-bottom">
            <button 
              className="btn rounded-0 py-3 px-4 fw-bold"
              style={{ 
                borderBottom: activeTab === 'desc' ? '3px solid #9a3412' : '3px solid transparent', 
                color: activeTab === 'desc' ? '#9a3412' : '#6b7280' 
              }}
              onClick={() => setActiveTab('desc')}
            >
              MÔ TẢ SÁCH
            </button>
            <button 
              className="btn rounded-0 py-3 px-4 fw-bold"
              style={{ 
                borderBottom: activeTab === 'reviews' ? '3px solid #9a3412' : '3px solid transparent', 
                color: activeTab === 'reviews' ? '#9a3412' : '#6b7280' 
              }}
              onClick={() => setActiveTab('reviews')}
            >
              ĐÁNH GIÁ ({product.numReviews})
            </button>
          </div>
          
          <div className="p-4 p-md-5 bg-white">
            {activeTab === 'desc' ? (
              <div style={{ maxWidth: '800px' }}>
                <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                  {product.description || 'Nội dung đang được cập nhật...'}
                </p>
                <div className="mt-4 p-3 bg-light rounded border">
                   <h6 className="fw-bold mb-2 text-dark">Thông tin chi tiết</h6>
                   <ul className="mb-0 ps-3 small text-secondary">
                     <li className="mb-1">Mã sản phẩm: <span className="text-dark">{product._id}</span></li>
                     <li className="mb-1">Kho: <span className="text-dark">{product.countInStock} cuốn</span></li>
                     <li>Nhà cung cấp: <span className="text-dark">{product.supplier || 'Đang cập nhật'}</span></li>
                   </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted bg-light rounded">
                Tính năng bình luận đang được phát triển.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* --- RELATED PRODUCTS --- */}
      {related.length > 0 && (
        <div className="mt-5">
          <h4 className="fw-bold mb-4" style={{ color: '#111827' }}>Có thể bạn sẽ thích</h4>
          <Row>
            {related.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={item.image} 
                      style={{ height: '220px', objectFit: 'cover' }} 
                    />
                  </div>
                  <Card.Body className="d-flex flex-column p-3">
                    <div className="text-uppercase fw-bold mb-1" style={{ fontSize: '10px', color: '#d97706' }}>
                       {item.category}
                    </div>
                    <Card.Title 
                      className="text-truncate mb-2" 
                      style={{ fontSize: '15px', fontWeight: 700, cursor: 'pointer', color: '#111827' }}
                      onClick={() => {
                          navigate(`/product/${item._id}`);
                          window.scrollTo(0,0);
                      }}
                    >
                      {item.title}
                    </Card.Title>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span style={{ fontWeight: 700, color: '#9a3412' }}>{Number(item.price).toLocaleString('vi-VN')} ₫</span>
                        <Button 
                            size="sm"
                            variant="outline-dark"
                            style={{ fontSize: '12px' }}
                            onClick={() => {
                                dispatch(addToCart({ ...item, product: item._id, qty: 1 }));
                                navigate('/cart');
                            }}
                            disabled={!item.countInStock}
                        >
                            Thêm
                        </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
};

export default ProductScreen;