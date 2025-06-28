import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';
// import grandmaLogo from '../../assets/images/할머니로고.png';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  // 로그인 성공 후 이동할 경로
  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (error) clearError();
    if (localError) setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    // 기본 유효성 검사
    if (!formData.email || !formData.password) {
      setLocalError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      await login(formData);
      // 로그인 성공 시 이전 페이지 또는 메인 페이지로 이동
      navigate(from, { replace: true });
    } catch (err) {
      // AuthContext에서 이미 에러가 설정되므로 추가 처리 불필요
      console.error('로그인 실패:', err);
    }
  };

  // 테스트용 계정 정보
  const handleTestLogin = async () => {
    setFormData({
      email: 'test@example.com',
      password: 'test123'
    });
  };

  const displayError = error || localError;

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 할머니 로고 */}
        <div className="login-header">
          <Link to="/" className="header-link">
            <div className="grandma-logo">
              <img src="/images/grandma-logo.png" alt="할머니 로고" className="logo-image" />
            </div>
            <h1 className="login-title">할매의 손맛</h1>
          </Link>
        </div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          {displayError && <div className="error-message">{displayError}</div>}
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 테스트용 계정 정보 (개발 환경에서만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="test-account-info">
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              테스트 계정 (개발용):
            </p>
            <button 
              type="button"
              onClick={handleTestLogin}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              disabled={isLoading}
            >
              테스트 계정으로 로그인
            </button>
          </div>
        )}

        {/* 하단 링크들 */}
        <div className="login-links">
          <Link to="/auth/signup" className="link">회원가입</Link>
          <span className="divider">|</span>
          <button 
            className="admin-login-button" 
            onClick={() => navigate('/host/login')}
            disabled={isLoading}
          >
            관리자 로그인
          </button>
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
            <p>회원가입 후 로그인하거나 테스트 계정을 사용하세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
