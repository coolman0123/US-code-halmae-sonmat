import { apiPost, apiGet, apiPut, apiDelete } from './config';

/**
 * 리뷰 작성 API
 * @param {Object} reviewData - 리뷰 데이터
 * @param {string} reviewData.hostId - 호스트 ID
 * @param {string} reviewData.userId - 사용자 ID
 * @param {number} reviewData.rating - 별점 (1-5)
 * @param {string} reviewData.content - 리뷰 내용
 * @returns {Promise<Object>} 작성된 리뷰 정보
 */
export const createReview = async (reviewData) => {
  try {
    const response = await apiPost('/api/reviews', reviewData);
    return response;
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
    throw error;
  }
};

/**
 * 모든 리뷰 조회 API
 * @returns {Promise<Array>} 리뷰 목록
 */
export const getAllReviews = async () => {
  try {
    const response = await apiGet('/api/reviews');
    return response.data;
  } catch (error) {
    console.error('리뷰 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 리뷰 조회 API
 * @param {string} reviewId - 리뷰 ID
 * @returns {Promise<Object>} 리뷰 정보
 */
export const getReviewById = async (reviewId) => {
  try {
    const response = await apiGet(`/api/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('리뷰 조회 실패:', error);
    throw error;
  }
};

/**
 * 호스트별 리뷰 조회 API
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 호스트 리뷰 정보 (리뷰 목록, 평균 평점, 총 리뷰 수)
 */
export const getReviewsByHostId = async (hostId) => {
  try {
    const response = await apiGet(`/api/reviews/host/${hostId}`);
    return response.data;
  } catch (error) {
    console.error('호스트 리뷰 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자별 리뷰 조회 API
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Array>} 사용자 리뷰 목록
 */
export const getReviewsByUserId = async (userId) => {
  try {
    const response = await apiGet(`/api/reviews/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자 리뷰 조회 실패:', error);
    throw error;
  }
};

/**
 * 호스트 평균 평점 조회 API
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<number>} 평균 평점
 */
export const getHostAverageRating = async (hostId) => {
  try {
    const response = await apiGet(`/api/reviews/host/${hostId}/rating`);
    return response.data.averageRating;
  } catch (error) {
    console.error('호스트 평점 조회 실패:', error);
    throw error;
  }
};

/**
 * 리뷰 수정 API
 * @param {string} reviewId - 리뷰 ID
 * @param {Object} updateData - 수정할 데이터
 * @param {string} updateData.userId - 사용자 ID (권한 확인용)
 * @param {number} updateData.rating - 별점
 * @param {string} updateData.content - 리뷰 내용
 * @returns {Promise<Object>} 수정된 리뷰 정보
 */
export const updateReview = async (reviewId, updateData) => {
  try {
    const response = await apiPut(`/api/reviews/${reviewId}`, updateData);
    return response;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
    throw error;
  }
};

/**
 * 리뷰 삭제 API
 * @param {string} reviewId - 리뷰 ID
 * @param {string} userId - 사용자 ID (권한 확인용)
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteReview = async (reviewId, userId) => {
  try {
    const response = await apiDelete(`/api/reviews/${reviewId}`, { userId });
    return response;
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
    throw error;
  }
}; 