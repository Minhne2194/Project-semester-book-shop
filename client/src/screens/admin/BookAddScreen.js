import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const BookAddScreen = () => {
  // Khởi tạo state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null); // State lưu file upload

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  // Kiểm tra quyền Admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // 1. Khởi tạo FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    formData.append('description', description);

    // 2. Append file ảnh (Quan trọng: key 'image' phải khớp với Backend)
    if (imageFile) {
      formData.append('image', imageFile); 
    }

    try {
      setLoading(true);
      setError(''); // Reset lỗi trước khi gửi

      const config = {
        headers: {
          // KHÔNG tự set Content-Type, để trình duyệt tự xử lý boundary của FormData
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post('/api/books', formData, config);
      
      // Thành công -> Chuyển hướng về trang danh sách
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
          <h2>Thêm Sách Mới</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {loading && <div className="alert alert-info">Đang xử lý...</div>}

          <Form onSubmit={submitHandler}>
            {/* Tên Sách */}
            <Form.Group className="my-2" controlId="title">
              <Form.Label>Tên sách <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên sách"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Tác Giả */}
            <Form.Group className="my-2" controlId="author">
              <Form.Label>Tác giả <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </Form.Group>

            {/* Giá Tiền */}
            <Form.Group className="my-2" controlId="price">
              <Form.Label>Giá tiền <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá"
                value={price}
                min="0"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            {/* Chọn Ảnh */}
            <Form.Group className="my-2" controlId="image">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*" // Chỉ cho phép chọn file ảnh
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Form.Group>

            {/* Thể Loại */}
            <Form.Group className="my-2" controlId="category">
              <Form.Label>Thể loại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập thể loại"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            {/* Số Lượng */}
            <Form.Group className="my-2" controlId="countInStock">
              <Form.Label>Số lượng trong kho</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số lượng"
                value={countInStock}
                min="0"
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            {/* Mô Tả */}
            <Form.Group className="my-2" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3} 
                placeholder="Nhập mô tả sách"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button 
              type="submit" 
              variant="primary" 
              className="mt-3"
              disabled={loading} // Disable nút khi đang loading
            >
              {loading ? 'Đang thêm...' : 'Thêm Sách'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAddScreen;