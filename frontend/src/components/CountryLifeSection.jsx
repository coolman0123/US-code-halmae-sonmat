import React from 'react';
import roomImage from '../assets/홈_집사진.jpg';

const CountryLifeSection = () => {
  return (
    <section style={{ 
      display: 'flex', 
      alignItems: 'center', 
      margin: '4rem 2rem',
      gap: '3rem'
    }}>
      {/* 왼쪽 텍스트 영역 */}
      <div style={{ flex: 1, paddingRight: '2rem' }}>
        <div style={{
          backgroundColor: '#D4C4A8',
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1rem',
            color: '#333',
            textAlign: 'center'
          }}>
            바쁜 세상 속 쉼표, 고요한 <span style={{ fontWeight: 'bold' }}>시골의 하루</span>
          </h3>
        </div>
        
        <div style={{ 
          fontSize: '1rem', 
          lineHeight: '1.8', 
          color: '#666',
          marginBottom: '1rem'
        }}>
          <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>한 끼의 밥과 따스한 온기로 채우는 여행</p>
          
          <p>갓 지은 밥과 푸근한 인사로 차려지는 할머니 밥상.</p>
          <p>한 숟갈마다 전해지는 정성과 이야기,</p>
          <p>할매의 손맛이 머무는 식탁에서</p>
          <p>마음까지 포근해지는 여행을 시작해보세요.</p>
        </div>
      </div>
      
      {/* 오른쪽 이미지 영역 */}
      <div style={{ flex: 1 }}>
        <img 
          src={roomImage} 
          alt="시골집 방 내부" 
          style={{ 
            width: '100%', 
            height: '300px',
            objectFit: 'cover',
            borderRadius: '8px'
          }} 
        />
      </div>
    </section>
  );
};

export default CountryLifeSection;
