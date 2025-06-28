import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailBooking.css';

const DetailBooking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // 기본 데이터 정의
  const defaultHostData = {
    id: 'default-host',
    name: '할매의 집',
    houseName: '여여',
    photo: null,
    photos: [],
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      washer: false,
      freeParking: true,
      paidParking: false,
      airConditioner: true,
      workspace: false
    },
    bedrooms: 1,
    beds: 1,
    guests: 4,
    address: '충남 논산시 연무읍',
    phone: '010-5517-1521',
    workExperience: '다양한 농촌 체험 활동이 가능합니다.'
  };

  const defaultBasicInfo = {
    age: '70세',
    specialty: '전통 한식',
    menu: '된장찌개, 묵은지찜',
    personality: '친절하고 따뜻한',
    introduction: '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.'
  };

  const defaultSelectedRoom = {
    id: roomId || '1',
    name: '여여',
    price: 340000
  };

  // 초기 상태를 기본값으로 설정
  const [hostData, setHostData] = useState(defaultHostData);
  const [basicInfo, setBasicInfo] = useState(defaultBasicInfo);
  const [selectedRoom, setSelectedRoom] = useState(defaultSelectedRoom);
  const [bookingData, setBookingData] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  useEffect(() => {
    // 현재 예약 정보 불러오기
    const savedBookingData = localStorage.getItem('currentBookingData');
    if (savedBookingData) {
      try {
        const parsedBookingData = JSON.parse(savedBookingData);
        setBookingData(parsedBookingData);
        if (parsedBookingData.room) {
          setSelectedRoom(parsedBookingData.room);
        }
        if (parsedBookingData.hostData) {
          setHostData(parsedBookingData.hostData);
        }
      } catch (error) {
        console.error('예약 데이터 파싱 오류:', error);
      }
    }

    // Host Register Detail에서 저장된 데이터 가져오기
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    if (hostsList.length > 0) {
      const latestHost = hostsList[hostsList.length - 1];
      setHostData(prev => ({ ...prev, ...latestHost }));
    }

    // Host Register New에서 저장된 기본 정보 가져오기
    const savedData = localStorage.getItem('hostRegisterData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.basicInfo) {
          setBasicInfo(prev => ({ ...prev, ...parsedData.basicInfo }));
        }
      } catch (error) {
        console.error('호스트 등록 데이터 파싱 오류:', error);
      }
    }
  }, [roomId]);

  const handleReservation = () => {
    // 예약하기 버튼 클릭 시 결제 페이지로 이동
    navigate('/live-reservation/payment');
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}.${month}.${day} (${weekday})`;
  };

  const getTotalGuests = () => {
    if (bookingData?.guests) {
      return bookingData.guests.adult + bookingData.guests.child + bookingData.guests.infant;
    }
    return 2; // 기본값
  };

  const getSearchDateString = () => {
    if (bookingData?.dates) {
      const checkIn = new Date(bookingData.dates.checkIn);
      const checkOut = new Date(bookingData.dates.checkOut);
      const checkInStr = `${checkIn.getMonth() + 1}.${String(checkIn.getDate()).padStart(2, '0')}`;
      const checkOutStr = `${checkOut.getMonth() + 1}.${String(checkOut.getDate()).padStart(2, '0')}`;
      return `${checkInStr}-${checkOutStr} | 성인 ${getTotalGuests()}`;
    }
    return '2025.06.24-25 | 성인 2';
  };

  return (
    <div className="detail-booking-container">
      {/* 상단 검색 영역 */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-date">{getSearchDateString()}</span>
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
        <h1 className="room-name">{selectedRoom?.name || '여여'}</h1>
        
        <div className="info-layout">
          {/* 할매 소개 메모 박스 */}
          <div className="host-intro-box">
            <div className="host-intro-header">
              <span className="host-label">할매 소개</span>
            </div>
            <div className="host-intro-content">
              <p>"{basicInfo?.introduction || '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.'}"</p>
              <ul>
                <li>• 연령: {basicInfo?.age || '정보 없음'}</li>
                <li>• 특기: {basicInfo?.specialty || '정보 없음'}</li>
                <li>• 대표 메뉴: {basicInfo?.menu || '정보 없음'}</li>
                <li>• 성격: {basicInfo?.personality || '정보 없음'}</li>
              </ul>
            </div>
          </div>
          
          {/* 가격 및 결제 섹션 */}
          <div className="price-payment-section">
            <div className="price-info">
              <span className="total-label">총 결제금액 :</span>
              <span className="price">{(bookingData?.totalPrice || selectedRoom?.price || 340000).toLocaleString()}원</span>
            </div>
            <button className="reserve-btn" onClick={handleReservation}>
              결제
            </button>
          </div>
        </div>
      </div>

      {/* 후기 섹션 */}
      <div className="review-section">
        <div className="review-header">
          <span className="rating">⭐ 4.8 (4,309)</span>
          <span 
            className="review-link" 
            onClick={() => navigate(`/live-reservation/review/${roomId}`)}
            style={{ cursor: 'pointer' }}
          >
            전체보기 {`>`}
          </span>
        </div>
        
        <div className="review-content">
          <div className="review-item">
            <div className="review-stars">⭐⭐⭐⭐⭐</div>
            <div className="review-date">2023.05.15</div>
            <div className="review-text">방이 깨끗하고 친절한 할머니께서 좋았어요</div>
          </div>
          <div className="review-item">
            <div className="review-stars">⭐⭐⭐⭐⭐</div>
            <div className="review-date">2023.04.28</div>
            <div className="review-text">방이랑 화장실이 깨끗하고 할머니가 친절하셔서 좋았어요</div>
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
            <button 
              className="event-more-btn"
              onClick={() => setShowEventModal(true)}
            >
              더보기 {`>`}
            </button>
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
              <span className="detail-label">인원</span>
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

      {/* 이벤트 모달 */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>일손 돕기 이벤트</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowEventModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="event-item">
                <h4>Event 1</h4>
                <p><strong>일손 체험하면 숙박비 10% 할인!</strong></p>
                <p>마늘까기, 감따기, 밭일 돕기 등<br />할머니와 함께하는 하루의 보람,<br />후기 등록 시 10% 할인쿠폰을 드려요.<br />함께한 마음, 따뜻한 숙소로 이어집니다.</p>
              </div>
              
              <div className="event-item">
                <h4>Event 2</h4>
                <p><strong>할매의 밥상, 저녁 한 끼가 무료!</strong></p>
                <p>당일 숙박 고객에게 제공되는<br />시골 제철 밥상 1회 무료 체험<br />텃밭에서 딴 채소로 직접 만든<br />정성 가득한 한 상을 받아보세요.</p>
              </div>
              
              <div className="event-item">
                <h4>Event 3</h4>
                <p><strong>교감의 이야기, 선물로 보답!</strong></p>
                <p>할머니와 한 달간 나눈 소중한 추억,<br />그 이야기를 들려주세요.<br />코디네이터가 인터뷰를 통해 정리한 후기를<br />게시판에 올려드리며,<br />따뜻한 이야기를 남겨주신 분께는<br />소정의 기프티콘을 선물로 드립니다.</p>
              </div>
              
              <div className="event-item">
                <h4>Event 4</h4>
                <p><strong>다음 손님에게 마음 전하기!</strong></p>
                <p>체험을 마친 후,<br />다음 손님에게 짧은 메시지를 남겨주세요.<br />따뜻한 마음이 담긴 편지는 방 안에 놓여집니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailBooking;
