import { apiPost, apiGet } from './config';

/**
 * 로그인 API
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.email - 이메일
 * @param {string} credentials.password - 비밀번호
 * @returns {Promise<Object>} 로그인 응답 데이터
 */
export const login = async (credentials) => {
  try {
    const response = await apiPost('/api/auth/login', {
      email: credentials.email,
      password: credentials.password
    });

    // JWT 토큰 저장
    if (response.token) {
      localStorage.setItem('authToken', response.token);
    }
    
    // 사용자 정보 저장
    if (response.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return response;
  } catch (error) {
    console.error('로그인 실패:', error);
    throw error;
  }
};

/**
 * 회원가입 API
 * @param {Object} userData - 회원가입 정보
 * @param {string} userData.email - 이메일
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.name - 이름
 * @param {string} userData.phone - 전화번호
 * @returns {Promise<Object>} 회원가입 응답 데이터
 */
export const register = async (userData) => {
  try {
    const response = await apiPost('/api/auth/register', {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone
    });
    
    return response;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error;
  }
};

/**
 * 로그아웃 API
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    await apiPost('/api/auth/logout');
  } catch (error) {
    console.error('로그아웃 API 호출 실패:', error);
  } finally {
    // 로컬 스토리지 정리
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }
};

/**
 * 현재 사용자 정보 조회 API
 * @returns {Promise<Object>} 사용자 정보
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiGet('/api/auth/me');
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 여부
 */
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('authToken');
};

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보
 */
export const getStoredUser = () => {
  try {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('저장된 사용자 정보 조회 실패:', error);
    return null;
  }
}; 