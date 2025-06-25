import React from 'react';
import './ReservationInfo.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// 이미지 import
import reservationImage1 from '../../assets/images/예약안내_1.png';
import reservationImage2 from '../../assets/images/예약안내_2.png';

const ReservationInfo = () => {
  return (
    <div className="reservation-info-page">
      <Header />
      
      <main className="reservation-info-content">
        {/* 상단 이미지 */}
        <div className="reservation-hero">
          <img src={reservationImage1} alt="예약안내 상단" className="hero-image" />
        </div>

        {/* 타이틀 섹션 */}
        <div className="reservation-title-section">
          <p className="title-subtitle">질러운 여행을 만나는 곳선</p>
          <h1 className="title-main">예약안내</h1>
        </div>

        {/* 하단 상세 정보 이미지 */}
        <div className="reservation-detail">
          <img src={reservationImage2} alt="예약안내 상세" className="detail-image" />
        </div>

        {/* 연락처 정보 */}
        <div className="contact-section">
          <p className="contact-label">TEL</p>
          <p className="contact-number">010-5517-1521</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationInfo; 