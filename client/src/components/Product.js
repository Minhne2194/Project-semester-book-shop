import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <Card.Title as='div'>
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <div className='my-3'>
            {product.rating} sao ({product.numReviews} đánh giá)
          </div>
        </Card.Text>

        <Card.Text as='h3'>{product.price.toLocaleString('vi-VN')} đ</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;