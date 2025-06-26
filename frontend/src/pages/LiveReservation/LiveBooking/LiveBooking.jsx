import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Header, Footer } from '@/components';
import './LiveBooking.css';

const LiveBooking = () => {
  return (
    <div className='live-booking-wrapper'>
      <Header />
      <div className='booking-container'>
        <h2 className='subtitle'>정겨운 여행을 만나는 공간</h2>
        <h1 className='title'>실시간예약</h1>

        <div className='booking-tab-menu'>
          <NavLink
            to='my'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            예약현황
          </NavLink>
          <NavLink
            to='book'
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            예약하기
          </NavLink>
        </div>

        <div className='booking-tab-content'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LiveBooking;
