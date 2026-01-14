import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // <--- Import Hook
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'; // <--- Thêm NavDropdown
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../slices/userSlice'; // <--- Import hàm logout

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
              <LinkContainer to='/cart'>
                <Nav.Link><i className='fas fa-shopping-cart'></i> Giỏ hàng</Nav.Link>
              </LinkContainer>

              {/* LOGIC HIỂN THỊ: Nếu có userInfo thì hiện Dropdown, không thì hiện nút Đăng nhập */}
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
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;