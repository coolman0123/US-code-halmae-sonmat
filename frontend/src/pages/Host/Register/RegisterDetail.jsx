import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterDetail.css';

const RegisterDetail = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    detailAddress: '',
    postcode: '',
    lat: '',
    lng: '',
    phone: '',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    amenities: {
      wifi: false,
      tv: false,
      kitchen: false,
      washer: false,
      freeParking: false,
      paidParking: false,
      airConditioner: false,
      workspace: false
    },
    photo: null,
    houseName: '', // 할머니 집 이름
    workExperience: '', // 체험 가능한 일손
    price: '' // 숙박비
  });

  const [mapInfo, setMapInfo] = useState({
    isLoaded: true, // 테스트를 위해 true로 설정
    address: '서울 용산구 남산공원길 105',
    coordinates: { lat: 37.5515, lng: 126.9885 }
  });

  // 카카오맵 초기화
  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          if (mapInfo.isLoaded && mapInfo.coordinates) {
            initializeMap(mapInfo.coordinates.lat, mapInfo.coordinates.lng, mapInfo.address);
          }
        });
      } else {
        console.log('카카오맵 API를 로딩 중입니다...');
        // 카카오맵 API가 로드될 때까지 대기
        setTimeout(loadKakaoMap, 100);
      }
    };

    loadKakaoMap();
  }, [mapInfo.isLoaded]);

  // 컴포넌트 마운트 시 localStorage에서 기본 정보 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem('hostRegisterData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      console.log('저장된 기본 정보 불러오기:', parsedData);
    }
  }, []);

  const initializeMap = (lat, lng, address) => {
    try {
      const container = document.getElementById('map');
      if (container && window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
        
        // 마커 표시
        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);

        // 인포윈도우 표시
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;width:200px;">${address}</div>`
        });
        infowindow.open(map, marker);
      }
    } catch (error) {
      console.error('지도 초기화 실패:', error);
    }
  };

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
      // 파일을 Base64 URL로 변환하여 저장
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result, // Base64 URL 저장
          photoFile: file // 파일 객체도 별도 저장 (필요시)
        }));
      };
      reader.readAsDataURL(file);
    }
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
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // localStorage에서 기본 정보 가져오기
      const savedData = localStorage.getItem('hostRegisterData');
      let basicInfo = {};
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        basicInfo = parsedData.basicInfo || {};
      }

      // 완전한 할매 정보 생성
      const completeHostData = {
        id: Date.now().toString(), // 임시 ID
        name: basicInfo.introduction || '새로운 할머니',
        houseName: formData.houseName,
        age: basicInfo.age,
        specialty: basicInfo.specialty,
        menu: basicInfo.menu,
        personality: basicInfo.personality,
        address: formData.address,
        phone: formData.phone,
        guests: formData.guests,
        bedrooms: formData.bedrooms,
        beds: formData.beds,
        amenities: formData.amenities,
        workExperience: formData.workExperience,
        price: formData.price,
        photo: formData.photo,
        createdAt: new Date().toISOString()
      };

      // 기존 할매 목록 가져오기
      const existingHosts = JSON.parse(localStorage.getItem('hostsList') || '[]');
      
      // 새 할매 정보 추가
      existingHosts.push(completeHostData);
      
      // localStorage에 저장
      localStorage.setItem('hostsList', JSON.stringify(existingHosts));
      
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
  };

  const updateMap = (lat, lng, address) => {
    console.log('지도 업데이트:', { lat, lng, address });
    
    // 지도 정보 상태 업데이트
    setMapInfo({
      isLoaded: true,
      address: address,
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
    });

    // 실제 지도 API 연동
    try {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          if (container) {
            const options = {
              center: new window.kakao.maps.LatLng(lat, lng),
              level: 3
            };
            const map = new window.kakao.maps.Map(container, options);
            
            // 마커 표시
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);

            // 인포윈도우 표시
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;font-size:12px;width:200px;">${address}</div>`
            });
            infowindow.open(map, marker);
          }
        });
      }
    } catch (error) {
      console.error('지도 업데이트 실패:', error);
    }
  };

  const handleAddressSearch = () => {
    console.log('주소 검색 버튼 클릭됨');
    
    // 다음 주소 API가 로드되었는지 확인
    if (!window.daum || !window.daum.Postcode) {
      console.error('다음 주소 API가 로드되지 않음');
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    console.log('다음 주소 API 호출 시작');

    // 다음 주소 검색 API 사용
    new window.daum.Postcode({
      oncomplete: function(data) {
        console.log('주소 검색 완료:', data);
        
        // 각 주소의 노출 규칙에 따라 주소를 조합한다
        let addr = ''; // 주소 변수

        //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다
        if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
          addr = data.roadAddress;
        } else { // 사용자가 지번 주소를 선택했을 경우(J)
          addr = data.jibunAddress;
        }

        // 기본 주소만 사용 (참고항목 제외)
        const fullAddress = addr;
        console.log('주소 정보:', {
          address: fullAddress,
          postcode: data.zonecode,
          lat: data.y,
          lng: data.x
        });

        // 주소 정보를 해당 필드에 넣는다
        setFormData(prev => ({
          ...prev,
          address: fullAddress,
          postcode: data.zonecode,
          // 지도 표시용 좌표 정보도 저장
          lat: data.y, // 위도
          lng: data.x  // 경도
        }));

        // 지도 업데이트
        updateMap(data.y, data.x, fullAddress);

        // 상세주소 입력 필드에 포커스를 준다
        const detailAddressInput = document.querySelector('input[name="detailAddress"]');
        if (detailAddressInput) {
          detailAddressInput.focus();
        }
      },
      onclose: function(state) {
        console.log('주소 검색창 닫힘:', state);
      }
    }).open();
  };

  return (
    <div className="register-detail-page">
      <main className="register-detail-main">
        <div className="detail-container">
          <form className="detail-form" onSubmit={handleSubmit}>
            
            {/* 주소 입력 섹션 */}
            <div className="section">
              <h3 className="section-title">주 소</h3>
              <div className="address-group">
                <div className="address-input-row">
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    className="postcode-input"
                    placeholder="우편번호"
                    readOnly
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="address-input"
                    placeholder="주소를 검색하세요"
                    readOnly
                    required
                  />
                  <button 
                    type="button" 
                    className="address-search-btn"
                    onClick={handleAddressSearch}
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  className="detail-address-input"
                  placeholder="상세주소를 입력하세요 (선택사항)"
                />
              </div>
              
              {/* 지도 영역 */}
              <div className="map-container">
                {mapInfo.isLoaded ? (
                  <div className="map-loaded">
                    <div id="map" style={{width: '100%', height: '100%'}}></div>
                  </div>
                ) : (
                  <div className="map-placeholder">
                    <span>지도가 표시될 영역</span>
                    <p>주소 검색 후 위치가 표시됩니다</p>
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
                      onClick={() => handleCountChange('guests', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.guests}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('guests', true)}
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
                      onClick={() => handleCountChange('bedrooms', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.bedrooms}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('bedrooms', true)}
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
                      onClick={() => handleCountChange('beds', false)}
                    >
                      −
                    </button>
                    <span className="counter-value">{formData.beds}</span>
                    <button 
                      type="button" 
                      className="counter-btn"
                      onClick={() => handleCountChange('beds', true)}
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
                    className={`amenity-item ${formData.amenities.wifi ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('wifi')}
                  >
                    <div className="amenity-icon">📶</div>
                    <span className="amenity-label">와이파이</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.tv ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('tv')}
                  >
                    <div className="amenity-icon">📺</div>
                    <span className="amenity-label">TV</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.kitchen ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('kitchen')}
                  >
                    <div className="amenity-icon">🍳</div>
                    <span className="amenity-label">주방</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.washer ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('washer')}
                  >
                    <div className="amenity-icon">🔄</div>
                    <span className="amenity-label">세탁기</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.freeParking ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('freeParking')}
                  >
                    <div className="amenity-icon">🚗</div>
                    <span className="amenity-label">건물 내 무료 주차</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.paidParking ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('paidParking')}
                  >
                    <div className="amenity-icon">😊</div>
                    <span className="amenity-label">건물 내/외 유료 주차</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.airConditioner ? 'selected' : ''}`}
                    onClick={() => handleAmenityToggle('airConditioner')}
                  >
                    <div className="amenity-icon">❄️</div>
                    <span className="amenity-label">에어컨</span>
                  </div>

                  <div 
                    className={`amenity-item ${formData.amenities.workspace ? 'selected' : ''}`}
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

            {/* 소개 섹션들 */}
            <div className="section">
              <h3 className="section-title">할머니 집 이름을 지어주세요</h3>
              <textarea
                name="houseName"
                value={formData.houseName}
                onChange={handleInputChange}
                className="textarea-input"
                placeholder="입력하세요.."
                rows="4"
              />
            </div>

            <div className="section">
              <h3 className="section-title">체험 가능한 일손을 작성해주세요</h3>
              <textarea
                name="workExperience"
                value={formData.workExperience}
                onChange={handleInputChange}
                className="textarea-input"
                placeholder="입력하세요.."
                rows="4"
              />
            </div>

            <div className="section">
              <h3 className="section-title">숙박비를 설정하세요</h3>
              <textarea
                name="price"
                value={formData.price}
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