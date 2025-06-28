import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  
  // 기본 데이터 정의
  const defaultHostData = {
    id: 'default-host',
    name: '할매의 집',
    houseName: '여여',
    photo: null,
    photos: [],
    address: '충남 논산시 연무읍',
    phone: '010-5517-1521'
  };

  const defaultBasicInfo = {
    age: '70세',
    specialty: '전통 한식',
    menu: '된장찌개, 묵은지찜',
    personality: '친절하고 따뜻한',
    introduction: '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.'
  };

  // 초기 상태를 기본값으로 설정
  const [hostData, setHostData] = useState(defaultHostData);
  const [basicInfo, setBasicInfo] = useState(defaultBasicInfo);
  const [bookingData, setBookingData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState({
    name: '여여',
    price: 340000
  });
  const [tripData, setTripData] = useState(null);
  const [realHostData, setRealHostData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [agreeTerms, setAgreeTerms] = useState({
    all: false,
    booking: false,
    privacy: false,
    thirdParty: false,
    marketing: false
  });
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [currentTerms, setCurrentTerms] = useState('');

  // 실제 여행 데이터 가져오기
  const fetchTripAndHostData = async () => {
    try {
      setLoading(true);
      console.log('Payment 페이지에서 데이터 로딩 시작');

      // 현재 예약 정보 불러오기
      const savedBookingData = localStorage.getItem('currentBookingData');
      if (!savedBookingData) {
        console.error('예약 데이터가 없습니다');
        setLoading(false);
        return;
      }

      const parsedBookingData = JSON.parse(savedBookingData);
      console.log('Payment 저장된 예약 데이터:', parsedBookingData);
      setBookingData(parsedBookingData);

      if (parsedBookingData.room && parsedBookingData.room.tripId) {
        // 실제 Trip 데이터 조회
        const tripResponse = await fetch(
          `https://us-code-halmae-sonmat.onrender.com/api/trips/${parsedBookingData.room.tripId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (tripResponse.ok) {
          const tripResult = await tripResponse.json();
          console.log('Payment 실제 Trip 데이터:', tripResult);
          
          if (tripResult.success && tripResult.data) {
            setTripData(tripResult.data);

            // 호스트 데이터도 가져오기
            const hostResponse = await fetch(
              `https://us-code-halmae-sonmat.onrender.com/api/hosts/${tripResult.data.hostId}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (hostResponse.ok) {
              const hostResult = await hostResponse.json();
              console.log('Payment 실제 Host 데이터:', hostResult);
              
              if (hostResult.success && hostResult.data) {
                setRealHostData(hostResult.data);
              }
            }
          }
        }
      }

      // 기존 fallback 데이터들도 유지
      if (parsedBookingData.room) {
        setSelectedRoom(parsedBookingData.room);
      }
      if (parsedBookingData.hostData) {
        setHostData(prev => ({ ...prev, ...parsedBookingData.hostData }));
      }

    } catch (error) {
      console.error('Payment 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripAndHostData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAgreeChange = (key) => {
    if (key === 'all') {
      const newValue = !agreeTerms.all;
      setAgreeTerms({
        all: newValue,
        booking: newValue,
        privacy: newValue,
        thirdParty: newValue,
        marketing: newValue
      });
    } else {
      setAgreeTerms(prev => {
        const newTerms = { ...prev, [key]: !prev[key] };
        const allChecked = newTerms.booking && newTerms.privacy && newTerms.thirdParty && newTerms.marketing;
        return { ...newTerms, all: allChecked };
      });
    }
  };

  const handlePayment = async () => {
    try {
      // 입력 필드 유효성 검사
      if (!guestInfo.name || !guestInfo.phone || !guestInfo.email) {
        alert('예약자 정보를 모두 입력해주세요.');
        return;
      }

      if (!agreeTerms.booking || !agreeTerms.privacy || !agreeTerms.thirdParty) {
        alert('필수 약관에 동의해주세요.');
        return;
      }

      if (!bookingData || !bookingData.room) {
        alert('예약 정보가 없습니다. 다시 시도해주세요.');
        return;
      }

      // 로그인한 사용자 정보 가져오기 또는 테스트 사용자 생성
      let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (!currentUser.id) {
        // 테스트용 사용자 자동 생성
        const testUser = {
          id: `test-user-${Date.now()}`,
          name: guestInfo.name || '테스트 사용자',
          email: guestInfo.email || 'test@example.com',
          phone: guestInfo.phone || '010-1234-5678',
          userType: 'guest',
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(testUser));
        currentUser = testUser;
        
        console.log('테스트 사용자 생성:', testUser);
      }

      // 실제 Trip과 Host 데이터 검증
      if (!tripData || !realHostData) {
        alert('여행 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      // 1단계: 결제 정보 생성 (실제 데이터 사용)
      const paymentData = {
        userId: currentUser.id,
        tripId: tripData.id,
        hostId: realHostData.id,
        guestInfo: {
          name: guestInfo.name,
          phone: guestInfo.phone,
          email: guestInfo.email,
          guestCount: getTotalGuests()
        },
        bookingDetails: {
          tripTitle: getTripTitle(),
          tripDescription: getTripDescription(),
          hostName: getHostName(),
          hostPhone: getHostPhone(),
          location: getLocationInfo(),
          dates: {
            checkIn: bookingData.dates.checkIn,
            checkOut: bookingData.dates.checkOut,
            tripStartDate: tripData.startDate,
            tripEndDate: tripData.endDate
          },
          room: {
            ...bookingData.room,
            actualTripId: tripData.id,
            actualHostId: realHostData.id
          },
          guests: bookingData.guests
        },
        amount: getRoomPrice(),
        paymentMethod: paymentMethod,
        additionalInfo: {
          hostIntroduction: getHostIntroduction(),
          tripIncludes: tripData.included || [],
          tripExcludes: tripData.excluded || [],
          maxParticipants: tripData.maxParticipants,
          currentParticipants: tripData.currentParticipants
        }
      };

      console.log('결제 데이터 생성:', paymentData);

      const createResponse = await fetch('https://us-code-halmae-sonmat.onrender.com/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!createResponse.ok) {
        throw new Error('결제 정보 생성에 실패했습니다.');
      }

      const createResult = await createResponse.json();
      console.log('결제 생성 결과:', createResult);

      if (!createResult.success) {
        throw new Error(createResult.message || '결제 정보 생성에 실패했습니다.');
      }

      // 2단계: 결제 처리
      const processResponse = await fetch(
        `https://us-code-halmae-sonmat.onrender.com/api/payments/${createResult.data.id}/process`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!processResponse.ok) {
        throw new Error('결제 처리에 실패했습니다.');
      }

      const processResult = await processResponse.json();
      console.log('결제 처리 결과:', processResult);

      if (!processResult.success) {
        throw new Error(processResult.message || '결제 처리에 실패했습니다.');
      }

      // 3단계: 로컬 스토리지에도 예약 정보 저장 (기존 기능 유지)
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const checkInDate = new Date(bookingData.dates.checkIn);
      const newReservation = {
        id: Date.now(),
        paymentId: createResult.data.id,
        houseName: bookingData.room.name,
        startDate: checkInDate.toISOString().split('T')[0],
        endDate: new Date(bookingData.dates.checkOut).toISOString().split('T')[0],
        status: 'unavailable',
        guestInfo: {
          name: guestInfo.name,
          phone: guestInfo.phone,
          email: guestInfo.email,
          guestCount: getTotalGuests()
        },
        totalPrice: getRoomPrice(),
        paymentCompleted: true,
        createdAt: new Date().toISOString()
      };

      existingReservations.push(newReservation);
      localStorage.setItem('reservations', JSON.stringify(existingReservations));

      // 4단계: Trip에 참가자 등록 (실제 Trip 업데이트)
      try {
        const participantData = {
          userId: currentUser.id,
          guestInfo: {
            name: guestInfo.name,
            phone: guestInfo.phone,
            email: guestInfo.email,
            guestCount: getTotalGuests()
          },
          paymentId: createResult.data.id,
          joinedAt: new Date().toISOString()
        };

        const joinResponse = await fetch(
          `https://us-code-halmae-sonmat.onrender.com/api/trips/${tripData.id}/join`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(participantData)
          }
        );

        if (joinResponse.ok) {
          const joinResult = await joinResponse.json();
          console.log('Trip 참가 등록 성공:', joinResult);
        } else {
          console.warn('Trip 참가 등록 실패, 하지만 결제는 성공');
        }
      } catch (tripJoinError) {
        console.warn('Trip 참가 등록 중 오류:', tripJoinError);
        // Trip 참가 등록이 실패해도 결제는 성공했으므로 계속 진행
      }

      alert(`✅ 결제가 완료되었습니다!\n\n🏠 ${getTripTitle()}\n📍 ${getLocationInfo()}\n💰 ${getRoomPrice().toLocaleString()}원\n\n마이페이지에서 예약 내역을 확인할 수 있습니다.`);
      navigate('/');

    } catch (error) {
      console.error('결제 처리 중 오류:', error);
      alert(error.message || '결제 처리 중 오류가 발생했습니다.');
    }
  };

  const showTermsContent = (termsType) => {
    setCurrentTerms(termsType);
    setShowTermsModal(true);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[dateObj.getDay()];
    
    return `${year}.${month}.${day} (${weekday})`;
  };

  const getTotalGuests = () => {
    if (bookingData?.guests) {
      return bookingData.guests.adult + bookingData.guests.child + bookingData.guests.infant;
    }
    return 2; // 기본값
  };

  const getCheckInDate = () => {
    if (bookingData?.dates?.checkIn) {
      return formatDate(bookingData.dates.checkIn);
    }
    return '2025.06.24 (화)';
  };

  const getCheckOutDate = () => {
    if (bookingData?.dates?.checkOut) {
      return formatDate(bookingData.dates.checkOut);
    }
    return '2025.06.25 (수)';
  };

  const getRoomPrice = () => {
    return tripData?.price || bookingData?.totalPrice || selectedRoom?.price || 340000;
  };

  // 실제 데이터 사용을 위한 헬퍼 함수들
  const getTripTitle = () => {
    return tripData?.title || selectedRoom?.name || '여여';
  };

  const getTripDescription = () => {
    return tripData?.description || `${realHostData?.personalitySummary || '따뜻한 할머니'}가 준비한 특별한 숙소입니다.`;
  };

  const getHostName = () => {
    return realHostData?.name || hostData?.name || '할매';
  };

  const getHostPhone = () => {
    return realHostData?.phoneNumber || hostData?.phone || '010-5517-1521';
  };

  const getLocationInfo = () => {
    if (realHostData && realHostData.address) {
      return realHostData.address.detailAddress || realHostData.address;
    }
    if (tripData && tripData.location) {
      return tripData.location.detailAddress || tripData.location.region || '충남 논산시 연무읍';
    }
    return hostData.address || '충남 논산시 연무읍';
  };

  const getHostIntroduction = () => {
    if (realHostData) {
      return {
        introduction: realHostData.hostIntroduction || realHostData.personalitySummary || '따뜻한 할머니입니다',
        age: realHostData.age ? `${realHostData.age}세` : '정보 없음',
        specialty: realHostData.characteristics || '정보 없음',
        menu: realHostData.representativeMenu || '정보 없음',
        personality: realHostData.personalitySummary || '정보 없음'
      };
    }
    return {
      introduction: basicInfo?.introduction || '따뜻한 할머니가 정성스럽게 준비한 숙소입니다.',
      age: basicInfo?.age || '정보 없음',
      specialty: basicInfo?.specialty || '정보 없음',
      menu: basicInfo?.menu || '정보 없음',
      personality: basicInfo?.personality || '정보 없음'
    };
  };

  const getTermsContent = () => {
    switch (currentTerms) {
      case 'booking':
        return {
          title: '숙박 예약 서비스 약관',
          content: `
제1조 (목적)
본 약관은 할매의 손맛(이하 "플랫폼")이 제공하는 농촌 할머니 댁 숙박 예약 중개 서비스의 이용과 관련하여 플랫폼, 이용자(청년), 숙박 제공자(할머니) 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "플랫폼"이라 함은 할매의 손맛 서비스 운영 주체를 의미합니다.
2. "이용자"라 함은 농촌 할머니 댁 숙박을 예약하는 청년을 의미합니다.
3. "숙박 제공자"라 함은 농촌에 거주하며 숙박을 제공하는 할머니를 의미합니다.
4. "코디네이터"라 함은 할머니를 도와 예약 관리 및 소통을 지원하는 중간 관리자를 의미합니다.
5. "일손 돕기 체험"이라 함은 할머니와 함께하는 농촌 생활 체험을 의미합니다.

제3조 (서비스 내용)
1. 플랫폼은 농촌 할머니 댁 숙박 예약 중개 서비스를 제공합니다.
2. 코디네이터가 할머니를 대신하여 예약 관리 및 이용자와의 소통을 담당합니다.
3. 일손 돕기 체험 프로그램을 통해 농촌 문화 교류를 지원합니다.

제4조 (예약 및 결제)
1. 예약은 이용자가 숙박 날짜, 인원 등을 선택하고 결제를 완료한 시점에 성립됩니다.
2. 예약 확정 후 코디네이터를 통해 할머니에게 예약 정보가 전달됩니다.
3. 결제는 무통장입금 방법으로 진행됩니다.

제5조 (일손 돕기 체험)
1. 이용자는 숙박 중 할머니와 함께하는 농촌 일손 돕기에 참여할 수 있습니다.
2. 체험 참여 후 코디네이터와의 인터뷰를 통해 후기를 작성하면 숙박비 10% 할인 혜택을 제공합니다.
3. 체험 내용은 할머니별로 상이할 수 있습니다.

제6조 (취소 및 환불)
1. 체크인 7일 전까지: 100% 환불
2. 체크인 3일 전까지: 50% 환불
3. 체크인 1일 전까지: 30% 환불
4. 당일 취소 및 노쇼: 환불 불가

제7조 (이용자의 의무)
1. 이용자는 예약 시 정확한 정보를 제공해야 합니다.
2. 할머니 댁의 규칙과 농촌 생활 예절을 준수해야 합니다.
3. 시설물 손상 시 배상 책임이 있습니다.
4. 할머니의 생활 패턴과 농촌 환경을 존중해야 합니다.

제8조 (체크인/체크아웃)
1. 체크인 시간: 오후 3:00 이후
2. 체크아웃 시간: 오전 11:00 이전
3. 정확한 시간은 코디네이터를 통해 할머니와 사전 조율 가능합니다.
          `
        };
      case 'privacy':
        return {
          title: '개인정보 수집 및 이용',
          content: `
1. 개인정보 수집 목적
- 농촌 할머니 댁 숙박 예약 중개 서비스 제공
- 할머니와 이용자 간 예약 정보 전달
- 코디네이터를 통한 예약 관리 및 소통 지원
- 일손 돕기 체험 관련 안내 및 후기 관리

2. 수집하는 개인정보 항목
가. 필수 항목: 이름, 휴대폰번호, 이메일주소
나. 선택 항목: 없음

3. 개인정보 보유 및 이용기간
- 예약 서비스 제공 완료 후 3년간 보관
- 관계 법령에 따른 보관이 필요한 경우 해당 기간까지 보관

4. 개인정보 제공 거부권
귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 
다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.

5. 개인정보보호 책임자
- 담당자: 코디네이터팀
- 연락처: privacy@halmae-sonmat.com
- 전화: 1588-0000
          `
        };
      case 'thirdParty':
        return {
          title: '개인정보 제3자 제공',
          content: `
플랫폼은 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 
다만, 서비스 제공을 위해 다음과 같이 개인정보를 제공합니다.

제3자 제공 현황:

1. 제공받는 자: 숙박 제공 할머니
   - 제공 목적: 숙박 서비스 제공 및 예약 확인
   - 제공 항목: 이름, 휴대폰번호, 체크인/아웃 날짜, 인원수
   - 제공 방법: 코디네이터를 통한 전달
   - 보유 기간: 숙박 서비스 제공 완료 후 1년

2. 제공받는 자: 코디네이터
   - 제공 목적: 할머니와 이용자 간 예약 관리 및 소통 지원
   - 제공 항목: 이름, 휴대폰번호, 이메일주소, 예약 정보
   - 보유 기간: 서비스 제공 완료 후 3년

3. 제공받는 자: 무통장입금 확인을 위한 금융기관
   - 제공 목적: 결제 확인 및 정산
   - 제공 항목: 이름, 휴대폰번호
   - 보유 기간: 결제 완료 후 3년

개인정보 제3자 제공에 동의하지 않을 권리가 있으나, 
동의 거부 시 숙박 예약 서비스 이용이 불가능합니다.

※ 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 
수사기관의 요구가 있는 경우에는 예외로 합니다.
          `
        };
      case 'marketing':
        return {
          title: '마케팅 정보 수신',
          content: `
1. 수집 목적
- 새로운 할머니 댁 숙박시설 안내
- 계절별 일손 돕기 체험 프로그램 정보 제공
- 농촌 문화 교류 이벤트 및 할인 혜택 안내
- 할머니와 청년 간 소통 프로그램 소식 전달

2. 수집 항목
- 이름, 휴대폰번호, 이메일주소
- 서비스 이용 기록, 예약 내역
- 선호 지역, 체험 관심사

3. 수신 방법
- SMS 문자메시지
- 이메일

4. 발송 빈도
- 새로운 할머니 댁 등록: 월 1~2회
- 계절별 농촌 체험 프로그램: 계절당 2~3회
- 할인 이벤트 및 특별 프로그램: 분기당 1~2회

5. 수신 동의 철회
- 코디네이터팀 전화(1588-0000) 또는 SMS 회신으로 수신거부 가능
- 이메일 하단 '수신거부' 링크 클릭

6. 동의 거부에 따른 불이익
마케팅 정보 수신에 동의하지 않아도 숙박 예약 서비스 이용에는 
제한이 없습니다. 다만, 새로운 할머니 댁 소식이나 특별 체험 프로그램, 
할인 혜택 정보를 받아보실 수 없습니다.

※ 본 동의는 선택사항이며, 동의하지 않으셔도 서비스 이용이 가능합니다.
          `
        };
      default:
        return { title: '', content: '' };
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <p>여행 정보와 결제 페이지를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-content">
        {/* 실제 여행 정보 표시 */}
        {tripData && (
          <div className="trip-info-banner">
            <h2>🌿 {getTripTitle()}</h2>
            <p>📍 {getLocationInfo()}</p>
            <p>👵 호스트: {getHostName()}</p>
            <p>📅 여행 기간: {tripData.startDate} ~ {tripData.endDate}</p>
            <p>💰 참가비: {getRoomPrice().toLocaleString()}원</p>
          </div>
        )}

        {/* 왼쪽 섹션 */}
        <div className="payment-left">
          {/* 예약정보 */}
          <div className="section">
            <h3 className="section-title">🏠 예약정보</h3>
            <div className="reservation-info">
              <div className="info-row">
                <span className="label">여행명</span>
                <span className="value">{getTripTitle()}</span>
              </div>
              <div className="info-row">
                <span className="label">체크인</span>
                <span className="value">{getCheckInDate()} 15:00</span>
              </div>
              <div className="info-row">
                <span className="label">체크아웃</span>
                <span className="value">{getCheckOutDate()} 11:00</span>
              </div>
              <div className="info-row">
                <span className="label">여행 기간</span>
                <span className="value">
                  {tripData ? `${tripData.startDate} ~ ${tripData.endDate}` : '1박 2일'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">참가 인원</span>
                <span className="value">성인 {getTotalGuests()}명</span>
              </div>
              {tripData && (
                <>
                  <div className="info-row">
                    <span className="label">최대 참가 인원</span>
                    <span className="value">{tripData.maxParticipants}명</span>
                  </div>
                  <div className="info-row">
                    <span className="label">현재 참가 신청</span>
                    <span className="value">{tripData.currentParticipants}명</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 호스트 정보 */}
          {realHostData && (
            <div className="section">
              <h3 className="section-title">👵 호스트 정보</h3>
              <div className="host-info">
                <div className="info-row">
                  <span className="label">이름</span>
                  <span className="value">{getHostName()}</span>
                </div>
                <div className="info-row">
                  <span className="label">연락처</span>
                  <span className="value">{getHostPhone()}</span>
                </div>
                <div className="info-row">
                  <span className="label">주소</span>
                  <span className="value">{getLocationInfo()}</span>
                </div>
                <div className="info-row">
                  <span className="label">특징</span>
                  <span className="value">{getHostIntroduction().personality}</span>
                </div>
                <div className="info-row">
                  <span className="label">대표 메뉴</span>
                  <span className="value">{getHostIntroduction().menu}</span>
                </div>
              </div>
            </div>
          )}

          {/* 여행 포함 사항 */}
          {tripData && tripData.included && tripData.included.length > 0 && (
            <div className="section">
              <h3 className="section-title">✅ 포함 사항</h3>
              <div className="included-items">
                {tripData.included.map((item, index) => (
                  <div key={index} className="included-item">• {item}</div>
                ))}
              </div>
            </div>
          )}

          {/* 이용자 정보 */}
          <div className="section">
            <h3 className="section-title">이용자 정보</h3>
            <div className="guest-form">
              <div className="form-group">
                <label>이름 *</label>
                <input
                  type="text"
                  name="name"
                  value={guestInfo.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label>휴대폰 번호 *</label>
                <input
                  type="tel"
                  name="phone"
                  value={guestInfo.phone}
                  onChange={handleInputChange}
                  placeholder="휴대폰 번호를 입력하세요"
                  required
                />
              </div>
              <div className="form-group">
                <label>이메일 *</label>
                <input
                  type="email"
                  name="email"
                  value={guestInfo.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 결제수단 */}
          <div className="section">
            <h3 className="section-title">결제수단</h3>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>무통장입금</span>
              </label>
            </div>
          </div>

          {/* 약관동의 */}
          <div className="section">
            <h3 className="section-title">약관동의</h3>
            <div className="terms-agreement">
              <label className="terms-item all-agree">
                <input
                  type="checkbox"
                  checked={agreeTerms.all}
                  onChange={() => handleAgreeChange('all')}
                />
                <span>전체 동의</span>
              </label>
              <div className="terms-list">
                <label className="terms-item">
                  <input
                    type="checkbox"
                    checked={agreeTerms.booking}
                    onChange={() => handleAgreeChange('booking')}
                  />
                  <span>[필수] 숙박 예약 서비스 약관</span>
                  <button className="view-terms" onClick={(e) => { e.preventDefault(); showTermsContent('booking'); }}>보기</button>
                </label>
                <label className="terms-item">
                  <input
                    type="checkbox"
                    checked={agreeTerms.privacy}
                    onChange={() => handleAgreeChange('privacy')}
                  />
                  <span>[필수] 개인정보 수집 및 이용</span>
                  <button className="view-terms" onClick={(e) => { e.preventDefault(); showTermsContent('privacy'); }}>보기</button>
                </label>
                <label className="terms-item">
                  <input
                    type="checkbox"
                    checked={agreeTerms.thirdParty}
                    onChange={() => handleAgreeChange('thirdParty')}
                  />
                  <span>[필수] 개인정보 제3자 제공</span>
                  <button className="view-terms" onClick={(e) => { e.preventDefault(); showTermsContent('thirdParty'); }}>보기</button>
                </label>
                <label className="terms-item">
                  <input
                    type="checkbox"
                    checked={agreeTerms.marketing}
                    onChange={() => handleAgreeChange('marketing')}
                  />
                  <span>[선택] 마케팅 정보 수신</span>
                  <button className="view-terms" onClick={(e) => { e.preventDefault(); showTermsContent('marketing'); }}>보기</button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 */}
        <div className="payment-right">
          <div className="payment-summary">
            <h3 className="summary-title">💳 결제정보</h3>
            
            {/* 여행 이미지 */}
            <div className="accommodation-summary">
              <div className="accommodation-image">
                {realHostData?.housePhotos && realHostData.housePhotos.length > 0 ? (
                  <img src={realHostData.housePhotos[0]} alt="숙소 이미지" />
                ) : hostData.photo ? (
                  <img src={hostData.photo} alt="숙소 이미지" />
                ) : (
                  <div className="placeholder-image">🏠 할머니의 손맛</div>
                )}
              </div>
              <div className="accommodation-details">
                <h4>{getTripTitle()}</h4>
                <p>👵 {getHostName()}</p>
                <p>📍 {getLocationInfo()}</p>
                {tripData && (
                  <p>👥 {tripData.currentParticipants}/{tripData.maxParticipants}명 참가</p>
                )}
              </div>
            </div>

            {/* 요금 상세 */}
            <div className="price-breakdown">
              <div className="price-item">
                <span>🏡 여행 참가비</span>
                <span>{getRoomPrice().toLocaleString()}원</span>
              </div>
              {tripData && tripData.included && tripData.included.length > 0 && (
                <div className="price-note">
                  <small>✅ 포함: {tripData.included.slice(0, 2).join(', ')}{tripData.included.length > 2 ? ' 외' : ''}</small>
                </div>
              )}
              <div className="price-item">
                <span>🎁 농촌체험 할인 <span className="refund-condition">※일손돕기 시</span></span>
                <span>-{Math.floor(getRoomPrice() * 0.1).toLocaleString()}원</span>
              </div>
              <div className="price-divider"></div>
              <div className="price-item total">
                <span><strong>💰 총 결제금액</strong></span>
                <span><strong>{getRoomPrice().toLocaleString()}원</strong></span>
              </div>
            </div>

            {/* 결제 버튼 */}
            <button 
              className="payment-btn"
              onClick={handlePayment}
              disabled={!agreeTerms.booking || !agreeTerms.privacy || !agreeTerms.thirdParty}
            >
              💳 {getRoomPrice().toLocaleString()}원 결제하기
            </button>

            {/* 주의사항 */}
            <div className="payment-notice">
              <h4>⚠️ 결제 전 확인사항</h4>
              <ul>
                <li>✅ 예약 확정 후 취소 시 취소 수수료가 발생할 수 있습니다.</li>
                <li>🕒 체크인 시간은 15:00, 체크아웃 시간은 11:00입니다.</li>
                <li>🌾 일손 돕기 참여 시 10% 환급 혜택을 받을 수 있습니다.</li>
                <li>📞 숙소 관련 문의: {getHostPhone()}</li>
                {tripData && tripData.maxParticipants && (
                  <li>👥 최대 {tripData.maxParticipants}명까지 참가 가능합니다.</li>
                )}
              </ul>
            </div>

            {/* 여행 특별 안내 */}
            {tripData && tripData.description && (
              <div className="trip-special-notice">
                <h4>🌿 여행 특별 안내</h4>
                <p>{getTripDescription()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 약관 모달 */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{getTermsContent().title}</h3>
              <button 
                className="modal-close-btn"
                onClick={() => setShowTermsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="terms-modal-body">
              <pre>{getTermsContent().content}</pre>
            </div>
            <div className="terms-modal-footer">
              <button 
                className="terms-close-btn"
                onClick={() => setShowTermsModal(false)}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
