import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../../../components/Calendar/Calendar";
import "./Payment.css";

const HostPayment = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 1)); // 2025년 6월로 시작
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [paymentStats, setPaymentStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  // 실제 백엔드 Payment API에서 결제 데이터 가져오기
  const fetchPaymentDataFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("실제 결제 데이터 조회 중...");

      // 모든 결제 데이터 조회
      const response = await fetch(
        "https://us-code-halmae-sonmat.onrender.com/api/payments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("결제 데이터 조회에 실패했습니다.");
      }

      const result = await response.json();
      console.log("백엔드에서 불러온 실제 Payment 데이터:", result);

      const dateData = {};
      let stats = {
        totalPayments: 0,
        totalAmount: 0,
        averageAmount: 0
      };

      if (result.success && result.data && Array.isArray(result.data)) {
        // 성공한 결제만 필터링
        const successfulPayments = result.data.filter(payment => 
          payment.paymentStatus === 'completed' || payment.paymentStatus === 'success'
        );

        console.log(`총 ${result.data.length}개 결제 중 ${successfulPayments.length}개 성공 결제`);

        // 현재 월의 결제만 필터링
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        successfulPayments.forEach((payment) => {
          const paymentDate = new Date(payment.createdAt);
          const paymentYear = paymentDate.getFullYear();
          const paymentMonth = paymentDate.getMonth() + 1;
          const paymentDay = paymentDate.getDate();

          // 현재 보고 있는 월의 결제만 처리
          if (paymentYear === currentYear && paymentMonth === currentMonth) {
            const dateKey = `${paymentYear}-${paymentMonth}-${paymentDay}`;

            if (dateData[dateKey]) {
              dateData[dateKey] += payment.amount;
            } else {
              dateData[dateKey] = payment.amount;
            }

            // 통계 업데이트
            stats.totalPayments++;
            stats.totalAmount += payment.amount;
          }
        });

        // 평균 금액 계산
        if (stats.totalPayments > 0) {
          stats.averageAmount = Math.round(stats.totalAmount / stats.totalPayments);
        }

        console.log(`${currentYear}년 ${currentMonth}월 결제 통계:`, stats);
        console.log(`날짜별 결제 데이터:`, dateData);
      }

      // 통계 업데이트
      setPaymentStats(stats);
      
      // 월별 총액 계산
      const monthTotal = Object.values(dateData).reduce((sum, amount) => sum + amount, 0);
      setMonthlyTotal(monthTotal);

      // 데이터가 없을 때 샘플 데이터 제공 (테스트용)
      if (Object.keys(dateData).length === 0) {
        console.log("실제 결제 데이터가 없어 샘플 데이터를 표시합니다.");
        
        const sampleData = {};
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        // 현재 월에 샘플 결제 데이터 생성
        if (year === 2025 && month === 6) {
          const sampleDays = [2, 3, 5, 8, 10, 15, 18, 20, 22, 25, 28, 29, 30];
          
          sampleDays.forEach((day) => {
            const dateKey = `${year}-${month}-${day}`;
            // 150,000 ~ 500,000원 사이 랜덤 금액
            const amount = Math.floor(Math.random() * 350000) + 150000;
            sampleData[dateKey] = amount;
          });

          // 샘플 통계
          const sampleTotal = Object.values(sampleData).reduce((sum, amount) => sum + amount, 0);
          setMonthlyTotal(sampleTotal);
          setPaymentStats({
            totalPayments: sampleDays.length,
            totalAmount: sampleTotal,
            averageAmount: Math.round(sampleTotal / sampleDays.length)
          });
        }

        return sampleData;
      }

      return dateData;
    } catch (error) {
      console.error("결제 데이터 조회 실패:", error);
      setError(error.message);

      // 에러 시 기본 샘플 데이터 반환
      const fallbackData = {};
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      if (year === 2025 && month === 6) {
        const errorDays = [1, 3, 7, 14, 21, 28];
        errorDays.forEach((day) => {
          const dateKey = `${year}-${month}-${day}`;
          fallbackData[dateKey] = Math.floor(Math.random() * 200000) + 100000;
        });

        const fallbackTotal = Object.values(fallbackData).reduce((sum, amount) => sum + amount, 0);
        setMonthlyTotal(fallbackTotal);
        setPaymentStats({
          totalPayments: errorDays.length,
          totalAmount: fallbackTotal,
          averageAmount: Math.round(fallbackTotal / errorDays.length)
        });
      }

      return fallbackData;
    } finally {
      setLoading(false);
    }
  };

  // 특정 날짜의 결제 상세내역을 가져오는 함수
  const getPaymentDetailsForDate = async (dateString) => {
    try {
      const response = await fetch(
        "https://us-code-halmae-sonmat.onrender.com/api/trips",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          const targetDate = new Date(dateString);
          const matchingTrips = result.data.filter((trip) => {
            const startDate = new Date(trip.startDate);
            const endDate = new Date(trip.endDate);
            return (
              targetDate >= startDate &&
              targetDate <= endDate &&
              trip.currentParticipants > 0
            );
          });

          return matchingTrips.map((trip) => ({
            id: trip.id,
            title: trip.title,
            dateRange: `이용일자 ${trip.startDate} - ${trip.endDate}`,
            description: `참가자 ${trip.currentParticipants}명`,
            amount: trip.currentParticipants * trip.price,
          }));
        }
      }
    } catch (error) {
      console.error("결제 상세 조회 실패:", error);
    }

    // 에러 시 기본 데이터 반환
    return [
      {
        id: 1,
        title: "여여",
        dateRange: "이용일자 2025.06.29 - 2025.06.30",
        description: "김현진 님 예약",
        amount: 250000,
      },
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
    return amount?.toLocaleString("ko-KR") || "";
  };

  const handleDateClick = (date, payment) => {
    if (payment) {
      // 결제 내역이 있는 날짜만 클릭 가능
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      navigate(`/host/payment/${year}${month}${day}`);
    }
  };

  // 날짜별 컨텐츠 렌더링 함수 (결제 금액 표시)
  const renderDateContent = (date, data, isCurrentMonth) => {
    if (data && isCurrentMonth) {
      const amount = formatCurrency(data);
      // 금액에 따라 다른 스타일 적용
      let amountClass = 'payment-amount';
      if (data >= 400000) {
        amountClass += ' high-amount';
      } else if (data >= 200000) {
        amountClass += ' medium-amount';
      } else {
        amountClass += ' low-amount';
      }

      return (
        <div className={amountClass}>
          <div className="amount-icon">💰</div>
          <div className="amount-value">{amount}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="payment-management-page">
      <div className="payment-container">
        <h1 className="payment-title">💰 결제 관리</h1>

        {/* 로딩 상태 */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">🔄</div>
            <p>결제 데이터를 불러오고 있습니다...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>❌ 오류가 발생했습니다</h3>
              <p>{error}</p>
              <button onClick={() => {
                const loadData = async () => {
                  const data = await fetchPaymentDataFromAPI();
                  setPaymentData(data);
                };
                loadData();
              }} className="retry-button">
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 결제 통계 */}
        {!loading && !error && (
          <>
            <div className="payment-statistics">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{monthlyTotal.toLocaleString()}원</div>
                  <div className="stat-label">이달 총 결제액</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{paymentStats.totalPayments}건</div>
                  <div className="stat-label">총 결제 건수</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{paymentStats.averageAmount.toLocaleString()}원</div>
                  <div className="stat-label">평균 결제액</div>
                </div>
              </div>
            </div>

            {/* 총 결제 금액 표시 */}
            <div className="payment-summary-section">
              <div className="payment-summary-text">
                📊 {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 날짜별 결제 현황
              </div>
              <div className="payment-summary-note">
                💡 각 날짜의 숫자는 해당일 총 결제 금액입니다. 클릭하여 상세 내역을 확인하세요.
              </div>
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

            {/* 월별 결제 없을 때 */}
            {Object.keys(paymentData).length === 0 && (
              <div className="no-payments">
                <div className="empty-state">
                  <div className="empty-icon">💳</div>
                  <h3>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 결제 내역이 없습니다</h3>
                  <p>아직 이 달에 완료된 결제가 없습니다.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HostPayment;
