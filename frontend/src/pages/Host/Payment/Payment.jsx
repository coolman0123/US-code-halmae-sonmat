import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const HostPayment = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [paymentData, setPaymentData] = useState({});

  // 임시 결제 데이터 (실제 API에서 가져올 데이터)
  const generatePaymentData = () => {
    const data = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 2025년 6월 고정 결제 데이터 (첨부 이미지와 동일)
    if (year === 2025 && month === 5) { // 6월 (0-based index)
      data[`${year}-${month + 1}-2`] = 340000;
      data[`${year}-${month + 1}-3`] = 340000;
      data[`${year}-${month + 1}-4`] = 340000;
      data[`${year}-${month + 1}-5`] = 340000;
      data[`${year}-${month + 1}-6`] = 340000;
      data[`${year}-${month + 1}-7`] = 340000;
      data[`${year}-${month + 1}-8`] = 340000;
      data[`${year}-${month + 1}-9`] = 340000;
      data[`${year}-${month + 1}-10`] = 340000;
      data[`${year}-${month + 1}-14`] = 340000;
      data[`${year}-${month + 1}-15`] = 340000;
      data[`${year}-${month + 1}-16`] = 340000;
      data[`${year}-${month + 1}-17`] = 340000;
      data[`${year}-${month + 1}-18`] = 340000;
      data[`${year}-${month + 1}-19`] = 340000;
      data[`${year}-${month + 1}-20`] = 340000;
      data[`${year}-${month + 1}-21`] = 340000;
      data[`${year}-${month + 1}-22`] = 340000;
      data[`${year}-${month + 1}-23`] = 340000;
      data[`${year}-${month + 1}-24`] = 340000;
      data[`${year}-${month + 1}-25`] = 340000;
      data[`${year}-${month + 1}-26`] = 340000;
      data[`${year}-${month + 1}-27`] = 340000;
      data[`${year}-${month + 1}-28`] = 340000;
      data[`${year}-${month + 1}-29`] = 340000;
      data[`${year}-${month + 1}-30`] = 340000;
    } else {
      // 다른 월에는 랜덤 데이터
      for (let day = 1; day <= 30; day++) {
        if (Math.random() > 0.4) { // 60% 확률로 결제 발생
          data[`${year}-${month + 1}-${day}`] = 340000;
        }
      }
    }
    
    return data;
  };

  useEffect(() => {
    setPaymentData(generatePaymentData());
  }, [currentDate]);

  // 캘린더 데이터 생성
  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 일요일부터 시작

    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      calendarDays.push(date);
    }

    return calendarDays;
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('ko-KR') || '';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date, payment) => {
    if (payment) { // 결제 내역이 있는 날짜만 클릭 가능
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      navigate(`/host/payment/${year}${month}${day}`);
    }
  };

  const calendarDays = generateCalendarData();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return (
    <div className="payment-management-page">
      <div className="payment-container">
        <h1 className="payment-title">결제 관리</h1>
        
        {/* 월 네비게이션 */}
        <div className="month-navigation">
          <button 
            className="nav-button prev"
            onClick={() => navigateMonth(-1)}
          >
            ◀
          </button>
          <h2 className="current-month">
            {currentYear}. {currentMonth.toString().padStart(2, '0')}
          </h2>
          <button 
            className="nav-button next"
            onClick={() => navigateMonth(1)}
          >
            ▶
          </button>
        </div>

        {/* 총 결제 금액 표시 */}
        <div className="payment-summary-text">
          ※ 총 결제 금액
        </div>

        {/* 캘린더 */}
        <div className="calendar-container">
          {/* 요일 헤더 */}
          <div className="calendar-header">
            <div className="day-header sunday">일요일</div>
            <div className="day-header">월요일</div>
            <div className="day-header">화요일</div>
            <div className="day-header">수요일</div>
            <div className="day-header">목요일</div>
            <div className="day-header">금요일</div>
            <div className="day-header saturday">토요일</div>
          </div>

          {/* 캘린더 그리드 */}
          <div className="calendar-grid">
            {calendarDays.map((date, index) => {
              const dateKey = formatDate(date);
              const payment = paymentData[dateKey];
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const dayOfWeek = date.getDay();
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <div 
                  key={index}
                  className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSunday ? 'sunday' : ''} ${isSaturday ? 'saturday' : ''} ${payment && isCurrentMonth ? 'clickable' : ''}`}
                  onClick={() => handleDateClick(date, payment)}
                >
                  <div className="day-number">
                    {date.getDate()}
                  </div>
                  {payment && isCurrentMonth && (
                    <div className="payment-amount">
                      {formatCurrency(payment)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPayment;
