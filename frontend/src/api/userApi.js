import { apiGet, apiPut, apiDelete } from './config';

/**
 * 모든 사용자 조회 API
 * @returns {Promise<Array>} 사용자 목록
 */
export const getAllUsers = async () => {
  try {
    const response = await apiGet('/api/users');
    return response.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 사용자 조회 API
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 사용자 정보
 */
export const getUserById = async (userId) => {
  try {
    const response = await apiGet(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 정보 수정 API
 * @param {string} userId - 사용자 ID
 * @param {Object} updateData - 수정할 데이터
 * @param {string} updateData.name - 이름
 * @param {string} updateData.phone - 전화번호
 * @returns {Promise<Object>} 수정된 사용자 정보
 */
export const updateUser = async (userId, updateData) => {
  try {
    const response = await apiPut(`/api/users/${userId}`, updateData);
    return response;
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 사용자 삭제 API
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiDelete(`/api/users/${userId}`);
    return response;
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    throw error;
  }
}; 