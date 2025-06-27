import React from 'react';
import { NavLink, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import WriteReview from '../WriteReview/WriteReview';
import ListReview from '../ListReview/ListReview';
import './MyReview.css';

const MyReviewPage = () => {
  return (
    <div className='my-review-wrapper'>
      <div className='review-tabs'>
        <NavLink
          to='/mypage/review/write'
          className={({ isActive }) => (isActive ? 'active-tab' : '')}
        >
          리뷰 작성
        </NavLink>
        <NavLink
          to='/mypage/review/list'
          className={({ isActive }) => (isActive ? 'active-tab' : '')}
        >
          작성한 리뷰
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default MyReviewPage;
