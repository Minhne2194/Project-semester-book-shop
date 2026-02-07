import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
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
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = userInfo
    ? { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } }
    : {};

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/books/${id}`, config);
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setPrice(data.price || 0);
        setCategory(data.category || '');
        setCountInStock(data.countInStock || 0);
        setImage(data.image || '');
        setDescription(data.description || '');
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(
        `/api/books/${id}`,
        { title, author, price, category, countInStock, image, description },
        config
      );
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
      <h2>Chỉnh sửa sách</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Đang xử lý...</div>}

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="title">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>

        <Form.Group className="my-2" controlId="author">
          <Form.Label>Tác giả</Form.Label>
          <Form.Control value={author} onChange={(e) => setAuthor(e.target.value)} required />
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

        <Form.Group className="my-2" controlId="category">
          <Form.Label>Thể loại</Form.Label>
          <Form.Control value={category} onChange={(e) => setCategory(e.target.value)} />
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

        <Form.Group className="my-2" controlId="image">
          <Form.Label>Ảnh (URL)</Form.Label>
          <Form.Control value={image} onChange={(e) => setImage(e.target.value)} />
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
          Lưu
        </Button>
      </Form>
    </Container>
  );
};

export default BookEditScreen;
