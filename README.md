# 🏡 할머니의 손맛 (Grandma's Hand)

> 따뜻한 시골의 정취와 할머니의 손맛을 경험할 수 있는 농촌 체험 숙박 플랫폼

## 📖 프로젝트 소개

할머니의 손맛은 도시 사람들이 농촌에서 특별한 체험을 하고, 진정한 할머니의 손맛을 느낄 수 있는 숙박 예약 플랫폼입니다. 사용자들은 다양한 농촌 체험 활동과 함께 따뜻한 농가 숙박을 예약할 수 있습니다.

### 🎯 주요 기능

- **🏠 숙박 예약**: 농촌 숙박시설 검색 및 예약
- **🌾 체험 활동**: 농사 체험, 전통 요리 만들기 등 다양한 농촌 체험
- **👩‍🌾 호스트 관리**: 숙박업소 운영자를 위한 예약 및 결제 관리 시스템
- **⭐ 리뷰 시스템**: 숙박 및 체험 후기 작성 및 조회
- **💳 결제 시스템**: 안전한 온라인 결제 및 결제 내역 관리
- **🔔 알림 기능**: 예약 확인, 결제 완료 등 실시간 알림

## 🛠 기술 스택

### Frontend
- **React 18** - 사용자 인터페이스 구축
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **CSS3** - 스타일링
- **Firebase** - 인증 및 실시간 데이터베이스
- **Kakao Maps API** - 지도 표시 및 지오코딩

### Backend
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **Firebase Admin SDK** - 백엔드 인증 및 데이터베이스 관리
- **Swagger** - API 문서화
- **Kakao REST API** - 지오코딩

## 📁 프로젝트 구조

```
grandma_hand/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── api/            # API 호출 함수
│   │   └── services/       # 비즈니스 로직
│   └── public/             # 정적 자산
└── backend/                 # Node.js 백엔드
    ├── domains/            # 도메인별 모듈
    │   ├── auth/          # 인증 관리
    │   ├── user/          # 사용자 관리
    │   ├── host/          # 호스트 관리
    │   ├── trip/          # 여행/숙박 관리
    │   └── review/        # 리뷰 관리
    ├── firebase/           # Firebase 설정
    └── config/             # 설정 파일
```

## 🚀 설치 및 실행

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 또는 yarn
- Firebase 프로젝트 설정

### 1. 저장소 클론
```bash
git clone https://github.com/your-repo/grandma_hand.git
cd grandma_hand
```

### 2. Frontend 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend 설치 및 실행
```bash
cd backend
npm install
npm start
```

### 4. 환경 변수 설정
Firebase 설정을 위한 환경 변수 파일을 생성하세요:
- Frontend: `frontend/.env`
- Backend: `backend/.env`

## 📚 API 문서

백엔드 서버 실행 후 Swagger UI를 통해 API 문서를 확인할 수 있습니다:
```
http://localhost:3000/api-docs
```

## 🎨 주요 페이지

### 사용자
- **메인 페이지**: 할머니의 손맛 소개 및 추천 숙박시설
- **숙박 예약**: 날짜별 숙박시설 검색 및 예약
- **체험 활동**: 다양한 농촌 체험 프로그램 소개
- **마이페이지**: 예약 내역, 결제 내역, 리뷰 관리
- **할머니의 이야기**: 농촌의 따뜻한 이야기와 경험담

### 호스트
- **호스트 등록**: 숙박시설 정보 등록
- **예약 관리**: 실시간 예약 현황 및 관리
- **결제 관리**: 수익 현황 및 정산 관리

## 👨‍👩‍👧‍👦 팀 마늘톤 (Garlictone)

| 이름 | 역할 | GitHub |
|------|------|--------|
| 최시원 | 백엔드 개발 | https://github.com/coolman0123 |
| 손영관 | 백엔드 개발 | https://github.com/son9806 |
| 양유진 | 프론트엔드 개발 | https://github.com/skysunm |
| 김희연 | 프론트엔드 개발 | https://github.com/joyfulond |

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다.

---

docs_v2.0

## 🔧 기술 스택

### 프론트엔드
- React 18
- Vite
- React Router
- **Kakao Maps API** (지도 표시 및 지오코딩)

### 백엔드
- Node.js
- Express.js
- Firebase Firestore
- **Kakao REST API** (지오코딩)

## 🚀 시작하기

### 환경 변수 설정

#### 프론트엔드 (frontend/.env)
```bash
# Kakao Maps JavaScript API 키
VITE_KAKAO_MAP_API_KEY=your_kakao_javascript_api_key_here
```

#### 백엔드 (.env)
```bash
# Kakao REST API 키
KAKAO_REST_API_KEY=your_kakao_rest_api_key_here
```

### Kakao API 키 발급 방법

1. **[Kakao Developers](https://developers.kakao.com/)** 접속
2. **내 애플리케이션 > 애플리케이션 추가하기**
3. **앱 설정 > 앱 키**에서 다음 키들 복사:
   - **JavaScript 키**: 프론트엔드 지도 표시용
   - **REST API 키**: 백엔드 지오코딩용
4. **플랫폼 설정 > Web 플랫폼 추가**
5. **사이트 도메인 등록** (localhost:3000, localhost:5001 등)
6. **제품 설정**:
   - **Kakao Map** 활성화
   - **Local (주소 검색)** 활성화

### 실행 방법

#### 백엔드 실행
```bash
cd backend
npm install
KAKAO_REST_API_KEY=your_api_key npm start
```

#### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 📍 지오코딩 시스템

### 이중 안전망 구조
1. **1차**: 프론트엔드에서 Kakao Maps JavaScript API로 직접 지오코딩
2. **2차**: 실패 시 백엔드 Kakao REST API로 폴백

### 지원 주소 형식
- ✅ **도로명 주소**: 선릉로 221, 강남대로 382
- ✅ **지번 주소**: 서울시 강남구 역삼동 123-45
- ✅ **건물명**: 코엑스, 롯데월드타워

### API 엔드포인트
```
GET /api/hosts/geocoding?address=선릉로 221
```

## 🏠 호스트 등록 기능

- 카카오 지오코딩으로 정확한 위치 설정
- 실시간 지도 마커 표시
- 주소 자동 완성 및 검증
- 숙박 정보 및 편의시설 등록
- 사진 업로드 (최대 2장)

## 📁 프로젝트 구조

```
grandma_hand/
├── frontend/          # React 프론트엔드
│   ├── src/
│   │   ├── pages/Host/Register/   # 호스트 등록 페이지
│   │   └── ...
├── backend/           # Node.js 백엔드
│   ├── domains/host/  # 호스트 관련 API
│   └── ...
└── README.md
```

## 🔍 주요 변경사항

- ❌ **Google Maps API 완전 제거**
- ✅ **Kakao Maps/Local API로 전환**
- ✅ **이중 안전망 지오코딩 시스템**
- ✅ **한국 주소에 최적화된 검색**

## 📞 문의

문제가 발생하거나 궁금한 점이 있으시면 GitHub Issues를 통해 문의해주세요.