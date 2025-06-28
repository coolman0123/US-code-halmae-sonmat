import { apiPost, apiGet, apiPut, apiDelete } from './config';

/**
 * 여행 생성 API
 * @param {Object} tripData - 여행 데이터
 * @returns {Promise<Object>} 생성된 여행 정보
 */
export const createTrip = async (tripData) => {
  try {
    const response = await apiPost('/api/trips', tripData);
    return response;
  } catch (error) {
    console.error('여행 생성 실패:', error);
    throw error;
  }
};

/**
 * 모든 여행 목록 조회 API
 * @param {Object} filters - 필터 옵션
 * @param {string} filters.status - 여행 상태
 * @param {string} filters.region - 지역
 * @param {string} filters.hostId - 호스트 ID
 * @returns {Promise<Array>} 여행 목록
 */
export const getAllTrips = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const endpoint = queryParams.toString() 
      ? `/api/trips?${queryParams.toString()}`
      : '/api/trips';
      
    const response = await apiGet(endpoint);
    return response.data;
  } catch (error) {
    console.error('여행 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 여행 조회 API
 * @param {string} tripId - 여행 ID
 * @returns {Promise<Object>} 여행 정보
 */
export const getTripById = async (tripId) => {
  try {
    const response = await apiGet(`/api/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error('여행 조회 실패:', error);
    throw error;
  }
};

/**
 * 여행 정보 수정 API
 * @param {string} tripId - 여행 ID
 * @param {Object} updateData - 수정할 데이터
 * @returns {Promise<Object>} 수정된 여행 정보
 */
export const updateTrip = async (tripId, updateData) => {
  try {
    const response = await apiPut(`/api/trips/${tripId}`, updateData);
    return response;
  } catch (error) {
    console.error('여행 수정 실패:', error);
    throw error;
  }
};

/**
 * 여행 삭제 API
 * @param {string} tripId - 여행 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteTrip = async (tripId) => {
  try {
    const response = await apiDelete(`/api/trips/${tripId}`);
    return response;
  } catch (error) {
    console.error('여행 삭제 실패:', error);
    throw error;
  }
};

/**
 * 여행 참가 신청 API
 * @param {string} tripId - 여행 ID
 * @param {string} email - 참가자 이메일
 * @returns {Promise<Object>} 참가 신청 결과
 */
export const joinTrip = async (tripId, email) => {
  try {
    const response = await apiPost(`/api/trips/${tripId}/join`, { email });
    return response;
  } catch (error) {
    console.error('여행 참가 신청 실패:', error);
    throw error;
  }
};

/**
 * 여행 참가 취소 API
 * @param {string} tripId - 여행 ID
 * @param {string} email - 참가자 이메일
 * @returns {Promise<Object>} 참가 취소 결과
 */
export const leaveTrip = async (tripId, email) => {
  try {
    const response = await apiPost(`/api/trips/${tripId}/leave`, { email });
    return response;
  } catch (error) {
    console.error('여행 참가 취소 실패:', error);
    throw error;
  }
};

/**
 * 여행 취소 API (호스트용)
 * @param {string} tripId - 여행 ID
 * @returns {Promise<Object>} 여행 취소 결과
 */
export const cancelTrip = async (tripId) => {
  try {
    const response = await apiPost(`/api/trips/${tripId}/cancel`);
    return response;
  } catch (error) {
    console.error('여행 취소 실패:', error);
    throw error;
  }
}; 