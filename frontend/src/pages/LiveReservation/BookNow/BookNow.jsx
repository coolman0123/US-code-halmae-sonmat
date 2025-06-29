import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookNow.css';
import houseIcon from '../../../assets/icons/집.png';
import Button from '../../../components/Button/Button';
import grayCheck from '../../../assets/icons/회색체크.png';
import whiteCheck from '../../../assets/icons/흰체크.png';
import Calendar from '../../../components/Calendar/Calendar';

const getDummyRooms = (hostData) => {
  // hostData가 있으면 실제 데이터 사용, 없으면 기본 더미 데이터 사용
  const maxPeople = hostData?.guests || 4;
  const bedrooms = hostData?.bedrooms || 1;
  const beds = hostData?.beds || 1;
  const price = hostData?.price ? parseInt(hostData.price) : 340000;
  
  return [
    {
      id: 1,
      name: '여여',
      available: true,
      maxPeople: maxPeople,
      bedrooms: bedrooms,
      beds: beds,
      price: price,
    },
    {
      id: 2,
      name: '모모',
      available: false,
      maxPeople: 3,
      bedrooms: 1,
      beds: 1,
      price: 280000,
    },
    {
      id: 3,
      name: '소소',
      available: false,
      maxPeople: 3,
      bedrooms: 1,
      beds: 1,
      price: 280000,
    },
    {
      id: 4,
      name: '호호',
      available: false,
      maxPeople: 4,
      bedrooms: 1,
      beds: 2,
      price: 300000,
    },
    {
      id: 5,
      name: '패밀리',
      available: false,
      maxPeople: 6,
      bedrooms: 2,
      beds: 3,
      price: 400000,
    },
  ];
};

const BookNow = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guests, setGuests] = useState({ adult: 2, child: 0, infant: 0 });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewRooms, setPreviewRooms] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date(2025, 6, 1), // 2025-06-24 (기본값)
    checkOut: new Date(2025, 6, 2)  // 2025-06-25 (기본값)
  });
  const [tempSelectedDates, setTempSelectedDates] = useState({
    checkIn: new Date(2025, 6, 1),
    checkOut: new Date(2025, 6, 2)
  });
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1));
  const [hostData, setHostData] = useState(null);
  const navigate = useNavigate();

  // Host Register Detail에서 저장된 데이터 가져오기
  useEffect(() => {
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    if (hostsList.length > 0) {
      // 가장 최근 등록된 할매 데이터 사용
      const latestHost = hostsList[hostsList.length - 1];
      setHostData(latestHost);
    }
  }, []);

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

  // 모달 헤더용 날짜 포맷 함수
  const formatModalHeaderDate = (checkInDate, checkOutDate) => {
    const formatShort = (date) => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[date.getDay()];
      return `${month}.${day}(${weekday})`;
    };

    const checkInFormatted = formatShort(checkInDate);
    const checkOutFormatted = formatShort(checkOutDate);
    
    return `${checkInFormatted}~${checkOutFormatted} • 1박`;
  };

  const goToDetailPage = () => {
    if (selectedRoom) {
      const dummyRooms = getDummyRooms(hostData);
      const roomInfo = dummyRooms.find((room) => room.name === selectedRoom);
      
      // 선택한 예약 정보를 localStorage에 저장
      const bookingData = {
        room: roomInfo,
        guests: guests,
        dates: selectedDates,
        totalPrice: totalPrice,
        hostData: hostData
      };
      
      localStorage.setItem('currentBookingData', JSON.stringify(bookingData));
      
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
              <h3>{formatModalHeaderDate(tempSelectedDates.checkIn, tempSelectedDates.checkOut)}</h3>
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
            {/* 객실 미리보기 섹션 */}
            <div className='preview-section'>
              <h4>선택 날짜의 예약 가능한 객실</h4>
              <p className='preview-date'>📅 {formatDate(tempSelectedDates.checkIn)}</p>
              
              {previewLoading && (
                <div className='preview-loading'>객실 조회 중...</div>
              )}
              
              {!previewLoading && previewRooms.length === 0 && (
                <div className='preview-no-rooms'>
                  이 날짜에는 예약 가능한 객실이 없습니다.
                </div>
              )}
              
              {!previewLoading && previewRooms.length > 0 && (
                <div className='preview-rooms'>
                  {previewRooms.map((room) => (
                    <div key={room.id} className='preview-room-card'>
                      <div className='preview-room-info'>
                        <div className='preview-room-name'>{room.name}</div>
                        <div className='preview-room-details'>
                          최대 {room.maxPeople}명 · {room.price.toLocaleString()}원
                        </div>
                      </div>
                      <div className='preview-room-status available'>
                        예약가능
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className='modal-footer'>
              <button 
                className='confirm-button'
                onClick={handleConfirmDates}
                disabled={previewLoading}
              >
                {previewRooms.length > 0 ? `이 날짜로 선택 (${previewRooms.length}개 객실)` : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='room-selection-title'>객실선택</div>

      {getDummyRooms(hostData).map((room) => (
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
              최대 {room.maxPeople}명<br />
              침실{room.bedrooms} / 침대{room.beds}
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
