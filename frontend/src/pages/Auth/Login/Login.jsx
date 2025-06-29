import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { healthCheck } from '../../../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'ok', 'error'
  const [debugInfo, setDebugInfo] = useState('');

  // 서버 상태 확인
  useEffect(() => {
    const checkServer = async () => {
      try {
        await healthCheck();
        setServerStatus('ok');
      } catch (error) {
        console.error('서버 연결 실패:', error);
        setServerStatus('error');
      }
    };
    checkServer();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    try {
      console.log('🔐 로그인 시도:', formData.email);
      const response = await login(formData);
      if (response.success) {
        alert(`${response.data.name}님, 환영합니다!`);
        navigate('/');
      }
    } catch (err) {
      console.error('로그인 에러:', err);
      setError(err.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleServerTest = async () => {
    try {
      setDebugInfo('서버 테스트 중...');
      const result = await healthCheck();
      setDebugInfo(`서버 테스트 성공:\n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setDebugInfo(`서버 테스트 실패:\n${error.message}\n${error.stack}`);
    }
  };

  const handleLoginTest = async () => {
    try {
      setDebugInfo('로그인 테스트 중...');
      const testData = {
        email: 'test@example.com',
        password: 'test123'
      };
      const response = await login(testData);
      setDebugInfo(`로그인 성공:\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setDebugInfo(`로그인 실패:\n${error.message}\n${error.stack}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 로고 */}
        <div className="login-header">
          <Link to="/" className="header-link">
            <div className="grandma-logo">
              <img src="/images/grandma-logo.png" alt="할머니 로고" className="logo-image" />
            </div>
            <h1 className="login-title">할매의 손맛</h1>
          </Link>
        </div>

        {/* 서버 상태 */}
        {serverStatus === 'checking' && (
          <div className="server-status checking">서버 연결 확인 중...</div>
        )}
        {serverStatus === 'error' && (
          <div className="server-status error">⚠️ 서버에 연결할 수 없습니다</div>
        )}
        {serverStatus === 'ok' && (
          <div className="server-status ok">✅ 서버 연결 정상</div>
        )}

        {/* 테스트 계정 안내 (항상 보임) */}
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

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="이메일 (예: user@naver.com)"
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
              placeholder="비밀번호 (예: 0000)"
              value={formData.password}
              onChange={handleInputChange}
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

        {/* 하단 링크 */}
        <div className="login-links">
          <Link to="/auth/signup" className="link">회원가입</Link>
          <span className="divider">|</span>
          <button className="admin-login-button" onClick={() => navigate('/auth/admin-login')}>
            관리자 로그인
          </button>
        </div>

        {/* 디버깅 도구 (개발 환경에서만 표시) */}
        {import.meta.env.MODE === 'development' && (
          <div className="debug-section">
            <h4>디버깅 도구</h4>
            <div className="debug-buttons">
              <button onClick={handleServerTest} className="debug-button">서버 연결 테스트</button>
              <button onClick={handleLoginTest} className="debug-button">로그인 API 테스트</button>
            </div>
            {debugInfo && (
              <div className="debug-info">
                <pre>{debugInfo}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;