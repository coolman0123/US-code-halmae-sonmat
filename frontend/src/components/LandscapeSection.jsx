import React from 'react';
import landscapeImage from '../assets/홈_전경사진.png';

const LandscapeSection = () => {
  return (
    <section style={{ margin: '4rem 0', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <img 
          src={landscapeImage} 
          alt="시골 전경" 
          style={{ 
            width: '100%', 
            height: '500px',
            objectFit: 'cover',
            display: 'block'
          }} 
        />
        
        {/* 텍스트 오버레이 */}
        <div style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          fontWeight: '400',
          textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
          padding: '2rem',
          maxWidth: '900px'
        }}>
          <div>오시는 분들과 함께 소박한 밥 한 끼, 따뜻한 이야기를 나누고 싶습니다.</div>
          <div>단순히 머물다 가는 숙소가 아닌, 정이 오가고 마음이</div>
          <div>쉬어가는 곳이 되고자 합니다.</div>
          <div>할매의 손맛에 오셔서, 시골집의 온기와 함께 잊지 못할</div>
          <div>추억을 만들어 보시는 건 어떨까요..!</div>
        </div>
      </div>
      
      {/* 하단 텍스트 */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        color: '#666',
        fontSize: '1rem'
      }}>
        <p>손끝에 남는 흙냄새처럼, <span style={{ fontWeight: 'bold' }}>오래 기억될 하루</span></p>
      </div>
    </section>
  );
};

export default LandscapeSection;
