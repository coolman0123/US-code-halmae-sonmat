import React from 'react';
import logo from '../assets/할머니로고.png';

const IntroSection = () => {
  return (
    <section style={{ textAlign: 'center', margin: '3rem 0' }}>
      <img src={logo} alt="할머니 로고" style={{ width: 60, height: 60 }} />
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        marginTop: '1rem'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 'bold' }}>할매의 손맛</h2>
        <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
          홈스테이 · 따뜻한밥상 · 농촌체험
        </div>
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
        시골 할매 품에서, 따뜻한 밥 한 끼와 진짜 쉼을 드립니다.
      </div>
    </section>
  );
};

export default IntroSection;
