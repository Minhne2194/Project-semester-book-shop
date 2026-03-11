import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../../components/CheckoutSteps';
import { savePaymentMethod } from '../../slices/cartSlice';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
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
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Form.Check
                  type='radio'
                  label='Chuyển khoản ngân hàng (VietQR)'
                  id='BankTransfer'
                  name='paymentMethod'
                  value='BankTransfer'
                  checked={paymentMethod === 'BankTransfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
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