import apiClient from './apiClient';
import { addQuestProgress } from './questService';

// Lấy danh sách từ vựng cần ôn tập hôm nay
export const getVocabulariesForReview = async () => {
  try {
    const response = await apiClient.get('/vocabularies/review');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi lấy danh sách ôn tập' };
  }
};

// Lấy toàn bộ danh sách từ vựng
export const getAllVocabularies = async (skip = 0, limit = 100) => {
  try {
    const response = await apiClient.get(`/vocabularies/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi lấy danh sách từ vựng' };
  }
};

// Thêm từ vựng mới
export const addVocabulary = async (vocabData) => {
  try {
    const response = await apiClient.post('/vocabularies/', vocabData);
    addQuestProgress('words', 1);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi khi thêm từ vựng' };
  }
};

// Cập nhật kết quả ôn tập (Nhớ hoặc Quên)
export const reviewVocabulary = async (id, remembered) => {
  try {
    const response = await apiClient.put(`/vocabularies/${id}/review`, { remembered });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi cập nhật tiến độ' };
  }
};

// Cập nhật thông tin từ vựng (nghĩa, ví dụ)
export const updateVocabulary = async (id, vocabData) => {
  try {
    const response = await apiClient.put(`/vocabularies/${id}`, vocabData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi cập nhật từ vựng' };
  }
};

// Xóa từ vựng
export const deleteVocabulary = async (id) => {
  try {
    const response = await apiClient.delete(`/vocabularies/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi xóa từ vựng' };
  }
};
