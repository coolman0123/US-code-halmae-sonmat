import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false);

  useEffect(() => {
    if (!hasLoggedOut.current) {
      hasLoggedOut.current = true;

      localStorage.removeItem('token');

      setTimeout(() => {
        alert('로그아웃 되었습니다.');
        navigate('/');
      }, 1000);
    }
  }, [navigate]);

  return <div className='logout-container fade-out'>로그아웃 중입니다...</div>;
};

export default Logout;
