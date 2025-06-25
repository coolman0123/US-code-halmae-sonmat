import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const MyReview = () => {
  return (
    <div className='my-page'>
      <Header />
      <main className='my-page-content'>
        <h1>내 리뷰</h1>
        {/* 리뷰 관련 내용 추가 */}
      </main>
      <Footer />
    </div>
  );
};

export default MyReview;
