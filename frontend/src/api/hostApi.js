import { apiPost, apiGet, apiPut, apiDelete } from './config';

/**
 * 호스트 등록 API
 * @param {Object} hostData - 호스트 등록 데이터
 * @returns {Promise<Object>} 등록된 호스트 정보
 */
export const registerHost = async (hostData) => {
  try {
    const response = await apiPost('/api/hosts', hostData);
    return response;
  } catch (error) {
    console.error('호스트 등록 실패:', error);
    throw error;
  }
};

/**
 * 모든 호스트 목록 조회 API
 * @returns {Promise<Array>} 호스트 목록
 */
export const getAllHosts = async () => {
  try {
    const response = await apiGet('/api/hosts');
    return response.data;
  } catch (error) {
    console.error('호스트 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 호스트 조회 API
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 호스트 정보
 */
export const getHostById = async (hostId) => {
  try {
    const response = await apiGet(`/api/hosts/${hostId}`);
    return response.data;
  } catch (error) {
    console.error('호스트 조회 실패:', error);
    throw error;
  }
};

/**
 * 주소 지오코딩 API
 * @param {string} address - 검색할 주소
 * @returns {Promise<Object>} 지오코딩 결과
 */
export const geocoding = async (address) => {
  try {
    const response = await apiGet(`/api/hosts/geocoding?address=${encodeURIComponent(address)}`);
    return response.data;
  } catch (error) {
    console.error('지오코딩 실패:', error);
    throw error;
  }
};

/**
 * 호스트 삭제 API
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteHost = async (hostId) => {
  try {
    const response = await apiDelete(`/api/hosts/${hostId}`);
    return response;
  } catch (error) {
    console.error('호스트 삭제 실패:', error);
    throw error;
  }
}; 