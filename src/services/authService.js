import { AUTH_CONFIG } from '../config';
import apiClient, { decryptData, encryptData } from './apiClient';
import CryptoJS from 'crypto-js';

// Đăng ký tài khoản
export const register = async (userData) => {
  try {
    const hashedUserData = {
      ...userData,
      password: CryptoJS.SHA256(userData.password).toString()
    };
    const response = await apiClient.post('/auth/register', hashedUserData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', hashedPassword);

    // Call Login
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data) {
      // Mã hóa và lưu token
      if (response.data.access_token) {
        const encryptedToken = encryptData(response.data.access_token);
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, encryptedToken);
      }

      const userResponse = await apiClient.get('/auth/me');

      // Mã hóa và lưu thông tin user
      const { username: uname, name, email, phone, role, created_at } = userResponse.data;
      const encryptedUser = encryptData({ username: uname, name, email, phone, role, created_at });
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedUser);

      return userResponse.data;
    }
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Đăng xuất
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (err) {
    console.warn('Logout API missed');
  }
  localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
};

// Lấy thông tin người dùng hiện tại từ localStorage
export const getCurrentUser = () => {
  const encryptedUser = localStorage.getItem(AUTH_CONFIG.USER_KEY);
  if (!encryptedUser) return null;
  return decryptData(encryptedUser);
};

// Lấy thông tin user profile từ API
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    const currentUser = getCurrentUser();

    if (response.data) {
      const updatedUser = { ...currentUser, ...response.data };
      const encryptedUser = encryptData(updatedUser);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedUser);
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
    }
    throw error.response?.data || { detail: 'Lỗi kết nối server' };
  }
};

// Cập nhật thông tin profile
export const updateProfileAPI = async (payload) => {
  try {
    const response = await apiClient.put('/auth/me', payload);
    const currentUser = getCurrentUser();

    if (response.data) {
      const updatedUser = { ...currentUser, ...response.data };
      const encryptedUser = encryptData(updatedUser);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedUser);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi cập nhật thông tin' };
  }
};

// Đặt lại mật khẩu (quên mật khẩu)
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await apiClient.post(`/auth/reset-password?email=${encodeURIComponent(email)}&new_password=${encodeURIComponent(newPassword)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi đặt lại mật khẩu' };
  }
};

// Ghi nhận 1 phiên học (Cộng XP và Streak)
export const recordStudySession = async () => {
  try {
    const response = await apiClient.post('/auth/me/study-session');
    const currentUser = getCurrentUser();
    if (response.data) {
      const updatedUser = { ...currentUser, ...response.data };
      const encryptedUser = encryptData(updatedUser);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, encryptedUser);
    }
    return response.data;
  } catch (error) {
    console.error("Lỗi ghi nhận phiên học:", error);
    return null;
  }
};

// Lấy Bảng xếp hạng
export const getLeaderboard = async () => {
  try {
    const response = await apiClient.get('/auth/leaderboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi lấy bảng xếp hạng' };
  }
};

// Upload ảnh đại diện
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi upload ảnh' };
  }
};

// Upload ảnh dùng chung (cho chat,...)
export const uploadChatImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // Sử dụng endpoint chung /upload/ thay vì /upload/avatar
    const response = await apiClient.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi upload ảnh' };
  }
};

export { apiClient };
