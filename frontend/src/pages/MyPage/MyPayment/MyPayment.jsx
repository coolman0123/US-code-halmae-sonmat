import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPayment.css';
import paymentImage from '../../../assets/images/내 결제_숙소.png';

// 사용자별 결제 데이터 (실제로는 백엔드에서 가져올 데이터)
const allPaymentData = {
  'user': [
    {
      location: '여여',
      date: '2025.06.24',
      description: '"말보단 손이 빠른" 박봉순 할머니',
      price: '340,000원',
    },
    {
      location: '모모',
      date: '2025.05.24',
      description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
      price: '150,000원',
    },
  ],
  'admin': [
    {
      location: '소소',
      date: '2025.04.14',
      description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
      price: '150,000원',
    },
    {
      location: '호호',
      date: '2025.03.14',
      description: '"한 마디면 눈물 터지는" 정다감 할머니',
      price: '170,000원',
    },
  ],
  '22': [
    {
      location: '패밀리',
      date: '2025.03.02',
      description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
      price: '150,000원',
    },
    {
      location: '여여',
      date: '2025.02.15',
      description: '"말보단 손이 빠른" 박봉순 할머니',
      price: '340,000원',
    },
  ]
};

const MyPayment = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userPayments, setUserPayments] = useState([]);

  useEffect(() => {
    // 로그인한 사용자 정보 가져오기
    const userData = localStorage.getItem("currentUser");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (isLoggedIn === "true" && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // 해당 사용자의 결제 정보 가져오기
        const payments = allPaymentData[user.email] || [];
        setUserPayments(payments);
        
        // TODO: 실제로는 백엔드 API 호출
        // const response = await fetch(`/api/payments?userId=${user.id}`);
        // const payments = await response.json();
        // setUserPayments(payments);
        
      } catch (error) {
        console.error("사용자 데이터 파싱 오류:", error);
        navigate("/auth/login");
      }
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  if (!currentUser) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='my-page'>
      <main className='my-payment-page'>
        <div className='payment-list'>
          {userPayments.length > 0 ? (
            userPayments.map((item, index) => (
              <div className='payment-card' key={index}>
                <img src={paymentImage} alt='숙소' className='payment-img' />
                <div className='payment-info'>
                  <div className='payment-location'>{item.location}</div>
                  <div className='payment-date'>{item.date}</div>
                  <div className='payment-desc'>{item.description}</div>
                </div>
                <div className='payment-price'>{item.price}</div>
              </div>
            ))
          ) : (
            <div className='no-payments'>
              <p>결제 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPayment;
