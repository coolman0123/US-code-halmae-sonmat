import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailBooking.css';

// 카카오맵 관련 함수들
const loadKakaoMapScript = () => {
  return new Promise((resolve, reject) => {
    // 이미 스크립트가 로드되어 있다면 resolve
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = '//dapi.kakao.com/v2/maps/sdk.js?appkey=90ae47b29041df889ea6ef2d93c8520e&autoload=false';
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

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
  const [tripData, setTripData] = useState(null);
  const [realHostData, setRealHostData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 실제 여행 데이터 가져오기
  const fetchTripAndHostData = async () => {
    try {
      setLoading(true);
      console.log('Detail 페이지에서 데이터 로딩 시작');

      // 현재 예약 정보 불러오기
      const savedBookingData = localStorage.getItem('currentBookingData');
      if (!savedBookingData) {
        console.error('예약 데이터가 없습니다');
        setLoading(false);
        return;
      }

      const parsedBookingData = JSON.parse(savedBookingData);
      console.log('저장된 예약 데이터:', parsedBookingData);
      setBookingData(parsedBookingData);

      if (parsedBookingData.room && parsedBookingData.room.tripId) {
        // 실제 Trip 데이터 조회
        const tripResponse = await fetch(
          `https://us-code-halmae-sonmat.onrender.com/api/trips/${parsedBookingData.room.tripId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (tripResponse.ok) {
          const tripResult = await tripResponse.json();
          console.log('실제 Trip 데이터:', tripResult);
          
          if (tripResult.success && tripResult.data) {
            setTripData(tripResult.data);

            // 호스트 데이터도 가져오기
            const hostResponse = await fetch(
              `https://us-code-halmae-sonmat.onrender.com/api/hosts/${tripResult.data.hostId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (hostResponse.ok) {
              const hostResult = await hostResponse.json();
              console.log('실제 Host 데이터:', hostResult);
              
              if (hostResult.success && hostResult.data) {
                setRealHostData(hostResult.data);
                
                // 카카오맵 초기화
                if (hostResult.data.latitude && hostResult.data.longitude) {
                  initializeKakaoMap(hostResult.data.latitude, hostResult.data.longitude);
                }
              }
            }
          }
        }
      }

      // 기존 fallback 데이터들도 유지
      if (parsedBookingData.room) {
        setSelectedRoom(parsedBookingData.room);
      }
      if (parsedBookingData.hostData) {
        setHostData(prev => ({ ...prev, ...parsedBookingData.hostData }));
      }

    } catch (error) {
      console.error('데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 카카오맵 초기화
  const initializeKakaoMap = async (latitude, longitude) => {
    try {
      console.log('카카오맵 초기화 시작:', latitude, longitude);
      // await loadKakaoMapScript();
      
      // 일단 카카오맵 API 키가 없으므로 로그만 출력
      // 실제 구현 시에는 아래 코드를 사용
      /*
      const mapContainer = document.getElementById('kakao-map');
      if (mapContainer) {
        const mapOption = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3
        };
        
        const map = new window.kakao.maps.Map(mapContainer, mapOption);
        
        // 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      }
      */
    } catch (error) {
      console.error('카카오맵 초기화 오류:', error);
    }
  };

  useEffect(() => {
    fetchTripAndHostData();
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

  // 실제 데이터 사용을 위한 헬퍼 함수들
  const getTripTitle = () => {
    return tripData?.title || selectedRoom?.name || '여여';
  };

  const getTripDescription = () => {
    return tripData?.description || `${realHostData?.personalitySummary || '따뜻한 할머니'}가 준비한 특별한 숙소입니다.`;
  };

  const getHostIntroduction = () => {
    if (realHostData) {
      return {
        introduction: realHostData.hostIntroduction || realHostData.personalitySummary || '따뜻한 할머니입니다',
        age: realHostData.age ? `${realHostData.age}세` : '정보 없음',
        specialty: realHostData.characteristics || '정보 없음',
        menu: realHostData.representativeMenu || '정보 없음',
        personality: realHostData.personalitySummary || '정보 없음'
      };
    }
    return {
      introduction: basicInfo?.introduction || '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.',
      age: basicInfo?.age || '정보 없음',
      specialty: basicInfo?.specialty || '정보 없음',
      menu: basicInfo?.menu || '정보 없음',
      personality: basicInfo?.personality || '정보 없음'
    };
  };

  const getTripPrice = () => {
    return tripData?.price || bookingData?.totalPrice || selectedRoom?.price || 340000;
  };

  const getLocationInfo = () => {
    if (realHostData && realHostData.address) {
      return realHostData.address.detailAddress || realHostData.address;
    }
    if (tripData && tripData.location) {
      return tripData.location.detailAddress || tripData.location.region || '충남 논산시 연무읍';
    }
    return hostData.address || '충남 논산시 연무읍';
  };

  if (loading) {
    return (
      <div className="detail-booking-container">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>여행 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-booking-container">
      {/* 상단 검색 영역 */}
      <div className="search-section">
        <div className="search-box">
          <span className="search-date">{getSearchDateString()}</span>
        </div>
      </div>

      {/* 실제 여행 정보 표시 */}
      {tripData && (
        <div className="trip-info-banner">
          <h2>🌿 {getTripTitle()}</h2>
          <p>📍 {getLocationInfo()}</p>
          <p>📅 {tripData.startDate} ~ {tripData.endDate}</p>
          <p>👥 최대 {tripData.maxParticipants}명 (현재 {tripData.currentParticipants}명 예약)</p>
        </div>
      )}

      {/* 숙소 이미지 영역 */}
      <div className="accommodation-images">
        <div className="main-image">
          {realHostData?.housePhotos && realHostData.housePhotos.length > 0 ? (
            <img src={realHostData.housePhotos[0]} alt="숙소 메인 이미지" />
          ) : hostData.photo ? (
            <img src={hostData.photo} alt="숙소 메인 이미지" />
          ) : (
            <div className="placeholder-image">🏠 숙소 이미지</div>
          )}
        </div>
        <div className="sub-images">
          {realHostData?.housePhotos && realHostData.housePhotos.length > 1 ? (
            realHostData.housePhotos.slice(1, 3).map((photo, index) => (
              <img key={index} src={photo} alt={`숙소 이미지 ${index + 2}`} />
            ))
          ) : hostData.photos && hostData.photos.length > 0 ? (
            hostData.photos.slice(0, 2).map((photo, index) => (
              <img key={index} src={photo.url} alt={`숙소 이미지 ${index + 1}`} />
            ))
          ) : (
            <>
              <div className="placeholder-image">📷 이미지 1</div>
              <div className="placeholder-image">📷 이미지 2</div>
            </>
          )}
        </div>
      </div>

      {/* 숙소 정보 */}
      <div className="accommodation-info">
        <h1 className="room-name">{getTripTitle()}</h1>
        <p className="trip-description">{getTripDescription()}</p>
        
        <div className="info-layout">
          {/* 할매 소개 메모 박스 */}
          <div className="host-intro-box">
            <div className="host-intro-header">
              <span className="host-label">👵 할매 소개</span>
            </div>
            <div className="host-intro-content">
              <p>"{getHostIntroduction().introduction}"</p>
              <ul>
                <li>• 연령: {getHostIntroduction().age}</li>
                <li>• 특징: {getHostIntroduction().specialty}</li>
                <li>• 대표 메뉴: {getHostIntroduction().menu}</li>
                <li>• 성격: {getHostIntroduction().personality}</li>
              </ul>
            </div>
          </div>
          
          {/* 가격 및 결제 섹션 */}
          <div className="price-payment-section">
            <div className="price-info">
              <span className="total-label">총 결제금액 :</span>
              <span className="price">{getTripPrice().toLocaleString()}원</span>
            </div>
            <button className="reserve-btn" onClick={handleReservation}>
              💳 결제하기
            </button>
          </div>
        </div>
      </div>

      {/* 카카오맵 영역 */}
      {realHostData && realHostData.latitude && realHostData.longitude && (
        <div className="map-section">
          <h3 className="section-title">📍 위치 정보</h3>
          <div className="map-info">
            <p><strong>주소:</strong> {getLocationInfo()}</p>
            <p><strong>좌표:</strong> 위도 {realHostData.latitude}, 경도 {realHostData.longitude}</p>
          </div>
          <div id="kakao-map" className="kakao-map-container">
            <div className="map-placeholder">
              🗺️ 지도 영역<br/>
              <small>카카오맵 API 키 설정 후 실제 지도가 표시됩니다</small><br/>
              <small>위도: {realHostData.latitude}, 경도: {realHostData.longitude}</small>
            </div>
          </div>
        </div>
      )}

      {/* 여행 포함 사항 */}
      {tripData && tripData.included && (
        <div className="section">
          <h3 className="section-title">✅ 포함 사항</h3>
          <div className="section-content">
            <div className="included-list">
              {tripData.included.map((item, index) => (
                <div key={index} className="included-item">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 여행 불포함 사항 */}
      {tripData && tripData.excluded && (
        <div className="section">
          <h3 className="section-title">❌ 불포함 사항</h3>
          <div className="section-content">
            <div className="excluded-list">
              {tripData.excluded.map((item, index) => (
                <div key={index} className="excluded-item">
                  • {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 여행 일정 */}
      {tripData && tripData.itinerary && (
        <div className="section">
          <h3 className="section-title">📅 여행 일정</h3>
          <div className="section-content">
            <div className="itinerary-list">
              {tripData.itinerary.map((dayPlan, index) => (
                <div key={index} className="itinerary-day">
                  <h4>Day {dayPlan.day}</h4>
                  {dayPlan.title && <p className="day-title">{dayPlan.title}</p>}
                  {dayPlan.description && <p className="day-description">{dayPlan.description}</p>}
                  {dayPlan.activities && (
                    <ul className="activities-list">
                      {dayPlan.activities.map((activity, actIndex) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
