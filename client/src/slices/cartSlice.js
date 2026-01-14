import { createSlice } from '@reduxjs/toolkit';

// Lấy địa chỉ từ LocalStorage nếu có
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

// Lấy phương thức thanh toán
const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  shippingAddress: shippingAddressFromStorage, // <--- Mới
  paymentMethod: paymentMethodFromStorage,     // <--- Mới
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
       // ... (Giữ nguyên code cũ đoạn này) ...
       const newItem = action.payload;
       const existItem = state.cartItems.find((x) => x.product === newItem.product);
       if (existItem) {
         state.cartItems = state.cartItems.map((x) =>
           x.product === existItem.product ? newItem : x
         );
       } else {
         state.cartItems = [...state.cartItems, newItem];
       }
       localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
       // ... (Giữ nguyên code cũ đoạn này) ...
       state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
       localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // --- THÊM 2 HÀM NÀY ---
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
        state.cartItems = [];
        localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart } = cartSlice.actions;
export default cartSlice.reducer;