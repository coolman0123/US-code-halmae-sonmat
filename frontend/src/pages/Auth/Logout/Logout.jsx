import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;

      // 로그아웃 처리
      const performLogout = () => {
        // 로그인 관련 정보 모두 제거
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken'); // 나중에 백엔드 연동시 사용될 토큰도 제거
        
        // storage 이벤트 강제 발생 (같은 탭에서도 감지되도록)
        window.dispatchEvent(new Event('storage'));
        
        // 페이지 강제 리로드로 상태 확실히 업데이트
        setTimeout(() => {
          alert('로그아웃 되었습니다.');
          navigate('/');
          // 추가적으로 페이지 리로드로 Header 상태 확실히 업데이트
          window.location.reload();
        }, 1000);
      };

      performLogout();
    }
  }, [navigate]);

  return (
    <div className='logout-container fade-out'>
      <div className="logout-message">
        <h2>로그아웃 중입니다...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default Logout;
