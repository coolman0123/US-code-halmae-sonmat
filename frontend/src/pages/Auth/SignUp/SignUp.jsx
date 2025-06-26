import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
// import grandmaLogo from '../../assets/images/할머니로고.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 입력 시 해당 필드 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 4) {
      newErrors.password = '비밀번호는 4자 이상이어야 합니다.';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '개인정보 수집 및 이용에 동의해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      // 중복 확인 (로컬스토리지)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const idExists = existingUsers.some(user => user.email === formData.id || user.id === formData.id);
      
      if (idExists) {
        setErrors({ id: '이미 사용중인 아이디입니다.' });
        setIsLoading(false);
        return;
      }

      // 사용자 등록
      const newUser = {
        id: formData.id, // 메인 ID 필드
        name: formData.id, // 아이디를 이름으로 사용
        email: formData.id, // 호환성을 위해 유지
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // 백엔드 API 호출 (나중에 활성화)
      // const response = await signupAPI(formData);

      // 회원가입 성공 처리
      alert('회원가입이 완료되었습니다!');
      navigate('/auth/login');

    } catch (error) {
      setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsLoading(false);
    }
  };

// 백엔드 연동용 API 함수 (나중에 활성화)
const signupAPI = async (userData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: userData.id,
      password: userData.password,
      agreeTerms: userData.agreeTerms
    })
  });
  
  if (!response.ok) {
    throw new Error('회원가입 실패');
  }
  
  return await response.json();
};

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* 할머니 로고 */}
        <div className="signup-header">
          <Link to="/" className="header-link">
            <div className="grandma-logo">
              <img src="/images/grandma-logo.png" alt="할머니 로고" className="logo-image" />
            </div>
            <h1 className="signup-title">할매의 손맛</h1>
          </Link>
        </div>

        {/* 회원가입 폼 */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {errors.general && <div className="error-message">{errors.general}</div>}
          
          <div className="input-group">
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={formData.id}
              onChange={handleInputChange}
              className={errors.id ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.id && <span className="field-error">{errors.id}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* 개인정보 동의 섹션 */}
          <div className="terms-section">
            <div className="terms-content">
              <h3>개인정보 수집 및 이용 동의</h3>
              <div className="terms-details">
                <p><strong>수집하는 개인정보 항목:</strong> 아이디, 비밀번호</p>
                <p><strong>개인정보 수집 및 이용 목적:</strong> 할매의 손맛 회원 가입 및 회원 관리</p>
                <p><strong>개인정보 보유 및 이용 기간:</strong> 회원탈퇴 시까지</p>
              </div>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className={errors.agreeTerms ? 'error' : ''}
                  disabled={isLoading}
                />
                <span className="checkmark"></span>
                개인정보 수집 및 이용에 동의합니다. (필수)
              </label>
              {errors.agreeTerms && <span className="field-error">{errors.agreeTerms}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        {/* 하단 링크들 */}
        <div className="signup-links">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/auth/login" className="link">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
