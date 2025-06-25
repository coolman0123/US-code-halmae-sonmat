// frontend/src/pages/MyPage/MyReview/WriteReview/WriteReview.jsx
import React, { useState } from 'react';
import roomImg from '../../../../assets/images/내 결제_숙소.png';
import SelectButton from '../../../../components/CheckButton/CheckButton';
import './WriteReview.css';

const mockReservations = [
  {
    id: 1,
    location: '여여',
    date: '2025.06.24',
    description: '"말보단 손이 빠른" 박봉순 할머니',
    price: '340,000원',
  },
  {
    id: 2,
    location: '모모',
    date: '2025.05.24',
    description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    price: '150,000원',
  },
  {
    id: 3,
    location: '소소',
    date: '2025.04.14',
    description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
    price: '150,000원',
  },
  {
    id: 4,
    location: '호호',
    date: '2025.03.14',
    description: '"한 마디면 눈물 터지는" 정다감 할머니',
    price: '170,000원',
  },
  {
    id: 5,
    location: '패밀리',
    date: '2025.03.02',
    description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
    price: '150,000원',
  },
];

const WriteReview = () => {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className='write-review'>
      {mockReservations.map((item) => (
        <div className='review-card' key={item.id}>
          <img src={roomImg} alt='숙소' />
          <div className='info'>
            <p className='place'>{item.location}</p>
            <p className='date'>{item.date}</p>
            <p className='desc'>{item.desc}</p>
          </div>
          <SelectButton
            selected={selectedId === item.id}
            onClick={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
            text='선택'
          />
        </div>
      ))}
      <div className='write-bottom-btn'>
        <SelectButton
          selected={!!selectedId}
          disabled={!selectedId}
          withCheck={false}
          onClick={() => {
            if (selectedId) {
              console.log('리뷰 작성하러 가기!');
            }
          }}
          text='리뷰 작성하러 가기'
        />
      </div>
    </div>
  );
};

export default WriteReview;
