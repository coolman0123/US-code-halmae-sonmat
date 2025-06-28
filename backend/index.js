const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// 할머니 데이터베이스 불러오기
const grandmothersData = require('./grandmothers-data');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL_NAME || 'gemini-1.5-flash' });

// 세션별 채팅 히스토리 저장
const chatHistory = new Map();

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '🏡 할머니 체험 숙박 매칭 시스템에 오신 것을 환영합니다!',
    endpoints: {
      chat: '/api/chat',
      grandmothers: '/api/grandmothers',
      matching: '/api/matching'
    }
  });
});

// 할머니 목록 조회 API
app.get('/api/grandmothers', (req, res) => {
  try {
    res.json({
      success: true,
      count: grandmothersData.length,
      data: grandmothersData
    });
  } catch (error) {
    console.error('할머니 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '할머니 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 할머니 정보 조회 API
app.get('/api/grandmothers/:id', (req, res) => {
  try {
    const grandmother = grandmothersData.find(g => g.id === req.params.id);
    
    if (!grandmother) {
      return res.status(404).json({
        success: false,
        error: '해당 할머니를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: grandmother
    });
  } catch (error) {
    console.error('할머니 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '할머니 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// 채팅 API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: '메시지가 필요합니다.' 
      });
    }

    // 세션별 히스토리 가져오기 또는 초기화
    if (!chatHistory.has(sessionId)) {
      chatHistory.set(sessionId, []);
    }
    const history = chatHistory.get(sessionId);

    // 히스토리에 사용자 메시지 추가
    history.push({ role: 'user', content: message });

    // 프롬프트 구성
    const prompt = `
당신은 할머니-청년 체험 숙박 서비스의 친근한 AI 도우미입니다.
현재 등록된 할머니 숙소는 다음과 같습니다:

${grandmothersData.map(g => `
🏡 ${g.houseName} (${g.name} 할머니, ${g.age}세)
- 위치: ${g.location}
- 특징: ${g.catchphrase}
- 대표 메뉴: ${g.specialMenus.map(m => m.name).join(', ')}
- 체험: ${g.experiences.map(e => e.name).join(', ')}
`).join('\n')}

사용자 질문: ${message}

친근하고 따뜻한 말투로 답변해주세요. 할머니들의 매력을 잘 전달하고, 필요시 매칭 서비스를 추천해주세요.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 히스토리에 AI 응답 추가
    history.push({ role: 'assistant', content: text });

    // 히스토리가 너무 길어지면 오래된 것부터 제거 (최대 20개 메시지)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    res.json({ 
      response: text,
      sessionId: sessionId
    });

  } catch (error) {
    console.error('채팅 API 오류:', error);
    res.status(500).json({ 
      error: '죄송합니다. 잠시 후 다시 시도해주세요.' 
    });
  }
});

// 개선된 매칭 API
app.post('/api/matching', async (req, res) => {
  try {
    const { grandmotherId, youthInfo } = req.body;

    if (!grandmotherId || !youthInfo) {
      return res.status(400).json({
        success: false,
        error: '할머니 ID와 청년 정보가 필요합니다.'
      });
    }

    // 선택된 할머니 정보 찾기
    const selectedGrandmother = grandmothersData.find(g => g.id === grandmotherId);
    
    if (!selectedGrandmother) {
      return res.status(404).json({
        success: false,
        error: '선택된 할머니를 찾을 수 없습니다.'
      });
    }

    // AI 매칭 분석을 위한 프롬프트
    const matchingPrompt = `
할머니-청년 체험 숙박 매칭 분석을 해주세요.

## 할머니 정보:
- 이름: ${selectedGrandmother.name} (${selectedGrandmother.age}세)
- 숙소명: ${selectedGrandmother.houseName}
- 위치: ${selectedGrandmother.location}
- 특징: ${selectedGrandmother.catchphrase}
- 성격: ${selectedGrandmother.personality.traits.join(', ')}
- 소통 스타일: ${selectedGrandmother.personality.communicationStyle}
- 대표 메뉴: ${selectedGrandmother.specialMenus.map(m => `${m.name} (${m.difficulty})`).join(', ')}
- 체험 활동: ${selectedGrandmother.experiences.map(e => `${e.name} (${e.difficulty}, ${e.season})`).join(', ')}
- 키워드: ${selectedGrandmother.keywords.join(', ')}

## 청년 정보:
- 이름: ${youthInfo.name}
- 나이: ${youthInfo.age}세
- 관심사: ${youthInfo.interests}
- 요리 경험: ${youthInfo.cookingExperience}
- 농사 경험: ${youthInfo.farmingExperience}
- 성격: ${youthInfo.personality}
- 기대하는 것: ${youthInfo.expectations}
- 우려사항: ${youthInfo.concerns || '없음'}

다음 JSON 형식으로 매칭 분석 결과를 제공해주세요:

{
  "matchingScore": 85,
  "compatibility": {
    "personality": 90,
    "interests": 80,
    "communication": 85,
    "experience": 75
  },
  "strengths": [
    "성격적 궁합이 매우 좋음",
    "요리에 대한 관심이 일치함"
  ],
  "considerations": [
    "농사 경험 부족으로 체험 시 주의 필요",
    "소통 방식 차이 고려"
  ],
  "schedule": {
    "day1": {
      "morning": "도착 및 인사, 할머니와 첫 만남",
      "afternoon": "점심 준비 도움 및 식사",
      "evening": "저녁 준비 및 할머니 이야기 시간"
    },
    "day2": {
      "morning": "체험 활동 (농사일 또는 요리)",
      "afternoon": "점심 후 마무리 활동",
      "evening": "작별 인사 및 귀가"
    }
  },
  "communicationTips": [
    "할머니의 소통 스타일에 맞춰 대화하기",
    "적극적으로 도움 요청하기"
  ],
  "expectedBenefits": [
    "전통 요리 기술 습득",
    "세대 간 소통 경험",
    "농촌 생활 체험"
  ],
  "recommendedActivities": [
    "할머니 특제 요리 배우기",
    "농사 체험하기",
    "인생 이야기 나누기"
  ]
}

JSON 형식으로만 응답해주세요.
`;

    const result = await model.generateContent(matchingPrompt);
    const response = result.response.text();
    
    // JSON 파싱 시도
    let matchingResult;
    try {
      // JSON 코드 블록에서 JSON 부분만 추출
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response;
      matchingResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      // 파싱 실패 시 기본값 제공
      matchingResult = {
        matchingScore: 75,
        compatibility: {
          personality: 80,
          interests: 75,
          communication: 70,
          experience: 65
        },
        strengths: [
          `${selectedGrandmother.name} 할머니와의 좋은 궁합이 예상됩니다`,
          "새로운 경험을 통한 성장 기회"
        ],
        considerations: [
          "첫 만남이므로 서로 적응 시간 필요",
          "할머니의 생활 패턴 존중 필요"
        ],
        schedule: {
          day1: {
            morning: "도착 및 인사, 할머니와 첫 만남",
            afternoon: `${selectedGrandmother.specialMenus[0]?.name || '전통 요리'} 만들기 체험`,
            evening: "저녁 식사 및 할머니 이야기 시간"
          },
          day2: {
            morning: `${selectedGrandmother.experiences[0]?.name || '농사 체험'}`,
            afternoon: "점심 후 체험 마무리",
            evening: "작별 인사 및 귀가"
          }
        },
        communicationTips: [
          `${selectedGrandmother.personality.communicationStyle}을 고려한 대화`,
          "적극적이고 예의 바른 자세"
        ],
        expectedBenefits: [
          "전통 문화 체험",
          "세대 간 소통 경험",
          "농촌 생활 이해"
        ],
        recommendedActivities: selectedGrandmother.experiences.map(e => e.name)
      };
    }

    // 할머니 정보와 함께 응답
    res.json({
      success: true,
      grandmother: selectedGrandmother,
      youth: youthInfo,
      matching: matchingResult
    });

  } catch (error) {
    console.error('매칭 API 오류:', error);
    res.status(500).json({
      success: false,
      error: '매칭 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
});

// 서버 상태 확인 엔드포인트
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '서버가 정상적으로 실행 중입니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('🚀 서버가 포트', PORT, '에서 실행 중입니다.');
  console.log('📡 API 엔드포인트:');
  console.log('   - 채팅: http://localhost:' + PORT + '/api/chat');
  console.log('   - 할머니 목록: http://localhost:' + PORT + '/api/grandmothers');
  console.log('   - 매칭: http://localhost:' + PORT + '/api/matching');
  console.log('🏡 등록된 할머니 숙소:', grandmothersData.length, '개');
  grandmothersData.forEach(g => {
    console.log('   -', g.houseName, `(${g.name} 할머니, ${g.location})`);
  });
});

module.exports = app; 