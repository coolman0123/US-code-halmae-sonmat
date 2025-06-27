import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookNow.css';
import houseIcon from '../../../assets/icons/집.png';
import Button from '../../../components/Button/Button';
import grayCheck from '../../../assets/icons/회색체크.png';
import whiteCheck from '../../../assets/icons/흰체크.png';

const dummyRooms = [
  {
    id: 1,
    name: '여여',
    available: true,
    maxPeople: 4,
    type: '원룸형',
    size: '0평',
    price: 340000,
  },
  {
    id: 2,
    name: '모모',
    available: false,
    maxPeople: 3,
    type: '원룸형',
    size: '0평',
    price: 280000,
  },
  {
    id: 3,
    name: '소소',
    available: false,
    maxPeople: 3,
    type: '원룸형',
    size: '0평',
    price: 280000,
  },
  {
    id: 4,
    name: '호호',
    available: false,
    maxPeople: 4,
    type: '원룸형',
    size: '0평',
    price: 300000,
  },
  {
    id: 5,
    name: '패밀리',
    available: false,
    maxPeople: 6,
    type: '거실+객실',
    size: '15평',
    price: 400000,
  },
];

const BookNow = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guests, setGuests] = useState({ adult: 2, child: 0, infant: 0 });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();

  const handleSelectRoom = (room, price) => {
    setSelectedRoom(room);
    setTotalPrice(price);
  };

  const handleGuestChange = (type, value) => {
    setGuests((prev) => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const goToDetailPage = () => {
    if (selectedRoom) {
      const roomInfo = dummyRooms.find((room) => room.name === selectedRoom);
      navigate(`/live-reservation/detail/${roomInfo.id}`);
    }
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
        <div className='date-box' onClick={() => setShowCalendar(true)}>
          2025-06-19 목요일
        </div>
        <div
          className='night-box selected'
          onClick={() => setShowCalendar(true)}
        >
          1박
        </div>
        <div className='date-box' onClick={() => setShowCalendar(true)}>
          2025-06-21 토요일
        </div>
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
              </button>
              {guests.adult}
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
              </button>
              {guests.child}
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
              </button>
              {guests.infant}
              <button
                onClick={() => handleGuestChange('infant', guests.infant + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className='room-price'>{room.price.toLocaleString()}원</div>
          <Button
            text='선택'
            selected={selectedRoom === room.name}
            disabled={!room.available && selectedRoom !== room.name}
            withIcon={true}
            icon={grayCheck}
            activeIcon={whiteCheck}
            onClick={() =>
              selectedRoom === room.name
                ? setSelectedRoom(null) || setTotalPrice(0)
                : (setSelectedRoom(room.name), setTotalPrice(room.price))
            }
          />
        </div>
      ))}

      <div className='payment-section'>
        <div className='total-price'>
          총 결제금액 : <span>{totalPrice.toLocaleString()}원</span>
        </div>
        <Button
          text='다음'
          selected={!!selectedRoom}
          disabled={!selectedRoom}
          withIcon={false}
          onClick={goToDetailPage}
        />
      </div>
    </div>
  );
};

export default BookNow;
