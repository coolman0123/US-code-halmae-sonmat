import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddReservation.css';

const AddReservation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    houseName: '',
    startDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.houseName || !formData.startDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      // 시작일의 다음날을 종료일로 자동 계산 (1박2일)
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 1);

      // 기존 예약 데이터 가져오기
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      
      // 새 예약 데이터 생성
      const newReservation = {
        id: Date.now(), // 임시 ID
        houseName: formData.houseName,
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
        status: 'available', // 처음엔 예약 가능 상태
        createdAt: new Date().toISOString()
      };

      // 저장
      existingReservations.push(newReservation);
      localStorage.setItem('reservations', JSON.stringify(existingReservations));
      
      console.log('새 예약 등록:', newReservation);
      alert(`예약이 성공적으로 등록되었습니다!\n입실: ${formData.startDate}\n퇴실: ${newReservation.endDate}`);
      
      // 예약 관리 페이지로 돌아가기
      navigate('/host/booking');
    } catch (error) {
      console.error('예약 등록 실패:', error);
      alert('예약 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    navigate('/host/booking');
  };

  return (
    <div className="add-reservation-page">
      <div className="add-reservation-container">
        <h1 className="add-reservation-title">예약 관리</h1>
        
        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">숙소 이름</label>
            <input
              type="text"
              name="houseName"
              value={formData.houseName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="입력하세요"
            />
          </div>

          <div className="form-group">
            <label className="form-label">날짜 등록</label>
            <div className="date-single">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="date-input-single"
                placeholder="입실 날짜"
              />
              <div className="date-info">
                * 1박 2일 (입실 다음날 자동 퇴실)
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="complete-button"
            >
              등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReservation; 