import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// CẬP NHẬT: Import thêm clearError
import { login, clearError } from '../slices/userSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Effect 1: Xử lý chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // Effect 2 (MỚI): Xóa lỗi khi rời khỏi trang hoặc component unmount
  useEffect(() => {
    // Hàm cleanup này chạy khi component bị hủy (người dùng chuyển sang trang khác)
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]); 
  
  // Mẹo: Nếu bạn muốn xóa lỗi ngay khi người dùng bắt đầu nhập lại email/pass, 
  // bạn có thể thêm dispatch(clearError()) vào hàm onChange của input.

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })); // Lưu ý: kiểm tra xem action login nhận object hay tham số rời
  };

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1 className='my-3'>Đăng Nhập</h1>

          {/* Hiển thị lỗi */}
          {error && <div className='alert alert-danger'>{error}</div>}
          
          {loading && <div className='my-2'>Đang tải...</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Địa chỉ Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Nhập email'
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    // (Tuỳ chọn) Xóa lỗi ngay khi người dùng sửa lại email
                    // if(error) dispatch(clearError()); 
                }}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label className='mt-3'>Mật khẩu</Form.Label>
              <Form.Control
                type='password'
                placeholder='Nhập mật khẩu'
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    // (Tuỳ chọn) Xóa lỗi ngay khi người dùng sửa lại pass
                    // if(error) dispatch(clearError());
                }}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              Đăng Nhập
            </Button>
          </Form>

          <Row className='py-3'>
            <Col>
              Chưa có tài khoản? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Đăng ký ngay</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;