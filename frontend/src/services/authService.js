// 기존 authService를 새로운 API 구조로 대체
// 이제 authApi를 직접 사용하거나 AuthContext를 사용하는 것을 권장
import { authApi } from '../api';

// 기존 함수들을 authApi로 래핑하여 호환성 유지
export const login = authApi.login;
export const signup = authApi.register; // register -> signup으로 별칭
export const logout = authApi.logout;
export const validateToken = async () => {
  try {
    await authApi.getCurrentUser();
    return true;
  } catch (error) {
    return false;
  }
};
export const getCurrentUser = authApi.getStoredUser;
export const isLoggedIn = authApi.isLoggedIn;

// 새로운 API 직접 사용을 위한 re-export
export { authApi }; 