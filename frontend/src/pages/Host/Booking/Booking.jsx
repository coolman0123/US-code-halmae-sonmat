import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar';
import './Booking.css';

const HostBooking = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [bookingData, setBookingData] = useState({});
  const [showPrices, setShowPrices] = useState(false); // 가격 표시 옵션 추가

  // 예약 데이터 생성 (localStorage 반영)
  const generateBookingData = () => {
    const data = {};
    
    // localStorage에서 저장된 예약 데이터 가져오기
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    // localStorage에서 할매 정보 가져오기 (가격 정보를 위해)
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    
    // 저장된 예약 데이터를 날짜별로 처리 (입실 날짜만 표시)
    savedReservations.forEach(reservation => {
      const startDate = new Date(reservation.startDate);

      
      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('예약 데이터 조회에 실패했습니다.');
      }

      const result = await response.json();
      console.log('백엔드에서 불러온 Trip 데이터:', result);

      const data = {};

      if (result.success && result.data && Array.isArray(result.data)) {
        // Trip 데이터를 날짜별 예약 데이터로 변환
        result.data.forEach(trip => {
          if (trip.status === 'cancelled') return; // 취소된 여행은 제외
          
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          
          // 시작일부터 종료일까지 모든 날짜를 예약 불가로 표시
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const dateKey = `${year}-${month}-${day}`;
            
            if (!data[dateKey]) {
              data[dateKey] = [];
            }
            
            // 현재 참가자가 최대 참가자 수에 도달했는지 확인
            const isFull = trip.currentParticipants >= trip.maxParticipants;
            
            data[dateKey].push({
              tripId: trip.id,
              status: isFull ? 'unavailable' : 'available',
              houseName: trip.title,
              displayText: isFull ? '완' : '가',
              participants: `${trip.currentParticipants}/${trip.maxParticipants}`,
              price: trip.price
            });
          }
        });
      }

      // 백엔드 데이터가 없거나 적을 때 기본 임시 데이터 추가
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      

      // 해당 숙소의 가격 정보 찾기
      let housePrice = null;
      if (reservation.totalPrice) {
        // 예약 데이터에 가격이 있으면 사용
        housePrice = reservation.totalPrice;
      } else {
        // 할매 정보에서 가격 찾기
        const hostInfo = hostsList.find(host => host.houseName === reservation.houseName);
        if (hostInfo && hostInfo.price) {
          housePrice = parseInt(hostInfo.price);
        }
      }
      
      data[dateKey].push({
        status: reservation.status, // 'available' 또는 'unavailable'
        houseName: reservation.houseName,
        displayText: reservation.status === 'available' ? '가' : '완',
        price: housePrice // 가격 정보 추가
      });
    });
    
    // 기본 임시 데이터 (저장된 데이터가 없을 때)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (savedReservations.length === 0 && year === 2025 && month === 5) {
      // 할매 정보에서 가격 가져오기 (기본 데이터용)
      const defaultPrice = hostsList.length > 0 && hostsList[0].price ? parseInt(hostsList[0].price) : 340000;
      
      // 예약 불가능한 날짜들 (빨강색 - '완')
      const unavailableDays = [2, 3, 7, 8, 9, 15, 16, 22, 23, 29, 30];
      unavailableDays.forEach(day => {
        const dateKey = `${year}-${month + 1}-${day}`;
        if (!data[dateKey]) {
          data[dateKey] = [];
        }
        data[dateKey].push({
          status: 'unavailable',
          houseName: '여여',
          displayText: '완',
          price: defaultPrice

        });


      // 예약 가능한 날짜들 (녹색 - '가')
      const availableDays = [1, 4, 5, 6, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 25, 26, 27, 28];
      availableDays.forEach(day => {
        const dateKey = `${year}-${month + 1}-${day}`;
        if (!data[dateKey]) {
          data[dateKey] = [];
        }
        data[dateKey].push({
          status: 'available',
          houseName: '여여',
          displayText: '가',
          price: defaultPrice

        });

      // 24일에 여러 숙소 예시 추가
      const day24Key = `${year}-${month + 1}-24`;
      data[day24Key] = [
        { status: 'available', houseName: '여여', displayText: '가', price: defaultPrice },
        { status: 'unavailable', houseName: '모모', displayText: '완', price: 280000 },
        { status: 'available', houseName: '소소', displayText: '가', price: 280000 },
        { status: 'unavailable', houseName: '영영', displayText: '완', price: 300000 },
        { status: 'unavailable', houseName: '패밀리', displayText: '완', price: 400000 }
      ];

    }
  };

  useEffect(() => {
    const loadBookingData = async () => {
      const data = await fetchBookingDataFromAPI();
      setBookingData(data);
    };
    
    loadBookingData();
  }, [currentDate]);

  // 페이지 포커스 시 데이터 새로고침 (예약 추가 후 돌아왔을 때)
  useEffect(() => {
    const handleFocus = async () => {
      const data = await fetchBookingDataFromAPI();
      setBookingData(data);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentDate]);

  const handleDateClick = (date, booking) => {
    if (booking) {
      console.log('클릭된 날짜:', date, '예약 정보:', booking);
      // 예약 상세 보기나 수정 기능을 여기에 추가할 수 있습니다
    }
  };

  const handleAddReservation = () => {
    navigate('/host/booking/add');
  };

  const handleCheckboxChange = (e) => {
    setShowPrices(e.target.checked);
  };

  // 날짜별 컨텐츠 렌더링 함수 (예약 상태 표시)
  const renderDateContent = (date, data, isCurrentMonth) => {
    if (data && isCurrentMonth && Array.isArray(data)) {
      return (
        <div className="booking-content">
          {data.map((booking, index) => (
            <div key={index} className="booking-item">
              <div className={`status-box ${booking.status}`}>
                {booking.displayText}
              </div>
              <div className="house-name">
                {booking.houseName}
              </div>

              {showPrices && (
                <div className="price-display">
                  {booking.price ? `${booking.price.toLocaleString()}원` : '가격 정보 없음'}

                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="booking-management-page">
      <div className="booking-container">
        <h1 className="booking-title">예약 관리</h1>
        
        <div className="booking-controls">
          <div className="calendar-header">
            <label>
              <input
                type="checkbox"
                checked={showPrices}
                onChange={handleCheckboxChange}
              />
              날짜별 요금보기
            </label>
          </div>
          
          <button 
            className="add-reservation-button"
            onClick={handleAddReservation}
          >
            예약 추가
          </button>
        </div>

        {/* 캘린더 컴포넌트 사용 */}
        <Calendar 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDateClick={handleDateClick}
          dateData={bookingData}
          renderDateContent={renderDateContent}
        />
      </div>
    </div>
  );
};

export default HostBooking;
