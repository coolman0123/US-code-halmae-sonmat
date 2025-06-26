import React from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage/MainPage';
import Stories from './pages/Stories/Stories';

import Login from './pages/Auth/Login/Login';
import Logout from './pages/Auth/Logout/Logout';

import LiveBooking from './pages/LiveReservation/LiveBooking/LiveBooking'; //실시간 예약
import BookNow from './pages/LiveReservation/BookNow/BookNow'; //예약하기
import DetailBooking from './pages/LiveReservation/DetailBooking/DetailBooking'; //객실 상세
import MyReservation from './pages/LiveReservation/MyReservation/MyReservation'; //예약 현황
import Payment from './pages/LiveReservation/Payment/Payment'; //결제
import Review from './pages/LiveReservation/Review/Review'; //객실 리뷰

import Experience from './pages/Experience/Experience';

import MyPage from './pages/MyPage/MyPage/MyPage';
import MyPayment from './pages/MyPage/MyPayment/MyPayment';
import MyReview from './pages/MyPage/MyReview/MyReview/MyReview';
import WriteReview from './pages/MyPage/MyReview/WriteReview/WriteReview';
import ListReview from './pages/MyPage/MyReview/ListReview/ListReview';
import ReviewForm from './pages/MyPage/MyReview/ReviewForm/ReviewForm';
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

          <Route path='/live-reservation' element={<LiveBooking />} />
          <Route path='/live-reservation/book' element={<BookNow />} />
          <Route
            path='/live-reservation/detail/:roomId'
            element={<DetailBooking />}
          />
          <Route
            path='/live-reservation/detail/:roomId/review'
            element={<Review />}
          />
          <Route path='/live-reservation/my' element={<MyReservation />} />
          <Route path='/live-reservation/payment' element={<Payment />} />

          <Route path='/experiences' element={<Experience />} />

          <Route path='/mypage' element={<MyPage />} />
          <Route path='/mypage/payment' element={<MyPayment />} />
          <Route path='/mypage/review' element={<MyReview />}>
            <Route index element={<Navigate to='write' replace />} />
            <Route path='write' element={<WriteReview />} />
            <Route path='list' element={<ListReview />} />
          </Route>
          <Route path='/mypage/review/form/:id' element={<ReviewForm />} />
          <Route path='/mypage/notification' element={<Notification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
