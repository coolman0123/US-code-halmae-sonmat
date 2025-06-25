import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './MyPage.css';

import ProfileIcon from '../../../assets/icons/MyPage_프로필.png';
import PaymentIcon from '../../../assets/icons/MyPage_내결제.png';
import ReviewIcon from '../../../assets/icons/MyPage_내리뷰.png';
import NotificationIcon from '../../../assets/icons/MyPage_알림.png';

const MyPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleInquiry = () => {
    alert('관리자 전화번호: 010-1234-5678');
  };

  return (
    <div className='my-page'>
      <Header />
      <div className='my-page-content'>
        <div className='profile-section'>
          <img src={ProfileIcon} alt='프로필' className='profile-icon' />
          <span className='welcome-message'>
            <strong>김희연</strong> 님 환영합니다 :)
          </span>
        </div>

        <div className='icon-buttons'>
          <div
            className='icon-button'
            onClick={() => handleNavigation('/mypage/payment')}
          >
            <img src={PaymentIcon} alt='내 결제' />
            <p>내 결제</p>
          </div>
          <div
            className='icon-button'
            onClick={() => handleNavigation('/mypage/review')}
          >
            <img src={ReviewIcon} alt='내 리뷰' />
            <p>내 리뷰</p>
          </div>
          <div
            className='icon-button'
            onClick={() => handleNavigation('/mypage/notification')}
          >
            <img src={NotificationIcon} alt='알림함' />
            <p>알림함</p>
          </div>
        </div>

        <div className='mypage-links'>
          <p className='inquiry' onClick={handleInquiry}>
            1 : 1 문의
          </p>
          <p className='logout' onClick={() => handleNavigation('/logout')}>
            로그아웃
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyPage;
