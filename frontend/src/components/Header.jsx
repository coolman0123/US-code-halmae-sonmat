import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/images/할머니로고.png";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // 로그인 상태 확인
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem("isLoggedIn");
      const userData = localStorage.getItem("currentUser");

      if (loginStatus === "true" && userData) {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    };

    checkLoginStatus();

    // 로컬스토리지 변경 감지
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [location]); // location 변경 시에도 로그인 상태 재확인

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
            {isLoggedIn ? (
              <>
                <span className="user-greeting">{currentUser?.name}님</span>
                <Link to="/auth/logout">로그아웃</Link>
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
