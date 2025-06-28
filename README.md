# 🏡 할머니의 손맛 (Grandma's Hand)

> 따뜻한 시골의 정취와 할머니의 손맛을 경험할 수 있는 농촌 체험 숙박 플랫폼

## 📖 프로젝트 소개

할머니의 손맛은 도시 사람들이 농촌에서 특별한 체험을 하고, 진정한 할머니의 손맛을 느낄 수 있는 숙박 예약 플랫폼입니다. **완전한 풀스택 웹 애플리케이션**으로 실제 백엔드 API와 연동되어 작동합니다.

### 🎯 완성된 주요 기능

- **🔐 완전한 인증 시스템**: JWT 기반 로그인/회원가입, Protected Routes
- **🏠 호스트 관리**: Google Maps 연동 주소 검색, 숙소 등록/관리
- **📅 예약 시스템**: 실시간 여행 생성, 참가 신청/취소
- **⭐ 리뷰 시스템**: 5점 별점 리뷰, 호스트별 평균 평점 계산
- **👤 사용자 관리**: 마이페이지, 결제 내역, 알림 관리
- **🗺️ 지도 통합**: Google Maps API를 통한 실시간 지오코딩
- **📱 반응형 디자인**: 모바일 친화적 UI

## 🛠 기술 스택

### Frontend
- **React 18** - UI 라이브러리
- **React Router DOM** - 클라이언트 사이드 라우팅
- **React Context** - 전역 상태 관리 (인증, 사용자 정보)
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **CSS3** - 모던 스타일링 (Grid, Flexbox)
- **Fetch API** - 백엔드 API 통신

### Backend
- **Node.js** - 서버 런타임 환경
- **Express.js** - RESTful API 프레임워크
- **Firebase Admin SDK** - NoSQL 데이터베이스 및 인증
- **Google Maps API** - 지오코딩 및 지도 서비스
- **Swagger** - 자동 API 문서화
- **JWT** - 토큰 기반 인증

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
- **Node.js** 18.0.0 이상
- **npm** 또는 **yarn**
- **Firebase 프로젝트** 설정
- **Google Maps API 키**

### 1. 저장소 클론
```bash
git clone https://github.com/your-repo/grandma_hand.git
cd grandma_hand
```

### 2. Backend 설치 및 실행
```bash
cd backend
npm install

# 환경 변수 설정
echo "PORT=5001" > .env
echo "GOOGLE_MAPS_API_KEY=your_google_maps_api_key" >> .env

# Firebase 설정 파일 추가 (필수)
# firebase/serviceAccountKey.json 파일을 추가하세요

npm start
```

### 3. Frontend 설치 및 실행
```bash
cd frontend
npm install

# 환경 변수 설정
echo "REACT_APP_API_URL=http://localhost:5001" > .env

npm run dev
```

### 4. 접속 및 테스트
- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:5001
- **API 문서**: http://localhost:5001/api-docs

### 5. 기능 테스트
1. **회원가입/로그인**: 새 계정을 만들어 로그인 테스트
2. **호스트 등록**: 관리자 로그인 → 주소 검색 → 숙소 등록
3. **API 테스트**: `curl http://localhost:5001/api/hosts`

## 📚 API 문서

백엔드 서버 실행 후 Swagger UI를 통해 API 문서를 확인할 수 있습니다:
```
http://localhost:5001/api-docs
```

### 주요 API 엔드포인트

#### 🔐 인증 (Auth)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인  
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

#### 🏠 호스트 (Host)
- `POST /api/hosts` - 호스트 등록
- `GET /api/hosts` - 호스트 목록 조회
- `GET /api/hosts/:id` - 특정 호스트 조회
- `GET /api/hosts/geocoding?address=주소` - 주소 지오코딩

#### 📅 여행/예약 (Trip)
- `POST /api/trips` - 여행 생성
- `GET /api/trips` - 여행 목록 조회
- `POST /api/trips/:id/join` - 여행 참가 신청
- `POST /api/trips/:id/leave` - 여행 참가 취소

#### ⭐ 리뷰 (Review)
- `POST /api/reviews` - 리뷰 작성
- `GET /api/reviews/host/:hostId` - 호스트별 리뷰 조회
- `GET /api/reviews/host/:hostId/rating` - 호스트 평균 평점

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