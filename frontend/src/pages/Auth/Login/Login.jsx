import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 입력 유효성 검사
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await login(formData);
      
      if (response.success) {
        alert(`${response.data.name}님, 환영합니다!`);
        navigate('/'); // 메인페이지로 이동
      }
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };



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
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
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

        {/* 하단 링크들 */}
        <div className="login-links">
          <Link to="/auth/signup" className="link">회원가입</Link>
          <span className="divider">|</span>
          <button className="admin-login-button" onClick={() => navigate('/auth/admin-login')}>
            관리자 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
