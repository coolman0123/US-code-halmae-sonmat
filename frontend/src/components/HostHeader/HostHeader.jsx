import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HostHeader.css';

const HostHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('currentUser');
      
      setIsLoggedIn(loginStatus);
      if (userData) {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch (error) {
          console.error('사용자 데이터 파싱 오류:', error);
        }
      }
    };

    checkLoginStatus();

    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시 동기화)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  return (
    <header className="host-header">
      <div className="host-logo-container">
        <Link to="/host" className="host-logo-link">
          <div className="host-logo">
            <img src="/images/grandma-logo.png" alt="할머니 로고" className="host-logo-image" />
          </div>
          <div className="host-logo-text-section">
            <h1 className="host-logo-text">할매의 손맛</h1>
            <p className="host-logo-subtitle">관리자 페이지</p>
          </div>
        </Link>
      </div>

      <nav className="host-nav">
        <ul>
          <li><Link to="/host/register">할매 등록</Link></li>
          <li><Link to="/host/booking">예약 관리</Link></li>
          <li><Link to="/host/payment">결제 관리</Link></li>
          <li>
            <Link to="/">로그아웃</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default HostHeader; 