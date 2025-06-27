import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookNow.css';
import houseIcon from '../../../assets/icons/집.png';
import Button from '../../../components/Button/Button';
import grayCheck from '../../../assets/icons/회색체크.png';
import whiteCheck from '../../../assets/icons/흰체크.png';
import Calendar from '../../../components/Calendar/Calendar';

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
  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date(2025, 5, 24), // 2025-06-24 (기본값)
    checkOut: new Date(2025, 5, 25)  // 2025-06-25 (기본값)
  });
  const [tempSelectedDates, setTempSelectedDates] = useState({
    checkIn: new Date(2025, 5, 24),
    checkOut: new Date(2025, 5, 25)
  });
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1));
  const navigate = useNavigate();

  const handleSelectRoom = (room, price) => {
    setSelectedRoom(room);
    setTotalPrice(price);
  };

  const handleGuestChange = (type, value) => {
    setGuests((prev) => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const handleDateClick = (date) => {
    // 임시 선택 날짜 설정 (확인 버튼을 눌러야 실제 적용)
    const checkIn = new Date(date);
    const checkOut = new Date(date);
    checkOut.setDate(checkIn.getDate() + 1);
    
    setTempSelectedDates({
      checkIn,
      checkOut
    });
  };

  const handleConfirmDates = () => {
    // 임시 선택된 날짜를 실제 선택 날짜로 적용
    setSelectedDates({
      checkIn: tempSelectedDates.checkIn,
      checkOut: tempSelectedDates.checkOut
    });
    setShowCalendar(false);
  };

  const handleOpenCalendar = () => {
    // 모달을 열 때 현재 선택된 날짜를 임시 선택으로 설정
    setTempSelectedDates({
      checkIn: selectedDates.checkIn,
      checkOut: selectedDates.checkOut
    });
    setShowCalendar(true);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    
    return `${year}-${month}-${day} ${weekday}요일`;
  };

  const goToDetailPage = () => {
    if (selectedRoom) {
      const roomInfo = dummyRooms.find((room) => room.name === selectedRoom);
      navigate(`/live-reservation/detail/${roomInfo.id}`);
    }
  };

  // 캘린더용 날짜 렌더링 함수 (임시 선택 날짜 사용)
  const renderDateContent = (date, data, isCurrentMonth) => {
    const isCheckIn = tempSelectedDates.checkIn && 
      date.toDateString() === tempSelectedDates.checkIn.toDateString();
    const isCheckOut = tempSelectedDates.checkOut && 
      date.toDateString() === tempSelectedDates.checkOut.toDateString();
    
    if (isCurrentMonth && (isCheckIn || isCheckOut)) {
      return (
        <div className="selected-date">
          <div className={`date-indicator ${isCheckIn ? 'check-in' : 'check-out'}`}>
            {date.getDate()}
          </div>
          <div className="date-label">
            {isCheckIn ? '체크인' : '체크아웃'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='book-now-wrapper'>
      <div className='date-section'>
        <div className='date-box' onClick={handleOpenCalendar}>
          {formatDate(selectedDates.checkIn)}
        </div>
        <div
          className='night-box selected'
          onClick={handleOpenCalendar}
        >
          1박
        </div>
        <div className='date-box' onClick={handleOpenCalendar}>
          {formatDate(selectedDates.checkOut)}
        </div>
      </div>

      {/* 캘린더 모달 */}
      {showCalendar && (
        <div className='calendar-modal'>
          <div className='calendar-modal-content'>
            <div className='modal-header'>
              <h3>06.24(화)~06.25(수) • 1박</h3>
              <button 
                className='close-button'
                onClick={() => setShowCalendar(false)}
              >
                ×
              </button>
            </div>
            <Calendar 
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onDateClick={handleDateClick}
              dateData={{}}
              renderDateContent={renderDateContent}
            />
            <div className='modal-footer'>
              <button 
                className='confirm-button'
                onClick={handleConfirmDates}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

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
              {room.name}
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
              <div className='guest-type'>
                <span className='guest-label'>인원</span>
                <div className='guest-controls'>
                  <button
                    onClick={() => handleGuestChange('adult', guests.adult - 1)}
                  >
                    -
                  </button>
                  <span className='guest-count'>{guests.adult} 명</span>
                  <button
                    onClick={() => handleGuestChange('adult', guests.adult + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className='room-bottom-section'>
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
