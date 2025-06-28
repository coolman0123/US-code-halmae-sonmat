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
    mapInitialized: false,
    isFullscreen: false
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

  // PAGE1에서 저장된 기본 정보
  const [basicInfo, setBasicInfo] = useState({
    introduction: '',
    age: '',
    specialty: '',
    menu: '',
    personality: ''
  });

  const BACKEND_URL = 'http://localhost:5001';
  // Kakao Map API 키 - 환경변수에서 읽기
  const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_API_KEY || import.meta.env.VITE_KAKAO_MAP_API_KEY || '90ae47b29041df889ea6ef2d93c8520e';
  
  // localStorage에서 기본 정보 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('hostRegisterData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.basicInfo) {
          setBasicInfo(parsedData.basicInfo);
          console.log('✅ 기본 정보 불러옴:', parsedData.basicInfo);
        }
      } catch (error) {
        console.error('❌ localStorage 데이터 파싱 실패:', error);
      }
    }
  }, []);

  // API 키 유효성 검사
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY || KAKAO_MAP_API_KEY === '90ae47b29041df889ea6ef2d93c8520e') {
      console.warn('⚠️ Kakao API 키가 기본값이거나 설정되지 않았습니다.');
      console.warn('💡 frontend/.env 파일에 VITE_KAKAO_API_KEY=실제_API_키 를 설정해주세요.');
    } else {
      console.log('✅ Kakao API 키가 설정되었습니다.');
    }
  }, []);

  // Kakao Maps API 로딩 (지도 표시용 + 지오코딩용)
  const loadKakaoMapsAPI = () => {
    return new Promise((resolve, reject) => {
      // Kakao API 상태 확인 함수 (지오코딩 서비스 포함)
      const checkKakaoReady = () => {
        return window.kakao && 
               window.kakao.maps && 
               window.kakao.maps.LatLng && 
               window.kakao.maps.Map &&
               window.kakao.maps.Marker &&
               window.kakao.maps.services &&
               window.kakao.maps.services.Geocoder;
      };

      // 이미 완전히 로드된 경우
      if (checkKakaoReady()) {
        console.log('✅ Kakao Maps API 이미 완전히 로드됨');
        resolve();
        return;
      }

      console.log('🔍 Kakao API 현재 상태:', {
        kakao: !!window.kakao,
        maps: !!window.kakao?.maps,
        LatLng: !!window.kakao?.maps?.LatLng,
        Map: !!window.kakao?.maps?.Map,
        Marker: !!window.kakao?.maps?.Marker,
        services: !!window.kakao?.maps?.services,
        Geocoder: !!window.kakao?.maps?.services?.Geocoder
      });

      // 기존 스크립트가 있는지 확인
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      
      if (existingScript) {
        console.log('🔄 Kakao Maps API 스크립트 존재 - 완전 로딩 대기 중');
        
        // kakao.maps.load() 함수가 있으면 실행
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
          window.kakao.maps.load(() => {
            console.log('✅ 기존 스크립트 - Kakao Maps API 로드 완료');
            
            // 기존 스크립트에도 재시도 로직 적용
            let retryCount = 0;
            const maxRetries = 3;
            
            const checkAndRetry = () => {
              if (checkKakaoReady()) {
                console.log('✅ 기존 스크립트 - 모든 API 기능 확인 완료');
                resolve();
              } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(`🔄 기존 스크립트 - API 기능 체크 재시도 ${retryCount}/${maxRetries}`);
                setTimeout(checkAndRetry, 300 * retryCount);
              } else {
                // services가 없어도 지도 기본 기능이 있으면 진행
                if (window.kakao?.maps?.Map && window.kakao?.maps?.Marker) {
                  console.log('⚠️ 기존 스크립트 - 지도 기본 기능은 사용 가능');
                  resolve();
                } else {
                  reject(new Error('Kakao Maps API 로드 후에도 일부 기능이 없음'));
                }
              }
            };
            
            checkAndRetry();
          });
        } else {
          // 폴링 방식으로 완전 로딩 대기
          let pollCount = 0;
          const maxPolls = 50; // 10초
          
          const checkLoaded = setInterval(() => {
            pollCount++;
            if (checkKakaoReady()) {
              clearInterval(checkLoaded);
              console.log('✅ 폴링 - Kakao Maps API 완전 로드 확인');
              resolve();
            } else if (pollCount >= maxPolls) {
              clearInterval(checkLoaded);
              
              // 기본 기능이라도 있으면 진행
              if (window.kakao?.maps?.Map) {
                console.log('⚠️ 폴링 - 지도 기본 기능만 사용 가능');
                resolve();
              } else {
                console.error('❌ Kakao Maps API 로딩 타임아웃');
                reject(new Error('Kakao Maps API 로딩 타임아웃'));
              }
            }
          }, 200);
        }
        return;
      }

      // 새 스크립트 로드 (services 라이브러리 포함)
      console.log('📥 새 Kakao Maps API 스크립트 로딩 시작 (지오코딩 포함)');
      console.log('🔑 사용 중인 API 키:', KAKAO_MAP_API_KEY ? KAKAO_MAP_API_KEY.substring(0, 10) + '...' : '없음');
      
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('📦 Kakao Maps API 스크립트 로드됨');
        
        if (window.kakao && window.kakao.maps && window.kakao.maps.load) {
          window.kakao.maps.load(() => {
            console.log('✅ 새 스크립트 - Kakao Maps API 초기화 완료');
            
            // 완전 로딩 확인 (재시도 로직 포함)
            let retryCount = 0;
            const maxRetries = 5;
            
            const checkAndRetry = () => {
              if (checkKakaoReady()) {
                console.log('✅ 모든 Kakao API 기능 확인 완료');
                resolve();
              } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(`🔄 API 기능 체크 재시도 ${retryCount}/${maxRetries}`);
                setTimeout(checkAndRetry, 200 * retryCount);
              } else {
                console.error('❌ API 로드 후에도 일부 기능 누락 (최대 재시도 초과)');
                
                // 상세 진단
                console.log('🔍 상세 API 상태:', {
                  kakao: !!window.kakao,
                  maps: !!window.kakao?.maps,
                  LatLng: !!window.kakao?.maps?.LatLng,
                  Map: !!window.kakao?.maps?.Map,
                  Marker: !!window.kakao?.maps?.Marker,
                  services: !!window.kakao?.maps?.services,
                  Geocoder: !!window.kakao?.maps?.services?.Geocoder,
                  event: !!window.kakao?.maps?.event
                });
                
                // services가 없어도 지도 표시는 가능하므로 부분적으로 성공 처리
                if (window.kakao?.maps?.Map && window.kakao?.maps?.Marker) {
                  console.log('⚠️ 지도 기본 기능은 사용 가능 (지오코딩 제외)');
                  resolve();
                } else {
                  reject(new Error('Kakao Maps API 핵심 기능이 로드되지 않음'));
                }
              }
            };
            
            checkAndRetry();
          });
        } else {
          console.error('❌ kakao.maps.load 함수가 없음');
          reject(new Error('Kakao Maps API load 함수 없음'));
        }
      };
      
      script.onerror = (error) => {
        console.error('❌ Kakao Maps API 스크립트 로드 실패:', error);
        reject(new Error('Kakao Maps API 스크립트 로드 실패'));
      };
      
      document.head.appendChild(script);
      console.log('📄 새 Kakao Maps API 스크립트 DOM에 추가됨');
    });
  };

  // Kakao 지도 초기화 (표시용)
  const initializeMap = () => {
    console.log('🗺️ 지도 초기화 시작');
    
    // API 상태 상세 확인
    console.log('🔍 Kakao API 상세 상태:', {
      kakao: !!window.kakao,
      maps: !!window.kakao?.maps,
      LatLng: !!window.kakao?.maps?.LatLng,
      Map: !!window.kakao?.maps?.Map,
      Marker: !!window.kakao?.maps?.Marker,
      LatLngType: typeof window.kakao?.maps?.LatLng
    });
    
    if (!window.kakao || !window.kakao.maps) {
      console.error('❌ Kakao Maps API가 로드되지 않음');
      setMapState(prev => ({ ...prev, error: 'Kakao Maps API가 로드되지 않았습니다.' }));
      return;
    }

    if (!window.kakao.maps.LatLng) {
      console.error('❌ Kakao Maps LatLng 클래스가 없음');
      setMapState(prev => ({ ...prev, error: 'Kakao Maps LatLng 클래스가 로드되지 않았습니다.' }));
      return;
    }

    if (!mapContainerRef.current) {
      console.error('❌ 지도 컨테이너가 없음');
      setMapState(prev => ({ ...prev, error: '지도 컨테이너를 찾을 수 없습니다.' }));
      return;
    }

    try {
      console.log('📍 지도 컨테이너 확인:', mapContainerRef.current);
      console.log('📐 컨테이너 크기:', {
        width: mapContainerRef.current.offsetWidth,
        height: mapContainerRef.current.offsetHeight
      });

      // LatLng 생성자 테스트
      console.log('🧪 LatLng 생성자 테스트');
      const testLatLng = new window.kakao.maps.LatLng(37.5665, 126.9780);
      console.log('✅ LatLng 테스트 성공:', testLatLng);

      // 서울 시청 좌표로 초기화
      const defaultPosition = testLatLng;
      
      const options = {
        center: defaultPosition,
        level: 14, // 확대 레벨 (1~14, 숫자가 작을수록 확대)
        draggable: true, // 지도 드래그 가능
        scrollwheel: true, // 마우스 휠로 확대/축소 가능
        doubleClickZoom: true, // 더블클릭으로 확대 가능
        keyboardShortcuts: true // 키보드 단축키 사용 가능
      };

      console.log('🔧 지도 옵션:', options);
      
      // Map 생성자 테스트
      console.log('🧪 Map 생성자 테스트');
      mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);
      
      console.log('🗺️ 지도 객체 생성 성공:', mapRef.current);

      // 지도 로딩 완료 이벤트
      window.kakao.maps.event.addListener(mapRef.current, 'tilesloaded', () => {
        console.log('🎯 지도 타일 로딩 완료');
        setMapState(prev => ({ ...prev, mapInitialized: true, error: null }));
      });

      console.log('✅ Kakao 지도 초기화 완료');
      
      // 즉시 초기화 상태 업데이트
      setTimeout(() => {
        setMapState(prev => ({ ...prev, mapInitialized: true, error: null }));
      }, 1000);
      
    } catch (error) {
      console.error('❌ Kakao 지도 초기화 실패:', error);
      console.error('❌ 에러 상세:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      setMapState(prev => ({ 
        ...prev, 
        error: `Kakao 지도 초기화 실패: ${error.message}`,
        mapInitialized: false 
      }));
    }
  };

  // 백엔드 지오코딩 API 호출
  // 백엔드 카카오 지오코딩 API 호출
  const searchAddressWithBackend = async (searchQuery) => {
    try {
      console.log('🔍 백엔드 지오코딩 요청:', searchQuery);
      
      const response = await axios.get(`${BACKEND_URL}/api/hosts/geocoding`, {
        params: { address: searchQuery },
        timeout: 15000 // 15초 타임아웃
      });

      console.log('✅ 백엔드 지오코딩 응답:', response.data);

      if (response.data.success && response.data.data) {
        const { data } = response.data;
        console.log('📍 지오코딩 결과:', {
          address: data.formattedAddress,
          lat: data.latitude,
          lng: data.longitude
        });
        return data;
      } else {
        throw new Error(response.data.message || '지오코딩 결과를 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('❌ 백엔드 지오코딩 실패:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // 상세한 에러 메시지 처리
      let errorMessage = '지오코딩 요청 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'API 접근이 거부되었습니다. 관리자에게 문의하세요.';
      } else if (error.response?.status === 404) {
        errorMessage = '검색 결과가 없습니다. 다른 주소로 시도해보세요.';
      } else if (error.response?.status === 429) {
        errorMessage = 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Kakao 지도에 위치 표시
  const displayLocationOnMap = (lat, lng, address, formattedAddress) => {
    try {
      console.log('🗺️ Kakao 지도 마커 표시 시작:', { lat, lng, address });

      if (!window.kakao || !window.kakao.maps) {
        console.error('❌ Kakao Maps API가 로드되지 않음');
        return;
      }

      if (!mapRef.current) {
        console.log('⚠️ 지도가 초기화되지 않음 - 지도 표시 건너뛰기');
        return;
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error('❌ 유효하지 않은 좌표:', { lat, lng });
        return;
      }

      const position = new window.kakao.maps.LatLng(latitude, longitude);
      console.log('📍 마커 위치 생성:', position);

      // 지도 중심 이동 및 확대 (부드러운 애니메이션)
      mapRef.current.panTo(position); // 부드럽게 이동
      
      // 적절한 확대 레벨 설정 (마커가 잘 보이도록)
      setTimeout(() => {
        mapRef.current.setLevel(2); // 매우 자세한 레벨로 확대
      }, 300);

      // 기존 마커 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
        console.log('🗑️ 기존 마커 제거');
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        console.log('🗑️ 기존 인포윈도우 닫기');
      }

      // 새 마커 생성
      markerRef.current = new window.kakao.maps.Marker({
        position: position,
        map: mapRef.current
      });
      console.log('📌 새 마커 생성 완료');

      // 인포윈도우 내용 생성
      const infoContent = `
        <div style="padding: 15px; min-width: 280px; max-width: 350px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="font-weight: 700; color: #2c5530; margin-bottom: 10px; font-size: 15px; display: flex; align-items: center;">
            <span style="margin-right: 8px;">📍</span>
            <span>할머니 집 위치</span>
          </div>
          <div style="font-size: 13px; margin-bottom: 8px; line-height: 1.5; color: #333;">
            <strong style="color: #2c5530;">주소:</strong> ${formattedAddress || address}
          </div>
          <div style="font-size: 12px; color: #666; line-height: 1.4; background: #f8f9fa; padding: 8px; border-radius: 4px;">
            <strong>좌표:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
          </div>
          <div style="margin-top: 10px; font-size: 11px; color: #888; text-align: center;">
            클릭하여 닫기
          </div>
        </div>
      `;

      // 인포윈도우 생성
      infoWindowRef.current = new window.kakao.maps.InfoWindow({
        content: infoContent,
        removable: true
      });
      console.log('💬 인포윈도우 생성 완료');

      // 인포윈도우 자동 열기
      setTimeout(() => {
        if (infoWindowRef.current && markerRef.current) {
          infoWindowRef.current.open(mapRef.current, markerRef.current);
          console.log('💬 인포윈도우 자동 열기 완료');
        }
      }, 300);

      // 마커 클릭 시 인포윈도우 토글
      window.kakao.maps.event.addListener(markerRef.current, 'click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.open(mapRef.current, markerRef.current);
          console.log('💬 마커 클릭 - 인포윈도우 열기');
        }
      });

      console.log('✅ Kakao 지도에 마커 표시 완료!');
    } catch (error) {
      console.error('❌ Kakao 지도 위치 표시 실패:', error);
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
      
      // 프론트엔드 카카오 지오코딩 시도, 실패 시 백엔드로 폴백
      let result;
      try {
        console.log('🔍 프론트엔드 카카오 지오코딩 시도');
        result = await searchAddressWithKakao(searchQuery);
        console.log('✅ 프론트엔드 지오코딩 성공');
      } catch (frontendError) {
        console.warn('⚠️ 프론트엔드 지오코딩 실패, 백엔드로 폴백:', frontendError.message);
        result = await searchAddressWithBackend(searchQuery);
        console.log('✅ 백엔드 지오코딩 폴백 성공');
      }

      // 결과 검증
      if (!result || !result.latitude || !result.longitude) {
        throw new Error('유효하지 않은 지오코딩 결과입니다.');
      }

      // 폼 데이터 업데이트
      setFormData(prev => ({
        ...prev,
        address: result.formattedAddress,
        lat: result.latitude,
        lng: result.longitude
      }));

      // Kakao 지도에 위치 표시 (지도가 초기화된 경우에만)
      if (mapState.mapInitialized) {
        console.log('🗺️ Kakao 지도에 마커 표시 중...');
        displayLocationOnMap(
          result.latitude, 
          result.longitude, 
          result.address, 
          result.formattedAddress
        );
      } else {
        console.log('⚠️ Kakao 지도가 초기화되지 않아 마커 표시를 건너뜁니다.');
      }

      // 성공 메시지
      alert(`✅ 주소 검색이 완료되었습니다!\n\n🔍 검색어: ${searchQuery}\n📍 찾은 주소: ${result.formattedAddress}\n🌐 위도: ${result.latitude.toFixed(6)}\n🌐 경도: ${result.longitude.toFixed(6)}\n\n${mapState.mapInitialized ? '🗺️ Kakao 지도에서 정확한 위치를 확인하세요!' : '(지도 표시 건너뛰기)'}`);

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
        userMessage = `🔍 "${searchQuery}"에 대한 검색 결과가 없습니다.\n\n다른 주소로 시도해보세요.\n\n💡 검색 팁:\n• 도로명 주소 사용 (예: 선릉로 221)\n• 상세한 주소 입력\n• 건물명 대신 도로명 사용\n• 띄어쓰기 확인`;
      } else if (error.message.includes('API 사용량') || error.message.includes('한도')) {
        userMessage = '⏱️ API 사용량 한도를 초과했습니다.\n\n잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('서버') || error.message.includes('500')) {
        userMessage = '🔧 서버에 일시적 문제가 있습니다.\n\n잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('네트워크') || error.message.includes('연결')) {
        userMessage = '🌐 네트워크 연결을 확인해주세요.\n\n인터넷 연결 상태를 점검해보세요.';
      } else if (error.message.includes('시간 초과') || error.message.includes('timeout')) {
        userMessage = '⏰ 요청 시간이 초과되었습니다.\n\n다시 시도해주세요.';
      } else if (error.message.includes('API 키') || error.message.includes('접근이 거부')) {
        userMessage = '🔑 API 접근 권한 문제가 있습니다.\n\n관리자에게 문의하세요.';
      } else {
        userMessage = `❌ ${error.message}\n\n문제가 지속되면 관리자에게 문의하세요.`;
      }
      
      alert(userMessage);
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
      console.log('🧪 백엔드 카카오 지오코딩 API 테스트 시작');
      const result = await searchAddressWithBackend('선릉로 221');
      console.log('✅ 백엔드 API 테스트 성공:', result);
      alert(`✅ 백엔드 카카오 지오코딩 테스트 성공!\n\n주소: ${result.formattedAddress}\n도로명주소: ${result.roadAddress || '없음'}\n위도: ${result.latitude}\n경도: ${result.longitude}`);
    } catch (error) {
      console.error('❌ 백엔드 API 테스트 실패:', error);
      alert(`❌ 백엔드 카카오 지오코딩 테스트 실패: ${error.message}`);
    }
  };

  // 지도 강제 초기화 핸들러
  const handleMapReset = () => {
    try {
      console.log('🔄 지도 강제 초기화 시작');
      
      // 현재 API 상태 출력
      console.log('🔍 현재 Kakao API 상태:', {
        kakao: !!window.kakao,
        maps: !!window.kakao?.maps,
        LatLng: !!window.kakao?.maps?.LatLng,
        Map: !!window.kakao?.maps?.Map,
        Marker: !!window.kakao?.maps?.Marker,
        load: !!window.kakao?.maps?.load
      });
      
      setMapState(prev => ({ 
        ...prev, 
        mapInitialized: false, 
        isLoading: true, 
        error: null 
      }));
      
      // 기존 지도 정리
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      mapRef.current = null;
      
      // API 재로딩 후 지도 초기화
      setTimeout(async () => {
        try {
          console.log('🎯 API 재로딩 및 지도 재초기화 실행');
          await loadKakaoMapsAPI();
          initializeMap();
          setMapState(prev => ({ ...prev, isLoading: false }));
        } catch (error) {
          console.error('❌ API 재로딩 실패:', error);
          setMapState(prev => ({ 
            ...prev, 
            error: `API 재로딩 실패: ${error.message}`,
            isLoading: false 
          }));
        }
      }, 500);
      
    } catch (error) {
      console.error('❌ 지도 초기화 실패:', error);
      setMapState(prev => ({ 
        ...prev, 
        error: `지도 초기화 실패: ${error.message}`,
        isLoading: false 
      }));
    }
  };

  // API 상태 확인 핸들러 (디버깅용)
  const handleAPIStatus = () => {
    console.log('🔍 Kakao API 완전 상태 확인:');
    console.log('- window.kakao:', window.kakao);
    console.log('- window.kakao.maps:', window.kakao?.maps);
    console.log('- window.kakao.maps.LatLng:', window.kakao?.maps?.LatLng);
    console.log('- window.kakao.maps.Map:', window.kakao?.maps?.Map);
    console.log('- window.kakao.maps.Marker:', window.kakao?.maps?.Marker);
    console.log('- window.kakao.maps.services:', window.kakao?.maps?.services);
    console.log('- window.kakao.maps.services.Geocoder:', window.kakao?.maps?.services?.Geocoder);
    console.log('- window.kakao.maps.load:', window.kakao?.maps?.load);
    
    if (window.kakao?.maps?.LatLng) {
      try {
        const testLatLng = new window.kakao.maps.LatLng(37.5665, 126.9780);
        console.log('✅ LatLng 테스트 성공:', testLatLng);
      } catch (error) {
        console.error('❌ LatLng 테스트 실패:', error);
      }
    }

    if (window.kakao?.maps?.services?.Geocoder) {
      try {
        const testGeocoder = new window.kakao.maps.services.Geocoder();
        console.log('✅ Geocoder 테스트 성공:', testGeocoder);
      } catch (error) {
        console.error('❌ Geocoder 테스트 실패:', error);
      }
    }
    
    alert(`Kakao API 상태:\n- kakao: ${!!window.kakao}\n- maps: ${!!window.kakao?.maps}\n- LatLng: ${!!window.kakao?.maps?.LatLng}\n- Map: ${!!window.kakao?.maps?.Map}\n- Marker: ${!!window.kakao?.maps?.Marker}\n- services: ${!!window.kakao?.maps?.services}\n- Geocoder: ${!!window.kakao?.maps?.services?.Geocoder}`);
  };

  // 전체화면 지도 열기
  const handleFullscreenMap = () => {
    console.log('🔍 전체화면 지도 열기');
    setMapState(prev => ({ ...prev, isFullscreen: true }));
    
    // 전체화면 모달이 열린 후 지도 크기 재조정
    setTimeout(() => {
      if (mapRef.current) {
        window.kakao.maps.event.trigger(mapRef.current, 'resize');
        console.log('📐 전체화면 지도 크기 재조정 완료');
      }
    }, 100);
  };

  // 전체화면 지도 닫기
  const handleCloseFullscreenMap = () => {
    console.log('❌ 전체화면 지도 닫기');
    setMapState(prev => ({ ...prev, isFullscreen: false }));
    
    // 모달이 닫힌 후 원래 지도 크기 재조정
    setTimeout(() => {
      if (mapRef.current) {
        window.kakao.maps.event.trigger(mapRef.current, 'resize');
        console.log('📐 원래 지도 크기 재조정 완료');
      }
    }, 100);
  };

  // ESC 키로 전체화면 닫기 및 지도 위치 관리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mapState.isFullscreen) {
        handleCloseFullscreenMap();
      }
    };

    if (mapState.isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      // 전체화면일 때 body 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      
      // 전체화면이 닫힐 때 지도를 원래 컨테이너로 돌려놓기
      if (mapRef.current && mapContainerRef.current) {
        setTimeout(() => {
          try {
            const mapContainer = mapRef.current.getContainer();
            if (mapContainer && mapContainer.parentNode !== mapContainerRef.current) {
              mapContainerRef.current.appendChild(mapContainer);
              // 지도 크기 재조정
              window.kakao.maps.event.trigger(mapRef.current, 'resize');
              console.log('📐 지도를 원래 위치로 복원 완료');
            }
          } catch (error) {
            console.error('❌ 지도 복원 중 오류:', error);
          }
        }, 100);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [mapState.isFullscreen]);

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
    let initializationAttempts = 0;
    const maxAttempts = 3;

    const initializeComponent = async () => {
      try {
        setMapState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Kakao Maps API 로드 (지도 표시용)
        console.log('🚀 Kakao Maps API 로딩 시작');
        await loadKakaoMapsAPI();
        
        if (!mounted) return;
        
        console.log('✅ API 로딩 완료 - 지도 초기화 준비');
        
        setMapState(prev => ({ 
          ...prev, 
          apiReady: true
        }));
        
        // 지도 초기화 시도 (재시도 로직 포함)
        const attemptMapInitialization = () => {
          initializationAttempts++;
          console.log(`🎯 지도 초기화 시도 ${initializationAttempts}/${maxAttempts}`);
          
          if (!mounted) {
            console.warn('⚠️ 컴포넌트가 언마운트되어 초기화 중단');
            return;
          }
          
          if (!mapContainerRef.current) {
            console.warn('⚠️ 지도 컨테이너가 없음, 100ms 후 재시도');
            if (initializationAttempts < maxAttempts) {
              setTimeout(attemptMapInitialization, 100);
            } else {
              console.error('❌ 지도 컨테이너를 찾을 수 없음 - 최대 시도 횟수 초과');
              setMapState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: '지도 컨테이너를 찾을 수 없습니다.' 
              }));
            }
            return;
          }
          
          // 컨테이너 크기 확인
          const rect = mapContainerRef.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            console.warn('⚠️ 지도 컨테이너 크기가 0, 100ms 후 재시도');
            if (initializationAttempts < maxAttempts) {
              setTimeout(attemptMapInitialization, 100);
            } else {
              console.error('❌ 지도 컨테이너 크기 문제 - 최대 시도 횟수 초과');
              setMapState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: '지도 컨테이너 크기 문제가 있습니다.' 
              }));
            }
            return;
          }
          
          console.log('✅ 지도 컨테이너 준비 완료, 초기화 실행');
          console.log('📐 컨테이너 크기:', rect);
          
          try {
            initializeMap();
            setMapState(prev => ({ 
              ...prev, 
              isLoading: false 
            }));
          } catch (error) {
            console.error('❌ 지도 초기화 실패:', error);
            if (initializationAttempts < maxAttempts) {
              console.log(`🔄 ${100 * initializationAttempts}ms 후 재시도`);
              setTimeout(attemptMapInitialization, 100 * initializationAttempts);
            } else {
              setMapState(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: `지도 초기화 실패: ${error.message}` 
              }));
            }
          }
        };
        
        // DOM이 완전히 준비된 후 초기화 시작
        setTimeout(attemptMapInitialization, 100);
        
        console.log('✅ 컴포넌트 초기화 완료');
        
      } catch (error) {
        console.error('❌ 컴포넌트 초기화 실패:', error);
        if (mounted) {
          let errorMessage = 'Kakao 지도 초기화에 실패했습니다.';
          
          if (error.message.includes('로딩 타임아웃')) {
            errorMessage = '⏰ Kakao 지도 로딩 시간이 초과되었습니다. 네트워크를 확인해주세요.';
          } else if (error.message.includes('핵심 기능')) {
            errorMessage = '🔑 Kakao API 키를 확인해주세요. (.env 파일의 VITE_KAKAO_API_KEY)';
          } else if (KAKAO_MAP_API_KEY === '90ae47b29041df889ea6ef2d93c8520e') {
            errorMessage = '🔑 .env 파일에 VITE_KAKAO_API_KEY=실제_API_키 를 설정해주세요.';
          }
          
          setMapState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: errorMessage,
            apiReady: true  // 백엔드 API는 사용 가능
          }));
        }
      }
    };

    initializeComponent();

    return () => {
      mounted = false;
      console.log('🧹 컴포넌트 정리');
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

    // 기본 정보 검증
    if (!basicInfo.introduction || !basicInfo.age || !basicInfo.specialty || !basicInfo.menu || !basicInfo.personality) {
      alert('기본 정보가 누락되었습니다. 처음부터 다시 입력해주세요.');
      navigate('/host/register/new');
      return;
    }

    try {
      console.log('📤 백엔드로 할머니 등록 데이터 전송...');
      
      const hostData = {
        // PAGE1 데이터 (localStorage에서 가져온 데이터)
        hostIntroduction: basicInfo.introduction,
        age: parseInt(basicInfo.age) || 70,
        characteristics: basicInfo.specialty,
        representativeMenu: basicInfo.menu,
        personalitySummary: basicInfo.personality,
        
        // PAGE2 데이터
        address: {
          zipCode: '', // 우편번호는 현재 수집하지 않음
          detailAddress: formData.address + (formData.detailAddress ? ` ${formData.detailAddress}` : '')
        },
        latitude: parseFloat(formData.lat),
        longitude: parseFloat(formData.lng),
        contact: {
          phone: formData.phone
        },
        houseNickname: formData.houseNickname,
        maxGuests: parseInt(formData.maxGuests),
        bedroomCount: parseInt(formData.bedroomCount),
        bedCount: parseInt(formData.bedCount),
        amenities: formData.amenities,
        housePhotos: formData.photos.map(photo => photo.url || photo.file?.name || '사진'),
        availableExperiences: formData.experiences,
        accommodationFee: formData.accommodationFee
      };

      console.log('📤 전송할 데이터:', hostData);

      const response = await fetch(`${BACKEND_URL}/api/hosts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostData)
      });

      const result = await response.json();
      console.log('📨 백엔드 응답:', result);

      if (response.ok && result.success) {
        alert(`✅ 할머니 등록 완료!\n\n📋 등록된 정보:\n• 할머니 소개: ${basicInfo.introduction}\n• 연세: ${basicInfo.age}세\n• 집 이름: ${formData.houseNickname}\n• 주소: ${formData.address}${formData.detailAddress ? ' ' + formData.detailAddress : ''}\n• 위도/경도: ${formData.lat}, ${formData.lng}\n• 연락처: ${formData.phone}\n• 대표 메뉴: ${basicInfo.menu}\n• 숙박비: ${formData.accommodationFee}원\n• 최대 인원: ${formData.maxGuests}명\n• 편의시설: ${formData.amenities.length}개\n\n🏠 카카오 지오코딩으로 정확한 위치가 설정되었습니다!`);
        
        // localStorage 정리
        localStorage.removeItem('hostRegisterData');
        
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

        setBasicInfo({
          introduction: '',
          age: '',
          specialty: '',
          menu: '',
          personality: ''
        });

        // Kakao 지도 초기화
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        if (mapRef.current && window.kakao && window.kakao.maps) {
          const defaultPosition = new window.kakao.maps.LatLng(37.5665, 126.9780);
          mapRef.current.setCenter(defaultPosition);
          mapRef.current.setLevel(6);
        }

        // 등록 성공 후 호스트 관리 페이지로 이동
        setTimeout(() => {
          navigate('/host/register');
        }, 2000);
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
                  <span className="status-ready">✅ Kakao Maps + 지오코딩 API 준비 완료</span>
                ) : (
                  <span className="status-loading">🔄 Kakao Maps + 지오코딩 API 로딩 중...</span>
                )}
                
                {/* 개발용 테스트 버튼 */}
                {mapState.apiReady && (
                  <>
                    <button 
                      type="button" 
                      className="test-api-btn"
                      onClick={handleAPITest}
                      style={{marginLeft: '10px', fontSize: '12px', padding: '4px 8px'}}
                    >
                      백엔드 지오코딩 테스트
                    </button>
                    <button 
                      type="button" 
                      className="test-api-btn"
                      onClick={handleMapReset}
                      style={{marginLeft: '8px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#e74c3c'}}
                    >
                      지도 재시작
                    </button>
                    <button 
                      type="button" 
                      className="test-api-btn"
                      onClick={handleAPIStatus}
                      style={{marginLeft: '8px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#3498db'}}
                    >
                      API 상태
                    </button>
                  </>
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
              <div className="map-container" style={{position: 'relative'}}>
                {/* 항상 표시되는 지도 컨테이너 */}
                <div 
                  ref={mapContainerRef}
                  style={{
                    width: '100%', 
                    height: '350px',
                    minHeight: '350px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    position: 'relative',
                    zIndex: 1
                  }}
                ></div>
                
                {/* 전체화면 버튼 */}
                {mapState.mapInitialized && (
                  <button
                    type="button"
                    className="fullscreen-btn"
                    onClick={handleFullscreenMap}
                    title="전체화면으로 지도 보기"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '40px',
                      height: '40px',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    🔍
                  </button>
                )}

                {/* 지도 위치 정보 */}
                {formData.lat && formData.lng && (
                  <div className="map-info">
                    📍 위치: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
                  </div>
                )}
                
                {/* 로딩/에러 오버레이 (지도가 준비되지 않은 경우에만) */}
                {!mapState.mapInitialized && (
                  <div 
                    className="map-overlay" 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(248, 249, 250, 0.95)',
                      zIndex: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '8px'
                    }}
                  >
                    <div className="map-loading">
                      {mapState.isLoading ? (
                        <>
                          <span>🔄 Kakao Maps 로딩 중...</span>
                          <p>지도 서비스를 불러오고 있습니다</p>
                        </>
                      ) : (
                        <>
                          <span>🗺️ Kakao 지도가 표시될 영역</span>
                          <p>주소 검색 후 정확한 위치가 표시됩니다</p>
                          {mapState.error && (
                            <small style={{color: '#e74c3c', display: 'block', marginTop: '8px'}}>
                              ⚠️ 지도 표시 실패: {mapState.error}
                            </small>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* 테스트 버튼 */}
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
                        <button 
                          type="button" 
                          className="test-api-btn"
                          onClick={handleMapReset}
                          style={{marginLeft: '8px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#e74c3c'}}
                        >
                          지도 재시작
                        </button>
                        <button 
                          type="button" 
                          className="test-api-btn"
                          onClick={handleAPIStatus}
                          style={{marginLeft: '8px', fontSize: '12px', padding: '4px 8px', backgroundColor: '#3498db'}}
                        >
                          API 상태
                        </button>
                        <br />
                        <small style={{color: '#666', fontSize: '12px'}}>
                          (디버깅 도구)
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

      {/* 전체화면 지도 모달 */}
      {mapState.isFullscreen && (
        <div 
          className="fullscreen-modal"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={handleCloseFullscreenMap}
        >
          {/* 모달 헤더 */}
          <div 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#2c5530' }}>
                🗺️ 전체화면 지도
              </span>
              {formData.lat && formData.lng && (
                <span style={{ fontSize: '14px', color: '#666' }}>
                  📍 {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
                </span>
              )}
            </div>
            <button
              onClick={handleCloseFullscreenMap}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '50%',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title="전체화면 닫기 (ESC)"
            >
              ❌
            </button>
          </div>

          {/* 전체화면 지도 컨테이너 */}
          <div 
            style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#f8f9fa'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                width: '100%',
                height: '100%',
                minHeight: '400px'
              }}
              ref={(el) => {
                if (el && mapState.isFullscreen && mapRef.current) {
                  // 전체화면 모달이 열릴 때 지도를 모달 컨테이너로 이동
                  if (!el.firstChild) {
                    el.appendChild(mapRef.current.getContainer());
                    // 지도 크기 재조정
                    setTimeout(() => {
                      window.kakao.maps.event.trigger(mapRef.current, 'resize');
                    }, 100);
                  }
                }
              }}
            />
            
            {/* 전체화면에서의 컨트롤 */}
            <div 
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '10px 20px',
                borderRadius: '25px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
                💡 지도를 드래그하거나 스크롤하여 확대/축소할 수 있습니다
              </span>
              <span style={{ fontSize: '12px', color: '#666' }}>
                ESC 키로 닫기
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterDetail; 