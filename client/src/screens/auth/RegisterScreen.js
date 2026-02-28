import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../slices/userSlice';

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
  // Thêm || {} để tránh lỗi nếu state undefined
  const { loading, error, userInfo } = userLogin || {};

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp!');
    } else {
      dispatch(register(name, email, password));
    }
  };

  // Các biến màu sắc đồng bộ với trang Login
  const brandColor = '#d81e5b';
  const textColor = '#333';

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {/* Tiêu đề nằm ngoài khung Box */}
          <h2 style={{ color: '#2b3a4a', marginBottom: '20px', fontFamily: 'serif' }}>
            Đăng Ký Tài Khoản
          </h2>

          {/* Box chứa Form */}
          <div
            style={{
              border: '1px solid #e0e0e0',
              padding: '40px',
              backgroundColor: '#fff',
              borderRadius: '4px'
            }}
          >
            {message && <div className="alert alert-danger">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="my-2">Đang xử lý...</div>}

            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label style={{ color: textColor }}>Họ và Tên</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập họ tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label style={{ color: textColor }}>Địa chỉ Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label style={{ color: textColor }}>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-4">
                <Form.Label style={{ color: textColor }}>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              {/* Đoạn text điều khoản (rất phù hợp cho trang đăng ký) */}
              <p style={{ fontSize: '15px', color: '#333', marginBottom: '25px' }}>
                Bằng cách tạo tài khoản, bạn đồng ý với{' '}
                <Link to="/privacy" style={{ color: brandColor, textDecoration: 'none' }}>
                  Thông Báo Bảo Mật
                </Link>{' '}
                và{' '}
                <Link to="/terms" style={{ color: brandColor, textDecoration: 'none' }}>
                  Điều Khoản Sử Dụng
                </Link>{' '}
                của chúng tôi.
              </p>

              <Button
                type="submit"
                style={{
                  backgroundColor: brandColor,
                  borderColor: brandColor,
                  borderRadius: '25px',
                  padding: '10px 30px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}
              >
                Đăng Ký
              </Button>
            </Form>

            {/* Link chuyển về trang đăng nhập */}
            <div className="mt-4" style={{ fontSize: '15px' }}>
              Đã có tài khoản?{' '}
              <Link
                to={redirect !== '/' ? `/login?redirect=${redirect}` : '/login'}
                style={{ color: brandColor, textDecoration: 'none' }}
              >
                Đăng nhập
              </Link>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;