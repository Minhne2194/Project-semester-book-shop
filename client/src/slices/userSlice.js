import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Lấy thông tin user từ LocalStorage nếu có
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  success: false, // Dùng cho việc update profile
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // --- LOGIN & REGISTER ---
    userLoginRequest: (state) => {
      state.loading = true;
      state.error = null; // Reset lỗi khi bắt đầu request mới
    },
    userLoginSuccess: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      state.error = null;
    },
    userLoginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userLogout: (state) => {
      state.userInfo = null;
      state.error = null;
      state.success = false;
    },

    // --- UPDATE PROFILE ---
    userUpdateProfileRequest: (state) => {
      state.loading = true;
    },
    userUpdateProfileSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.userInfo = action.payload;
      state.error = null;
    },
    userUpdateProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userUpdateProfileReset: (state) => {
      state.success = false;
    },

    // --- QUAN TRỌNG: Hàm xóa lỗi (Dùng khi chuyển trang) ---
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export tất cả các Actions
export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userLogout,
  userUpdateProfileRequest,
  userUpdateProfileSuccess,
  userUpdateProfileFail,
  userUpdateProfileReset,
  clearError, // Đừng quên export hàm này
} = userSlice.actions;

export default userSlice.reducer;

// --- API ACTIONS (THUNKS) ---

// 1. Hàm Đăng nhập
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(userLoginRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    dispatch(userLoginSuccess(data));
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      userLoginFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

// 2. Hàm Đăng xuất
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch(userLogout());
  document.location.href = '/login'; // Reset hoàn toàn state bằng cách reload trang (tuỳ chọn)
};

// 3. Hàm Đăng ký
export const register = (name, email, password) => async (dispatch) => {
  try {
    // Tận dụng lại actions của Login vì đăng ký xong cũng là login luôn
    dispatch(userLoginRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users', // Route đăng ký
      { name, email, password },
      config
    );

    dispatch(userLoginSuccess(data)); // Đăng ký thành công -> Login luôn
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      userLoginFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

// 4. Hàm Cập nhật Profile
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch(userUpdateProfileRequest());

    const {
      userLogin: { userInfo }, // Lấy token từ state hiện tại
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch(userUpdateProfileSuccess(data));
    
    // Cập nhật lại thông tin đăng nhập để Header hiển thị tên mới ngay lập tức
    dispatch(userLoginSuccess(data));
    
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      userUpdateProfileFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};