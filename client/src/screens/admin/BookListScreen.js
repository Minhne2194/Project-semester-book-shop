import React, { useEffect, useState } from 'react';
import { Button, Table, Container, Row, Col } from 'react-bootstrap';
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

  // Config header chứa Token cho các request
  const config = userInfo
    ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
    : {};

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Lấy toàn bộ sách (hoặc theo trang nếu bạn có phân trang)
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) return;
    try {
      await axios.delete(`/api/books/${id}`, config);
      // Xóa xong thì load lại danh sách để cập nhật giao diện
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  // --- SỬA ĐỔI QUAN TRỌNG Ở ĐÂY ---
  const createHandler = () => {
    // KHÔNG gọi API tạo ngay lập tức nữa.
    // Chuyển hướng sang trang Thêm Sách (BookAddScreen) để điền form
    navigate('/admin/book/add');
  };

  return (
    <Container>
      <Row className='align-items-center my-3'>
        <Col>
          <h1>Quản lý Sách</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createHandler}>
            <i className='fas fa-plus'></i> Thêm sách mới
          </Button>
        </Col>
      </Row>

      {error && <div className="alert alert-danger">{error}</div>}
      
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>TÊN SÁCH</th>
              <th>GIÁ</th>
              <th>THỂ LOẠI</th>
              <th>TÁC GIẢ</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book._id}</td>
                <td>{book.title}</td>
                <td>{Number(book.price).toLocaleString('vi-VN')} đ</td>
                <td>{book.category}</td>
                <td>{book.author}</td>
                <td>
                  {/* Nút Sửa: Dẫn tới trang Edit */}
                  <LinkContainer to={`/admin/book/${book._id}/edit`}>
                    <Button variant="light" className="btn-sm me-2">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  
                  {/* Nút Xóa */}
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