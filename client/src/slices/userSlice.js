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
    // --- LOGIN ---
    userLoginRequest: (state) => {
      state.loading = true;
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
    },

    // --- UPDATE PROFILE (Nguyên nhân lỗi của bạn là thiếu dòng export cho các hàm dưới này) ---
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
  },
});

// --- QUAN TRỌNG: PHẢI EXPORT TẤT CẢ CÁC HÀM Ở TRÊN RA ĐÂY ---
export const {
  userLoginRequest,
  userLoginSuccess,
  userLoginFail,
  userLogout,
  // Bạn đã quên thêm 4 dòng dưới này vào file cũ nên nó báo not defined
  userUpdateProfileRequest,
  userUpdateProfileSuccess,
  userUpdateProfileFail,
  userUpdateProfileReset,
} = userSlice.actions;

export default userSlice.reducer;

// --- API ACTIONS ---

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
};

// 3. Hàm Cập nhật Profile
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    // Bây giờ nó sẽ tìm thấy biến này vì đã export ở trên
    dispatch(userUpdateProfileRequest());

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch(userUpdateProfileSuccess(data));
    
    // Cập nhật lại userLogin để Header hiển thị tên mới ngay lập tức
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
      '/api/users',
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