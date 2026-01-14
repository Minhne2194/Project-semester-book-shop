import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    userLogin: userReducer,
    orderCreate: orderReducer,
  },
});

export default store;