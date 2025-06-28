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

  const BACKEND_URL = 'http://localhost:5001';

  // Google Maps API 로딩 (지도 표시용)
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps API 이미 로드됨');
        resolve();
        return;
      }

      // 기존 스크립트 제거 (중복 방지)
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      // 원래 API 키로 복원하고 로딩 방식 개선
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDQJbMWl9D5oa4ISEKnxSRnJfW7PaRpc2U&libraries=places&language=ko&callback=initGoogleMaps&loading=async`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      // 전역 콜백 함수 설정
      window.initGoogleMaps = () => {
        console.log('✅ Google Maps API 로드 완료 (콜백)');
        delete window.initGoogleMaps; // 콜백 함수 정리
        resolve();
      };
      
      script.onerror = (error) => {
        console.error('❌ Google Maps API 로드 실패:', error);
        delete window.initGoogleMaps;
        reject(new Error('Google Maps API 로드에 실패했습니다. 네트워크 연결과 API 키를 확인하세요.'));
      };
      
      // 타임아웃 설정 (15초)
      const timeout = setTimeout(() => {
        console.error('❌ Google Maps API 로드 타임아웃');
        delete window.initGoogleMaps;
        reject(new Error('Google Maps API 로드 시간이 초과되었습니다.'));
      }, 15000);
      
      script.onload = () => {
        clearTimeout(timeout);
      };
      
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 (표시용)
  const initializeMap = () => {
    if (!window.google || !window.google.maps) {
      console.error('❌ Google Maps API가 로드되지 않음');
      setMapState(prev => ({ ...prev, error: 'Google Maps API가 로드되지 않았습니다.' }));
      return false;
    }

    if (!mapContainerRef.current) {
      console.error('❌ 지도 컨테이너가 없음');
      setMapState(prev => ({ ...prev, error: '지도 컨테이너를 찾을 수 없습니다.' }));
      return false;
    }

    try {
      console.log('🗺️ Google Maps 초기화 시작...');
      
      // 컨테이너 크기 강제 설정 (중요!)
      const container = mapContainerRef.current;
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.minHeight = '350px';
      
      // 컨테이너가 DOM에 완전히 렌더링될 때까지 대기
      const containerRect = container.getBoundingClientRect();
      console.log('📏 지도 컨테이너 크기:', containerRect.width, 'x', containerRect.height);
      
      if (containerRect.width === 0 || containerRect.height === 0) {
        console.warn('⚠️ 지도 컨테이너 크기가 0입니다. 강제로 크기를 설정합니다.');
        container.style.width = '100%';
        container.style.height = '350px';
        container.style.display = 'block';
      }
      
      // 서울 시청 좌표로 초기화
      const defaultCenter = { lat: 37.5665, lng: 126.9780 };
      
      const mapOptions = {
        center: defaultCenter,
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        mapTypeControl: false, // 일단 간소화
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
        backgroundColor: '#f5f5f5'
      };
      
      console.log('🗺️ 지도 인스턴스 생성 중...');
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, mapOptions);

      // 지도 로드 완료 이벤트 리스너
      let isInitialized = false;
      const idleListener = window.google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
        if (!isInitialized) {
          isInitialized = true;
          console.log('✅ Google Maps 렌더링 완료');
          setMapState(prev => ({ ...prev, mapInitialized: true, error: null }));
        }
      });

      // 추가 안전장치: 타이머로도 초기화 완료 설정
      setTimeout(() => {
        if (!isInitialized && mapRef.current) {
          isInitialized = true;
          console.log('✅ Google Maps 렌더링 완료 (타이머)');
          setMapState(prev => ({ ...prev, mapInitialized: true, error: null }));
        }
      }, 2000);

      console.log('✅ Google Maps 인스턴스 생성 완료');
      return true;
    } catch (error) {
      console.error('❌ 지도 초기화 실패:', error);
      setMapState(prev => ({ ...prev, error: `지도 초기화 실패: ${error.message}` }));
      return false;
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
      console.log('📍 지도에 마커 표시 시도:', { lat, lng, address });

      // Google Maps API 및 지도 인스턴스 확인
      if (!window.google || !window.google.maps) {
        console.log('⚠️ Google Maps API가 로드되지 않음 - 마커 표시 건너뛰기');
        return;
      }

      if (!mapRef.current) {
        console.log('⚠️ 지도가 초기화되지 않음 - 마커 표시 건너뛰기');
        return;
      }

      const position = { 
        lat: parseFloat(lat), 
        lng: parseFloat(lng) 
      };

      // 좌표 유효성 검사
      if (isNaN(position.lat) || isNaN(position.lng)) {
        console.error('❌ 잘못된 좌표값:', { lat, lng });
        return;
      }

      console.log('✅ 유효한 좌표 확인:', position);

      // 지도 중심 이동 및 줌 설정
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(17);

      // 기존 마커 및 인포윈도우 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      // 새 마커 생성
      try {
        markerRef.current = new window.google.maps.Marker({
          position: position,
          map: mapRef.current,
          title: formattedAddress || address,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        console.log('✅ 마커 생성 완료:', markerRef.current ? 'Success' : 'Failed');
        
        // 마커 위치 확인 (안전하게)
        setTimeout(() => {
          if (markerRef.current && markerRef.current.getPosition) {
            const markerPosition = markerRef.current.getPosition();
            if (markerPosition) {
              console.log('📍 마커 최종 위치:', markerPosition.lat(), markerPosition.lng());
            }
          }
        }, 200);

        // 인포윈도우 생성
        const infoContent = `
          <div style="padding: 15px; max-width: 300px; font-family: Arial, sans-serif;">
            <div style="font-weight: 600; color: #2c5530; margin-bottom: 10px; font-size: 14px;">
              📍 검색된 위치
            </div>
            <div style="font-size: 13px; margin-bottom: 8px; line-height: 1.4;">
              <strong style="color: #333;">주소:</strong><br>
              ${formattedAddress || address}
            </div>
            <div style="font-size: 12px; color: #666; line-height: 1.3;">
              <strong>좌표:</strong> ${lat.toFixed(6)}, ${lng.toFixed(6)}
            </div>
          </div>
        `;

        infoWindowRef.current = new window.google.maps.InfoWindow({
          content: infoContent
        });

        // 마커 클릭 이벤트 추가
        if (markerRef.current) {
          window.google.maps.event.addListener(markerRef.current, 'click', () => {
            if (infoWindowRef.current) {
              infoWindowRef.current.open(mapRef.current, markerRef.current);
            }
          });
        }

        // 인포윈도우 자동 열기 (약간의 딜레이)
        setTimeout(() => {
          if (infoWindowRef.current && markerRef.current && mapRef.current) {
            infoWindowRef.current.open(mapRef.current, markerRef.current);
            console.log('✅ 인포윈도우 열기 완료');
          }
        }, 800);

      } catch (markerError) {
        console.error('❌ 마커 생성 실패:', markerError);
        return;
      }

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

      // 지도에 위치 표시
      console.log('🔍 주소 검색 성공, 지도 상태 확인:', { 
        mapInitialized: mapState.mapInitialized, 
        hasMapRef: !!mapRef.current,
        hasGoogleMaps: !!(window.google && window.google.maps)
      });

      if (mapState.mapInitialized && mapRef.current) {
        // 지도가 이미 초기화된 경우 바로 마커 표시
        displayLocationOnMap(
          result.latitude, 
          result.longitude, 
          result.address, 
          result.formattedAddress
        );
      } else if (window.google && window.google.maps && mapContainerRef.current) {
        // 지도가 아직 초기화되지 않았지만 Google Maps API는 로드된 경우
        console.log('🔄 지도 재초기화 후 마커 표시 시도');
        const success = initializeMap();
        if (success) {
          // 지도 초기화 완료 후 마커 표시
          setTimeout(() => {
            displayLocationOnMap(
              result.latitude, 
              result.longitude, 
              result.address, 
              result.formattedAddress
            );
          }, 1000);
        }
      } else {
        console.log('⚠️ 지도 표시 불가 - Google Maps API 또는 지도 컨테이너 없음');
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
    let initializationAttempts = 0;
    const maxAttempts = 3;

    const attemptMapInitialization = async () => {
      if (!mounted || initializationAttempts >= maxAttempts) return;
      
      initializationAttempts++;
      console.log(`🗺️ 지도 초기화 시도 ${initializationAttempts}/${maxAttempts}`);

      // 더 엄격한 조건 확인
      const readyChecks = {
        mounted: mounted,
        container: !!mapContainerRef.current,
        googleApi: !!(window.google && window.google.maps),
        mapClass: !!(window.google && window.google.maps && window.google.maps.Map)
      };
      
      console.log('🔍 준비 상태 체크:', readyChecks);

      if (readyChecks.mounted && readyChecks.container && readyChecks.googleApi && readyChecks.mapClass) {
        // 컨테이너가 화면에 표시되고 크기가 있는지 확인
        const containerRect = mapContainerRef.current.getBoundingClientRect();
        if (containerRect.width > 0 && containerRect.height > 0) {
          const success = initializeMap();
          if (success) {
            console.log('✅ 지도 초기화 성공!');
            return;
          }
        } else {
          console.log('⚠️ 지도 컨테이너 크기가 아직 설정되지 않음:', containerRect);
        }
      }

      // 실패 시 재시도
      if (initializationAttempts < maxAttempts) {
        const delay = Math.min(1000 * initializationAttempts, 3000); // 최대 3초
        console.log(`⚠️ 지도 초기화 실패, ${delay}ms 후 재시도...`);
        setTimeout(attemptMapInitialization, delay);
      } else {
        console.log('❌ 지도 초기화 최대 시도 횟수 초과');
        if (mounted) {
          setMapState(prev => ({ 
            ...prev, 
            error: '지도 초기화에 실패했습니다. "지도 다시 로드" 버튼을 클릭하거나 주소 검색을 시도해보세요.'
          }));
        }
      }
    };

    const initializeComponent = async () => {
      try {
        console.log('🚀 컴포넌트 초기화 시작');
        setMapState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // 백엔드 API는 항상 사용 가능
        setMapState(prev => ({ ...prev, apiReady: true }));
        
        try {
          // Google Maps API 로드
          console.log('🔄 Google Maps API 로드 시작...');
          await loadGoogleMapsAPI();
          
          if (!mounted) return;
          console.log('✅ Google Maps API 로드 완료');
          
          // API 로드 후 추가 확인
          let apiReadyCount = 0;
          const checkApiReady = () => {
            apiReadyCount++;
            if (window.google && window.google.maps && window.google.maps.Map) {
              console.log('✅ Google Maps 클래스 사용 가능');
              // 지도 초기화 시도 (충분한 딜레이)
              setTimeout(attemptMapInitialization, 800);
            } else if (apiReadyCount < 10) {
              console.log(`⏳ Google Maps 클래스 대기 중... (${apiReadyCount}/10)`);
              setTimeout(checkApiReady, 200);
            } else {
              console.error('❌ Google Maps 클래스 로드 실패');
              setMapState(prev => ({ 
                ...prev, 
                error: 'Google Maps API 로드는 완료되었지만 클래스 초기화에 실패했습니다.'
              }));
            }
          };
          
          checkApiReady();
          
        } catch (mapError) {
          console.error('❌ Google Maps API 로드 실패:', mapError);
          if (mounted) {
            setMapState(prev => ({ 
              ...prev, 
              error: `Google Maps 로드 실패: ${mapError.message}`
            }));
          }
        }
        
        setMapState(prev => ({ 
          ...prev, 
          isLoading: false 
        }));
        
        console.log('✅ 컴포넌트 초기화 완료');
        
      } catch (error) {
        console.error('❌ 컴포넌트 초기화 실패:', error);
        if (mounted) {
          setMapState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: '컴포넌트 초기화에 실패했습니다. 주소 검색은 여전히 사용할 수 있습니다.',
            apiReady: true  // 백엔드 API는 사용 가능
          }));
        }
      }
    };

    initializeComponent();

    return () => {
      mounted = false;
      // 정리 작업
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
      // Google Maps 콜백 정리
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
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

    if (!formData.phone) {
      alert('연락처를 입력해주세요.');
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
                <div className="map-loaded">
                  <div 
                    ref={mapContainerRef}
                    style={{
                      width: '100%', 
                      height: '100%', 
                      minHeight: '350px',
                      display: 'block',
                      backgroundColor: '#f5f5f5'
                    }}
                  ></div>
                  
                  {/* 로딩 오버레이 */}
                  {mapState.isLoading && (
                    <div className="map-overlay">
                      <div className="map-loading-overlay">
                        <span>🔄 Google Maps 로딩 중...</span>
                        <p>지도 서비스를 불러오고 있습니다</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 지도 초기화 실패 시 오버레이 */}
                  {!mapState.mapInitialized && !mapState.isLoading && (
                    <div className="map-overlay">
                      <div className="map-placeholder-overlay">
                        <span>🗺️ 지도를 초기화하고 있습니다</span>
                        <p>잠시만 기다려주세요</p>
                        {mapState.error && (
                          <small style={{color: '#e74c3c', display: 'block', marginTop: '8px'}}>
                            ⚠️ {mapState.error}
                          </small>
                        )}
                        
                        {/* 수동 초기화 및 테스트 버튼 */}
                        <div style={{marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button 
                              type="button" 
                              onClick={async () => {
                                console.log('🔄 수동 지도 초기화 시도');
                                setMapState(prev => ({ ...prev, isLoading: true, error: null }));
                                
                                try {
                                  // Google Maps API 재로드 시도
                                  if (!window.google || !window.google.maps) {
                                    console.log('🔄 Google Maps API 재로드');
                                    await loadGoogleMapsAPI();
                                  }
                                  
                                  setTimeout(() => {
                                    const success = initializeMap();
                                    setMapState(prev => ({ ...prev, isLoading: false }));
                                    
                                    if (success) {
                                      console.log('✅ 수동 지도 초기화 성공');
                                    } else {
                                      console.log('❌ 수동 지도 초기화 실패');
                                    }
                                  }, 500);
                                  
                                } catch (error) {
                                  console.error('❌ 수동 초기화 중 오류:', error);
                                  setMapState(prev => ({ 
                                    ...prev, 
                                    isLoading: false, 
                                    error: `초기화 실패: ${error.message}` 
                                  }));
                                }
                              }}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              🗺️ 지도 다시 로드
                            </button>
                            
                            {mapState.apiReady && (
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
                                  fontSize: '13px'
                                }}
                              >
                                🔍 테스트 검색
                              </button>
                            )}
                          </div>
                          
                          <small style={{color: '#666', fontSize: '12px', textAlign: 'center'}}>
                            지도 로드에 실패한 경우 위 버튼을 클릭하거나<br/>
                            주소 검색을 하면 자동으로 재시도됩니다
                          </small>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 좌표 정보 표시 */}
                  {formData.lat && formData.lng && (
                    <div className="map-info">
                      📍 위치: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
                    </div>
                  )}
                </div>
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