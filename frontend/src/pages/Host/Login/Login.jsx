import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const HostLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 관리자 계정 확인
      if (formData.id === 'admin' && formData.password === '0000') {
        // 관리자 로그인 성공
        localStorage.setItem('currentUser', JSON.stringify({
          id: 'admin',
          name: 'admin',
          userId: 'admin',
          role: 'admin',
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert('관리자님, 환영합니다!');
        navigate('/host'); // 관리자 메인 페이지로 이동
      } else {
        setError('관리자 아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="host-login-page">
      <div className="host-login-container">
        {/* 할머니 로고 */}
        <div className="host-login-header">
          <Link to="/" className="host-header-link">
            <div className="host-grandma-logo">
              <img src="/images/grandma-logo.png" alt="할머니 로고" className="host-logo-image" />
            </div>
            <div className="host-title-section">
              <h1 className="host-login-title">할매의 손맛</h1>
              <p className="host-login-subtitle">관리자 로그인</p>
            </div>
          </Link>
        </div>

        {/* 관리자 계정 안내 */}
        <div className="admin-account-info">
          <h3>🔑 관리자 로그인 정보</h3>
          <div className="admin-account">
            <div className="admin-credential">
              <span className="credential-label">아이디:</span>
              <span className="credential-value">admin</span>
            </div>
            <div className="admin-credential">
              <span className="credential-label">비밀번호:</span>
              <span className="credential-value">0000</span>
            </div>
          </div>
          <p className="admin-note">💡 위 정보를 입력하여 관리자 페이지에 접속하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form className="host-login-form" onSubmit={handleSubmit}>
          {error && <div className="host-error-message">{error}</div>}
          
          <div className="host-input-group">
            <input
              type="text"
              name="id"
              placeholder="관리자 아이디 (admin)"
              value={formData.id}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="host-input-group">
            <input
              type="password"
              name="password"
              placeholder="비밀번호 (0000)"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="host-login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '관리자 로그인'}
          </button>
        </form>

        {/* 하단 링크들 */}
        <div className="host-login-links">
          <Link to="/auth/login" className="host-link">일반 사용자 로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;
