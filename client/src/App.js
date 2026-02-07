import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import BookListScreen from './screens/BookListScreen';
import BookEditScreen from './screens/BookEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import ShopScreen from './screens/ShopScreen';
import BlogScreen from './screens/BlogScreen';
import VirtualLibrarian from './components/VirtualLibrarian';
import SearchScreen from './screens/SearchScreen';

const App = () => {
  return (
    <Router>
      <Header />
      
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/cart' element={<CartScreen />} />
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/shipping' element={<ShippingScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/placeorder' element={<PlaceOrderScreen />} />
            <Route path='/order/:id' element={<OrderScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/admin/booklist' element={<BookListScreen />} />
            <Route path='/admin/book/:id/edit' element={<BookEditScreen />} />
            <Route path='/admin/orderlist' element={<OrderListScreen />} />
            <Route path='/shop' element={<ShopScreen />} />
            <Route path='/blog' element={<BlogScreen />} />
            <Route path='/search' element={<SearchScreen />} />
          </Routes>
        </Container>
      </main>

      <Footer />
      <VirtualLibrarian />
    </Router>
  );
};

export default App;
