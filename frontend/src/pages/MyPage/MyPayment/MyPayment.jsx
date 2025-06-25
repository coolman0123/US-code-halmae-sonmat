import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './MyPayment.css';
import paymentImage from '../../../assets/images/내 결제_숙소.png';

const paymentData = [
  {
    location: '여여',
    date: '2025.06.24',
    description: '“말보단 손이 빠른” 박봉순 할머니',
    price: '340,000원',
  },
  {
    location: '모모',
    date: '2025.05.24',
    description: '"입은 좀 험하지만 속은 꿀” 김옥순 할머니',
    price: '150,000원',
  },
];

const MyPayment = () => {
  return (
    <div className='my-page'>
      <Header />
      <main className='my-payment-page'>
        <h1 className='payment-title'>결제 내역</h1>
        <div className='payment-list'>
          {paymentData.map((item, index) => (
            <div className='payment-card' key={index}>
              <img src={paymentImage} alt='숙소' className='payment-img' />
              <div className='payment-info'>
                <div className='payment-location'>{item.location}</div>
                <div className='payment-date'>{item.date}</div>
                <div className='payment-desc'>{item.description}</div>
              </div>
              <div className='payment-price'>{item.price}</div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyPayment;
