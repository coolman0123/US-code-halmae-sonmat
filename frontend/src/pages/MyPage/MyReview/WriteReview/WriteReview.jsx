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
    desc: '"말보단 손이 빠른" 박봉순 할머니',
  },
  {
    id: 2,
    location: '여여',
    date: '2025.06.24',
    desc: '"말보단 손이 빠른" 박봉순 할머니',
  },
  {
    id: 3,
    location: '여여',
    date: '2025.06.24',
    desc: '"말보단 손이 빠른" 박봉순 할머니',
  },
  {
    id: 4,
    location: '여여',
    date: '2025.06.24',
    desc: '"말보단 손이 빠른" 박봉순 할머니',
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
              // TODO: 이동 로직 연결
            }
          }}
          text='리뷰 작성하러 가기'
        />
      </div>
    </div>
  );
};

export default WriteReview;
