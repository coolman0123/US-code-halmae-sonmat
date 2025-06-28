// 백엔드 API 서비스
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// 공통 API 요청 함수
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      credentials: 'include',
      ...options
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '요청에 실패했습니다.');
    }

    return data;
  } catch (error) {
    console.error(`API Request Error [${endpoint}]:`, error);
    throw error;
  }
};

// ================== 인증 관련 API ==================

/**
 * 로그인 API 호출
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.email - 사용자 이메일
 * @param {string} credentials.password - 비밀번호
 * @returns {Promise<Object>} 로그인 응답 데이터
 */
export const login = async (credentials) => {
  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
    
    // JWT 토큰이 있다면 localStorage에 저장
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    // 사용자 정보 저장
    if (data.data) {
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * 회원가입 API 호출
 * @param {Object} userData - 회원가입 정보
 * @param {string} userData.email - 사용자 이메일
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.name - 이름
 * @param {string} userData.phone - 전화번호
 * @returns {Promise<Object>} 회원가입 응답 데이터
 */
export const signup = async (userData) => {
  try {
    return await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone
      })
    });
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * 로그아웃 처리
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // 서버에 로그아웃 요청
    await apiRequest('/api/auth/logout', {
      method: 'POST'
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 로컬 스토리지에서 인증 정보 제거
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }
};

/**
 * 현재 사용자 정보 가져오기
 * @returns {Promise<Object>} 사용자 정보
 */
export const getCurrentUser = async () => {
  try {
    const data = await apiRequest('/api/auth/me', {
      method: 'GET'
    });
    return data.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // 토큰이 유효하지 않으면 로그아웃 처리
    await logout();
    throw error;
  }
};

/**
 * 토큰 유효성 검사
 * @returns {Promise<boolean>} 토큰이 유효한지 여부
 */
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    await getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 상태
 */
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('authToken');
};

/**
 * 저장된 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getStoredUser = () => {
  try {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting stored user:', error);
    return null;
  }
};

// ================== 예약(Trip) 관련 API ==================

/**
 * 모든 여행 목록 조회
 * @param {Object} filters - 필터 옵션
 * @returns {Promise<Object>} 여행 목록
 */
export const getAllTrips = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    return await apiRequest(`/api/trips?${queryParams}`);
  } catch (error) {
    console.error('Get all trips error:', error);
    throw error;
  }
};

/**
 * 특정 여행 상세 정보 조회
 * @param {string} tripId - 여행 ID
 * @returns {Promise<Object>} 여행 상세 정보
 */
export const getTripById = async (tripId) => {
  try {
    return await apiRequest(`/api/trips/${tripId}`);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    throw error;
  }
};

/**
 * 여행 예약하기
 * @param {string} tripId - 여행 ID
 * @param {Object} bookingData - 예약 정보
 * @returns {Promise<Object>} 예약 결과
 */
export const bookTrip = async (tripId, bookingData) => {
  try {
    return await apiRequest(`/api/trips/${tripId}/join`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  } catch (error) {
    console.error('Book trip error:', error);
    throw error;
  }
};

/**
 * 여행 예약 취소
 * @param {string} tripId - 여행 ID
 * @returns {Promise<Object>} 취소 결과
 */
export const cancelTripBooking = async (tripId) => {
  try {
    const user = getStoredUser();
    return await apiRequest(`/api/trips/${tripId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ email: user?.email })
    });
  } catch (error) {
    console.error('Cancel trip booking error:', error);
    throw error;
  }
};

// ================== 리뷰 관련 API ==================

/**
 * 모든 리뷰 조회
 * @returns {Promise<Object>} 리뷰 목록
 */
export const getAllReviews = async () => {
  try {
    return await apiRequest('/api/reviews');
  } catch (error) {
    console.error('Get all reviews error:', error);
    throw error;
  }
};

/**
 * 특정 호스트의 리뷰 조회
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 호스트 리뷰 목록
 */
export const getReviewsByHostId = async (hostId) => {
  try {
    return await apiRequest(`/api/reviews/host/${hostId}`);
  } catch (error) {
    console.error('Get reviews by host ID error:', error);
    throw error;
  }
};

/**
 * 사용자별 리뷰 조회
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 사용자 리뷰 목록
 */
export const getReviewsByUserId = async (userId) => {
  try {
    return await apiRequest(`/api/reviews/user/${userId}`);
  } catch (error) {
    console.error('Get reviews by user ID error:', error);
    throw error;
  }
};

/**
 * 리뷰 작성
 * @param {Object} reviewData - 리뷰 데이터
 * @returns {Promise<Object>} 작성된 리뷰
 */
export const createReview = async (reviewData) => {
  try {
    return await apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

/**
 * 리뷰 수정
 * @param {string} reviewId - 리뷰 ID
 * @param {Object} reviewData - 수정할 리뷰 데이터
 * @returns {Promise<Object>} 수정된 리뷰
 */
export const updateReview = async (reviewId, reviewData) => {
  try {
    const user = getStoredUser();
    return await apiRequest(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...reviewData, userId: user?.id })
    });
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

/**
 * 리뷰 삭제
 * @param {string} reviewId - 리뷰 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deleteReview = async (reviewId) => {
  try {
    const user = getStoredUser();
    return await apiRequest(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId: user?.id })
    });
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

/**
 * 호스트 평균 평점 조회
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 평균 평점
 */
export const getHostAverageRating = async (hostId) => {
  try {
    return await apiRequest(`/api/reviews/host/${hostId}/rating`);
  } catch (error) {
    console.error('Get host average rating error:', error);
    throw error;
  }
};

// ================== 호스트 관련 API ==================

/**
 * 모든 호스트 조회
 * @returns {Promise<Object>} 호스트 목록
 */
export const getAllHosts = async () => {
  try {
    return await apiRequest('/api/hosts');
  } catch (error) {
    console.error('Get all hosts error:', error);
    throw error;
  }
};

/**
 * 특정 호스트 정보 조회
 * @param {string} hostId - 호스트 ID
 * @returns {Promise<Object>} 호스트 정보
 */
export const getHostById = async (hostId) => {
  try {
    return await apiRequest(`/api/hosts/${hostId}`);
  } catch (error) {
    console.error('Get host by ID error:', error);
    throw error;
  }
}; 