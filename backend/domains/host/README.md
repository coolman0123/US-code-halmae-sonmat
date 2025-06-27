# Host API Documentation

## Host 등록 API

### Endpoint
`POST /api/hosts/register`

### Request Body 구조

#### PAGE1 정보
```json
{
  "hostIntroduction": "따뜻한 마음으로 손님을 맞이하는 할머니입니다.",
  "age": 75,
  "characteristics": "손님을 가족처럼 대하며, 전통 요리에 능숙합니다.",
  "representativeMenu": "된장찌개, 김치찌개, 시골 백반",
  "personalitySummary": "인자하고 정이 많은 성격"
}
```

#### PAGE2 정보
```json
{
  "address": {
    "zipCode": "12345",
    "detailAddress": "경기도 양평군 용문면 연꽃마을 123번지"
  },
  "contact": {
    "phone": "010-1234-5678"
  },
  "houseNickname": "연꽃마을 할머니댁",
  "maxGuests": 4,
  "bedroomCount": 2,
  "bedCount": 3,
  "amenities": [
    "와이파이",
    "TV",
    "주방",
    "세탁기",
    "건물 내 무료 주차",
    "에어컨",
    "업무 전용 공간"
  ],
  "housePhotos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
    "https://example.com/photo3.jpg"
  ],
  "availableExperiences": "농사 체험, 전통 요리 배우기, 산책로 안내",
  "accommodationFee": "50000원/박"
}
```

### 전체 Request Body 예시

#### 예시 1: 모든 편의시설 선택
```json
{
  "hostIntroduction": "따뜻한 마음으로 손님을 맞이하는 할머니입니다.",
  "age": 75,
  "characteristics": "손님을 가족처럼 대하며, 전통 요리에 능숙합니다.",
  "representativeMenu": "된장찌개, 김치찌개, 시골 백반",
  "personalitySummary": "인자하고 정이 많은 성격",
  "address": {
    "zipCode": "12345",
    "detailAddress": "경기도 양평군 용문면 연꽃마을 123번지"
  },
  "contact": {
    "phone": "010-1234-5678"
  },
  "houseNickname": "연꽃마을 할머니댁",
  "maxGuests": 4,
  "bedroomCount": 2,
  "bedCount": 3,
  "amenities": [
    "와이파이",
    "TV",
    "주방",
    "세탁기",
    "건물 내 무료 주차",
    "건물 내/외 유료 주차",
    "에어컨",
    "업무 전용 공간"
  ],
  "housePhotos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
    "https://example.com/photo3.jpg"
  ],
  "availableExperiences": "농사 체험, 전통 요리 배우기, 산책로 안내",
  "accommodationFee": "50000원/박"
}
```

#### 예시 2: 일부 편의시설만 선택
```json
{
  "hostIntroduction": "따뜻한 마음으로 손님을 맞이하는 할머니입니다.",
  "age": 75,
  "characteristics": "손님을 가족처럼 대하며, 전통 요리에 능숙합니다.",
  "representativeMenu": "된장찌개, 김치찌개, 시골 백반",
  "personalitySummary": "인자하고 정이 많은 성격",
  "address": {
    "zipCode": "12345",
    "detailAddress": "경기도 양평군 용문면 연꽃마을 123번지"
  },
  "contact": {
    "phone": "010-1234-5678"
  },
  "houseNickname": "연꽃마을 할머니댁",
  "maxGuests": 4,
  "bedroomCount": 2,
  "bedCount": 3,
  "amenities": [
    "와이파이",
    "주방",
    "에어컨"
  ],
  "housePhotos": [
    "https://example.com/photo1.jpg",
    "https://example.com/photo2.jpg",
    "https://example.com/photo3.jpg"
  ],
  "availableExperiences": "농사 체험, 전통 요리 배우기, 산책로 안내",
  "accommodationFee": "50000원/박"
}
```

### 응답 예시

#### 성공 응답 (201 Created)
```json
{
  "success": true,
  "message": "Host 등록이 완료되었습니다.",
  "data": {
    "id": "host123456",
    "hostIntroduction": "따뜻한 마음으로 손님을 맞이하는 할머니입니다.",
    "age": 75,
    "characteristics": "손님을 가족처럼 대하며, 전통 요리에 능숙합니다.",
    "representativeMenu": "된장찌개, 김치찌개, 시골 백반",
    "personalitySummary": "인자하고 정이 많은 성격",
    "address": {
      "zipCode": "12345",
      "detailAddress": "경기도 양평군 용문면 연꽃마을 123번지"
    },
    "contact": {
      "phone": "010-1234-5678"
    },
    "houseNickname": "연꽃마을 할머니댁",
    "maxGuests": 4,
    "bedroomCount": 2,
    "bedCount": 3,
    "amenities": [
      "와이파이",
      "TV",
      "주방",
      "에어컨"
    ],
    "housePhotos": [
      "https://example.com/photo1.jpg",
      "https://example.com/photo2.jpg",
      "https://example.com/photo3.jpg"
    ],
    "availableExperiences": "농사 체험, 전통 요리 배우기, 산책로 안내",
    "accommodationFee": "50000원/박",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 에러 응답 (400 Bad Request)
```json
{
  "success": false,
  "error": "호스트 한줄 소개는 필수입니다."
}
```

## 필드 설명

### PAGE1 필드
- **hostIntroduction** (string, required): 호스트 한줄 소개
- **age** (number, required): 연세
- **characteristics** (string, required): 특징
- **representativeMenu** (string, required): 대표 메뉴
- **personalitySummary** (string, required): 성격 한 줄 요약

### PAGE2 필드
- **address** (object, required): 주소 정보
  - **zipCode** (string, required): 우편번호
  - **detailAddress** (string, required): 상세주소
- **contact** (object, required): 연락처
  - **phone** (string, required): 전화번호
- **houseNickname** (string, required): HOST 집 닉네임 (중복 불가)
- **maxGuests** (number, required): 숙박가능인원 (1 이상)
- **bedroomCount** (number, required): 침실개수 (1 이상)
- **bedCount** (number, required): 침대개수 (1 이상)
- **amenities** (array, required): 숙소 편의시설 정보
  - **허용되는 8개 값** (이 중에서 원하는 것들을 선택):
    - "와이파이"
    - "TV"
    - "주방"
    - "세탁기"
    - "건물 내 무료 주차"
    - "건물 내/외 유료 주차"
    - "에어컨"
    - "업무 전용 공간"
  - **참고**: 8개 모두 선택할 수도 있고, 일부만 선택할 수도 있습니다
- **housePhotos** (array, required): 집 사진 3장 (정확히 3개 필요)
- **availableExperiences** (string, required): 체험 가능한 일손 작성
- **accommodationFee** (string, required): 숙박비

## 기타 API

### 모든 Host 조회
`GET /api/hosts`

### Host ID로 조회
`GET /api/hosts/:id`

### 집 닉네임으로 조회
`GET /api/hosts/nickname/:houseNickname` 