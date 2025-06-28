# 🤖 Gemini 챗봇

Google Gemini AI를 활용한 실시간 채팅 애플리케이션입니다.

## 🚀 기능

- 실시간 AI 채팅
- 세션별 대화 히스토리 관리
- 반응형 디자인
- 타이핑 인디케이터
- 에러 처리

## 📋 요구사항

- Node.js (v14 이상)
- Google Gemini API 키

## 🛠️ 설치 및 실행

### 1. 저장소 클론
```bash
git clone <repository-url>
cd gemini-chatbot
```

### 2. 백엔드 설정
```bash
cd backend
npm install
```

### 3. 환경변수 설정
`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
NODE_ENV=development
```

### 4. 프론트엔드 설정
```bash
cd ../frontend
npm install
```

### 5. 애플리케이션 실행

**백엔드 서버 실행:**
```bash
cd backend
npm run dev
```

**프론트엔드 실행 (새 터미널에서):**
```bash
cd frontend
npm start
```

## 🌐 접속

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## 📁 프로젝트 구조

```
gemini-chatbot/
├── backend/
│   ├── index.js          # Express 서버
│   ├── package.json
│   └── .env              # 환경변수 (직접 생성 필요)
├── frontend/
│   ├── src/
│   │   ├── App.js        # 메인 React 컴포넌트
│   │   └── App.css       # 스타일링
│   └── package.json
└── README.md
```

## 🔧 API 엔드포인트

### POST /api/chat
채팅 메시지를 전송하고 AI 응답을 받습니다.

**요청:**
```json
{
  "message": "안녕하세요!",
  "sessionId": "optional_session_id"
}
```

**응답:**
```json
{
  "message": "안녕하세요! 무엇을 도와드릴까요?",
  "sessionId": "session_id"
}
```

### GET /api/health
서버 상태를 확인합니다.

## 🎨 주요 기능

- **실시간 채팅**: 사용자와 AI 간의 실시간 대화
- **세션 관리**: 각 세션별로 대화 히스토리 유지
- **반응형 UI**: 모바일과 데스크톱에서 모두 사용 가능
- **타이핑 인디케이터**: AI가 응답을 생성 중임을 표시
- **에러 처리**: 네트워크 오류나 API 오류에 대한 적절한 처리

## 🔒 보안

- API 키는 환경변수로 관리
- CORS 설정으로 프론트엔드와 백엔드 통신 보안
- 입력 검증 및 에러 처리

## 🚀 배포

### 백엔드 배포 (예: Heroku)
```bash
cd backend
npm start
```

### 프론트엔드 배포 (예: Netlify)
```bash
cd frontend
npm run build
```

## 📝 라이선스

MIT License

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 