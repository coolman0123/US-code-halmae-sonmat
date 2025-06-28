import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 앱 초기화 시 로그인 상태 확인
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // 저장된 토큰이 있는지 확인
        if (authService.isLoggedIn()) {
          // 토큰 유효성 검사
          const isValid = await authService.validateToken();
          
          if (isValid) {
            // 사용자 정보 가져오기
            const storedUser = authService.getStoredUser();
            if (storedUser) {
              setUser(storedUser);
              setIsAuthenticated(true);
            } else {
              // 저장된 사용자 정보가 없으면 서버에서 가져오기
              try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
                setIsAuthenticated(true);
              } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
                // 무한 루프 방지를 위해 직접 상태만 초기화
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isLoggedIn');
              }
            }
          } else {
            // 토큰이 유효하지 않으면 상태 초기화
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
          }
        }
      } catch (error) {
        console.error('인증 초기화 오류:', error);
        // 상태 초기화만 진행
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 로그인 함수
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error(response.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 함수
  const signup = async (userData) => {
    try {
      setIsLoading(true);
      return await authService.signup(userData);
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 사용자 정보 업데이트
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // Context 값
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 