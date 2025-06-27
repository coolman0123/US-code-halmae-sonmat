import React, { useState, useEffect } from 'react';
import Calendar from '../../../components/Calendar/Calendar';
import './MyReservation.css';

const MyReservation = () => {
  const [showPrices, setShowPrices] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [bookingData, setBookingData] = useState({});

  // Host Booking과 동일한 예약 데이터 생성
  const generateBookingData = () => {
    const data = {};
    
    // localStorage에서 저장된 예약 데이터 가져오기
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    
    // 저장된 예약 데이터를 날짜별로 처리 (입실 날짜만 표시)
    savedReservations.forEach(reservation => {
      const startDate = new Date(reservation.startDate);
      
      // 입실 날짜만 표시
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const day = startDate.getDate();
      const dateKey = `${year}-${month}-${day}`;
      
      // 같은 날짜에 여러 예약이 있을 수 있으므로 배열로 관리
      if (!data[dateKey]) {
        data[dateKey] = [];
      }
      
      data[dateKey].push({
        status: reservation.status, // 'available' 또는 'unavailable'
        houseName: reservation.houseName,
        displayText: reservation.status === 'available' ? '가' : '완'
      });
    });
    
    // 기본 임시 데이터 (저장된 데이터가 없을 때)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    if (savedReservations.length === 0 && year === 2025 && month === 5) {
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
          displayText: '완'
        });
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
          displayText: '가'
        });
      });

      // 24일에 여러 숙소 예시 추가
      const day24Key = `${year}-${month + 1}-24`;
      data[day24Key] = [
        { status: 'available', houseName: '여여', displayText: '가' },
        { status: 'unavailable', houseName: '모모', displayText: '완' },
        { status: 'available', houseName: '소소', displayText: '가' },
        { status: 'unavailable', houseName: '영영', displayText: '완' },
        { status: 'unavailable', houseName: '패밀리', displayText: '완' }
      ];
    }
    
    return data;
  };

  useEffect(() => {
    setBookingData(generateBookingData());
  }, [currentDate]);

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      setBookingData(generateBookingData());
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [currentDate]);

  const handleCheckboxChange = (e) => {
    setShowPrices(e.target.checked);
  };

  const handleDateClick = (date, data) => {
    console.log('날짜 클릭:', date, data);
  };

  // 날짜별 컨텐츠 렌더링 함수 (Host Booking과 동일)
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
                  150,000원
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
    <div className='book-now-wrapper'>
      <h1>예약현황</h1>

      <div className='calendar-header'>
        <label>
          <input
            type='checkbox'
            checked={showPrices}
            onChange={handleCheckboxChange}
          />
          날짜별 요금보기
        </label>
      </div>

      <div className='calendar-wrapper'>
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

export default MyReservation;
