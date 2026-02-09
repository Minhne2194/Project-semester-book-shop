import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';

const BookEditScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.userLogin);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  // State lưu URL ảnh hiện tại (để hiển thị preview)
  const [image, setImage] = useState('');
  // State lưu File ảnh MỚI (nếu người dùng muốn đổi ảnh)
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchBook = async () => {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get(`/api/books/${id}`, config);
        
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setPrice(data.price || 0);
        setCategory(data.category || '');
        setCountInStock(data.countInStock || 0);
        setImage(data.image || ''); // Lưu URL ảnh cũ
        setDescription(data.description || '');
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // 1. Dùng FormData để gửi dữ liệu (bao gồm cả file nếu có)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('description', description);

    // 2. Chỉ append file nếu người dùng có chọn ảnh mới
    if (imageFile) {
      // Key này phải là 'image' (số ít) để khớp với upload.array('image') ở Backend
      formData.append('image', imageFile);
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          // Khi dùng FormData, trình duyệt tự set Content-Type
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`/api/books/${id}`, formData, config);
      navigate('/admin/booklist');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Link to="/admin/booklist" className="btn btn-light my-3">
        Quay lại
      </Link>
      
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h2>Chỉnh sửa sách</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Đang xử lý...</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="title">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="author">
              <Form.Label>Tác giả</Form.Label>
              <Form.Control
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="price">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={price}
                min="0"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </Form.Group>

            {/* --- PHẦN XỬ LÝ ẢNH --- */}
            <Form.Group className="my-2">
              <Form.Label>Hình ảnh</Form.Label>
              
              {/* Hiển thị ảnh hiện tại */}
              <div className="mb-2">
                <Image src={image} alt={title} fluid rounded style={{ maxHeight: '150px' }} />
                <div className="text-muted small mt-1">Ảnh hiện tại: {image}</div>
              </div>

              {/* Input chọn file mới */}
              <Form.Control
                type="file"
                label="Chọn ảnh mới"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Để trống nếu bạn không muốn thay đổi ảnh.
              </Form.Text>
            </Form.Group>
            {/* ---------------------- */}

            <Form.Group className="my-2" controlId="category">
              <Form.Label>Thể loại</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="countInStock">
              <Form.Label>Số lượng tồn</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                min="0"
                onChange={(e) => setCountInStock(Number(e.target.value))}
              />
            </Form.Group>

            <Form.Group className="my-2" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Cập nhật
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookEditScreen;