import React, { useState } from 'react';
import Calendar from '@/components/Calendar/Calendar';
import './MyReservation.css';

const BookNow = () => {
  const [showPrices, setShowPrices] = useState(false);

  const handleCheckboxChange = (e) => {
    setShowPrices(e.target.checked);
  };

  return (
    <div className='book-now-wrapper'>
      <h1>예약하기</h1>

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
        <Calendar showPrices={showPrices} />
      </div>
    </div>
  );
};

export default BookNow;
