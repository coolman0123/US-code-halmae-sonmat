import React, { useState } from 'react';
import './BookNow.css';
import houseIcon from '../../../assets/icons/집.png';
import Button from '../../../components/Button/Button';

const dummyRooms = [
  {
    name: '여여',
    available: true,
    maxPeople: 4,
    type: '원룸형',
    size: '0평',
    price: 340000,
  },
  {
    name: '모모',
    available: false,
    maxPeople: 3,
    type: '원룸형',
    size: '0평',
    price: 280000,
  },
  {
    name: '소소',
    available: false,
    maxPeople: 3,
    type: '원룸형',
    size: '0평',
    price: 280000,
  },
  {
    name: '호호',
    available: false,
    maxPeople: 4,
    type: '원룸형',
    size: '0평',
    price: 300000,
  },
  {
    name: '패밀리',
    available: false,
    maxPeople: 6,
    type: '거실+객실',
    size: '15평',
    price: 400000,
  },
];

const BookNow = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [guests, setGuests] = useState({ adult: 2, child: 0, infant: 0 });
  const [totalPrice, setTotalPrice] = useState(0);

  const handleSelectRoom = (room, price) => {
    setSelectedRoom(room);
    setTotalPrice(price);
  };

  const handleGuestChange = (type, value) => {
    setGuests((prev) => ({ ...prev, [type]: Math.max(0, value) }));
  };

  return (
    <div className='book-now-wrapper'>
      <h3 className='sub-title'>정겨운 여행을 만나는 공간</h3>
      <h1 className='book-now-title'>실시간예약</h1>

      <div className='tab-menu'>
        <div className='tab'>예약현황</div>
        <div className='tab active'>예약하기</div>
      </div>

      <div className='date-section'>
        <div className='date-box'>2025-06-19 목요일</div>
        <div className='night-box selected'>1박</div>
        <div className='date-box'>2025-06-21 토요일</div>
      </div>

      <div className='room-selection-title'>객실선택</div>

      {dummyRooms.map((room) => (
        <div
          key={room.name}
          className={`room-card ${
            room.available ? 'available' : 'unavailable'
          }`}
        >
          <img src={houseIcon} alt={room.name} className='room-img' />
          <div className='room-info'>
            <div className='room-name'>
              {room.name}{' '}
              <span
                className={room.available ? 'tag-available' : 'tag-unavailable'}
              >
                {room.available ? '예약가능' : '예약완료'}
              </span>
            </div>
            <div className='room-desc'>
              기준 2명, 최대 {room.maxPeople}명<br />
              {room.type} / {room.size}
            </div>
            <div className='guest-selector'>
              성인{' '}
              <button
                onClick={() => handleGuestChange('adult', guests.adult - 1)}
              >
                -
              </button>{' '}
              {guests.adult}{' '}
              <button
                onClick={() => handleGuestChange('adult', guests.adult + 1)}
              >
                +
              </button>
              아동{' '}
              <button
                onClick={() => handleGuestChange('child', guests.child - 1)}
              >
                -
              </button>{' '}
              {guests.child}{' '}
              <button
                onClick={() => handleGuestChange('child', guests.child + 1)}
              >
                +
              </button>
              유아{' '}
              <button
                onClick={() => handleGuestChange('infant', guests.infant - 1)}
              >
                -
              </button>{' '}
              {guests.infant}{' '}
              <button
                onClick={() => handleGuestChange('infant', guests.infant + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className='room-price'>{room.price.toLocaleString()}원</div>
          <Button
            text={selectedRoom === room.name ? '✔ 선택됨' : '선택'}
            selected={selectedRoom === room.name}
            disabled={!room.available}
            withIcon={false}
            onClick={() => handleSelectRoom(room.name, room.price)}
          />
        </div>
      ))}

      <div className='payment-section'>
        <div className='total-price'>
          총 결제금액 : <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <button className='pay-btn' disabled={!selectedRoom}>
          결제
        </button>
      </div>

      <footer className='book-footer'>
        <p>TEL 010-5517-1521</p>
        <p>계좌번호 : 국민 28770104431749 (예금주 : 김○연)</p>
        <p>업체명 : 할매의 손맛 | 대표자 : 최세원</p>
      </footer>
    </div>
  );
};

export default BookNow;
