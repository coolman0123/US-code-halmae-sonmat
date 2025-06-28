import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddReservation.css';

const AddReservation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hostId: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    maxParticipants: 4,
    price: '',
    location: {
      region: '',
      address: ''
    }
  });
  
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 호스트 목록 가져오기
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/hosts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setHosts(result.data);
          }
        }
      } catch (error) {
        console.error('호스트 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // 중첩된 객체 처리 (location.region, location.address)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.hostId || !formData.title || !formData.startDate || !formData.endDate || !formData.price) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }

    try {
      // 백엔드 Trip API에 전송할 데이터 구성
      const tripData = {
        hostId: formData.hostId,
        title: formData.title,
        description: formData.description || '농촌 체험 프로그램',
        location: {
          region: formData.location.region || '경기도',
          address: formData.location.address || '상세 주소 미정'
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxParticipants: parseInt(formData.maxParticipants) || 4,
        currentParticipants: 0,
        price: parseFloat(formData.price) || 0,
        included: ['농촌 체험', '전통 음식', '숙박'],
        excluded: ['교통비', '개인 용품'],
        itinerary: [
          {
            day: 1,
            title: '체크인 및 농촌 체험',
            description: '할머니와 함께하는 농촌 생활 체험',
            activities: ['체크인', '농사 체험', '전통 요리 만들기']
          }
        ],
        status: 'active'
      };

      console.log('전송할 Trip 데이터:', tripData);

      // 배포된 백엔드 Trip API 호출
      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '여행 등록에 실패했습니다.');
      }

      console.log('여행 등록 성공:', result);
      alert(`여행이 성공적으로 등록되었습니다!\n제목: ${formData.title}\n기간: ${formData.startDate} ~ ${formData.endDate}\n최대 참가자: ${formData.maxParticipants}명`);
      
      // 예약 관리 페이지로 돌아가기
      navigate('/host/booking');
    } catch (error) {
      console.error('여행 등록 실패:', error);
      alert(error.message || '여행 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancel = () => {
    navigate('/host/booking');
  };

  if (loading) {
    return (
      <div className="add-reservation-page">
        <div className="add-reservation-container">
          <h1 className="add-reservation-title">로딩 중...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="add-reservation-page">
      <div className="add-reservation-container">
        <h1 className="add-reservation-title">새 여행 등록</h1>
        
        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">호스트 선택 *</label>
            <select
              name="hostId"
              value={formData.hostId}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">호스트를 선택하세요</option>
              {hosts.map((host) => (
                <option key={host.id} value={host.id}>
                  {host.houseNickname} ({host.hostIntroduction})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">여행 제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="예: 할머니와 함께하는 농촌 체험"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">여행 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="여행에 대한 상세 설명을 입력하세요"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">여행 기간</label>
            <div className="date-range">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="date-input"
                required
              />
              <span className="date-separator">~</span>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="date-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">최대 참가자 수 *</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              className="form-input"
              min="1"
              max="20"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">여행 가격 (원) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="form-input"
              placeholder="1인당 가격을 입력하세요"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">지역</label>
            <input
              type="text"
              name="location.region"
              value={formData.location.region}
              onChange={handleInputChange}
              className="form-input"
              placeholder="예: 경기도 양평군"
            />
          </div>

          <div className="form-group">
            <label className="form-label">상세 주소</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="상세 주소를 입력하세요"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleCancel}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="complete-button"
            >
              여행 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReservation; 