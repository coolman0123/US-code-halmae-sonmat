import React, { useState } from 'react';
import MyReservation from '../MyReservation/MyReservation';
import BookNow from '../BookNow/BookNow';
import { Header, Footer, Calendar, Button } from '@/components';
import './LiveBooking.css';

const LiveBooking = () => {
  const [activeTab, setActiveTab] = useState('reservation');

  return (
    <div className='live-booking-wrapper'>
      <Header />

      <div className='booking-container'>
        <p className='booking-subtitle'>정겨운 여행을 만나는 공간</p>
        <h1 className='booking-title'>실시간예약</h1>

        <div className='booking-tab-menu'>
          <button
            className={`tab-button ${
              activeTab === 'reservation' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('reservation')}
          >
            예약현황
          </button>
          <button
            className={`tab-button ${activeTab === 'book' ? 'active' : ''}`}
            onClick={() => setActiveTab('book')}
          >
            예약하기
          </button>
        </div>

        <div className='booking-tab-content'>
          {activeTab === 'reservation' && (
            <>
              <Calendar type='big' />
              <MyReservation />
            </>
          )}
          {activeTab === 'book' && <BookNow />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LiveBooking;
