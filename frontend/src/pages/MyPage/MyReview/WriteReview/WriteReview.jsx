import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import roomImg from '../../../../assets/images/내 결제_숙소.png';
import SelectButton from '../../../../components/Button/Button';
import whiteCheck from '../../../../assets/icons/흰체크.png';
import grayCheck from '../../../../assets/icons/회색체크.png';
import './WriteReview.css';

const WriteReview = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserTravelHistory();
  }, [navigate]);

  // 실제 백엔드에서 사용자의 여행 이력 조회
  const loadUserTravelHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // 로그인한 사용자 정보 가져오기
      const userData = localStorage.getItem("currentUser");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      if (!isLoggedIn || isLoggedIn !== "true" || !userData) {
        navigate("/auth/login");
        return;
      }

      const user = JSON.parse(userData);
      setCurrentUser(user);

      console.log('리뷰 작성을 위한 사용자 여행 이력 조회 시작:', user);

      // 1. 사용자의 결제 내역 조회
      const paymentsResponse = await fetch(
        `https://us-code-halmae-sonmat.onrender.com/api/payments/user/${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!paymentsResponse.ok) {
        throw new Error('결제 내역 조회에 실패했습니다.');
      }

      const paymentsResult = await paymentsResponse.json();
      console.log('사용자 결제 내역:', paymentsResult);

      if (!paymentsResult.success || !paymentsResult.data) {
        console.log('결제 내역이 없습니다.');
        setUserReservations([]);
        return;
      }

      // 2. 결제 완료된 여행들을 리뷰 작성 가능한 형태로 변환
      const completedPayments = paymentsResult.data.filter(payment => 
        payment.paymentStatus === 'completed' || payment.paymentStatus === 'success'
      );

      // 3. 각 결제에 대한 Trip과 Host 정보 가져오기
      const travelHistoryPromises = completedPayments.map(async (payment) => {
        try {
          // Trip 정보 조회
          const tripResponse = await fetch(
            `https://us-code-halmae-sonmat.onrender.com/api/trips/${payment.tripId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          let tripData = null;
          let hostData = null;

          if (tripResponse.ok) {
            const tripResult = await tripResponse.json();
            if (tripResult.success && tripResult.data) {
              tripData = tripResult.data;

              // Host 정보 조회
              const hostResponse = await fetch(
                `https://us-code-halmae-sonmat.onrender.com/api/hosts/${tripData.hostId}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (hostResponse.ok) {
                const hostResult = await hostResponse.json();
                if (hostResult.success && hostResult.data) {
                  hostData = hostResult.data;
                }
              }
            }
          }

          return {
            id: payment.id,
            paymentId: payment.id,
            tripId: payment.tripId,
            hostId: payment.hostId,
            location: tripData?.title || payment.bookingDetails?.tripTitle || '여행',
            date: new Date(payment.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/ /g, ''),
            price: `${payment.amount.toLocaleString()}원`,
            description: hostData ? 
              `"${hostData.personalitySummary || '친절한 할머니'}" ${hostData.name || '할머니'}` :
              `${tripData?.description || '특별한 농촌 체험'}`,
            tripData: tripData,
            hostData: hostData,
            paymentData: payment,
            // 여행 종료 여부 확인 (여행 종료 후에만 리뷰 작성 가능)
            canReview: tripData ? new Date() > new Date(tripData.endDate) : true
          };
        } catch (error) {
          console.error('여행 정보 조회 오류:', error);
          // 에러가 발생해도 기본 정보는 표시
          return {
            id: payment.id,
            paymentId: payment.id,
            tripId: payment.tripId,
            hostId: payment.hostId,
            location: payment.bookingDetails?.tripTitle || '여행',
            date: new Date(payment.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/ /g, ''),
            price: `${payment.amount.toLocaleString()}원`,
            description: '농촌 체험 여행',
            paymentData: payment,
            canReview: true
          };
        }
      });

      const travelHistory = await Promise.all(travelHistoryPromises);
      console.log('처리된 여행 이력:', travelHistory);

      // 4. 리뷰 작성 가능한 여행들만 필터링
      const reviewableTravels = travelHistory.filter(travel => travel.canReview);
      setUserReservations(reviewableTravels);

    } catch (error) {
      console.error('여행 이력 로드 오류:', error);
      setError(error.message);
      
      // 에러 발생 시 로컬 스토리지 데이터를 fallback으로 사용
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Fallback 데이터 로드 (API 오류 시)
  const loadFallbackData = () => {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const fallbackReservations = reservations.map((reservation, index) => ({
      id: reservation.id || index + 1,
      paymentId: reservation.paymentId || reservation.id,
      location: reservation.houseName || '여행',
      date: reservation.startDate || '2025.06.24',
      price: `${reservation.totalPrice?.toLocaleString() || '150,000'}원`,
      description: '따뜻한 할머니와 함께하는 농촌 체험',
      canReview: true
    }));
    
    setUserReservations(fallbackReservations);
  };

  if (loading) {
    return (
      <div className='write-review'>
        <div className='loading-container'>
          <div className='loading-spinner'>🔄</div>
          <p>여행 이력을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='write-review'>
        <div className='error-container'>
          <div className='error-message'>
            <h3>❌ 오류가 발생했습니다</h3>
            <p>{error}</p>
            <button onClick={loadUserTravelHistory} className='retry-button'>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTrip = userReservations.find(trip => trip.id === selectedId);

  return (
    <div className='write-review'>
      <div className='page-header'>
        <h2>📝 리뷰 작성할 여행 선택</h2>
        <p>참여하신 여행 중 리뷰를 작성하고 싶은 여행을 선택해주세요.</p>
      </div>

      {userReservations.length > 0 ? (
        userReservations.map((item) => (
          <div className={`review-card ${selectedId === item.id ? 'selected' : ''}`} key={item.id}>
            <img src={item.hostData?.housePhotos?.[0] || roomImg} alt='숙소' />
            <div className='info'>
              <p className='place'>🏠 {item.location}</p>
              <p className='date'>📅 {item.date}</p>
              <p className='price'>💰 {item.price}</p>
              <p className='desc'>👵 {item.description}</p>
              {item.tripData && (
                <div className='trip-details'>
                  <span className='trip-period'>
                    🗓️ {item.tripData.startDate} ~ {item.tripData.endDate}
                  </span>
                  {!item.canReview && (
                    <span className='not-reviewable'>⏳ 여행 종료 후 리뷰 작성 가능</span>
                  )}
                </div>
              )}
            </div>
            <SelectButton
              selected={selectedId === item.id}
              icon={selectedId === item.id ? whiteCheck : grayCheck}
              text={selectedId === item.id ? '선택됨' : '선택'}
              onClick={() =>
                setSelectedId(selectedId === item.id ? null : item.id)
              }
              disabled={!item.canReview}
            />
          </div>
        ))
      ) : (
        <div className='no-reservations'>
          <div className='empty-state'>
            <div className='empty-icon'>🏕️</div>
            <h3>참여한 여행이 없습니다</h3>
            <p>먼저 할머니의 농촌 체험에 참여해보세요!</p>
            <button 
              onClick={() => navigate('/live-reservation/book-now')}
              className='go-booking-btn'
            >
              여행 예약하러 가기
            </button>
          </div>
        </div>
      )}
      
      {selectedTrip && (
        <div className='selected-trip-preview'>
          <h3>✅ 선택된 여행</h3>
          <div className='preview-info'>
            <span className='preview-name'>{selectedTrip.location}</span>
            <span className='preview-date'>{selectedTrip.date}</span>
          </div>
        </div>
      )}

      <div className='write-bottom-btn'>
        <SelectButton
          selected={!!selectedId}
          disabled={!selectedId}
          text={selectedId ? '리뷰 작성하러 가기' : '여행을 선택해주세요'}
          onClick={() => {
            if (selectedId && selectedTrip) {
              // 선택된 여행 정보를 로컬 스토리지에 저장
              localStorage.setItem('selectedTripForReview', JSON.stringify(selectedTrip));
              navigate(`/mypage/review/form/${selectedId}`);
            }
          }}
        />
      </div>
    </div>
  );
};

export default WriteReview;
