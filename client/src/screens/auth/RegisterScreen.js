import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../slices/userSlice'; // Import hàm register

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Kiểm tra mật khẩu nhập lại
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp!');
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1>Đăng Ký Tài Khoản</h1>
          
          {message && <div className='alert alert-danger'>{message}</div>}
          {error && <div className='alert alert-danger'>{error}</div>}
          {loading && <div>Đang xử lý...</div>}

          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type='name'
                placeholder='Nhập họ tên'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='email'>
              <Form.Label className='mt-3'>Địa chỉ Email</Form.Label>
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

            <Form.Group controlId='confirmPassword'>
              <Form.Label className='mt-3'>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type='password'
                placeholder='Nhập lại mật khẩu'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              Đăng Ký
            </Button>
          </Form>

          <Row className='py-3'>
            <Col>
              Đã có tài khoản? <Link to='/login'>Đăng nhập</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;