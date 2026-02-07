import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { clearCart } from './cartSlice';

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    loading: false,
    success: false,
    error: null,
    order: null,      
    orders: [],       // Danh sách đơn Admin
    ordersMy: [],     // <--- THÊM: Danh sách đơn của Tôi (Lịch sử mua hàng)
    loadingDeliver: false, 
    successDeliver: false, 
  },
  reducers: {
    // --- TẠO ĐƠN HÀNG ---
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

    // --- LẤY CHI TIẾT ĐƠN HÀNG ---
    orderDetailsRequest: (state) => { state.loading = true; },
    orderDetailsSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- LẤY DANH SÁCH ĐƠN CỦA TÔI (MY ORDERS) --- <--- PHẦN BỔ SUNG
    orderListMyRequest: (state) => { state.loading = true; },
    orderListMySuccess: (state, action) => {
      state.loading = false;
      state.ordersMy = action.payload;
    },
    orderListMyFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderListMyReset: (state) => {
      state.ordersMy = [];
    },

    // --- LẤY DANH SÁCH ĐƠN HÀNG (ADMIN) ---
    orderListRequest: (state) => { state.loading = true; },
    orderListSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderListFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- DUYỆT ĐƠN HÀNG (ADMIN) ---
    orderDeliverRequest: (state) => { state.loadingDeliver = true; },
    orderDeliverSuccess: (state) => {
      state.loadingDeliver = false;
      state.successDeliver = true;
    },
    orderDeliverFail: (state, action) => {
      state.loadingDeliver = false;
      state.error = action.payload;
    },
    orderDeliverReset: (state) => {
      state.successDeliver = false;
    },
  },
});

export const {
  orderCreateRequest, orderCreateSuccess, orderCreateFail, orderCreateReset,
  orderDetailsRequest, orderDetailsSuccess, orderDetailsFail,
  orderListMyRequest, orderListMySuccess, orderListMyFail, orderListMyReset, // <--- Export bổ sung
  orderListRequest, orderListSuccess, orderListFail,
  orderDeliverRequest, orderDeliverSuccess, orderDeliverFail, orderDeliverReset 
} = orderSlice.actions;

export default orderSlice.reducer;

// ================== CÁC HÀM GỌI API (THUNKS) ==================

// 1. TẠO ĐƠN HÀNG
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(orderCreateRequest());
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.post(`/api/orders`, order, config);
    dispatch(orderCreateSuccess(data));
    dispatch(clearCart());
  } catch (error) {
    dispatch(orderCreateFail(error.response?.data?.message || error.message));
  }
};

// 2. LẤY CHI TIẾT 1 ĐƠN
export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(orderDetailsRequest());
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`/api/orders/${id}`, config);
    dispatch(orderDetailsSuccess(data));
  } catch (error) {
    dispatch(orderDetailsFail(error.response?.data?.message || error.message));
  }
};

// 3. LẤY DANH SÁCH ĐƠN CỦA TÔI (MY ORDERS) <--- HÀM BẠN ĐANG THIẾU
export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListMyRequest());
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`/api/orders/myorders`, config);
    dispatch(orderListMySuccess(data));
  } catch (error) {
    dispatch(orderListMyFail(error.response?.data?.message || error.message));
  }
};

// 4. LẤY TẤT CẢ ĐƠN (ADMIN)
export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListRequest());
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    const { data } = await axios.get(`/api/orders`, config);
    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(orderListFail(error.response?.data?.message || error.message));
  }
};

// 5. DUYỆT ĐƠN HÀNG (ADMIN)
export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(orderDeliverRequest());
    const { userLogin: { userInfo } } = getState();
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    await axios.put(`/api/orders/${order._id}/deliver`, {}, config);
    dispatch(orderDeliverSuccess());
  } catch (error) {
    dispatch(orderDeliverFail(error.response?.data?.message || error.message));
  }
};