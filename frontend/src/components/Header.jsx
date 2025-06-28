import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';
import logo from '../assets/images/할머니로고.png';

const Header = () => {
  const { isLoggedIn, user, isLoading } = useAuth();

  return (
    <header>
      <Link to='/' className='logo-container'>
        <img src={logo} alt='할매의 손맛 로고' className='logo-image' />
        <div className='logo-text-section'>
          <span className='logo-text'>할매의 손맛</span>
          <div className='logo-subtitle'>홈스테이 · 따뜻한밥상 · 농촌체험</div>
        </div>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to='/stories'>할매의 손맛 이야기</Link>
          </li>
          <li>
            <Link to='/experiences'>할매집소개</Link>
          </li>
          <li>
            <Link to='/booking'>예약안내</Link>
          </li>
          <li>
            <Link to='/live-reservation'>실시간예약</Link>
          </li>
          <li>
            <Link to='/mypage'>마이페이지</Link>
          </li>
          <li className="auth-section">
            {isLoading ? (
              <span className="loading-text">로딩중...</span>
            ) : isLoggedIn ? (
              <div className="user-menu">
                <span className="user-greeting">
                  {user?.name}님
                </span>
                <Link to='/auth/logout' className="logout-link">
                  로그아웃
                </Link>
              </div>
            ) : (
              <div className="login-menu">
                <Link to='/auth/login' className="login-link">
                  로그인
                </Link>
                <span className="divider">|</span>
                <Link to='/auth/signup' className="signup-link">
                  회원가입
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
