import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './MainPage.css';

// 이미지 import
import topImage from '../../assets/images/홈_상단사진.png';
import countryHouseImage from '../../assets/images/홈_정겨운시골집.png';
import landscapeImage from '../../assets/images/홈_전경사진.png';
import tableImage from '../../assets/images/홈_따뜻한밥상.png';
import experienceImage from '../../assets/images/홈_특별한체험.png';
import warmthImage from '../../assets/images/홈_삶의온기.png';
import houseImage from '../../assets/images/홈_집사진.jpg';

const MainPage = () => {
  return (
    <div className='main-page'>
      <Header />

      {/* Hero Section - 메인 이미지 */}
      <section className='hero-section'>
        <div className='hero-image'>
          <img src={topImage} alt='할머니의 손맛' />
        </div>
      </section>

      {/* Title Section - 할매의 손맛 */}
      <section className='title-section'>
        <div className='container'>
          <div className='title-icon'>🌸</div>
          <h1 className='main-title'>할매의 손맛</h1>
          <p className='main-subtitle'>
            어느 날부터인가, 내 곁에 온 따뜻한 밥상이 있었다.
            <br />
            그 안에는 정성과 사랑이 가득 담겨 있었고,
            <br />
            할머니의 손길이 닿은 모든 것들이
            <br />
            나에게는 특별한 의미로 다가왔다.
            <br />
            이곳에서 만나는 모든 순간들이
            <br />
            소중한 추억이 되기를 바라며...
          </p>
        </div>
      </section>

      {/* Info Notice Section - 회색 배경 안내 */}
      <section className='info-notice-section'>
        <div className='container'>
          <p className='notice-text'>
            예약 문의는 미리 연락 주시면 감사하겠습니다. 더 맛있고 정성스러운
            식사를 준비해드릴 수 있습니다.
          </p>
        </div>
      </section>

      {/* Country Life Section - 시골의 하루 */}
      <section className='country-life-section'>
        <div className='container'>
          <div className='content-row'>
            <div className='text-content'>
              <h2>시골의 하루</h2>
              <p>
                새벽부터 시작되는 할머니의 하루는
                <br />
                정성스러운 음식 준비로 시작됩니다.
                <br />
                텃밭에서 직접 기른 신선한 채소들과
                <br />
                전통 방식으로 만든 건강한 음식들을
                <br />
                맛보실 수 있습니다.
              </p>
            </div>
            <div className='image-content'>
              <img src={countryHouseImage} alt='정겨운 시골집' />
            </div>
          </div>
        </div>
      </section>

      {/* Landscape Section - 전경 이미지 */}
      <section className='landscape-section'>
        <div className='landscape-container'>
          <img src={landscapeImage} alt='전경' />
          <div className='landscape-overlay'>
            <h2>자연 속에서 만나는 진정한 휴식</h2>
            <p>
              맑은 공기와 아름다운 풍경이 어우러진 이곳에서 특별한 추억을
              만들어보세요
            </p>
          </div>
        </div>
      </section>

      {/* Experience Cards Section - 3개 카드 */}
      <section className='experience-cards-section'>
        <div className='container'>
          <div className='cards-grid'>
            <div className='experience-card'>
              <div className='card-image'>
                <img src={tableImage} alt='따뜻한 밥상' />
              </div>
              <div className='card-content'>
                <h3>따뜻한 밥상</h3>
                <p>
                  할머니의 정성이 담긴 따뜻한 밥상에서 진정한 맛을 경험하세요
                </p>
              </div>
            </div>

            <div className='experience-card'>
              <div className='card-image'>
                <img src={experienceImage} alt='특별한 체험' />
              </div>
              <div className='card-content'>
                <h3>특별한 체험</h3>
                <p>전통 요리법을 배우고 직접 만들어보는 소중한 시간</p>
              </div>
            </div>

            <div className='experience-card'>
              <div className='card-image'>
                <img src={warmthImage} alt='삶의 온기' />
              </div>
              <div className='card-content'>
                <h3>삶의 온기</h3>
                <p>할머니의 따뜻한 마음이 전해지는 정겨운 공간</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Image Section - 집 이미지만 */}
      <section className='final-image-section'>
        <div className='final-image'>
          <img src={houseImage} alt='할머니 집' />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MainPage;
