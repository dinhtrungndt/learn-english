import apiClient from './apiClient';

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi lấy danh sách thư mục' };
  }
};

export const createCategory = async (name) => {
  try {
    const response = await apiClient.post('/categories/', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi tạo thư mục' };
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Lỗi xóa thư mục' };
  }
};
