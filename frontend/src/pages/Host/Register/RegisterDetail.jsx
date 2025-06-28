import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterDetail.css';

const RegisterDetail = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const mapContainerRef = useRef(null);

  const [mapState, setMapState] = useState({
    apiReady: false,
    isLoading: true,
    isSearching: false,
    error: null,
    mapInitialized: false
  });

  const [formData, setFormData] = useState({
    // 기본 정보
    address: '',
    detailAddress: '',
    lat: null,
    lng: null,
    phone: '',
    houseNickname: '',
    
    // 숙박 정보
    maxGuests: 1,
    bedroomCount: 1,
    bedCount: 1,
    
    // 편의시설
    amenities: [],
    
    // 사진
    photos: [],
    
    // 체험 및 요금
    experiences: '',
    accommodationFee: ''
  });

  const BACKEND_URL = 'https://us-code-halmae-sonmat.onrender.com';

  // Google Maps API 로딩 (지도 표시용)
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API 이미 로드됨');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDCFpWL0RLVqqgnRJqVmpjec9pnw7DAHeo&libraries=places&language=ko`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps API 로드 완료');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ Google Maps API 로드 실패:', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 (표시용)
  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('❌ Google Maps API가 로드되지 않음');
      return;
    }

    if (!mapContainerRef.current) {
      console.error('❌ 지도 컨테이너가 없음');
      return;
    }

    try {
      // 서울 시청 좌표로 초기화
      const defaultCenter = { lat: 37.5665, lng: 126.9780 };
      
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        mapTypeId: 'roadmap'
      });

      console.log('✅ 지도 초기화 완료');
      setMapState(prev => ({ ...prev, mapInitialized: true }));
    } catch (error) {
      console.error('❌ 지도 초기화 실패:', error);
      setMapState(prev => ({ ...prev, error: '지도 초기화에 실패했습니다.' }));
    }
  };

  // 백엔드 지오코딩 API 호출
  const searchAddressWithBackend = async (searchQuery) => {
    try {
      console.log('🔍 백엔드 지오코딩 요청:', searchQuery);
      
      const response = await axios.get(`${BACKEND_URL}/api/hosts/geocoding`, {
        params: { address: searchQuery }
      });

      console.log('✅ 백엔드 지오코딩 응답:', response.data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || '지오코딩 실패');
      }
    } catch (error) {
      console.error('❌ 백엔드 지오코딩 실패:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('지오코딩 요청 중 오류가 발생했습니다.');
      }
    }
  };

  // 지도에 위치 표시
  const displayLocationOnMap = (lat, lng, address, formattedAddress) => {
    try {
      if (!mapRef.current) {
        console.log('⚠️ 지도가 초기화되지 않음 - 지도 표시 건너뛰기');
        return;
      }

      const position = { lat: parseFloat(lat), lng: parseFloat(lng) };

      // 지도 중심 이동
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(17);

      // 기존 마커 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // 새 마커 생성
      markerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapRef.current,
        title: address,
        animation: window.google.maps.Animation.DROP
      });

      // 인포윈도우 생성
      infoWindowRef.current = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 300px;">
            <div style="font-weight: 600; color: #2c5530; margin-bottom: 8px;">
              📍 검색된 위치
            </div>
            <div style="font-size: 13px; margin-bottom: 6px;">
              <strong>주소:</strong> ${formattedAddress || address}
            </div>
            <div style="font-size: 12px; color: #666;">
              <strong>좌표:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </div>
          </div>
        `
      });

      // 인포윈도우 자동 열기
      setTimeout(() => {
        if (infoWindowRef.current && markerRef.current) {
          infoWindowRef.current.open(mapRef.current, markerRef.current);
        }
      }, 500);

      console.log('✅ 지도에 위치 표시 완료');
    } catch (error) {
      console.error('❌ 지도 위치 표시 실패:', error);
      // 지도 표시 실패해도 계속 진행
    }
  };

  // 주소 검색 핸들러
  const handleAddressSearch = async () => {
    const searchInput = document.querySelector('input[name="address"]');
    const searchQuery = searchInput.value.trim();
    
    // 입력 검증
    if (!searchQuery) {
      alert('주소를 입력해주세요.\n\n📍 정확한 입력 예시:\n• 선릉로 221\n• 강남대로 382\n• 테헤란로 14길 6');
      searchInput.focus();
      return;
    }

    // 검색 중 상태
    setMapState(prev => ({ ...prev, isSearching: true, error: null }));
    const searchButton = document.querySelector('.address-search-btn');
    const originalText = searchButton.textContent;
    searchButton.textContent = '🔍 검색 중...';
    searchButton.disabled = true;

    try {
      console.log('📍 주소 검색 요청:', searchQuery);
      
      const result = await searchAddressWithBackend(searchQuery);

      // 폼 데이터 업데이트
      setFormData(prev => ({
        ...prev,
        address: result.formattedAddress,
        lat: result.latitude,
        lng: result.longitude
      }));

      // 지도에 위치 표시 (지도가 초기화된 경우에만)
      if (mapState.mapInitialized) {
        displayLocationOnMap(
          result.latitude, 
          result.longitude, 
          result.address, 
          result.formattedAddress
        );
      }

      // 성공 메시지
      alert(`✅ 주소 검색이 완료되었습니다!\n\n🔍 검색어: ${searchQuery}\n📍 찾은 주소: ${result.formattedAddress}\n🌐 위도: ${result.latitude.toFixed(6)}\n🌐 경도: ${result.longitude.toFixed(6)}\n\n${mapState.mapInitialized ? '지도에서 정확한 위치를 확인하세요!' : '(지도 표시 건너뛰기)'}`);

      // 상세주소 입력으로 포커스 이동
      setTimeout(() => {
        const detailAddressInput = document.querySelector('input[name="detailAddress"]');
        if (detailAddressInput) {
          detailAddressInput.focus();
        }
      }, 100);

    } catch (error) {
      console.error('❌ 주소 검색 실패:', error);
      
      // 사용자에게 친화적인 오류 메시지
      let userMessage = '주소 검색에 실패했습니다.';
      
      if (error.message.includes('검색 결과가 없습니다')) {
        userMessage = `"${searchQuery}"에 대한 검색 결과가 없습니다.\n\n다른 주소로 시도해보세요.\n\n💡 검색 팁:\n• 도로명 주소 사용 (예: 선릉로 221)\n• 상세한 주소 입력\n• 건물명 대신 도로명 사용`;
      } else if (error.message.includes('API 사용량')) {
        userMessage = 'API 사용량 한도를 초과했습니다.\n잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('서버')) {
        userMessage = '서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.';
      }
      
      alert(`❌ ${userMessage}`);
      setMapState(prev => ({ ...prev, error: error.message }));
    } finally {
      // 검색 완료 상태 복원
      setMapState(prev => ({ ...prev, isSearching: false }));
      searchButton.textContent = originalText;
      searchButton.disabled = false;
    }
  };

  // 테스트 검색 핸들러
  const handleTestSearch = async () => {
    const searchInput = document.querySelector('input[name="address"]');
    searchInput.value = '선릉로 221';
    await handleAddressSearch();
  };

  // API 테스트 핸들러
  const handleAPITest = async () => {
    try {
      console.log('🧪 백엔드 API 테스트 시작');
      const result = await searchAddressWithBackend('선릉로 221');
      console.log('✅ API 테스트 성공:', result);
      alert(`✅ API 테스트 성공!\n\n주소: ${result.formattedAddress}\n위도: ${result.latitude}\n경도: ${result.longitude}`);
    } catch (error) {
      console.error('❌ API 테스트 실패:', error);
      alert(`❌ API 테스트 실패: ${error.message}`);
    }
  };

  // Enter 키 검색
  const handleAddressKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddressSearch();
    }
  };

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    let mounted = true;

    const initializeComponent = async () => {
      try {
        setMapState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Google Maps API 로드 (지도 표시용)
        await loadGoogleMapsAPI();
        
        if (!mounted) return;
        
        // 지도 초기화 (선택적)
        setTimeout(() => {
          if (mounted) {
            initializeMap();
          }
        }, 100);
        
        setMapState(prev => ({ 
          ...prev, 
          apiReady: true, 
          isLoading: false 
        }));
        
        console.log('✅ 컴포넌트 초기화 완료');
        
      } catch (error) {
        console.error('❌ 컴포넌트 초기화 실패:', error);
        if (mounted) {
          setMapState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: '초기화에 실패했습니다. 지도 없이 계속 진행할 수 있습니다.',
            apiReady: true  // 백엔드 API는 사용 가능
          }));
        }
      }
    };

    initializeComponent();

    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result,
          photoFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 2) {
      alert('최대 2장까지만 업로드할 수 있습니다.');
      return;
    }

    if (formData.photos.length + files.length > 2) {
      alert('최대 2장까지만 업로드할 수 있습니다.');
      return;
    }

    const processFiles = async () => {
      const newPhotos = [];
      
      for (const file of files) {
        const reader = new FileReader();
        const result = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
        
        newPhotos.push({
          id: Date.now() + Math.random(),
          url: result,
          file: file,
          name: file.name
        });
      }
      
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos]
      }));
    };

    processFiles();
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const handleCountChange = (field, increment) => {
    setFormData(prev => {
      const currentValue = prev[field];
      const newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
      return {
        ...prev,
        [field]: newValue
      };
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(item => item !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!formData.address || !formData.lat || !formData.lng) {
      alert('주소 검색을 먼저 완료해주세요.');
      return;
    }

      // 기존 할매 목록 가져오기
      const existingHosts = JSON.parse(localStorage.getItem('hostsList') || '[]');
      
      // 새 할매 정보 추가
      existingHosts.push(completeHostData);
      
      // localStorage에 저장
      localStorage.setItem('hostsList', JSON.stringify(existingHosts));
      
      // Stories 페이지 실시간 업데이트를 위한 커스텀 이벤트 발생
      window.dispatchEvent(new CustomEvent('hostRegistered', { 
        detail: { host: completeHostData } 
      }));
      
      console.log('할매 등록 완료:', completeHostData);
      alert('할매 등록이 완료되었습니다!');
      
      // 등록 데이터 정리
      localStorage.removeItem('hostRegisterData');
      
      // 할매 목록 페이지로 돌아가기
      navigate('/host');
    } catch (error) {
      console.error('할매 등록 실패:', error);
      alert('할매 등록에 실패했습니다. 다시 시도해주세요.');

    }

    if (!formData.houseNickname) {
      alert('할머니 집 이름을 입력해주세요.');
      return;
    }

    if (!formData.experiences) {
      alert('체험 가능한 일손을 입력해주세요.');
      return;
    }

    if (!formData.accommodationFee) {
      alert('숙박비를 입력해주세요.');
      return;
    }

    try {
      console.log('📤 백엔드로 할머니 등록 데이터 전송...');
      
              const hostData = {
          houseNickname: formData.houseNickname,
          hostIntroduction: formData.experiences,
          address: {
            detailAddress: formData.address + (formData.detailAddress ? ` ${formData.detailAddress}` : '')
          },
          latitude: parseFloat(formData.lat),
          longitude: parseFloat(formData.lng),
          contact: {
            phone: formData.phone
          },
          maxGuests: formData.maxGuests,
          bedroomCount: formData.bedroomCount,
          bedCount: formData.bedCount,
          amenities: formData.amenities, // 이미 배열 형태
          availableExperiences: formData.experiences,
          accommodationFee: parseFloat(formData.accommodationFee),
          housePhotos: formData.photos.map(photo => photo.url)
        };

      console.log('📤 전송할 데이터:', hostData);

      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/hosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostData)
      });

      const result = await response.json();
      console.log('📨 백엔드 응답:', result);

      if (response.ok && result.success) {
        alert(`✅ 할머니 등록이 완료되었습니다!\n\n📋 등록된 정보:\n• 집 이름: ${formData.houseNickname}\n• 주소: ${formData.address}\n• 위도/경도: ${formData.lat}, ${formData.lng}\n• 연락처: ${formData.phone}\n• 숙박비: ${formData.accommodationFee}원`);
        
        // 폼 초기화
        setFormData({
          address: '',
          detailAddress: '',
          lat: null,
          lng: null,
          phone: '',
          maxGuests: 1,
          bedroomCount: 1,
          bedCount: 1,
          amenities: [],
          photos: [],
          houseNickname: '',
          experiences: '',
          accommodationFee: ''
        });

        // 지도 초기화
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        if (mapRef.current) {
          mapRef.current.setCenter({ lat: 37.5665, lng: 126.9780 });
          mapRef.current.setZoom(11);
        }

        navigate('/host/register');
      } else {
        throw new Error(result.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 할머니 등록 실패:', error);
      alert(`❌ 등록에 실패했습니다.\n오류: ${error.message}\n\n다시 시도해주세요.`);
    }
  };

  return (
    <div className="register-detail-page">
      <main className="register-detail-main">
        <div className="detail-container">
          <form className="detail-form" onSubmit={handleSubmit}>
            
            {/* 주소 입력 섹션 */}
            <div className="section">
              <h3 className="section-title">📍 주 소</h3>
              
              {/* API 상태 표시 */}
              <div className="api-status">
                {mapState.apiReady ? (
                  <span className="status-ready">✅ Google Maps API 준비 완료</span>
                ) : (
                  <span className="status-loading">🔄 Google Maps API 로딩 중...</span>
                )}
                
                {/* 개발용 테스트 버튼 */}
                {mapState.apiReady && (
                  <button 
                    type="button" 
                    className="test-api-btn"
                    onClick={handleAPITest}
                    style={{marginLeft: '10px', fontSize: '12px', padding: '4px 8px'}}
                  >
                    API 테스트
                  </button>
                )}
              </div>

              {mapState.error && (
                <div className="error-message">
                  ⚠️ {mapState.error}
                </div>
              )}

              <div className="address-group">
                <div className="address-input-row">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onKeyPress={handleAddressKeyPress}
                    className="address-input full-width"
                    placeholder="정확한 도로명 주소를 입력하세요 (예: 선릉로 221)"
                    required
                  />
                  <button 
                    type="button" 
                    className="address-search-btn"
                    onClick={handleAddressSearch}
                    disabled={mapState.isSearching || !mapState.apiReady}
                  >
                    {mapState.isSearching ? '🔍 검색 중...' : '주소 검색'}
                  </button>
                </div>
                
                {/* 검색 도움말 */}
                <div className="address-help">
                  💡 <strong>검색 팁:</strong> 도로명 + 번지를 정확히 입력하세요
                  <br />
                  <small>
                    ✅ 좋은 예시: 선릉로 221, 강남대로 382, 테헤란로 14길 6
                    <br />
                    ❌ 피할 예시: 강남역, OO빌딩, 대략적인 지명
                  </small>
                </div>

                <input
                  type="text"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  className="detail-address-input"
                  placeholder="상세주소를 입력하세요 (예: 101동 1502호, 2층 등)"
                />
              </div>
              
              {/* 지도 영역 */}
              <div className="map-container">
                {mapState.mapInitialized ? (
                  <div className="map-loaded">
                    <div 
                      ref={mapContainerRef}
                      style={{width: '100%', height: '100%'}}
                    ></div>
                    {formData.lat && formData.lng && (
                      <div className="map-info">
                        📍 위치: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="map-placeholder">
                    <div className="map-loading">
                      {mapState.isLoading ? (
                        <>
                          <span>🔄 Google Maps 로딩 중...</span>
                          <p>지도 서비스를 불러오고 있습니다</p>
                        </>
                      ) : (
                        <>
                          <span>🗺️ 지도가 표시될 영역</span>
                          <p>주소 검색 후 정확한 위치가 표시됩니다</p>
                          {mapState.error && (
                            <small style={{color: '#e74c3c', display: 'block', marginTop: '8px'}}>
                              ⚠️ 지도 표시 실패: {mapState.error}
                            </small>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* 테스트 버튼 추가 */}
                    {mapState.apiReady && (
                      <div style={{marginTop: '15px'}}>
                        <button 
                          type="button" 
                          className="test-search-btn"
                          onClick={handleTestSearch}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginRight: '8px'
                          }}
                        >
                          🔍 "선릉로 221" 테스트 검색
                        </button>
                        <small style={{color: '#666', fontSize: '12px'}}>
                          (지오코딩 테스트용)
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 연락처 섹션 */}
            <div className="section">
              <h3 className="section-title">연락처</h3>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="연락처를 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 숙박 인원 섹션 */}
            <div className="section">
              <h3 className="section-title">숙박 가능한 인원은 몇 명인가요?</h3>
              <div className="guest-counter-container">
                <div className="guest-counter-row">
                  <span className="guest-label">게스트</span>
                  <div className="counter-controls">
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('maxGuests', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.maxGuests}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('maxGuests', true)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="guest-counter-row">
                  <span className="guest-label">침실</span>
                  <div className="counter-controls">
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('bedroomCount', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.bedroomCount}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('bedroomCount', true)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="guest-counter-row">
                  <span className="guest-label">침대</span>
                  <div className="counter-controls">
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('bedCount', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.bedCount}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('bedCount', true)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 편의시설 섹션 */}
            <div className="section">
              <h3 className="section-title">숙소 편의시설 정보를 추가하세요</h3>
              
              <div className="amenities-section">
                <div className="amenities-grid">
                  <div 
                    className={`amenity-item ${formData.amenities.includes('wifi') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('wifi')}
                  >
                    <div className="amenity-icon">📶</div>
                    <span className="amenity-label">와이파이</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('tv') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('tv')}
                  >
                    <div className="amenity-icon">📺</div>
                    <span className="amenity-label">TV</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('kitchen') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('kitchen')}
                  >
                    <div className="amenity-icon">🍳</div>
                    <span className="amenity-label">주방</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('washer') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('washer')}
                  >
                    <div className="amenity-icon">🔄</div>
                    <span className="amenity-label">세탁기</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('freeParking') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('freeParking')}
                  >
                    <div className="amenity-icon">🚗</div>
                    <span className="amenity-label">건물 내 무료 주차</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('paidParking') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('paidParking')}
                  >
                    <div className="amenity-icon">😊</div>
                    <span className="amenity-label">건물 내/외 유료 주차</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('airConditioner') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('airConditioner')}
                  >
                    <div className="amenity-icon">❄️</div>
                    <span className="amenity-label">에어컨</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.includes('workspace') ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('workspace')}
                  >
                    <div className="amenity-icon">💼</div>
                    <span className="amenity-label">업무 전용 공간</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 사진 업로드 섹션 */}
            <div className="section">
              <h3 className="section-title">할머니 집 사진 추가하기</h3>
              <div className="photo-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-label">
                    <div className="upload-icon">📷</div>
                    <span>사진 업로드</span>
                  </label>
                </div>
                {formData.photo && (
                  <div className="uploaded-file">
                    <div className="image-preview">
                      <img 
                        src={formData.photo} 
                        alt="업로드된 사진" 
                        style={{
                          width: '200px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    <span className="file-name">
                      📎 {formData.photoFile ? formData.photoFile.name : '업로드된 이미지'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 사진 업로드 섹션 */}
            <div className="section">
              <h3 className="section-title">관련 사진들</h3>
              <p className="section-description">사진을 2장 업로드 해주세요.</p>
              <div className="photo-upload">
                <div className="upload-area">
                  <input
                    type="file"
                    id="photos-upload"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photos-upload" className="upload-label">
                    <div className="upload-icon">📷</div>
                    <span>사진 업로드 ({formData.photos.length}/2)</span>
                  </label>
                </div>
                {formData.photos.map(photo => (
                  <div key={photo.id} className="uploaded-file">
                    <div className="image-preview">
                      <img 
                        src={photo.url} 
                        alt={`업로드된 사진 - ${photo.name}`} 
                        style={{
                          width: '200px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                    <span className="file-name">
                      📎 {photo.name}
                    </span>
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removePhoto(photo.id)}
                    >
                      제거
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 소개 섹션들 */}
            <div className="section">
              <h3 className="section-title">할머니 집 이름을 지어주세요</h3>
              <textarea
                name="houseNickname"
                value={formData.houseNickname}
                onChange={handleInputChange}
                className="textarea-input"
                placeholder="입력하세요.."
                rows="4"
              />
            </div>

            <div className="section">
              <h3 className="section-title">체험 가능한 일손을 작성해주세요</h3>
              <textarea
                name="experiences"
                value={formData.experiences}
                onChange={handleInputChange}
                className="textarea-input"
                placeholder="입력하세요.."
                rows="4"
              />
            </div>

            <div className="section">
              <h3 className="section-title">숙박비를 설정하세요</h3>
              <textarea
                name="accommodationFee"
                value={formData.accommodationFee}
                onChange={handleInputChange}
                className="textarea-input"
                placeholder="입력하세요.."
                rows="4"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="form-actions">
              <button type="submit" className="submit-button">
                할머니 등록 완료
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterDetail; 