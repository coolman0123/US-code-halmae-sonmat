import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const { logout, user, isLoggedIn } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // 이미 로그아웃된 상태라면 메인 페이지로 이동
    if (!isLoggedIn) {
      navigate('/', { replace: true });
      return;
    }

    // 자동 로그아웃 실행
    const performLogout = async () => {
      setIsLoggingOut(true);
      try {
        await logout();
        // 로그아웃 성공 후 잠시 대기 후 메인 페이지로 이동
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } catch (error) {
        console.error('로그아웃 실패:', error);
        // 에러가 발생해도 메인 페이지로 이동
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      }
    };

    performLogout();
  }, [logout, navigate, isLoggedIn]);

  if (!isLoggedIn && !isLoggingOut) {
    return null; // 이미 로그아웃된 상태
  }

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-content">
          <div className="logout-icon">
            <img src="/images/grandma-logo.png" alt="할머니 로고" className="logo-image" />
          </div>
          
          {isLoggingOut ? (
            <>
              <h1 className="logout-title">로그아웃 중...</h1>
              <p className="logout-message">
                {user?.name ? `${user.name}님, ` : ''}안전하게 로그아웃하고 있습니다.
              </p>
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </>
          ) : (
            <>
              <h1 className="logout-title">로그아웃 완료</h1>
              <p className="logout-message">
                {user?.name ? `${user.name}님, ` : ''}이용해 주셔서 감사합니다.
              </p>
              <p className="redirect-message">
                메인 페이지로 이동합니다...
              </p>
            </>
          )}
        </div>

        <div className="logout-actions">
          <button 
            className="home-button"
            onClick={() => navigate('/')}
            disabled={isLoggingOut}
          >
            메인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
