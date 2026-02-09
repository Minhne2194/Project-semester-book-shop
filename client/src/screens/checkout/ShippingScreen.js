import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import { saveShippingAddress } from '../../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Điền sẵn dữ liệu nếu đã có
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    // Lưu vào Redux
    dispatch(saveShippingAddress({ address, city, phone }));
    // Chuyển sang bước thanh toán
    navigate('/payment');
  };

  return (
    <Container>
        <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
                <CheckoutSteps step1 step2 /> {/* Hiển thị bước 1 và 2 sáng lên */}
                
                <h1>Địa chỉ giao hàng</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='address' className='my-3'>
                    <Form.Label>Địa chỉ nhận hàng</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Số nhà, tên đường, phường xã'
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='city' className='my-3'>
                    <Form.Label>Thành phố / Tỉnh</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Nhập thành phố'
                        value={city}
                        required
                        onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='phone' className='my-3'>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Nhập số điện thoại'
                        value={phone}
                        required
                        onChange={(e) => setPhone(e.target.value)}
                    ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                    Tiếp tục
                    </Button>
                </Form>
            </Col>
        </Row>
    </Container>
  );
};

export default ShippingScreen;