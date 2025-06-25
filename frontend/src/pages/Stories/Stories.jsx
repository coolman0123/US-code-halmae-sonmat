import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './Stories.css';

const Stories = () => {
  // 임시 숙박시설 데이터 (나중에 백엔드 API로 교체)
  const accommodations = [
    { name: '할매의 손맛', phone: '041-733-1234', lat: 36.7648, lng: 127.7816 },
    { name: '농가민박 들꽃', phone: '041-733-5678', lat: 36.7350, lng: 127.8200 },
    { name: '시골할머니집', phone: '041-733-9101', lat: 36.7950, lng: 127.7400 },
    { name: '전원마을펜션', phone: '041-733-1122', lat: 36.7200, lng: 127.7500 },
    { name: '산골농가체험', phone: '041-733-3344', lat: 36.8000, lng: 127.8100 }
  ];

  useEffect(() => {
    // Kakao Map API 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=f3431dbe0250d319e254837045e1ef8a&autoload=false';
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(36.7648, 127.7816), // 논산 중심
          level: 8 // 지도 확대 레벨
        };
        
        const map = new window.kakao.maps.Map(container, mapOption);
        
        // 숙박시설 마커들 추가
        accommodations.forEach(place => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(place.lat, place.lng),
            map: map
          });

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="
                padding: 8px 12px; 
                font-size: 12px; 
                background: white; 
                border: 1px solid #ccc; 
                border-radius: 3px; 
                text-align: center; 
                white-space: nowrap; 
                font-weight: bold; 
                color: #333; 
                min-width: 120px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              ">
                <div style="margin-bottom: 3px;">${place.name}</div>
                <div style="font-size: 11px; color: #666; font-weight: normal;">${place.phone}</div>
              </div>
            `
          });

          // 마우스 호버 이벤트
          window.kakao.maps.event.addListener(marker, 'mouseover', function() {
            infoWindow.open(map, marker);
          });

          window.kakao.maps.event.addListener(marker, 'mouseout', function() {
            infoWindow.close();
          });
        });
      });
    };
    
    document.head.appendChild(script);
    
    // cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);
  return (
    <div className="stories-page">
      <Header />
      
      {/* Hero Section - 메인 이미지 */}
      <section className="stories-hero">
        <div className="hero-image">
          <img src="/src/assets/images/상단_메인이미지.png" alt="할머니 방" />
        </div>
      </section>

      {/* Title Section */}
      <section className="stories-title">
        <div className="container">
          <p className="title-subtitle">시골의 품에서, 마음 쉬어가는 시간</p>
          <h1 className="title-main">할매의 손맛 이야기</h1>
        </div>
      </section>

      {/* Story Sections */}
      <section className="stories-content">
        <div className="container">
          
          {/* Story 01 - 왼쪽 텍스트, 오른쪽 이미지 */}
          <div className="story-item">
            <div className="story-text">
              <span className="story-number">01.</span>
              <h3 className="story-title">쉼이 머무는 집,</h3>
              <h3 className="story-subtitle">할매 댁에 오세요</h3>
              <p className="story-description">
                바쁜 일상 속, 잠시 멈추고 쉴을 때<br />
                시골 할매 댁에서 따뜻한 하루를 보내세요.<br />
                마당을 스치는 바람,<br />
                논밭 풍경과 함께하는 밤.<br />
                정겨운 시골집에서 진짜 쉼이 시작됩니다.
              </p>
            </div>
            <div className="story-image">
              <img src="/src/assets/images/할매의손맛이야기_1.png" alt="할머니 집" />
            </div>
          </div>

          {/* Story 02 - 왼쪽 이미지, 오른쪽 텍스트 */}
          <div className="story-item">
            <div className="story-image">
              <img src="/src/assets/images/할매의손맛이야기_2.png" alt="직접 기른 음식" />
            </div>
            <div className="story-text">
              <span className="story-number">02.</span>
              <h3 className="story-title">밥 한 끼에 담긴</h3>
              <h3 className="story-subtitle">정과 지혜</h3>
              <p className="story-description">
                할매가 직접 지은 따끈한 밥,<br />
                거기에 삶의 이야기까지 더해집니다.<br />
                함께 요리도 해보고<br />
                오래된 손맛을 배우는 시간,<br />
                밥상에서 마음이 오갑니다.
              </p>
            </div>
          </div>

          {/* Story 03 - 왼쪽 텍스트, 오른쪽 이미지 */}
          <div className="story-item">
            <div className="story-text">
              <span className="story-number">03.</span>
              <h3 className="story-title">시골의 하루를</h3>
              <h3 className="story-subtitle">살아보는 시간</h3>
              <p className="story-description">
                사과 따고, 마늘 밭을 매고,<br />
                장터도 함께 나가보며<br />
                시골의 하루를 함께합니다.<br />
                할매를 도우면<br />
                숙박비도 조금 덜어드릴 수 있어요.
              </p>
            </div>
            <div className="story-image">
              <img src="/src/assets/images/할매의손맛이야기_3.png" alt="체험하는 사람들" />
            </div>
          </div>

          {/* Story 04 - 왼쪽 이미지, 오른쪽 텍스트 */}
          <div className="story-item">
            <div className="story-image">
              <img src="/src/assets/images/할매의손맛이야기_4.png" alt="할머니와 손님" />
            </div>
            <div className="story-text">
              <span className="story-number">04.</span>
              <h3 className="story-title">하루의 만남이</h3>
              <h3 className="story-subtitle">인연이 됩니다</h3>
              <p className="story-description">
                여행이 끝난 후에도<br />
                할매와 안부를 나누는 사이가 됩니다.<br />
                편지 한 장, 전화 한 통으로<br />
                이곳에서 시작된 인연은 계속 이어집니다.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="stories-map">
        <div className="container">
          <div className="map-label">
            <span>MAP</span>
          </div>
          <div className="map-container">
            <div id="map" className="kakao-map">
              {/* Kakao Map이 여기에 렌더링됩니다 */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Stories;
