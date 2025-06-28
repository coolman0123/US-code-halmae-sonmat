import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../api';

// 초기 상태
const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: true,
  error: null
};

// 액션 타입
const ACTION_TYPES = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// 리듀서
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ACTION_TYPES.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
        isLoading: false,
        error: null
      };
    case ACTION_TYPES.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: action.payload.error
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoading: false,
        error: null
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case ACTION_TYPES.UPDATE_USER:
      return {
        ...state,
        user: action.payload.user
      };
    default:
      return state;
  }
};

// Context 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
        
        // 로컬 스토리지에서 토큰과 사용자 정보 확인
        if (authApi.isLoggedIn()) {
          const storedUser = authApi.getStoredUser();
          if (storedUser) {
            dispatch({
              type: ACTION_TYPES.LOGIN_SUCCESS,
              payload: { user: storedUser }
            });
          } else {
            // 토큰은 있지만 사용자 정보가 없는 경우 서버에서 가져오기
            try {
              const user = await authApi.getCurrentUser();
              dispatch({
                type: ACTION_TYPES.LOGIN_SUCCESS,
                payload: { user }
              });
            } catch (error) {
              // 토큰이 유효하지 않은 경우 로그아웃 처리
              await authApi.logout();
              dispatch({ type: ACTION_TYPES.LOGOUT });
            }
          }
        } else {
          dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // 로그인 함수
  const login = async (credentials) => {
    try {
      dispatch({ type: ACTION_TYPES.LOGIN_START });
      
      const response = await authApi.login(credentials);
      
      dispatch({
        type: ACTION_TYPES.LOGIN_SUCCESS,
        payload: { user: response.user }
      });
      
      return response;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // 회원가입 함수
  const register = async (userData) => {
    try {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
      
      const response = await authApi.register(userData);
      
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
      
      return response;
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      await authApi.logout();
      dispatch({ type: ACTION_TYPES.LOGOUT });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 발생해도 로컬 상태는 초기화
      dispatch({ type: ACTION_TYPES.LOGOUT });
    }
  };

  // 사용자 정보 업데이트 함수
  const updateUser = (updatedUser) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_USER,
      payload: { user: updatedUser }
    });
    // 로컬 스토리지도 업데이트
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // 에러 초기화 함수
  const clearError = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
  };

  // Context 값
  const contextValue = {
    // 상태
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    isLoading: state.isLoading,
    error: state.error,
    
    // 액션 함수들
    login,
    register,
    logout,
    updateUser,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};

export default AuthContext; 