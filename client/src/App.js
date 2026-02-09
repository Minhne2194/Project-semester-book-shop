import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import VirtualLibrarian from './components/VirtualLibrarian';

// --- SCREENS: SHOP (Mặt tiền) ---
import HomeScreen from './screens/shop/HomeScreen';
import ProductScreen from './screens/shop/ProductScreen';
import ShopScreen from './screens/shop/ShopScreen';
import BlogScreen from './screens/shop/BlogScreen';
import SearchScreen from './screens/shop/SearchScreen';

// --- SCREENS: AUTH (Tài khoản) ---
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ProfileScreen from './screens/auth/ProfileScreen';

// --- SCREENS: CHECKOUT (Thanh toán) ---
import CartScreen from './screens/checkout/CartScreen';
import ShippingScreen from './screens/checkout/ShippingScreen';
import PaymentScreen from './screens/checkout/PaymentScreen';
import PlaceOrderScreen from './screens/checkout/PlaceOrderScreen';
import OrderScreen from './screens/checkout/OrderScreen';

// --- SCREENS: ADMIN (Quản trị) ---
import BookListScreen from './screens/admin/BookListScreen';
import BookEditScreen from './screens/admin/BookEditScreen';
import BookAddScreen from './screens/admin/BookAddScreen'; // <--- MỚI: Import trang thêm sách
import OrderListScreen from './screens/admin/OrderListScreen';

const App = () => {
  return (
    <Router>
      <Header />
      
      <main className='py-3'>
        <Container>
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path='/' element={<HomeScreen />} />
            <Route path='/shop' element={<ShopScreen />} />
            <Route path='/search' element={<SearchScreen />} />
            <Route path='/blog' element={<BlogScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            
            {/* --- CART & CHECKOUT --- */}
            <Route path='/cart' element={<CartScreen />} /> {/* Có thể thêm /:id? nếu cần */}
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />

            {/* --- AUTH ROUTES --- */}
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />

            {/* --- ADMIN ROUTES --- */}
            <Route path='/admin/orderlist' element={<OrderListScreen />} />
            <Route path='/admin/booklist' element={<BookListScreen />} />
            
            {/* Route cho thêm sách mới (Nên đặt trước route :id để tránh conflict) */}
            <Route path='/admin/book/add' element={<BookAddScreen />} /> 
            
            <Route path='/admin/book/:id/edit' element={<BookEditScreen />} />
          </Routes>
        </Container>
      </main>

      <Footer />
      <VirtualLibrarian />
    </Router>
  );
};

export default App;