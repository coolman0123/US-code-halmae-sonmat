import React from 'react';
import './Calendar.css';

const Calendar = ({ 
  currentDate, 
  onDateChange, 
  onDateClick, 
  dateData = {}, 
  formatCurrency,
  renderDateContent 
}) => {
  // 캘린더 데이터 생성
  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
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

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    onDateChange(newDate);
  };

  const handleDateClick = (date) => {
    if (onDateClick) {
      const dateKey = formatDate(date);
      const data = dateData[dateKey];
      onDateClick(date, data);
    }
  };

  const calendarDays = generateCalendarData();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return (
    <div className="calendar-component">
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
            const data = dateData[dateKey];
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const dayOfWeek = date.getDay();
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <div 
                key={index}
                className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isSunday ? 'sunday' : ''} ${isSaturday ? 'saturday' : ''} ${data && isCurrentMonth ? 'clickable' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className="day-number">
                  {date.getDate()}
                </div>
                {renderDateContent && renderDateContent(date, data, isCurrentMonth)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
