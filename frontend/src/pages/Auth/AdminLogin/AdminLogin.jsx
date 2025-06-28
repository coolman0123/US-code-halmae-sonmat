import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminId: '',
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
      // 관리자 계정 검증 (임시로 하드코딩된 관리자 계정)
      const adminCredentials = {
        adminId: 'admin',
        password: '0000'
      };

      // 또는 localStorage에서 관리자 계정 확인
      const adminUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
      const isValidAdmin = adminUsers.find(
        admin => admin.adminId === formData.adminId && admin.password === formData.password
      );

      // 기본 관리자 계정 또는 등록된 관리자 계정 확인
      if ((formData.adminId === adminCredentials.adminId && formData.password === adminCredentials.password) || isValidAdmin) {
        // 관리자 로그인 성공
        localStorage.setItem('currentAdmin', JSON.stringify({
          adminId: formData.adminId,
          name: isValidAdmin ? isValidAdmin.name : '관리자',
          role: 'admin',
          loginTime: new Date().toISOString()
        }));
        localStorage.setItem('isAdminLoggedIn', 'true');
        
        alert('관리자 로그인에 성공했습니다!');
        navigate('/host'); // 호스트 관리 페이지로 이동
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
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* 관리자 로그인 헤더 */}
        <div className="admin-login-header">
          <Link to="/" className="header-link">
            <div className="grandma-logo">
              <img src="/images/grandma-logo.png" alt="할머니 로고" className="logo-image" />
            </div>
            <h1 className="admin-login-title">할매의 손맛</h1>
          </Link>
          <h2 className="admin-subtitle">관리자 로그인</h2>
        </div>

        {/* 관리자 로그인 폼 */}
        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              name="adminId"
              placeholder="관리자 아이디"
              value={formData.adminId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="관리자 비밀번호"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '관리자 로그인'}
          </button>
        </form>

        {/* 관리자 정보 안내 */}
        <div className="admin-info">
          <p className="info-text">관리자 전용 로그인입니다.</p>
        </div>

        {/* 하단 링크들 */}
        <div className="admin-login-links">
          <Link to="/auth/login" className="link">일반 로그인</Link>
          <span className="divider">|</span>
          <Link to="/" className="link">메인으로</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 