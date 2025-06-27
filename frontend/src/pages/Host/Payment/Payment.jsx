import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar';
import './Payment.css';

const HostPayment = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [paymentData, setPaymentData] = useState({});

  // 특정 날짜의 결제 상세내역을 가져오는 함수 (PaymentDetail.jsx와 동일한 데이터)
  const getPaymentDetailsForDate = (dateString) => {
    // 실제로는 API에서 해당 날짜의 상세 결제 내역을 가져와야 함
    // 현재는 모든 날짜에 동일한 데이터를 반환 (실제 구현시 날짜별로 다른 데이터 반환)
    return [
      {
        id: 1,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 250000
      },
      {
        id: 2,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000
      },
      {
        id: 3,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000
      },
      {
        id: 4,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 340000
      }
    ];
  };

  // 임시 결제 데이터 (실제 API에서 가져올 데이터)
  const generatePaymentData = () => {
    const data = {};
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 2025년 6월 고정 결제 데이터
    if (year === 2025 && month === 5) { // 6월 (0-based index)
      // 결제가 있는 날짜들 (기존과 동일)
      const paymentDays = [2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      
      paymentDays.forEach(day => {
        const dateKey = `${year}-${month + 1}-${day}`;
        const paymentDetails = getPaymentDetailsForDate(dateKey);
        // 실제 상세내역의 합계를 계산
        const totalAmount = paymentDetails.reduce((sum, item) => sum + item.amount, 0);
        data[dateKey] = totalAmount;
      });
    } else {
      // 다른 월에는 랜덤 데이터
      for (let day = 1; day <= 30; day++) {
        if (Math.random() > 0.4) { // 60% 확률로 결제 발생
          const dateKey = `${year}-${month + 1}-${day}`;
          const paymentDetails = getPaymentDetailsForDate(dateKey);
          const totalAmount = paymentDetails.reduce((sum, item) => sum + item.amount, 0);
          data[dateKey] = totalAmount;
        }
      }
    }
    
    return data;
  };

  useEffect(() => {
    setPaymentData(generatePaymentData());
  }, [currentDate]);

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('ko-KR') || '';
  };

  const handleDateClick = (date, payment) => {
    if (payment) { // 결제 내역이 있는 날짜만 클릭 가능
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      navigate(`/host/payment/${year}${month}${day}`);
    }
  };

  // 날짜별 컨텐츠 렌더링 함수 (결제 금액 표시)
  const renderDateContent = (date, data, isCurrentMonth) => {
    if (data && isCurrentMonth) {
      return (
        <div className="payment-amount">
          {formatCurrency(data)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="payment-management-page">
      <div className="payment-container">
        <h1 className="payment-title">결제 관리</h1>
        
        {/* 총 결제 금액 표시 */}
        <div className="payment-summary-text">
          ※ 총 결제 금액
        </div>

        {/* 캘린더 컴포넌트 사용 */}
        <Calendar 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onDateClick={handleDateClick}
          dateData={paymentData}
          formatCurrency={formatCurrency}
          renderDateContent={renderDateContent}
        />
      </div>
    </div>
  );
};

export default HostPayment;
