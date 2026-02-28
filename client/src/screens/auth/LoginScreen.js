import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../slices/userSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin || {};

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const brandColor = '#d81e5b';
  const textColor = '#333';

  return (
    <Container className="py-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          {/* Tiêu đề nằm ngoài khung Box */}
          <h2 style={{ color: '#2b3a4a', marginBottom: '20px', fontFamily: 'serif' }}>
            Đăng Nhập
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
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="my-2">Đang tải...</div>}

            <Form onSubmit={submitHandler}>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label style={{ color: textColor }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label style={{ color: textColor }}>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '4px', padding: '10px' }}
                />
              </Form.Group>

              {/* Checkbox Ghi nhớ đăng nhập */}
              <Form.Group className="mb-4" controlId="rememberMe">
                <Form.Check
                  type="checkbox"
                  label="Ghi nhớ đăng nhập"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ color: '#555' }}
                />
              </Form.Group>

              {/* Đoạn text điều khoản */}
              <p style={{ fontSize: '15px', color: '#333', marginBottom: '25px' }}>
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <Link to="/privacy" style={{ color: brandColor, textDecoration: 'none' }}>
                  Thông Báo Bảo Mật
                </Link>{' '}
                và{' '}
                <Link to="/terms" style={{ color: brandColor, textDecoration: 'none' }}>
                  Điều Khoản Sử Dụng
                </Link>{' '}
                của chúng tôi.
              </p>

              {/* Nút Đăng nhập bo tròn */}
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
                Đăng Nhập
              </Button>
            </Form>

            {/* Link Đăng ký / Quên mật khẩu ở dưới cùng */}
            <div className="mt-4" style={{ fontSize: '15px' }}>
              hoặc{' '}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : '/register'}
                style={{ color: brandColor, textDecoration: 'none' }}
              >
                Tạo tài khoản mới
              </Link>{' '}
              |{' '}
              <Link
                to="/forgot-password"
                style={{ color: brandColor, textDecoration: 'none' }}
              >
                Quên mật khẩu?
              </Link>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;