import React from 'react';
import './Experience.css';

// 이미지 import
import heroImage from '../../assets/images/상단_메인이미지.png';
import appleImage1 from '../../assets/images/특별한체험_사과1.png';
import appleImage2 from '../../assets/images/특별한체험_사과2.png';
import potatoImage1 from '../../assets/images/특별한체험_시골1.png';
import potatoImage2 from '../../assets/images/특별한체험_시골2.png';
import riceImage1 from '../../assets/images/특별한체험_모내기1.png';
import riceImage2 from '../../assets/images/특별한체험_모내기2.png';
import sesameImage1 from '../../assets/images/특별한체험_참깨1.png';
import sesameImage2 from '../../assets/images/특별한체험_참깨2.png';
import garlicImage1 from '../../assets/images/특별한체험_마늘1.png';
import garlicImage2 from '../../assets/images/특별한체험_마늘2.png';

const Experience = () => {
  return (
    <div className="experience-page">
      {/* Hero Section */}
      <section className="experience-hero">
        <div className="hero-image-container">
          <img src={heroImage} alt="특별한 체험" className="hero-image" />
        </div>
      </section>

      {/* Title Section */}
      <section className="experience-title">
        <div className="container">
          <p className="title-subtitle">소중한 하루를 만드는 시간</p>
          <h1 className="title-main">특별함, 특별한 체험</h1>
        </div>
      </section>

      {/* Experience Cards Section */}
      <section className="experience-content">
        <div className="container">
          
          {/* Experience 01 - 사과 체험 */}
          <div className="experience-item">
            <div className="experience-images">
              <img src={appleImage1} alt="사과 체험 1" className="image-left" />
              <img src={appleImage2} alt="사과 체험 2" className="image-right" />
            </div>
            <div className="experience-text">
              <h3 className="experience-title-en">Special experience</h3>
              <p className="experience-intro">
                할머니 댁에서 보내는 특별한 오늘은 당신에게 잊지못할 추억을 가져다 드립니다.<br />
                할머니의 손길을 도우며 농촌의 일상을 함께 나누고, 정겨운 특별한 체험을 즐겨보세요.
              </p>
              <h2 className="experience-title-kr">특별한 체험 01: 사과 수확과 선별</h2>
              <p className="experience-description">
                가을 햇살 아래 탐스러운 사과를 직접 따보고,<br />
                정성껏 선별하여 박스에 담아보는 수확의 기쁨을 느껴보세요.
              </p>
            </div>
          </div>

          {/* Experience 02 - 마늘 체험 */}
          <div className="experience-item">
            <div className="experience-images">
              <img src={garlicImage1} alt="마늘 체험 1" className="image-left" />
              <img src={garlicImage2} alt="마늘 체험 2" className="image-right" />
            </div>
            <div className="experience-text">
              <h2 className="experience-title-kr">특별한 체험 02: 마늘밭 김매기와 수확</h2>
              <p className="experience-description">
                넓은 밭에서 흙을 만지고 풀을 뽑으며,<br />
                시골의 봄과 여름을 고스란히 경험해보세요.
              </p>
            </div>
          </div>

          {/* Experience 03 - 모내기 체험 */}
          <div className="experience-item">
            <div className="experience-images">
              <img src={riceImage1} alt="모내기 체험 1" className="image-left" />
              <img src={riceImage2} alt="모내기 체험 2" className="image-right" />
            </div>
            <div className="experience-text">
              <h2 className="experience-title-kr">특별한 체험 03: 모내기와 탈곡 체험</h2>
              <p className="experience-description">
                초록 들판에 서서 직접 모를 심고,<br />
                가을엔 벼를 털며 전통 농사의 리듬을 배워보세요.
              </p>
            </div>
          </div>

          {/* Experience 04 - 참깨 체험 */}
          <div className="experience-item">
            <div className="experience-images">
              <img src={sesameImage1} alt="장터 체험 1" className="image-left" />
              <img src={sesameImage2} alt="장터 체험 2" className="image-right" />
            </div>
            <div className="experience-text">
              <h2 className="experience-title-kr">특별한 체험 04: 참깨 · 콩 타작하기</h2>
              <p className="experience-description">
                수확한 콩과 참깨를 털고 말리는 손맛,<br />
                처음엔 낯설지만 어느새 정이 가득해지는 체험입니다.
              </p>
            </div>
          </div>

          {/* Experience 05 - 장터 체험 */}
          <div className="experience-item">
            <div className="experience-images">
              <img src={potatoImage1} alt="참깨 체험 1" className="image-left" />
              <img src={potatoImage2} alt="참깨 체험 2" className="image-right" />
            </div>
            <div className="experience-text">
              <h2 className="experience-title-kr">특별한 체험 05: 시골 장터 둘기</h2>
              <p className="experience-description">
                장터에서 텐트를 치고, 국수를 데우고, 손님을 맞으며<br />
                마을 사람들과 함께 어울려보는 따뜻한 하루를 보내보세요.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Experience;
