import React from 'react';
import Header from '../../../components/Header';
import './Notification.css';

const mockNotifications = [
  {
    location: '여여',
    description: '"말보단 손이 빠른" 박봉순 할머니',
    date: '2025.06.24',
  },
  {
    location: '모모',
    description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    date: '2025.05.24',
  },
  {
    location: '소소',
    description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
    date: '2025.04.14',
  },
  {
    location: '호호',
    description: '"한 마디면 눈물 터지는" 정다감 할머니',
    date: '2025.03.14',
  },
  {
    location: '패밀리',
    description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
    date: '2025.03.02',
  },
];

const Notification = () => {
  return (
    <div className='my-page'>
      <Header />
      <main className='my-page-content notification-page'>
        <div className='notification-list'>
          {mockNotifications.map((item, index) => (
            <div key={index} className='notification-card'>
              <p className='notification-type'>
                예약 <span className='divider'>|</span>{' '}
                <span className='bold'>
                  '{item.location}' 숙소 예약이 완료되었습니다.
                </span>
              </p>
              <p className='notification-message'>
                {item.description}와 즐거운 시간 되세요!
              </p>
              <p className='notification-date'>{item.date}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notification;
