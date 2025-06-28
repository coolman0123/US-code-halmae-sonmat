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

### Backend
- **Node.js** - 서버 런타임
- **Express.js** - 웹 프레임워크
- **Firebase Admin SDK** - 백엔드 인증 및 데이터베이스 관리
- **Swagger** - API 문서화

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