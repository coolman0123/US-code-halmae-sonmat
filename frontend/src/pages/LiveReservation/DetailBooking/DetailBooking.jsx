import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailBooking.css';

const DetailBooking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [hostData, setHostData] = useState(null);
  const [basicInfo, setBasicInfo] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // Host Register Detail에서 저장된 데이터 가져오기
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    if (hostsList.length > 0) {
      const latestHost = hostsList[hostsList.length - 1];
      setHostData(latestHost);
    }

    // Host Register New에서 저장된 기본 정보 가져오기
    const savedData = localStorage.getItem('hostRegisterData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setBasicInfo(parsedData.basicInfo || {});
    }

    // 선택된 객실 정보 설정 (임시로 여여 객실)
    setSelectedRoom({
      id: roomId,
      name: '여여',
      price: 340000
    });
  }, [roomId]);

  const handleReservation = () => {
    // 예약하기 버튼 클릭 시 결제 페이지로 이동
    navigate('/live-reservation/payment');
  };

  if (!hostData) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="detail-booking-container">
      {/* 상단 검색 영역 */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <span className="search-text">여행</span>
          <span className="search-date">2025.06.24-25 | 성인 2</span>
        </div>
      </div>

      {/* 숙소 이미지 영역 */}
      <div className="accommodation-images">
        <div className="main-image">
          {hostData.photo ? (
            <img src={hostData.photo} alt="숙소 메인 이미지" />
          ) : (
            <div className="placeholder-image">숙소 이미지</div>
          )}
        </div>
        <div className="sub-images">
          {hostData.photos && hostData.photos.length > 0 ? (
            hostData.photos.slice(0, 2).map((photo, index) => (
              <img key={index} src={photo.url} alt={`숙소 이미지 ${index + 1}`} />
            ))
          ) : (
            <>
              <div className="placeholder-image">이미지 1</div>
              <div className="placeholder-image">이미지 2</div>
            </>
          )}
        </div>
      </div>

      {/* 숙소 정보 */}
      <div className="accommodation-info">
        <div className="room-type">1일차예약</div>
        <h1 className="room-name">{selectedRoom?.name || '여여'}</h1>
        <div className="host-intro">
          <span className="host-label">할매 소개</span>
        </div>
        <div className="price-section">
          <span className="total-label">총 결제금액 :</span>
          <span className="price">{(selectedRoom?.price || 340000).toLocaleString()}원</span>
          <button className="reserve-btn" onClick={handleReservation}>
            결제
          </button>
        </div>
      </div>

      {/* 할매 소개 섹션 */}
      <div className="section">
        <div className="section-content">
          <p>{basicInfo?.introduction || '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.'}</p>
          <ul>
            <li>• 연령: {basicInfo?.age || '정보 없음'}</li>
            <li>• 특기: {basicInfo?.specialty || '정보 없음'}</li>
            <li>• 대표 메뉴: {basicInfo?.menu || '정보 없음'}</li>
            <li>• 성격: {basicInfo?.personality || '정보 없음'}</li>
          </ul>
        </div>
      </div>

      {/* 후기 섹션 */}
      <div className="review-section">
        <div className="review-header">
          <span className="rating">⭐ 4.8 (4,309)</span>
          <span className="review-link">전체보기 </span>
        </div>
        <div className="review-stars">⭐⭐⭐⭐⭐</div>
        <div className="review-content">
          <div className="review-item">
            <span className="review-date">2023.05.15</span>
            <p>방이 깨끗하고 친절한 할머니께서 좋았어요</p>
          </div>
          <div className="review-item">
            <span className="review-date">⭐⭐⭐⭐⭐</span>
            <p>편안한 휴식</p>
          </div>
        </div>
      </div>

      {/* 구비시설 섹션 */}
      <div className="section">
        <h3 className="section-title">구비시설</h3>
        <div className="section-content">
          <p>숙소에서 제공하는 편의시설을 확인해보세요.</p>
          <div className="amenities-list">
            {hostData.amenities && Object.entries(hostData.amenities).map(([key, value]) => {
              if (!value) return null;
              const amenityNames = {
                wifi: '와이파이',
                tv: 'TV',
                kitchen: '주방',
                washer: '세탁기',
                freeParking: '건물 내 무료 주차',
                paidParking: '건물 내/외 유료 주차',
                airConditioner: '에어컨',
                workspace: '업무 전용 공간'
              };
              return (
                <div key={key} className="amenity-item">
                  • {amenityNames[key] || key}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 일손돕기 이벤트 섹션 */}
      <div className="section">
        <h3 className="section-title">일손 돕기 이벤트</h3>
        <div className="section-content">
          <p><strong>체험 가능한 일손:</strong></p>
          <p>{hostData.workExperience || '다양한 농촌 체험 활동이 가능합니다.'}</p>
          <div className="event-notice">
            <p>체험형 숙소 예약 시, 일손 돕기 활동에 참여하신 후 코디네이터와의 인터뷰를 통해 후기 내용을 전달해주시면 숙박 요금의 10%가 할인됩니다.</p>
            <p>※ 전달해주신 후기는 코디네이터가 정리하여 게시판에 등록되며, 할인은 후기 확인 후 적용됩니다.</p>
          </div>
        </div>
      </div>

      {/* 숙소 정보 섹션 */}
      <div className="section">
        <h3 className="section-title">숙소 정보</h3>
        <div className="section-content">
          <div className="accommodation-details">
            <div className="detail-row">
              <span className="detail-label">침실</span>
              <span className="detail-value">{hostData.bedrooms || 1}개</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">침대</span>
              <span className="detail-value">{hostData.beds || 1}개</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">게스트</span>
              <span className="detail-value">최대 {hostData.guests || 4}명</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">체크인</span>
              <span className="detail-value">오후 3:00 이후</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">체크아웃</span>
              <span className="detail-value">오전 11:00 이전</span>
            </div>
          </div>
        </div>
      </div>

      {/* 위치 섹션 */}
      <div className="section">
        <h3 className="section-title">위치</h3>
        <div className="section-content">
          <div className="location-info">
            <p>{hostData.address || '주소 정보가 없습니다.'}</p>
            <div className="map-placeholder">
              <div className="map-container">
                {/* 지도 영역 - 실제 구현시 카카오맵 API 사용 */}
                <div className="map-area">지도가 표시될 영역</div>
              </div>
            </div>
            <div className="contact-info">
              <p><strong>연락처</strong></p>
              <p>{hostData.phone || '010-5517-1521'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBooking;
