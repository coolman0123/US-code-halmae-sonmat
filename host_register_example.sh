#!/bin/bash

# 호스트 등록 API 테스트용 curl 스크립트
# 서버가 localhost:5001에서 실행 중이어야 합니다.

curl -X POST http://localhost:5001/api/hosts \
  -H "Content-Type: application/json" \
  -d '{
    "hostIntroduction": "따뜻한 마음으로 손님을 맞이하는 할머니입니다",
    "age": 68,
    "characteristics": "정이 많고 요리 솜씨가 뛰어난 분",
    "representativeMenu": "된장찌개와 김치전",
    "personalitySummary": "활발하고 친근한 성격의 할머니",
    "address": {
      "zipCode": "12345",
      "detailAddress": "경기도 양평군 용문면 용문로 123"
    },
    "latitude": 37.5651,
    "longitude": 127.2485,
    "contact": {
      "phone": "010-1234-5678"
    },
    "houseNickname": "할머니네 정겨운 농가",
    "maxGuests": 4,
    "bedroomCount": 2,
    "bedCount": 3,
    "amenities": [
      "와이파이",
      "건물 내 무료 주차",
      "에어컨",
      "주방",
      "세탁기"
    ],
    "housePhotos": [
      "https://example.com/house1.jpg",
      "https://example.com/house2.jpg", 
      "https://example.com/house3.jpg"
    ],
    "availableExperiences": "농사일 체험, 전통 요리 만들기, 텃밭 가꾸기",
    "accommodationFee": "80000"
  }' 