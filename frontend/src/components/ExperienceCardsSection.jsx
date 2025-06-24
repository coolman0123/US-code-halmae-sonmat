import React from 'react';
import card1 from '../assets/홈_정겨운시골집.png';
import card2 from '../assets/홈_따뜻한밥상.png';
import card3 from '../assets/홈_특별한체험.png';

const ExperienceCardsSection = () => {
  const cardStyle = {
    flex: 1,
    margin: '0 1rem',
    textAlign: 'center',
    position: 'relative'
  };

  const imageStyle = {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px'
  };

  const overlayStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: '300',
    zIndex: 1
  };

  return (
    <section style={{ 
      margin: '4rem 2rem', 
      display: 'flex',
      gap: '2rem',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      {/* 첫 번째 카드 - 정겨운 시골집 */}
      <div style={cardStyle}>
        <div style={{ position: 'relative' }}>
          <img src={card1} alt="정겨운 시골집" style={imageStyle} />
          <div style={overlayStyle}>정겨운 시골집</div>
        </div>
      </div>

      {/* 두 번째 카드 - 따뜻한 밥상 */}
      <div style={cardStyle}>
        <div style={{ position: 'relative' }}>
          <img src={card2} alt="따뜻한 밥상" style={imageStyle} />
          <div style={overlayStyle}>따뜻한 밥상</div>
        </div>
      </div>

      {/* 세 번째 카드 - 특별한 체험 */}
      <div style={cardStyle}>
        <div style={{ position: 'relative' }}>
          <img src={card3} alt="특별한 체험" style={imageStyle} />
          <div style={overlayStyle}>특별한 체험</div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceCardsSection;
