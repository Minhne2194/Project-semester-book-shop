import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const footerStyle = {
    backgroundColor: 'rgb(40, 20, 70)',
    color: '#ffffff',
    paddingTop: '30px',
    paddingBottom: '30px',
    fontSize: '13px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const headingStyle = {
    fontSize: '16px',
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: '12px',
    marginTop: '0'
  };

  const linkStyle = {
    color: '#ffffff',
    opacity: '0.8',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px'
  };

  return (
    <footer style={footerStyle}>
      <Container>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
          <Col>
            <h5 style={headingStyle}>Hỗ trợ khách hàng</h5>
            <p className="mb-1">Hotline: <strong style={{ color: '#ffffff' }}>1900-6035</strong></p>
            <p className="mb-2" style={{ opacity: '0.7' }}>(1000 đ/phút, 8-21h kể cả T7, CN)</p>
            <a href="/faq" style={linkStyle}>Các câu hỏi thường gặp</a>
            <a href="/request" style={linkStyle}>Gửi yêu cầu hỗ trợ</a>
            <a href="/guide" style={linkStyle}>Hướng dẫn đặt hàng</a>
            <a href="/shipping" style={linkStyle}>Phương thức vận chuyển</a>
            <a href="/return" style={linkStyle}>Chính sách đổi trả</a>
          </Col>

          <Col>
            <h5 style={headingStyle}>Về FamilyBook</h5>
            <a href="/about" style={linkStyle}>Giới thiệu FamilyBook</a>
            <a href="/blog" style={linkStyle}>Tuyển dụng</a>
            <a href="/privacy" style={linkStyle}>Chính sách bảo mật thanh toán</a>
            <a href="/privacy-info" style={linkStyle}>Chính sách bảo mật thông tin</a>
            <a href="/terms" style={linkStyle}>Điều khoản sử dụng</a>
            <a href="/seller" style={linkStyle}>Bán hàng cùng FamilyBook</a>
          </Col>

          <Col>
            <h5 style={headingStyle}>Hợp tác và liên kết</h5>
            <a href="/regulation" style={linkStyle}>Quy chế hoạt động Sàn GDTMĐT</a>
            <a href="/coop" style={linkStyle}>Bán hàng cùng FamilyBook</a>

            <h5 style={headingStyle} className="mt-4">Chứng nhận bởi</h5>
            <div className="d-flex gap-2">
              <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png" alt="Bo Cong Thuong" width="32" style={{ filter: 'brightness(1)' }} />
              <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg" alt="Bo Cong Thuong" width="80" style={{ filter: 'brightness(1)' }} />
            </div>
          </Col>

          <Col>
            <h5 style={headingStyle}>Phương thức thanh toán</h5>
            <div className="d-flex flex-wrap gap-2">
              {['Visa', 'Master', 'JCB', 'Momo', 'ZaloPay'].map((item) => (
                <div key={item} style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '2px 5px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }}>
                  {item}
                </div>
              ))}
            </div>

            <h5 style={headingStyle} className="mt-4">Dịch vụ giao hàng</h5>
            <div style={{ color: '#00fb7e', fontWeight: 'bold' }}>FAMILY SHIP</div>
          </Col>

          <Col>
            <h5 style={headingStyle}>Kết nối với chúng tôi</h5>
            <div className="d-flex gap-2 mb-3">
              <span style={{ color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}><i className="fab fa-facebook"></i> </span>
              <span style={{ color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}><i className="fab fa-youtube"></i> </span>
              <span style={{ color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}><i className="fab fa-zalo"></i> </span>
            </div>

            <h5 style={headingStyle}>Tải ứng dụng</h5>
            <div className="d-flex">
              <div className="me-2">
                <div style={{ width: '60px', height: '60px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>QR Code</div>
              </div>
              <div className="d-flex flex-column gap-1">
                <div style={{ background: '#ffffff', color: 'rgb(40, 20, 70)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', width: '90px', fontWeight: 'bold', textAlign: 'center' }}>App Store</div>
                <div style={{ background: '#ffffff', color: 'rgb(40, 20, 70)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', width: '90px', fontWeight: 'bold', textAlign: 'center' }}>Google Play</div>
              </div>
            </div>
          </Col>
        </Row>

        <hr style={{ margin: '20px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <Row>
          <Col>
            <p style={{ fontSize: '11px', margin: 0, opacity: '0.8' }}>
              Địa chỉ văn phòng: Trường ĐH Phenikaa - Nhóm 2 <br />
              FamilyBook nhận đặt hàng trực tuyến và giao hàng tận nơi.
            </p>
            <p style={{ fontSize: '11px', color: '#ffffff', marginTop: '5px', opacity: '0.6' }}>
              &copy; 2026 - Bản quyền của Công Ty Cổ Phần FamilyBook.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;