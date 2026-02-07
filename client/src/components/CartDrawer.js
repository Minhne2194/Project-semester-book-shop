import React, { useMemo } from 'react';
import { Offcanvas, Button, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.qty * item.price, 0),
    [cartItems]
  );

  const changeQty = (item, delta) => {
    const newQty = item.qty + delta;
    if (newQty < 1) return;
    if (newQty > item.countInStock) return;
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const removeItem = (id) => dispatch(removeFromCart(id));

  const checkoutHandler = () => {
    onHide();
    navigate('/cart');
  };

  return (
    <Offcanvas placement="end" show={show} onHide={onHide} backdrop>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="fw-bold">🛒 Giỏ Hàng</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {cartItems.length === 0 ? (
          <div className="text-center text-muted">Chưa có sản phẩm nào.</div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.product || item._id}
                  className="d-flex gap-3 align-items-center border rounded-3 p-2 mb-3"
                  style={{ background: '#fff' }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    rounded
                    style={{ width: 64, height: 64, objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: 14 }}>
                      {item.title}
                    </div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {item.author}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => changeQty(item, -1)}
                        disabled={item.qty <= 1}
                      >
                        -
                      </Button>
                      <span className="px-2">{item.qty}</span>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => changeQty(item, 1)}
                        disabled={item.qty >= item.countInStock}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ fontSize: 14 }}>
                      {Number(item.price * item.qty).toLocaleString('vi-VN')} đ
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger p-0"
                      onClick={() => removeItem(item.product || item._id)}
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính</span>
                <span className="fw-bold">
                  {Number(subtotal).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <Button
                variant="primary"
                className="w-100 fw-semibold"
                onClick={checkoutHandler}
              >
                Thanh Toán
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
