import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
// import grandmaLogo from '../../assets/images/할머니로고.png';

const Login = () => {
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
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 백엔드 API 호출 (나중에 활성화)
      // const response = await loginAPI(formData);
      
      // 현재는 로컬스토리지 사용 (개발용)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find(
        u => (u.email === formData.id || u.id === formData.id) && u.password === formData.password
      );
      
      if (user) {
        // 로그인 성공 시 사용자 정보 저장
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          name: user.name,
          userId: formData.id, // 로그인에 사용한 ID
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert(`${user.name}님, 환영합니다!`);
        navigate('/'); // 메인페이지로 이동
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 백엔드 연동용 API 함수 (나중에 활성화)
  const loginAPI = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: credentials.id,
        password: credentials.password
      })
    });
    
    if (!response.ok) {
      throw new Error('로그인 실패');
    }
    
    return await response.json();
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
              type="text"
              name="id"
              placeholder="아이디"
              value={formData.id}
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
          <button className="admin-login-button" onClick={() => navigate('/admin/login')}>
            관리자 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
