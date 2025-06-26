import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import WriteReview from '../WriteReview/WriteReview';
import ListReview from '../ListReview/ListReview';
import './MyReview.css';

const MyReviewPage = () => {
  return (
    <div className='my-review-wrapper'>
      <div className='review-tabs'>
        <NavLink
          to='write'
          className={({ isActive }) => (isActive ? 'active-tab' : '')}
        >
          리뷰 작성
        </NavLink>
        <NavLink
          to='list'
          className={({ isActive }) => (isActive ? 'active-tab' : '')}
        >
          작성한 리뷰
        </NavLink>
      </div>

      <Routes>
        <Route path='write' element={<WriteReview />} />
        <Route path='list' element={<ListReview />} />
        <Route path='*' element={<Navigate to='write' />} />
      </Routes>
    </div>
  );
};

export default MyReviewPage;
