import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../slices/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  
  // Lấy thông tin user từ Redux
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>BOOKSHOP</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              
              {/* 1. Link Giỏ hàng */}
              <LinkContainer to='/cart'>
                <Nav.Link><i className='fas fa-shopping-cart'></i> Giỏ hàng</Nav.Link>
              </LinkContainer>

              {/* 2. Menu User (Đăng nhập / Profile) */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Thông tin cá nhân</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link><i className='fas fa-user'></i> Đăng nhập</Nav.Link>
                </LinkContainer>
              )}

              {/* 3. MENU ADMIN (ĐOẠN MỚI THÊM) */}
              {/* Chỉ hiện khi đã đăng nhập VÀ là Admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Quản trị' id='adminmenu'>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Quản lý Đơn hàng</NavDropdown.Item>
                  </LinkContainer>
                  {/* Sau này thêm Quản lý sách ở đây */}
                </NavDropdown>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;