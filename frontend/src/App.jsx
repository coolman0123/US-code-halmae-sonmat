import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage/MainPage';
import Stories from './pages/Stories/Stories';
import Login from './pages/Auth/Login/Login';
import Logout from './pages/Auth/Logout/Logout';
import Booking from './pages/Booking/Booking';
import Experience from './pages/Experience/Experience';
import LiveBooking from './pages/LiveReservation/LiveBooking/LiveBooking';
import MyPage from './pages/MyPage/MyPage/MyPage';
import MyPayment from './pages/MyPage/MyPayment/MyPayment';
import MyReview from './pages/MyPage/MyReview/MyReview/MyReview';
import WriteReview from './pages/MyPage/MyReview/WriteReview/WriteReview';
import ListReview from './pages/MyPage/MyReview/ListReview/ListReview';
import Notification from './pages/MyPage/Notification/Notification';

import './App.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/stories' element={<Stories />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/experiences' element={<Experience />} />
          <Route path='/live-reservation' element={<LiveBooking />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/mypage/payment' element={<MyPayment />} />
          <Route path='/mypage/review' element={<MyReview />}>
            <Route index element={<Navigate to='write' replace />} />
            <Route path='write' element={<WriteReview />} />
            <Route path='list' element={<ListReview />} />
          </Route>
          <Route path='/mypage/notification' element={<Notification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
