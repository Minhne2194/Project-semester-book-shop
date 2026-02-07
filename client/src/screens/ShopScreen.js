import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';

// Dữ liệu tĩnh
const pricePresets = [
  { label: 'Tất cả mức giá', val: '' },
  { label: 'Dưới 80.000đ', val: '0-80000' },
  { label: '80.000đ - 160.000đ', val: '80000-160000' },
  { label: '160.000đ - 300.000đ', val: '160000-300000' },
  { label: 'Trên 300.000đ', val: '300000-0' },
];

const ShopScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State bộ lọc
  const [category, setCategory] = useState('Tất cả');
  const [brand, setBrand] = useState('');
  const [supplier, setSupplier] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [priceCustom, setPriceCustom] = useState({ min: '', max: '' });

  // Lấy danh sách Categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ['Tất cả', ...Array.from(set)];
  }, [products]);

  // Logic lọc sản phẩm (Giữ nguyên)
  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'Tất cả') list = list.filter((p) => p.category === category);
    if (brand) list = list.filter((p) => (p.brand || '').toLowerCase() === brand.toLowerCase());
    if (supplier) list = list.filter((p) => (p.supplier || '').toLowerCase() === supplier.toLowerCase());
    
    // Lọc giá theo preset
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      list = list.filter((p) => {
        const price = Number(p.price || 0);
        if (max === 0) return price >= min;
        return price >= min && price < max;
      });
    }
    
    // Lọc giá tự nhập
    if (priceCustom.min || priceCustom.max) {
      const min = Number(priceCustom.min || 0);
      const max = Number(priceCustom.max || Infinity);
      list = list.filter((p) => {
        const price = Number(p.price || 0);
        return price >= min && price <= max;
      });
    }
    return list;
  }, [products, category, brand, supplier, priceRange, priceCustom]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/books');
        setProducts(data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCartHandler = (product, qty = 1) => {
    dispatch(addToCart({ ...product, product: product._id, qty }));
    navigate('/cart');
  };

  // Nút xóa bộ lọc
  const clearFilters = () => {
    setPriceRange('');
    setPriceCustom({ min: '', max: '' });
    setBrand('');
    setSupplier('');
    setCategory('Tất cả');
  };

  return (
    <div className="py-4">
        {/* Header Tiêu đề */}
        <div className="mb-4 pb-2 border-bottom">
            <h2 style={{ fontWeight: 800, color: '#111827' }}>Cửa Hàng Sách</h2>
        </div>

        <Row>
            {/* --- SIDEBAR BỘ LỌC (Cột Trái) --- */}
            <Col lg={3} md={4} className="mb-4">
                <div className="bg-white p-4 rounded-3 shadow-sm border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold m-0" style={{fontSize: '16px'}}>BỘ LỌC TÌM KIẾM</h5>
                        <Button variant="link" size="sm" className="text-decoration-none p-0 text-danger" onClick={clearFilters}>
                            Xóa tất cả
                        </Button>
                    </div>

                    {/* 1. Lọc Giá */}
                    <div className="mb-4">
                        <h6 className="fw-bold mb-2" style={{fontSize: '14px', textTransform: 'uppercase', color:'#4b5563'}}>Khoảng giá</h6>
                        <Form>
                            {pricePresets.map((p) => (
                                <Form.Check 
                                    key={p.val}
                                    type="radio"
                                    id={`price-${p.val}`}
                                    label={p.label}
                                    name="priceGroup"
                                    className="mb-2"
                                    checked={priceRange === p.val}
                                    onChange={() => setPriceRange(p.val)}
                                    style={{fontSize: '14px', color: '#374151'}}
                                />
                            ))}
                        </Form>
                        {/* Input giá tự chọn */}
                        <div className="mt-2 d-flex gap-2 align-items-center">
                            <Form.Control 
                                size="sm" placeholder="Từ" 
                                value={priceCustom.min}
                                onChange={(e)=>setPriceCustom({...priceCustom, min: e.target.value})}
                            />
                            <span>-</span>
                            <Form.Control 
                                size="sm" placeholder="Đến" 
                                value={priceCustom.max}
                                onChange={(e)=>setPriceCustom({...priceCustom, max: e.target.value})}
                            />
                        </div>
                    </div>

                    <hr className="my-3 text-muted" />

                </div>
            </Col>

            {/* --- MAIN CONTENT (Cột Phải) --- */}
            <Col lg={9} md={8}>
                {/* Category Tabs */}
                <div className="mb-4 d-flex flex-wrap gap-2">
                    {categories.map((c) => (
                        <Button
                            key={c}
                            variant={category === c ? 'dark' : 'outline-secondary'}
                            size="sm"
                            className="rounded-pill px-3"
                            style={{ fontWeight: 500 }}
                            onClick={() => setCategory(c)}
                        >
                            {c}
                        </Button>
                    ))}
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <div className="text-center py-5">Đang tải dữ liệu sách...</div>}
                
                {!loading && filtered.length === 0 && (
                     <div className="text-center py-5 border rounded-3 bg-light">
                        <h5 className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h5>
                        <Button variant="link" onClick={clearFilters}>Xóa bộ lọc</Button>
                     </div>
                )}

                {/* Grid Sản Phẩm */}
                <Row>
                    {filtered.map((product) => (
                        // SỬA: Đổi lg={4} thành lg={3} để hiển thị 4 cột/hàng
                        <Col key={product._id} xs={12} sm={6} lg={3} xl={3} className="mb-4">
                            <Card 
                                className="h-100 border-0 shadow-sm" 
                                style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', cursor: 'pointer' }}
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                <div className="position-relative">
                                    <Card.Img 
                                        variant="top" 
                                        src={product.image} 
                                        // SỬA: Giảm chiều cao ảnh xuống 220px
                                        style={{ height: '220px', objectFit: 'cover' }} 
                                    />
                                    {product.numReviews > 50 && (
                                    <span 
                                        className="position-absolute top-0 end-0 m-3 px-3 py-1 text-white fw-bold"
                                        style={{ backgroundColor: '#ef4444', borderRadius: '20px', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                    >
                                        Phổ biến
                                    </span>
                                    )}
                                </div>

                                <Card.Body className="d-flex flex-column p-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        {/* SỬA: Font size 10px */}
                                        <span className="text-uppercase fw-bold" style={{ fontSize: '10px', color: '#d97706', letterSpacing: '0.5px' }}>
                                            {product.category || 'VĂN HỌC'}
                                        </span>
                                        {/* SỬA: Font size 12px */}
                                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {product.rating}</span>
                                    </div>

                                    {/* SỬA: Font size 16px */}
                                    <Card.Title className="mb-1" style={{ fontWeight: 700, fontSize: '16px', fontFamily: '"Merriweather", serif', color: '#111827', lineHeight: '1.4' }}>
                                        {product.title}
                                    </Card.Title>

                                    <div className="mb-3 text-muted" style={{ fontSize: '12px' }}>{product.author}</div>

                                    <Card.Text className="flex-grow-1" style={{ fontSize: '12px', color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {product.description}
                                    </Card.Text>
                                    
                                    <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                                        <div className="d-flex flex-column">
                                            {/* SỬA: Font size 16px */}
                                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#92400e' }}>
                                                {Number(product.price).toLocaleString('vi-VN')}&nbsp;₫
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Đánh giá: {product.numReviews}</span>
                                        </div>
                                        
                                        <button
                                            className="btn d-flex align-items-center"
                                            // SỬA: Padding nhỏ hơn (6px 10px) và font 13px
                                            style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontWeight: 500, border: 'none', transition: 'background-color 0.2s' }}
                                            disabled={product.countInStock === 0}
                                            onClick={(e) => { e.stopPropagation(); addToCartHandler(product); }}
                                            onMouseOver={(e) => { if(!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#334155' }}
                                            onMouseOut={(e) => { if(!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#0f172a' }}
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
            </Col>
        </Row>
    </div>
  );
};

export default ShopScreen;
