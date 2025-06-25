import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

const MyPayment = () => {
  return (
    <div className='my-page'>
      <Header />
      <main className='my-page-content'>
        <h1>내 결제</h1>
        {/* 결제 관련 내용 추가 */}
      </main>
      <Footer />
    </div>
  );
};

export default MyPayment;
