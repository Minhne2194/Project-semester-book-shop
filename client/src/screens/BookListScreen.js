import React, { useEffect, useState } from 'react';
import { Button, Table, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BookListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const config = userInfo
    ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
    : {};

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/books', config);
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (!window.confirm('Xóa sách này?')) return;
    try {
      await axios.delete(`/api/books/${id}`, config);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const createHandler = async () => {
    try {
      const { data } = await axios.post('/api/books', {}, config);
      navigate(`/admin/book/${data._id}/edit`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Quản lý sách</h2>
        <Button onClick={createHandler} variant="primary">
          Thêm sách
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Giá</th>
              <th>Kho</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{Number(book.price).toLocaleString('vi-VN')} đ</td>
                <td>{book.countInStock}</td>
                <td className="text-end">
                  <LinkContainer to={`/admin/book/${book._id}/edit`}>
                    <Button variant="light" className="btn-sm me-2">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(book._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default BookListScreen;
