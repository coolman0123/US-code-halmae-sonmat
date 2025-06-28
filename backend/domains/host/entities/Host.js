class Host {
  constructor({ 
    id, 
    // PAGE1 정보
    hostIntroduction,      // 호스트 한줄 소개
    age,                   // 연세
    characteristics,       // 특징
    representativeMenu,    // 대표 메뉴
    personalitySummary,    // 성격 한 줄 요약
    
    // PAGE2 정보
    address,               // 주소 정보 (우편번호, 상세주소 포함)
    latitude,              // 위도
    longitude,             // 경도
    contact,               // 연락처
    houseNickname,         // HOST 집 닉네임
    maxGuests,             // 숙박가능인원
    bedroomCount,          // 침실개수
    bedCount,              // 침대개수
    amenities,             // 숙소 편의시설 정보
    housePhotos,           // 집 사진 3장
    availableExperiences,  // 체험 가능한 일손 작성
    accommodationFee,      // 숙박비
    
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    
    // PAGE1 정보
    this.hostIntroduction = hostIntroduction;
    this.age = age;
    this.characteristics = characteristics;
    this.representativeMenu = representativeMenu;
    this.personalitySummary = personalitySummary;
    
    // PAGE2 정보
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.contact = contact;
    this.houseNickname = houseNickname;
    this.maxGuests = maxGuests;
    this.bedroomCount = bedroomCount;
    this.bedCount = bedCount;
    this.amenities = amenities;
    this.housePhotos = housePhotos;
    this.availableExperiences = availableExperiences;
    this.accommodationFee = accommodationFee;
    
    this.createdAt = createdAt ?? new Date();  
    this.updatedAt = updatedAt ?? new Date();   
    this.validate();
  }

  validate() {
    // PAGE1 필수 필드 검증
    if (!this.hostIntroduction) throw new Error('호스트 한줄 소개는 필수입니다.');
    if (!this.age) throw new Error('연세는 필수입니다.');
    if (!this.characteristics) throw new Error('특징은 필수입니다.');
    if (!this.representativeMenu) throw new Error('대표 메뉴는 필수입니다.');
    if (!this.personalitySummary) throw new Error('성격 한 줄 요약은 필수입니다.');
    
    // PAGE2 필수 필드 검증
    if (!this.address || !this.address.zipCode || !this.address.detailAddress) {
      throw new Error('주소 정보(우편번호, 상세주소)는 필수입니다.');
    }
    //if (!this.latitude || !this.longitude) {
    //  throw new Error('위도, 경도 정보는 필수입니다.');
    //}
    if (!this.contact || !this.contact.phone) throw new Error('연락처는 필수입니다.');
    if (!this.houseNickname) throw new Error('HOST 집 닉네임은 필수입니다.');
    if (!this.maxGuests || this.maxGuests <= 0) throw new Error('숙박가능인원은 1명 이상이어야 합니다.');
    
    // 침실개수와 침대개수 검증
    if (!this.bedroomCount || this.bedroomCount <= 0) throw new Error('침실개수는 1개 이상이어야 합니다.');
    if (!this.bedCount || this.bedCount <= 0) throw new Error('침대개수는 1개 이상이어야 합니다.');
    
    // 편의시설 검증
    if (!this.amenities || this.amenities.length === 0) throw new Error('숙소 편의시설 정보는 필수입니다.');
    
    // 허용되는 편의시설 목록
    const allowedAmenities = [
      '와이파이',
      'TV', 
      '주방',
      '세탁기',
      '건물 내 무료 주차',
      '건물 내/외 유료 주차',
      '에어컨',
      '업무 전용 공간'
    ];
    
    // 유효하지 않은 편의시설 체크
    const invalidAmenities = this.amenities.filter(amenity => !allowedAmenities.includes(amenity));
    if (invalidAmenities.length > 0) {
      throw new Error(`유효하지 않은 편의시설입니다: ${invalidAmenities.join(', ')}. 허용되는 편의시설: ${allowedAmenities.join(', ')}`);
    }
    
    if (!this.housePhotos || this.housePhotos.length !== 3) throw new Error('집 사진은 정확히 3장이 필요합니다.');
    if (!this.availableExperiences) throw new Error('체험 가능한 일손 정보는 필수입니다.');
    if (!this.accommodationFee) throw new Error('숙박비는 필수입니다.');
  }

  toJSON() {
    const obj = { ...this };
    // undefined 값은 Firestore에 저장하지 않도록 필터링
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) delete obj[key];
    });
    return obj;
  }
}

module.exports = Host;
