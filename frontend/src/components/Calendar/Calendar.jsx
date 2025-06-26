import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

import 예약가능 from '../../assets/images/예약가능.png';
import 예약진행 from '../../assets/images/예약진행.png';
import 예약완료 from '../../assets/images/예약완료.png';
import 전화문의 from '../../assets/images/전화문의.png';

const CalendarComponent = ({ showPrices }) => {
  const getStatusIcon = (date) => {
    const day = date.getDate();
    if (day % 7 === 0) return 전화문의;
    if (day % 5 === 0) return 예약완료;
    if (day % 3 === 0) return 예약진행;
    return 예약가능;
  };

  return (
    <Calendar
      calendarType='gregory'
      showNeighboringMonth={false}
      formatDay={(_, date) => `${date.getDate()}일`}
      tileContent={({ date }) => (
        <div className='tile-content'>
          <img src={getStatusIcon(date)} alt='상태' className='status-icon' />
          {showPrices && <span className='price'>₩100,000</span>}
        </div>
      )}
    />
  );
};

export default CalendarComponent;
