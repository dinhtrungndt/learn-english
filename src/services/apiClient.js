import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_CONFIG, AUTH_CONFIG } from '../config';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'thuytrieu2026';

// Instance Axios dùng chung cho toàn hệ thống
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: true
});

// Hàm mã hóa dữ liệu
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Hàm giải mã dữ liệu
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    return null;
  }
};

// Request Interceptor: Tự động đính kèm Token và Guest ID (đã giải mã) vào Header
apiClient.interceptors.request.use(
  (config) => {
    // 1. Xử lý Token
    const encryptedToken = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    if (encryptedToken) {
      const token = decryptData(encryptedToken);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // 2. Xử lý Guest ID
    const encryptedGid = localStorage.getItem(AUTH_CONFIG.GUEST_KEY);
    if (encryptedGid) {
      const gid = decryptData(encryptedGid);
      if (gid) {
        config.headers['X-Guest-ID'] = gid;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi 401 toàn hệ thống
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Tự động dọn dẹp khi hết hạn
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      // Có thể reload trang ở đây nếu cần
    }
    return Promise.reject(error);
  }
);

export default apiClient;
