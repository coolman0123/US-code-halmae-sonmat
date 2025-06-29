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
      console.log('🔑 관리자 로그인 시도:', formData);

      // 관리자 계정 검증 - 매우 간단하게 처리
      const validAdminIds = ['admin', 'manager', 'host', '관리자'];
      
      // 아이디만 확인 (비밀번호 무시)
      if (validAdminIds.includes(formData.adminId) || formData.adminId.length > 0) {
        // 관리자 로그인 성공
        const adminInfo = {
          adminId: formData.adminId,
          name: formData.adminId === 'admin' ? '시스템 관리자' : `${formData.adminId} 관리자`,
          role: 'admin',
          loginTime: new Date().toISOString()
        };

        localStorage.setItem('currentAdmin', JSON.stringify(adminInfo));
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('authToken', 'admin-token-' + Date.now()); // 임시 관리자 토큰
        
        console.log('✅ 관리자 로그인 성공:', adminInfo);
        
        alert('관리자 로그인에 성공했습니다!');
        navigate('/host'); // 호스트 관리 페이지로 이동
      } else {
        setError('관리자 아이디를 입력해주세요.');
      }
    } catch (err) {
      console.error('❌ 관리자 로그인 실패:', err);
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

          <div className="test-account-info">
            <h3>🧪 테스트 계정으로 로그인</h3>
            <div className="test-accounts">
              <div className="test-account">
                <strong>일반 사용자:</strong>
                <span className="test-email">user@naver.com</span>
                <span className="test-password">(비밀번호: 0000)</span>
              </div>
              <div className="test-account">
                <strong>관리자:</strong>
                <span className="test-email">admin</span>
                <span className="test-password">(비밀번호: 0000)</span>
              </div>
            </div>
            <p className="test-note">💡 위 계정 정보를 복사해서 사용하세요!</p>
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
              placeholder="관리자 비밀번호 (선택사항)"
              value={formData.password}
              onChange={handleInputChange}
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
          <p className="info-text">사용 가능한 아이디: admin, manager, host 등</p>
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