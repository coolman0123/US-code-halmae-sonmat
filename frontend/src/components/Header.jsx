import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Header.css";
import logo from "../assets/images/할머니로고.png";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/'; // 로그아웃 후 메인페이지로 이동
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header>
      <Link to="/" className="logo-container">
        <img src={logo} alt="할매의 손맛 로고" className="logo-image" />
        <div className="logo-text-section">
          <span className="logo-text">할매의 손맛</span>
          <div className="logo-subtitle">홈스테이 · 따뜻한밥상 · 농촌체험</div>
        </div>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/stories">할매의 손맛 이야기</Link>
          </li>
          <li>
            <Link to="/experiences">할매집 소개</Link>
          </li>
          <li>
            <Link to="/booking">예약안내</Link>
          </li>
          <li>
            <Link to="/live-reservation">실시간예약</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
          <li>
            {isAuthenticated ? (
              <>
                <span className="user-greeting">{user?.name}님</span>
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <Link to="/auth/login">로그인</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
