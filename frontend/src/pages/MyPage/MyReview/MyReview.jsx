import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './MyReview.css';

import roomImg from '../../../assets/images/내 결제_숙소.png';

const mockReservations = [
  {
    location: '여여',
    date: '2025.06.24',
    description: '"말보단 손이 빠른" 박봉순 할머니',
  },
  {
    location: '모모',
    date: '2025.05.24',
    description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
  },
  {
    location: '소소',
    date: '2025.04.14',
    description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
  },
  {
    location: '호호',
    date: '2025.03.14',
    description: '"한 마디면 눈물 터지는" 정다감 할머니',
  },
  {
    location: '패밀리',
    date: '2025.03.02',
    description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
  },
];

const MyReview = () => {
  return (
    <div className='my-page'>
      <Header />
      <main className='my-page-content my-review-page'>
        <h1 className='review-title'>내 예약</h1>
        <div className='review-list'>
          {mockReservations.map((item, index) => (
            <div key={index} className='review-card'>
              <img src={roomImg} alt='숙소' className='review-img' />
              <div className='review-info'>
                <div className='review-title-row'>
                  <p className='review-place'>{item.location}</p>
                  <p className='review-date'>{item.date}</p>
                </div>
                <p className='review-desc'>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyReview;
