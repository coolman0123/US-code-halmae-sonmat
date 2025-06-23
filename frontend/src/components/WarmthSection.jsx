import React from 'react';
import warmthImage from '../assets/홈_삶의온기.png';

const WarmthSection = () => {
  return (
    <section style={{ margin: '4rem 0', textAlign: 'center' }}>
      {/* 상단 텍스트 */}
      <div style={{
        backgroundColor: '#E8E8E8',
        padding: '2rem',
        margin: '0 2rem 3rem 2rem',
        borderRadius: '8px'
      }}>
        <p style={{ 
          fontSize: '1.3rem', 
          color: '#666',
          margin: 0,
          lineHeight: '1.6'
        }}>
          정이 흐르는 시골집에서 다시 만나는 <span style={{ fontWeight: 'bold' }}>삶의 온기</span>
        </p>
      </div>
      
      {/* 하단 이미지 */}
      <div style={{ margin: '0 2rem' }}>
        <img 
          src={warmthImage} 
          alt="삶의 온기" 
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

export default WarmthSection;
