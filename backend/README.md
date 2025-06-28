# 백엔드 서버

## 환경 변수 설정

### Kakao Maps API 설정

백엔드에서 카카오 지오코딩 API를 사용하려면 다음 환경 변수를 설정해야 합니다:

```bash
# .env 파일 또는 환경 변수로 설정
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
```

#### Kakao REST API 키 발급 방법

1. [Kakao Developers](https://developers.kakao.com/)에 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 설정 > 앱 키에서 "REST API 키" 복사
4. 플랫폼 설정 > Web 플랫폼 추가
5. 사이트 도메인 등록 (localhost:5001 등)

#### API 사용 설정

1. 제품 설정 > Kakao Map > Local (주소 검색) 활성화
2. 앱 설정 > API 키 > REST API 키 사용

## 지오코딩 API 엔드포인트

### GET /api/hosts/geocoding

주소를 위도/경도로 변환하는 카카오 지오코딩 API

#### 요청
```
GET /api/hosts/geocoding?address=선릉로 221
```

#### 응답
```json
{
  "success": true,
  "data": {
    "address": "선릉로 221",
    "formattedAddress": "서울 강남구 선릉로 221",
    "roadAddress": "서울 강남구 선릉로 221",
    "latitude": 37.5074846,
    "longitude": 127.0484407,
    "addressType": "REGION_ADDR"
  }
}
```

## 서버 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 후 서버 실행
KAKAO_REST_API_KEY=your_api_key npm start
``` 