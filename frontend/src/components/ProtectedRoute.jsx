import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 로그인이 필요한 페이지를 보호하는 컴포넌트
 * @param {Object} props
 * @param {React.ReactNode} props.children - 보호할 컴포넌트
 * @param {string} props.redirectTo - 미로그인 시 리다이렉트할 경로
 * @param {boolean} props.requireAuth - 로그인이 필요한지 여부 (기본값: true)
 * @returns {React.ReactElement}
 */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/auth/login', 
  requireAuth = true 
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #2c5530',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '14px' }}>로그인 상태를 확인하는 중...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // 로그인이 필요한 페이지인데 로그인하지 않은 경우
  if (requireAuth && !isLoggedIn) {
    // 현재 경로를 state로 전달해서 로그인 후 돌아올 수 있도록 함
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 로그인이 필요하지 않은 페이지인데 로그인한 경우 (예: 로그인/회원가입 페이지)
  if (!requireAuth && isLoggedIn) {
    // 이전 페이지가 있다면 그곳으로, 없다면 메인 페이지로
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // 조건을 만족하는 경우 컴포넌트 렌더링
  return children;
};

export default ProtectedRoute; 