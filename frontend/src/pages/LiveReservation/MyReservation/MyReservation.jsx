import React, { useState } from 'react';
import CustomCalendar from '@/components/Calendar/Calendar';
import './MyReservation.css';

const MyReservation = () => {
  const [showPrices, setShowPrices] = useState(false);

  return (
    <div className='my-reservation-page'>
      <div className='calendar-header'>
        <div className='calendar-toggle'>
          <input
            type='checkbox'
            id='price-toggle'
            checked={showPrices}
            onChange={() => setShowPrices((prev) => !prev)}
          />
          <label htmlFor='price-toggle'>날짜별 요금보기</label>
        </div>
      </div>

      <CustomCalendar showPrices={showPrices} />
    </div>
  );
};

export default MyReservation;
