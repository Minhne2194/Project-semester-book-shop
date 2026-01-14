import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/books/${id}`);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if(!product._id){
      console.error("Lỗi: product._id không tồn tại.");
      return;
    }

    dispatch(addToCart({ ...product, product: product._id, qty }));
    navigate('/cart');
  }

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Trở về
      </Link>
      <Row>
        {/* Cột 1: Ảnh bìa sách */}
        <Col md={6}>
          <Image src={product.image} alt={product.title} fluid />
        </Col>

        {/* Cột 2: Thông tin chi tiết */}
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>{product.title}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              Tác giả: {product.author}
            </ListGroup.Item>
            <ListGroup.Item>
              Đánh giá: {product.rating} sao ({product.numReviews} lượt)
            </ListGroup.Item>
            <ListGroup.Item>
              Giá: {product.price?.toLocaleString('vi-VN')} đ
            </ListGroup.Item>
            <ListGroup.Item>
              Mô tả: {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Cột 3: Khung đặt mua */}
        <Col md={3}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Row>
                  <Col>Giá:</Col>
                  <Col>
                    <strong>{product.price?.toLocaleString('vi-VN')} đ</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Trạng thái:</Col>
                  <Col>
                    {product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Số lượng</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(product.countInStock).keys()].slice(0, 10).map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className='btn-block'
                  type='button'
                  disabled={product.countInStock === 0}
                >
                  Thêm vào giỏ
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;