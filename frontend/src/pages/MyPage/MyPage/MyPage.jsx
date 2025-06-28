import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

import ProfileIcon from "../../../assets/icons/MyPage_프로필.png";
import PaymentIcon from "../../../assets/icons/MyPage_내결제.png";
import ReviewIcon from "../../../assets/icons/MyPage_내리뷰.png";
import NotificationIcon from "../../../assets/icons/MyPage_알림.png";

const MyPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleInquiry = () => {
    alert("관리자 전화번호: 010-1234-5678");
  };

  return (
    <div className="my-page-bg">
      <div className="my-page-card">
        <div className="profile-section centered">
          <img src={ProfileIcon} alt="프로필" className="profile-icon" />
          <span className="welcome-message">
            <strong>김희연</strong> 님 환영합니다 :)
          </span>
        </div>

        <div className="icon-buttons centered">
          <div
            className="icon-button"
            onClick={() => handleNavigation("/mypage/payment")}
          >
            <img src={PaymentIcon} alt="내 결제" />
            <p>내 결제</p>
          </div>
          <div
            className="icon-button"
            onClick={() => handleNavigation("/mypage/review")}
          >
            <img src={ReviewIcon} alt="내 리뷰" />
            <p>내 리뷰</p>
          </div>
          <div
            className="icon-button"
            onClick={() => handleNavigation("/mypage/notification")}
          >
            <img src={NotificationIcon} alt="알림함" />
            <p>알림함</p>
          </div>
        </div>

        <div className="mypage-links centered">
          <button className="inquiry-btn" onClick={handleInquiry}>
            1 : 1 문의
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
