import React, { useState } from 'react';
import { Form, Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import { savePaymentMethod } from '../../slices/cartSlice';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();

  // Nếu chưa nhập địa chỉ mà cố vào trang này -> đá về trang nhập địa chỉ
  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('COD'); // Mặc định chọn COD

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder'); // Chuyển sang bước cuối: Đặt hàng
  };

  return (
    <Container>
        <Row className='justify-content-md-center'>
            <Col xs={12} md={6}>
                <CheckoutSteps step1 step2 step3 />
                
                <h1>Phương thức thanh toán</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-3'>
                    <Form.Label as='legend'>Chọn phương thức</Form.Label>
                    <Col>
                        <Form.Check
                        type='radio'
                        label='Thanh toán khi nhận hàng (COD)'
                        id='COD'
                        name='paymentMethod'
                        value='COD'
                        checked
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check>
                        
                        {/* Sau này có thể mở rộng thêm PayPal/Momo ở đây */}
                        {/* <Form.Check
                        type='radio'
                        label='PayPal hoặc Thẻ tín dụng'
                        id='PayPal'
                        name='paymentMethod'
                        value='PayPal'
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        ></Form.Check> */}
                    </Col>
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

export default PaymentScreen;