import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    introduction: '', // 할머니 한 줄 소개
    age: '',          // 연세
    specialty: '',    // 특징
    menu: '',         // 대표 메뉴
    personality: ''   // 성격 한 줄 요약
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 폼 데이터를 localStorage에 저장
      localStorage.setItem('hostRegisterData', JSON.stringify({
        basicInfo: formData,
        timestamp: new Date().toISOString()
      }));
      
      console.log('할매 기본 정보 저장:', formData);
      
      // 상세 등록 페이지로 이동
      navigate('/host/register/detail');
    } catch (error) {
      console.error('할매 등록 실패:', error);
      alert('할매 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="register-form-page">
      <main className="register-form-main">
        <div className="form-container">
          <h1 className="form-title">할머니 등록</h1>
          
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">할머니 한 줄 소개</label>
              <input
                type="text"
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                className="form-input"
                placeholder="할머니 한 줄 소개를 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">연세</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="form-input"
                placeholder="연세를 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">특징</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="form-input"
                placeholder="특징을 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">대표 메뉴</label>
              <input
                type="text"
                name="menu"
                value={formData.menu}
                onChange={handleInputChange}
                className="form-input"
                placeholder="대표 메뉴를 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">성격 한 줄 요약</label>
              <input
                type="text"
                name="personality"
                value={formData.personality}
                onChange={handleInputChange}
                className="form-input"
                placeholder="할머니 성격을 한 줄로 입력하세요"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">할머니 등록 예시</label>
              <div className="story-section">
                <div className="story-header">
                  <span className="story-title">"말보단 손이 빠른" 박봉순 할머니</span>
                </div>
                <ul className="story-list">
                  <li>연세: 82세</li>
                  <li>특징: 하루도 안 쉬고 아침 5시에 일어나 밭일하고 밥 짓는 할머니. 말수는 적지만 상 위엔 늘 7첩 반상.</li>
                  <li>대표 메뉴: 직접 재배한 콩으로 만든 청국장, 묵은지찜</li>
                  <li>성격 한 줄 요약: "말 안 해도 다 해놓는 성격이에요. 손이 말해요."</li>
                </ul>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="submit-button"
              >
                다음
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterForm; 