import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './SignUp.css';
// import grandmaLogo from '../../assets/images/할머니로고.png';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

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
    if (error) clearError();
  };

  const validateForm = () => {
    const newErrors = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다.';
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '유효한 이메일 주소를 입력해주세요.';
      }
    }

    // 전화번호 검증
    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else {
      const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = '유효한 전화번호를 입력해주세요. (예: 010-1234-5678)';
      }
    }

    // 비밀번호 검증
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
    }

    // 비밀번호 확인 검증
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 개인정보 동의 검증
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '개인정보 수집 및 이용에 동의해주세요.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password
      };

      await register(userData);
      
      // 회원가입 성공 처리
      alert(`${formData.name}님, 회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.`);
      navigate('/auth/login');

    } catch (err) {
      console.error('회원가입 실패:', err);
      // AuthContext에서 설정된 에러를 사용하거나 기본 메시지 설정
      if (!error) {
        setErrors({ general: '회원가입에 실패했습니다. 다시 시도해주세요.' });
      }
    }
  };

  // 전화번호 자동 포맷팅
  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
    
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }));
    }
    if (error) clearError();
  };

  const displayError = error || errors.general;

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
          {displayError && <div className="error-message">{displayError}</div>}
          
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              disabled={isLoading}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder="전화번호 (010-1234-5678)"
              value={formData.phone}
              onChange={handlePhoneChange}
              className={errors.phone ? 'error' : ''}
              disabled={isLoading}
              maxLength="13"
              autoComplete="tel"
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (6자 이상)"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
              autoComplete="new-password"
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
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* 개인정보 동의 섹션 */}
          <div className="terms-section">
            <div className="terms-content">
              <h3>개인정보 수집 및 이용 동의</h3>
              <div className="terms-details">
                <p><strong>수집하는 개인정보 항목:</strong> 이름, 이메일, 전화번호, 비밀번호</p>
                <p><strong>개인정보 수집 및 이용 목적:</strong> 할매의 손맛 회원 가입 및 회원 관리, 서비스 제공</p>
                <p><strong>개인정보 보유 및 이용 기간:</strong> 회원탈퇴 시까지</p>
                <p><strong>동의 거부권:</strong> 위 개인정보 수집·이용에 대한 동의를 거부할 권리가 있으나, 동의를 거부할 경우 회원가입이 제한됩니다.</p>
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

        {/* 개발 정보 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666'
          }}>
            <p><strong>개발 모드</strong></p>
            <p>백엔드 서버: {process.env.REACT_APP_API_URL || 'http://localhost:5001'}</p>
            <p>회원가입 후 로그인 페이지에서 해당 계정으로 로그인할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
