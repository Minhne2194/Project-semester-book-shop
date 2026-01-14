import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/userSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux Store
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  // Xử lý chuyển hướng (nếu có redirect url)
  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Nếu đã đăng nhập rồi thì đá về trang chủ (hoặc trang redirect)
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Gọi hàm login từ userSlice
    dispatch(login(email, password));
  };

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1>Đăng Nhập</h1>
          
          {error && <div className='alert alert-danger'>{error}</div>}
          {loading && <div>Đang tải...</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Địa chỉ Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Nhập email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label className='mt-3'>Mật khẩu</Form.Label>
              <Form.Control
                type='password'
                placeholder='Nhập mật khẩu'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              Đăng Nhập
            </Button>
          </Form>

          <Row className='py-3'>
            <Col>
              Chưa có tài khoản? <Link to='/register'>Đăng ký ngay</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;