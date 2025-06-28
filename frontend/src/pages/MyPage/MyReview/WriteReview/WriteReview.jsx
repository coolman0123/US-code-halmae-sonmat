import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import roomImg from '../../../../assets/images/내 결제_숙소.png';
import SelectButton from '../../../../components/Button/Button';
import whiteCheck from '../../../../assets/icons/흰체크.png';
import grayCheck from '../../../../assets/icons/회색체크.png';
import './WriteReview.css';

const WriteReview = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem("currentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === "true" && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        loadUserReservations(user);
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const loadUserReservations = (user) => {
    // 1. 할매 등록 정보 가져오기
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    
    // 2. 사용자별 결제 정보 가져오기 (MyPayment에서 사용한 구조와 동일)
    const allPaymentData = {
      'user': [
        {
          id: 1,
          location: '여여',
          date: '2025.06.24',
          price: '340,000원',
        },
        {
          id: 2,
          location: '모모',
          date: '2025.05.24',
          price: '150,000원',
        },
      ],
      'admin': [
        {
          id: 3,
          location: '소소',
          date: '2025.04.14',
          price: '150,000원',
        },
        {
          id: 4,
          location: '호호',
          date: '2025.03.14',
          price: '170,000원',
        },
      ],
      '22': [
        {
          id: 5,
          location: '패밀리',
          date: '2025.03.02',
          price: '150,000원',
        },
        {
          id: 6,
          location: '여여',
          date: '2025.02.15',
          price: '340,000원',
        },
      ]
    };

    // 3. 사용자의 결제 정보 가져오기
    const userPayments = allPaymentData[user.email] || [];
    
    // 4. 결제 정보와 할매 등록 정보 연결
    const reservationsWithHostInfo = userPayments.map(payment => {
      // 해당 숙소의 할매 정보 찾기
      const hostInfo = hostsList.find(host => 
        host.houseName === payment.location || 
        host.id === payment.location
      );
      
      // 할매 등록 기본 정보에서 가져오기
      const savedHostData = localStorage.getItem('hostRegisterData');
      let basicInfo = {};
      if (savedHostData) {
        try {
          const parsedData = JSON.parse(savedHostData);
          basicInfo = parsedData.basicInfo || {};
        } catch (error) {
          console.error('할매 등록 데이터 파싱 오류:', error);
        }
      }

      return {
        ...payment,
        description: hostInfo ? 
          `"${basicInfo.personality || '친절한'}" ${basicInfo.name || hostInfo.name || '할머니'}` :
          `"${basicInfo.personality || '따뜻한'}" ${basicInfo.name || '할머니'}`
      };
    });

    setUserReservations(reservationsWithHostInfo);
  };

  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='write-review'>
      {userReservations.length > 0 ? (
        userReservations.map((item) => (
          <div className='review-card' key={item.id}>
            <img src={roomImg} alt='숙소' />
            <div className='info'>
              <p className='place'>{item.location}</p>
              <p className='date'>{item.date}</p>
              <p className='desc'>{item.description}</p>
            </div>
            <SelectButton
              selected={selectedId === item.id}
              icon={selectedId === item.id ? whiteCheck : grayCheck}
              text='선택'
              onClick={() =>
                setSelectedId(selectedId === item.id ? null : item.id)
              }
            />
          </div>
        ))
      ) : (
        <div className='no-reservations'>
          <p>예약 내역이 없습니다.</p>
        </div>
      )}
      <div className='write-bottom-btn'>
        <SelectButton
          selected={!!selectedId}
          disabled={!selectedId}
          text='리뷰 작성하러 가기'
          onClick={() => {
            if (selectedId) {
              navigate(`/mypage/review/form/${selectedId}`);
            }
          }}
        />
      </div>
    </div>
  );
};

export default WriteReview;
