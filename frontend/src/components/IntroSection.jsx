import React from 'react';
import '../styles/IntroSection.css';
import logo from '../assets/할머니로고.png';

const IntroSection = () => {
  return (
    <section className="intro-section">
      <img src={logo} alt="할머니 로고" className="intro-logo" />
      <div className="intro-text-container">
        <h2 className="intro-title">할매의 손맛</h2>
        <div className="intro-subtitle">
          홈스테이 · 따뜻한밥상 · 농촌체험
        </div>
      </div>
      <div className="intro-description">
        시골 할매 품에서, 따뜻한 밥 한 끼와 진짜 쉼을 드립니다.
      </div>
    </section>
  );
};

export default IntroSection;
