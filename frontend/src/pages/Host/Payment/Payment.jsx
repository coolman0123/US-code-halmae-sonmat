import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../../components/Calendar/Calendar';
import './Payment.css';

const HostPayment = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [paymentData, setPaymentData] = useState({});

  // 백엔드에서 결제 데이터 가져오기 (Trip API 활용)
  const fetchPaymentDataFromAPI = async () => {
    try {
      console.log('백엔드에서 결제 데이터 조회 중...');
      
      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('결제 데이터 조회에 실패했습니다.');
      }

      const result = await response.json();
      console.log('백엔드에서 불러온 Trip 데이터 (결제용):', result);

      const data = {};

      if (result.success && result.data && Array.isArray(result.data)) {
        // Trip 데이터를 날짜별 결제 데이터로 변환
        result.data.forEach(trip => {
          if (trip.status === 'cancelled' || trip.currentParticipants === 0) return; // 취소된 여행이나 참가자 없는 여행 제외
          
          const startDate = new Date(trip.startDate);
          const endDate = new Date(trip.endDate);
          
          // 시작일부터 종료일까지 모든 날짜에 결제 정보 표시
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const day = d.getDate();
            const dateKey = `${year}-${month}-${day}`;
            
            // 해당 날짜의 총 결제 금액 계산 (참가자 수 × 가격)
            const dailyPayment = trip.currentParticipants * trip.price;
            
            if (data[dateKey]) {
              data[dateKey] += dailyPayment;
            } else {
              data[dateKey] = dailyPayment;
            }
          }
        });
      }

      // 백엔드 데이터가 없거나 적을 때 기본 임시 데이터 추가
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      if (Object.keys(data).length === 0 && year === 2025 && month === 5) {
        // 2025년 6월 고정 결제 데이터
        const paymentDays = [2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
        
        paymentDays.forEach(day => {
          const dateKey = `${year}-${month + 1}-${day}`;
          // 임시 결제 금액 (250,000 ~ 680,000원 사이 랜덤)
          data[dateKey] = Math.floor(Math.random() * 430000) + 250000;
        });
      }
      
      return data;
    } catch (error) {
      console.error('결제 데이터 조회 실패:', error);
      
      // 에러 시 기본 임시 데이터 반환
      const data = {};
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      if (year === 2025 && month === 5) {
        const paymentDays = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        paymentDays.forEach(day => {
          const dateKey = `${year}-${month + 1}-${day}`;
          data[dateKey] = Math.floor(Math.random() * 200000) + 100000;
        });
      }
      
      return data;
    }
  };

  // 특정 날짜의 결제 상세내역을 가져오는 함수
  const getPaymentDetailsForDate = async (dateString) => {
    try {
      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/trips', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const targetDate = new Date(dateString);
          const matchingTrips = result.data.filter(trip => {
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            return targetDate >= startDate && targetDate <= endDate && trip.currentParticipants > 0;
          });

          return matchingTrips.map(trip => ({
            id: trip.id,
            title: trip.title,
            dateRange: `이용일자 ${trip.startDate} - ${trip.endDate}`,
            description: `참가자 ${trip.currentParticipants}명`,
            amount: trip.currentParticipants * trip.price
          }));
        }
      }
    } catch (error) {
      console.error('결제 상세 조회 실패:', error);
    }

    // 에러 시 기본 데이터 반환
    return [
      {
        id: 1,
        title: '여여',
        dateRange: '이용일자 2025.06.29 - 2025.06.30',
        description: '김현진 님 예약',
        amount: 250000
      }
    ];
  };

  useEffect(() => {
    const loadPaymentData = async () => {
      const data = await fetchPaymentDataFromAPI();
      setPaymentData(data);
    };
    
    loadPaymentData();
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
