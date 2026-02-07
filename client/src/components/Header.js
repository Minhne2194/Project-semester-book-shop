import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/userSlice';
import CartDrawer from './CartDrawer';
import { useEffect, useRef } from 'react';
import './Header.css';

const logoSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23b48366'/%3E%3Ctext x='50' y='72' font-family='Times New Roman, serif' font-weight='bold' font-size='60' text-anchor='middle' fill='white'%3EFB%3C/text%3E%3C/svg%3E";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);
  const [showCart, setShowCart] = useState(false);
  const searchRef = useRef(null);
  const [keyword, setKeyword] = useState('');

  const logoutHandler = () => dispatch(logout());

  const searchHandler = (e) => {
    e.preventDefault();
    const value = keyword.trim();
    navigate(value ? `/search?keyword=${encodeURIComponent(value)}` : '/');
  };

  // Reset keyword when clicking outside the search form
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setKeyword('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
        <Container>

          {/* ===== BRAND + LOGO ===== */}
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center gap-2">
              <img
                src={logoSvg}
                alt="FB logo"
                style={{ width: 44, height: 44 }}
              />

              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  Family Book
                </div>
                <small
                  className="text-muted"
                  style={{ fontSize: 11, letterSpacing: 2 }}
                >
                  STORE
                </small>
              </div>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle />
          <Navbar.Collapse>

            <Form className="d-flex me-3" onSubmit={searchHandler} ref={searchRef}>
              <Form.Control
                type="text"
                placeholder="Tìm sách..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="me-2"
                style={{ width: '500px', maxWidth: '100%' }}
              />
              <Button type="submit" variant="outline-primary">Tìm</Button>
            </Form>

            {/* ===== MENU GIỮA ===== */}
            <Nav className="mx-auto">
              <LinkContainer to="/">
                <Nav.Link>Trang Chủ</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/shop">
                <Nav.Link>Cửa Hàng Sách</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/blog">
                <Nav.Link>Blog</Nav.Link>
              </LinkContainer>
            </Nav>

            {/* ===== RIGHT SIDE ===== */}
            <Nav>
              <Nav.Link onClick={() => setShowCart(true)} style={{ position: 'relative' }}>
                <i className="fas fa-shopping-cart"></i>
                {cartItems.length > 0 && (
                  <Badge bg="danger" pill style={{ position: 'absolute', top: 0, right: 0 }}>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/booklist">
                    <NavDropdown.Item>Quản lý sách</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Quản lý đơn hàng</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      Thông tin cá nhân
                    </NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CartDrawer show={showCart} onHide={() => setShowCart(false)} />
    </header>
  );
};

export default Header;
