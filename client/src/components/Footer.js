import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  // Style tổng thể: Nền trắng, chữ xám nhỏ, có border trên
  const footerStyle = {
    backgroundColor: '#ffffff',
    color: '#808089',
    paddingTop: '30px',
    paddingBottom: '30px',
    fontSize: '13px', // Font chữ nhỏ như Tiki
    borderTop: '1px solid #f0f0f0'
  };

  // Style cho tiêu đề cột
  const headingStyle = {
    fontSize: '16px',
    fontWeight: '500', // Đậm vừa phải
    color: '#38383d',
    marginBottom: '12px',
    marginTop: '0'
  };

  // Style cho các link
  const linkStyle = {
    color: '#808089',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px'
  };

  return (
    <footer style={footerStyle}>
      <Container>
        {/* Sử dụng row-cols để chia 5 cột trên màn hình lớn (lg), 2 cột trên tablet (md/sm) */}
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 row-cols-lg-5 g-3">
          
          {/* Cột 1: Hỗ trợ khách hàng */}
          <Col>
            <h5 style={headingStyle}>Hỗ trợ khách hàng</h5>
            <p className="mb-1">Hotline: <strong style={{color: '#333'}}>1900-6035</strong></p>
            <p className="mb-2">(1000 đ/phút, 8-21h kể cả T7, CN)</p>
            <a href="/faq" style={linkStyle}>Các câu hỏi thường gặp</a>
            <a href="/request" style={linkStyle}>Gửi yêu cầu hỗ trợ</a>
            <a href="/guide" style={linkStyle}>Hướng dẫn đặt hàng</a>
            <a href="/shipping" style={linkStyle}>Phương thức vận chuyển</a>
            <a href="/return" style={linkStyle}>Chính sách đổi trả</a>
          </Col>

          {/* Cột 2: Về FamilyBook (Thay cho Về Tiki) */}
          <Col>
            <h5 style={headingStyle}>Về FamilyBook</h5>
            <a href="/about" style={linkStyle}>Giới thiệu FamilyBook</a>
            <a href="/blog" style={linkStyle}>Tuyển dụng</a>
            <a href="/privacy" style={linkStyle}>Chính sách bảo mật thanh toán</a>
            <a href="/privacy-info" style={linkStyle}>Chính sách bảo mật thông tin</a>
            <a href="/terms" style={linkStyle}>Điều khoản sử dụng</a>
            <a href="/seller" style={linkStyle}>Bán hàng cùng FamilyBook</a>
          </Col>

          {/* Cột 3: Hợp tác (Giữ layout giống mẫu) */}
          <Col>
            <h5 style={headingStyle}>Hợp tác và liên kết</h5>
            <a href="/regulation" style={linkStyle}>Quy chế hoạt động Sàn GDTMĐT</a>
            <a href="/coop" style={linkStyle}>Bán hàng cùng FamilyBook</a>
            
            <h5 style={headingStyle} className="mt-4">Chứng nhận bởi</h5>
            <div className="d-flex gap-2">
                {/* Placeholder cho icon Bộ Công Thương */}
                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong-2.png" alt="Bo Cong Thuong" width="32" />
                <img src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg" alt="Bo Cong Thuong" width="80" />
            </div>
          </Col>

          {/* Cột 4: Phương thức thanh toán */}
          <Col>
            <h5 style={headingStyle}>Phương thức thanh toán</h5>
            <div className="d-flex flex-wrap gap-2">
                {/* Giả lập các icon thanh toán bằng div màu hoặc ảnh */}
                {['Visa', 'Master', 'JCB', 'Momo', 'ZaloPay'].map((item) => (
                    <div key={item} style={{
                        border: '1px solid #ddd', 
                        padding: '2px 5px', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        backgroundColor: '#fff'
                    }}>
                        {item}
                    </div>
                ))}
            </div>
            
            <h5 style={headingStyle} className="mt-4">Dịch vụ giao hàng</h5>
            <div style={{color: '#00AB56', fontWeight: 'bold'}}>FAMILY SHIP</div>
          </Col>

          {/* Cột 5: Kết nối */}
          <Col>
            <h5 style={headingStyle}>Kết nối với chúng tôi</h5>
            <div className="d-flex gap-2 mb-3">
                {/* Icon Facebook/Youtube giả lập */}
                <span style={{color: '#3b5998', fontSize: '20px', cursor:'pointer'}}><i className="fab fa-facebook"></i> F</span>
                <span style={{color: '#FF0000', fontSize: '20px', cursor:'pointer'}}><i className="fab fa-youtube"></i> Y</span>
                <span style={{color: '#0068FF', fontSize: '20px', cursor:'pointer'}}><i className="fab fa-zalo"></i> Z</span>
            </div>

            <h5 style={headingStyle}>Tải ứng dụng</h5>
            <div className="d-flex">
                <div className="me-2">
                    {/* Placeholder QR Code */}
                    <div style={{width: '60px', height: '60px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>QR Code</div>
                </div>
                <div className="d-flex flex-column gap-1">
                     <div style={{background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', width: '90px'}}>App Store</div>
                     <div style={{background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', width: '90px'}}>Google Play</div>
                </div>
            </div>
          </Col>

        </Row>
        
        <hr style={{margin: '20px 0', borderColor: '#eee'}} />
        
        {/* Phần bản quyền dưới cùng */}
        <Row>
            <Col>
                <p style={{fontSize: '11px', margin: 0}}>
                   Địa chỉ văn phòng: Trường ĐH Phenikaa - Nhóm 2 <br/>
                   FamilyBook nhận đặt hàng trực tuyến và giao hàng tận nơi.
                </p>
                <p style={{fontSize: '11px', color: '#808089', marginTop: '5px'}}>
                   &copy; 2026 - Bản quyền của Công Ty Cổ Phần FamilyBook.
                </p>
            </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;