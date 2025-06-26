// 백엔드 API 서비스
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

/**
 * 로그인 API 호출
 * @param {Object} credentials - 로그인 정보
 * @param {string} credentials.id - 사용자 아이디
 * @param {string} credentials.password - 비밀번호
 * @returns {Promise<Object>} 로그인 응답 데이터
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: credentials.id,
        password: credentials.password
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '로그인에 실패했습니다.');
    }

    const data = await response.json();
    
    // JWT 토큰이 있다면 localStorage에 저장
    if (data.token) {
      localStorage.setItem('authToken', data.token);
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
 * @param {string} userData.id - 사용자 아이디
 * @param {string} userData.password - 비밀번호
 * @param {boolean} userData.agreeTerms - 약관 동의 여부
 * @returns {Promise<Object>} 회원가입 응답 데이터
 */
export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userData.id,
        password: userData.password,
        agreeTerms: userData.agreeTerms
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '회원가입에 실패했습니다.');
    }

    return await response.json();
    
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
    // 서버에 로그아웃 요청 (토큰이 있는 경우)
    const token = localStorage.getItem('authToken');
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    }
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
 * 토큰 유효성 검사
 * @returns {Promise<boolean>} 토큰이 유효한지 여부
 */
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.ok;
    
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * 현재 로그인된 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
export const getCurrentUser = () => {
  try {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * 로그인 상태 확인
 * @returns {boolean} 로그인 상태
 */
export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
}; 