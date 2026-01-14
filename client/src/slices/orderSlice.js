import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    success: false,
    order: null,      // Đơn hàng vừa tạo hoặc đang xem
    orders: [],       // Danh sách lịch sử đơn hàng
    error: null,
  },
  reducers: {
    // ... Giữ nguyên các reducer cũ (orderCreateRequest...)
    orderCreateRequest: (state) => { state.loading = true; },
    orderCreateSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.order = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderCreateReset: (state) => {
      state.success = false;
      state.order = null;
    },

    // --- THÊM MỚI: Xem chi tiết 1 đơn hàng ---
    orderDetailsRequest: (state) => { state.loading = true; },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- THÊM MỚI: Xem danh sách đơn hàng của tôi ---
    orderListMyRequest: (state) => { state.loading = true; },
    orderListMySuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListMyFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListMyReset: (state) => { // Dùng khi logout
        state.orders = [];
    }
  },
});

export const { 
    orderCreateRequest, orderCreateSuccess, orderCreateFail, orderCreateReset,
    orderDetailsRequest, orderDetailsSuccess, orderDetailsFail,
    orderListMyRequest, orderListMySuccess, orderListMyFail, orderListMyReset
} = orderSlice.actions;

export default orderSlice.reducer;

// ... Giữ nguyên hàm createOrder cũ ...
export const createOrder = (order) => async (dispatch, getState) => {
    // (Code cũ của hàm createOrder giữ nguyên không đổi)
    try {
        dispatch(orderCreateRequest());
        const { userLogin: { userInfo } } = getState();
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.post(`/api/orders`, order, config);
        dispatch(orderCreateSuccess(data));
        dispatch(clearCart());
    } catch (error) {
        dispatch(orderCreateFail(error.response && error.response.data.message ? error.response.data.message : error.message));
    }
};

// --- THÊM MỚI: Action lấy chi tiết đơn hàng ---
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(orderDetailsRequest());

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch(orderDetailsSuccess(data));
  } catch (error) {
    dispatch(orderDetailsFail(error.response && error.response.data.message ? error.response.data.message : error.message));
  }
};

// --- THÊM MỚI: Action lấy danh sách đơn hàng của tôi ---
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListMyRequest());

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`/api/orders/myorders`, config);

    dispatch(orderListMySuccess(data));
  } catch (error) {
    dispatch(orderListMyFail(error.response && error.response.data.message ? error.response.data.message : error.message));
  }
};