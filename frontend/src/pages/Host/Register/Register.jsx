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
    introduction: '"말보단 손이 빠른" 박봉순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active',
    isLocal: true // 로컬 데이터 표시
  },
  {
    id: 2,
    name: '모모',
    date: '2025.05.24 등록',
    introduction: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active',
    isLocal: true // 로컬 데이터 표시
  },
  {
    id: 3,
    name: '소소',
    date: '2025.04.14 등록',
    introduction: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active',
    isLocal: true // 로컬 데이터 표시
  },
  {
    id: 4,
    name: '호호',
    date: '2025.03.14 등록',
    introduction: '"한 마디면 눈물 터지는" 정다감 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active',
    isLocal: true // 로컬 데이터 표시
  },
  {
    id: 5,
    name: '패밀리',
    date: '2025.03.02 등록',
    introduction: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
    image: hostImage, // 임시 이미지 (후에 실제 할매 사진으로 교체)
    status: 'active',
    isLocal: true // 로컬 데이터 표시
  }
];

const HostRegister = () => {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHosts = async () => {
    try {
      console.log('백엔드에서 호스트 목록 조회 중...');
      
      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/hosts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('호스트 목록 조회에 실패했습니다.');
      }

      const result = await response.json();
      console.log('백엔드에서 불러온 호스트 목록:', result);

      if (result.success && result.data) {
        // 백엔드 데이터를 프론트엔드 형식에 맞게 변환
        const transformedHosts = result.data.map(host => ({
          id: host.id,
          houseName: host.houseNickname,
          name: host.hostIntroduction,
          age: host.age,
          specialty: host.characteristics,
          menu: host.representativeMenu,
          personality: host.personalitySummary,
          address: host.address?.detailAddress || '',
          phone: host.contact?.phone || '',
          guests: host.maxGuests,
          bedrooms: host.bedroomCount,
          beds: host.bedCount,
          amenities: host.amenities || [],
          workExperience: host.availableExperiences,
          price: host.accommodationFee,
          photos: host.housePhotos || [],
          latitude: host.latitude,
          longitude: host.longitude,
          createdAt: host.createdAt,
          date: host.createdAt ? 
            new Date(host.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\. /g, '.').replace(/\.$/, '') + ' 등록' 
            : '등록일 미상',
          isLocal: false // 백엔드 데이터 표시
        }));

        // 기본 임시 데이터와 백엔드 데이터 합치기
        const allHosts = [...hostData, ...transformedHosts];
        setHosts(allHosts);
      } else {
        // 백엔드 데이터가 없으면 기본 데이터만 표시
        setHosts(hostData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('할매 목록 조회 실패:', error);
      // 에러 시 기본 데이터만 표시
      setHosts(hostData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []); // 컴포넌트 마운트 시 실행

  // 페이지 포커스 시 데이터 새로고침
  useEffect(() => {
    const handleFocus = () => {
      fetchHosts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRegisterNew = () => {
    // 새 할매 등록 페이지로 이동
    navigate('/host/register/new');
  };

  const handleDeleteHost = async (hostId) => {
    const hostToDelete = hosts.find(host => host.id === hostId);
    
    if (!hostToDelete) {
      alert('삭제할 호스트를 찾을 수 없습니다.');
      return;
    }

    // 삭제 확인
    const confirmMessage = hostToDelete.isLocal 
      ? '정말로 이 임시 할매를 삭제하시겠습니까?' 
      : `정말로 "${hostToDelete.houseName || hostToDelete.name}" 할머니를 삭제하시겠습니까?\n\n주의: 백엔드에서 완전히 삭제됩니다.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      if (hostToDelete.isLocal) {
        // 로컬(임시) 데이터 삭제
        const updatedHosts = hosts.filter(host => host.id !== hostId);
        setHosts(updatedHosts);
        console.log('임시 할매 삭제 완료:', hostId);
        alert('임시 할매가 삭제되었습니다.');
      } else {
        // 백엔드 데이터 삭제
        console.log('백엔드에서 호스트 삭제 중...', hostId);
        
        const response = await fetch(`https://us-code-halmae-sonmat.onrender.com/api/hosts/${hostId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();
        console.log('백엔드 삭제 응답:', result);

        if (response.ok && result.success) {
          // 삭제 성공 후 전체 목록 새로고침
          await fetchHosts();
          alert(`"${hostToDelete.houseName || hostToDelete.name}" 할머니가 성공적으로 삭제되었습니다.`);
        } else {
          throw new Error(result.message || '호스트 삭제에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('할매 삭제 실패:', error);
      
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        alert('삭제하려는 호스트가 이미 삭제되었거나 존재하지 않습니다.\n목록을 새로고침합니다.');
        await fetchHosts();
      } else {
        alert(`삭제에 실패했습니다.\n오류: ${error.message}\n\n다시 시도해주세요.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="host-register-page">
        <div className="loading">
          <div>로딩 중...</div>
          <div style={{fontSize: '12px', marginTop: '10px', color: '#666'}}>
            백엔드에서 등록된 할머니 목록을 불러오고 있습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="host-register-page">
      <main className="host-register-main">
        <h1 className="page-title">할매 등록</h1>
        <div className="host-count-info">
          <span>총 {hosts.length}명의 할머니가 등록되어 있습니다.</span>
          <span style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}>
            (임시: {hosts.filter(h => h.isLocal).length}명, 백엔드: {hosts.filter(h => !h.isLocal).length}명)
          </span>
        </div>
        <div className="host-list">
          {hosts.map((host) => (
            <div className="host-card" key={`${host.isLocal ? 'local' : 'backend'}-${host.id}`}>
              {/* 삭제 버튼 - 데이터 출처에 따라 다른 스타일 */}
              <button 
                className={`delete-button ${host.isLocal ? 'local-delete' : 'backend-delete'}`}
                onClick={() => handleDeleteHost(host.id)}
                title={host.isLocal ? "임시 데이터 삭제" : "백엔드에서 완전 삭제"}
              >
                ×
              </button>
              
              {/* 데이터 출처 표시 */}
              <div className={`data-source-badge ${host.isLocal ? 'local' : 'backend'}`}>
                {host.isLocal ? '임시' : '백엔드'}
              </div>
              
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
                  {host.introduction || host.description || 
                   (host.personality ? `"${host.personality}" ${host.name || '할머니'}` : 
                    host.workExperience || '소개 없음')}
                </div>
                {/* 추가 정보 표시 (백엔드 데이터인 경우) */}
                {!host.isLocal && (
                  <div className="host-details">
                    {host.address && <div className="host-address">📍 {host.address}</div>}
                    {host.price && <div className="host-price">💰 {host.price}원/박</div>}
                    {host.latitude && host.longitude && (
                      <div className="host-coordinates" style={{fontSize: '11px', color: '#888'}}>
                        위치: {host.latitude.toFixed(4)}, {host.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                )}
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
          <button 
            className="refresh-button"
            onClick={() => {
              setLoading(true);
              fetchHosts();
            }}
            style={{marginLeft: '10px', background: '#f0f0f0', color: '#333'}}
          >
            목록 새로고침
          </button>
        </div>
      </main>
    </div>
  );
};

export default HostRegister;
