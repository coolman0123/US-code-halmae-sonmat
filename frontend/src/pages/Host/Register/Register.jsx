import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import hostImage from '../../../assets/images/내 결제_숙소.png';

// 임시 데이터 (나중에 API로 대체)
const hostData = [
  {
    id: 1,
    name: '여여',
    date: '2025.06.24 등록',
    description: '"말보단 손이 빠른" 박봉순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active'
  },
  {
    id: 2,
    name: '모모',
    date: '2025.05.24 등록',
    description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active'
  },
  {
    id: 3,
    name: '소소',
    date: '2025.04.14 등록',
    description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active'
  },
  {
    id: 4,
    name: '호호',
    date: '2025.03.14 등록',
    description: '"한 마디면 눈물 터지는" 정다감 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active'
  },
  {
    id: 5,
    name: '패밀리',
    date: '2025.03.02 등록',
    description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active'
  }
];

const HostRegister = () => {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 백엔드 연동 시 API 호출
    const fetchHosts = async () => {
      try {
        // localStorage에서 저장된 할매 목록 불러오기
        const savedHosts = JSON.parse(localStorage.getItem('hostsList') || '[]');
        
        // 기본 임시 데이터와 저장된 데이터 합치기
        const allHosts = [...hostData, ...savedHosts];
        
        console.log('불러온 할매 목록:', allHosts);
        
        setTimeout(() => {
          setHosts(allHosts);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('할매 목록 조회 실패:', error);
        // 에러 시 기본 데이터만 표시
        setHosts(hostData);
        setLoading(false);
      }
    };

    fetchHosts();
  }, []); // 컴포넌트 마운트 시와 페이지 재진입 시 실행

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      const savedHosts = JSON.parse(localStorage.getItem('hostsList') || '[]');
      const allHosts = [...hostData, ...savedHosts];
      setHosts(allHosts);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRegisterNew = () => {
    // 새 할매 등록 페이지로 이동
    navigate('/host/register/new');
  };

  const handleDeleteHost = (hostId) => {
    if (window.confirm('정말로 이 할매를 삭제하시겠습니까?')) {
      try {
        // 현재 화면에서 해당 할매 제거
        const updatedHosts = hosts.filter(host => host.id !== hostId);
        setHosts(updatedHosts);
        
        // localStorage에서도 제거 (새로 등록된 할매인 경우)
        const savedHosts = JSON.parse(localStorage.getItem('hostsList') || '[]');
        const updatedSavedHosts = savedHosts.filter(host => host.id !== hostId);
        localStorage.setItem('hostsList', JSON.stringify(updatedSavedHosts));
        
        console.log('할매 삭제 완료:', hostId);
      } catch (error) {
        console.error('할매 삭제 실패:', error);
        alert('삭제에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (loading) {
    return (
      <div className="host-register-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="host-register-page">
      <main className="host-register-main">
        <h1 className="page-title">할매 등록</h1>
        <div className="host-list">
          {hosts.map((host) => (
            <div className="host-card" key={host.id}>
              {/* 모든 할머니에 삭제 버튼 표시 */}
              <button 
                className="delete-button"
                onClick={() => handleDeleteHost(host.id)}
                title="삭제"
              >
                ×
              </button>
              
              <img 
                src={host.photo || host.image || hostImage} 
                alt={host.name || host.houseName} 
                className="host-img"
                onError={(e) => {
                  e.target.src = hostImage; // 이미지 로드 실패 시 기본 이미지
                }}
              />
              <div className="host-info">
                <div className="host-name">{host.houseName || host.name}</div>
                <div className="host-date">
                  {host.date || (host.createdAt ? 
                    new Date(host.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\. /g, '.').replace(/\.$/, '') + ' 등록' 
                    : '등록일 미상')}
                </div>
                <div className="host-desc">
                  {host.description || 
                   (host.personality ? `"${host.personality}" ${host.name || '할머니'}` : '소개 없음')}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="register-button-container">
          <button 
            className="register-new-button"
            onClick={handleRegisterNew}
          >
            할매 등록하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default HostRegister;
