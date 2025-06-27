import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PaymentDetail.css';
import hostImage from '../../../assets/images/내 결제_숙소.png';

const PaymentDetail = () => {
  const { date } = useParams(); // URL에서 날짜 파라미터 받기
  const navigate = useNavigate();

  // 날짜 파싱 (예: 20250604 -> 2025.06.04)
  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}.${month}.${day}`;
  };

  // 요일 계산
  const getWeekday = (dateString) => {
    if (!dateString || dateString.length !== 8) return '';
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1;
    const day = parseInt(dateString.substring(6, 8));
    const date = new Date(year, month, day);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return weekdays[date.getDay()];
  };

  // 해당 날짜의 결제 내역 데이터 (임시)
  const getPaymentDetails = () => {
    // 실제로는 API에서 해당 날짜의 상세 결제 내역을 가져와야 함
    return [
      {
        id: 1,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 250000,
        image: hostImage
      },
      {
        id: 2,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000,
        image: hostImage
      },
      {
        id: 3,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000,
        image: hostImage
      },
      {
        id: 4,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000,
        image: hostImage
      }
    ];
  };

  const paymentDetails = getPaymentDetails();
  const totalAmount = paymentDetails.reduce((sum, item) => sum + item.amount, 0);

  const handleBack = () => {
    navigate('/host/payment');
  };

  return (
    <div className="payment-detail-page">
      <div className="payment-detail-container">
        <h1 className="payment-detail-title">결제 관리</h1>
        
        <div className="date-info">
          <span className="date-text">
            {formatDate(date)} ({getWeekday(date)})
          </span>
        </div>

        <div className="payment-list">
          {paymentDetails.map((payment) => (
            <div key={payment.id} className="payment-item">
              <img 
                src={payment.image} 
                alt={payment.title}
                className="payment-image"
              />
              <div className="payment-info">
                <h3 className="payment-title">{payment.title}</h3>
                <p className="payment-date">{payment.dateRange}</p>
                <p className="payment-description">{payment.description}</p>
              </div>
              <div className="payment-amount">
                {payment.amount.toLocaleString('ko-KR')} 원
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail; 