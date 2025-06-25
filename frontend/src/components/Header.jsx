import React from 'react';
import '../styles/Header.css';
import logo from '../assets/images/할머니로고.png';

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <img src={logo} alt="할매의 손맛 로고" className="logo-image" />
        <div className="logo-text-section">
          <span className="logo-text">할매의 손맛</span>
          <div className="logo-subtitle">홈스테이 · 따뜻한밥상 · 농촌체험</div>
        </div>
      </div>
      <nav>
        <ul>
          <li>할매의 손맛 이야기</li>
          <li>특별한 체험</li>
          <li>예약안내</li>
          <li>실시간예약</li>
          <li>로그인</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
