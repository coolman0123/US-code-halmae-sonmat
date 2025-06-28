// 할머니 숙소 데이터베이스
const grandmothersData = [
  {
    id: "bongsoon",
    name: "박봉순",
    houseName: "봉순가",
    catchphrase: "말보다 손이 빠른, 정통 밥상 장인",
    age: 82,
    location: "경상북도 안동시",
    personality: {
      traits: ["과묵함", "성실함", "부지런함", "정성스러움"],
      communicationStyle: "말보다는 행동으로 표현",
      wakeUpTime: "새벽 5시",
      workStyle: "매일 밭일, 7첩 반상"
    },
    specialMenus: [
      {
        name: "청국장",
        description: "장독대 옆에서 직접 뜬 된장으로 끓인 구수한 청국장",
        difficulty: "중급"
      },
      {
        name: "묵은지찜",
        description: "혀에 닿자마자 퍼지는 깊은 감칠맛의 묵은지찜",
        difficulty: "초급"
      },
      {
        name: "된장찌개",
        description: "구수한 향이 진동하는 전통 된장찌개",
        difficulty: "초급"
      }
    ],
    experiences: [
      {
        name: "사과 수확과 선별",
        season: "10월",
        difficulty: "쉬움",
        description: "단밀 사과밭에서의 수확 체험, 선별 노하우 전수",
        skills: ["사과 따기", "선별 기술", "농산물 관리"]
      }
    ],
    mealStyle: "7첩 반상",
    keywords: ["조용함", "정성", "전통", "농사", "과묵"]
  },
  {
    id: "oksoon",
    name: "김옥순",
    houseName: "옥순가",
    catchphrase: "욕쟁이 같지만, 손맛은 꿀이여~",
    age: 78,
    location: "경상북도 의성군",
    personality: {
      traits: ["털털함", "정 많음", "시원함", "넉넉함"],
      communicationStyle: "직설적이지만 따뜻함",
      specialNote: "입은 험해도 마음은 따뜻함"
    },
    specialMenus: [
      {
        name: "묵은지등갈비찜",
        description: "숟가락으로도 살이 발라질 정도로 부드러운 등갈비찜",
        difficulty: "고급"
      },
      {
        name: "청국장찌개",
        description: "진하면서도 깔끔한 청국장찌개",
        difficulty: "중급"
      }
    ],
    experiences: [
      {
        name: "마늘밭 김매기와 수확",
        season: "초여름",
        difficulty: "중간",
        description: "의성 마늘밭에서의 김매기와 수확 체험",
        skills: ["김매기", "마늘 수확", "농작물 관리"]
      }
    ],
    keywords: ["털털함", "정", "고기요리", "마늘", "시원함"]
  },
  {
    id: "geumja",
    name: "이금자",
    houseName: "금자가",
    catchphrase: "국물엔 인생이 있어야지",
    age: 85,
    location: "충청남도 공주시",
    personality: {
      traits: ["생존력", "노하우", "진중함", "깊이"],
      communicationStyle: "인생 경험이 담긴 조언",
      specialNote: "6.25 피난 중에도 솥은 놓지 않은 요리 달인"
    },
    specialMenus: [
      {
        name: "사골국",
        description: "뽀얗고 진한 사골국, 국물만 마셔도 속이 풀림",
        difficulty: "고급"
      },
      {
        name: "감자탕",
        description: "뼈 사이 고기부터 국물까지 완벽한 감자탕",
        difficulty: "고급"
      },
      {
        name: "누룽지",
        description: "따뜻한 속을 채워주는 구수한 누룽지",
        difficulty: "초급"
      }
    ],
    experiences: [
      {
        name: "모내기와 탈곡 체험",
        season: "봄, 가을",
        difficulty: "어려움",
        description: "논물 속 모내기부터 가을 탈곡까지 벼농사 전 과정",
        skills: ["모내기", "탈곡", "벼농사"]
      }
    ],
    keywords: ["국물요리", "인생경험", "진중함", "벼농사", "깊이"]
  },
  {
    id: "dagam",
    name: "정다감",
    houseName: "다감가",
    catchphrase: "밥보다 사람이 먼저지",
    age: 80,
    location: "전라남도 순천시",
    personality: {
      traits: ["따뜻함", "소통", "배려", "정"],
      communicationStyle: "온 동네 사정 꿰는 따뜻한 말 한마디",
      specialNote: "사람을 먼저 생각하는 마음"
    },
    specialMenus: [
      {
        name: "나물비빔밥",
        description: "계절 나물로 만든 정성 가득 비빔밥",
        difficulty: "중급"
      },
      {
        name: "미역국",
        description: "따뜻한 마음이 담긴 구수한 미역국",
        difficulty: "초급"
      },
      {
        name: "계란찜",
        description: "부드러움의 극치를 보여주는 계란찜",
        difficulty: "초급"
      }
    ],
    experiences: [
      {
        name: "참깨·콩 타작하기",
        season: "가을",
        difficulty: "쉬움",
        description: "마당에서 참깨와 콩을 타작하며 듣는 농사 이야기",
        skills: ["타작", "곡물 가공", "전통 농법"]
      }
    ],
    keywords: ["소통", "따뜻함", "나물", "배려", "정"]
  },
  {
    id: "malsoon",
    name: "조말순",
    houseName: "말순가",
    catchphrase: "메뉴는 고정, 맛은 고정불변",
    age: 76,
    location: "강원도 정선군",
    personality: {
      traits: ["일관성", "정직함", "소박함", "집밥 전문"],
      communicationStyle: "소박하지만 진심 어린 대화",
      specialNote: "조미료 없이도 매일 같은 반찬에서 다르게 느껴지는 맛"
    },
    specialMenus: [
      {
        name: "된장찌개",
        description: "매일 먹어도 질리지 않는 정통 된장찌개",
        difficulty: "초급"
      },
      {
        name: "계란말이",
        description: "엄마 손길이 느껴지는 따뜻한 계란말이",
        difficulty: "초급"
      },
      {
        name: "깍두기",
        description: "아삭아삭 시원한 깍두기",
        difficulty: "중급"
      }
    ],
    experiences: [
      {
        name: "시골 장터 돕기",
        season: "연중",
        difficulty: "쉬움",
        description: "5일장 날 장터에서 장사 돕기, 시골 인심 체험",
        skills: ["장사", "소통", "시골 문화"]
      }
    ],
    keywords: ["집밥", "일관성", "소박함", "장터", "정직함"]
  }
];

module.exports = grandmothersData; 