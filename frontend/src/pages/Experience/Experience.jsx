//Experience.jsx

import React, { useState } from "react";
import "./Experience.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { Modal } from "../../components";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// 이미지 import
import card1 from "../../assets/images/체험/1.jpeg";
import card2 from "../../assets/images/체험/2.jpeg";
import card3 from "../../assets/images/체험/3.png";
import card4 from "../../assets/images/체험/4.png";
import card5 from "../../assets/images/체험/5.jpeg";

import card1_1 from "../../assets/images/음식/음식1.jpeg";
import card1_2 from "../../assets/images/음식/음식2.jpeg";
import card1_3 from "../../assets/images/음식/음식3.jpeg";
import card1_4 from "../../assets/images/음식/음식4.jpeg";
import card1_5 from "../../assets/images/음식/음식5.jpeg";

import card1_1_1 from "../../assets/images/대표/대표1.jpeg";
import card1_1_2 from "../../assets/images/대표/대표2.jpeg";
import card1_1_3 from "../../assets/images/대표/대표3.jpeg";
import card1_1_4 from "../../assets/images/대표/대표4.jpeg";
import card1_1_5 from "../../assets/images/대표/대표5.jpeg";

const cards = [
  {
    title: "봉순가 — 박봉순 할머니",
    description: "말보다 손이 빠른, 정통 밥상 장인",
    image: card1,
    details: `<img src="${card1_1_1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
- 연세: 82세
- 특징: 새벽 5시에 일어나 밭일하고, 매일 7첩 반상을 차리는 정직한 손맛
- 대표 메뉴: 청국장, 묵은지찜

🍚 밥상 설명
<img src="${card1_1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
봉순 할머니 밥상은 조용하지만 강한 울림이 있어요. 된장찌개는 장독대 옆에서 직접 뜬 된장으로 끓여 구수한 향이 진동하고, 꽁치조림은 뼈까지 부드러워 밥도둑이에요. 고추전은 달군 철판에 지글지글 부쳐내 입에 착 감기고, 묵은지찜은 혀에 닿자마자 퍼지는 깊은 감칠맛이 일품이죠. 말없이 차려놓은 밥상이지만, 할매의 손끝에서 나온 정성은 밥 한 숟갈마다 느껴져요.

🍎 체험: 사과 수확과 선별
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
초여름 의성 마늘밭, 아스라이 퍼지는 흙냄새와 함께 시작돼요. 무릎을 꿇고 쪼그린 채로 잡초를 뽑는 김매기 작업은 허리가 끊어질 듯하지만, 그 곁엔 늘 할매의 "에이, 그건 그냥 뽑으라니께!"라는 호통이 동반되죠. 마늘을 뽑아 뿌리 털고 단으로 묶는 손놀림엔 숙련된 농사꾼의 노하우가 배어있어요. 구슬땀이 흐르다 보면, 어느새 마음까지 후끈해져요.`,
  },
  {
    title: "옥순가 — 김옥순 할머니",
    description: "욕쟁이 같지만, 손맛은 꿀이여~",
    image: card2,
    details: `<img src="${card1_1_2}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
- 연세: 78세
- 특징: 입은 험해도 고기반찬 리필은 무한. 정 많고 털털한 할매
- 대표 메뉴: 묵은지등갈비찜, 청국장찌개

🍚 밥상 설명
<img src="${card1_2}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
할매가 욕을 한마디 툭 뱉으시면서도 "밥은 더 먹어라!"라고 쿨하게 한 그릇 더 퍼주시죠. 보글보글 청국장은 진하면서도 깔끔하고, 묵은지등갈비찜은 숟가락으로도 살이 발라질 정도로 부드러워요. 나물은 씹을수록 단맛이 나는 고소한 들기름 향이 은은하게 퍼지고, 잡곡밥에 나물을 쓱쓱 비벼 먹으면 그 순간만큼은 '욕쟁이'가 아니라 '정쟁이' 할매가 됩니다.

🧄 체험: 마늘밭 김매기와 수확
<img src="${card2}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
10월 단밀 사과밭에서 펼쳐지는 수확체험은 생각보다 섬세한 손길이 필요해요. 할매가 사다리를 붙잡아 주면, 조심스레 나무 꼭대기까지 올라가 붉게 익은 사과를 골라 따요. 툭하고 떨어지는 소리, 상자에 담을 때의 묵직한 감촉, 상처 난 사과를 골라내며 배우는 선별 노하우까지. 수확 후 마시는 따뜻한 대추차 한 잔은, 봉순 할매표 인심의 마침표랍니다.`,
  },
  {
    title: "금자가 — 이금자 할머니",
    description: "국물엔 인생이 있어야지",
    image: card3,
    details: `<img src="${card1_1_3}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
- 연세: 85세
- 특징: 6.25 피난 중에도 솥은 놓지 않은 생존형 요리 달인
- 대표 메뉴: 사골국, 감자탕, 누룽지

🍚 밥상 설명
<img src="${card1_3}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
할매 밥상 앞에선 괜히 허리를 곧추세우게 됩니다. 사골국은 뽀얗고 진하며, 국물만 마셔도 속이 다 풀려요. 푹 끓인 감자탕은 뼈 사이 고기부터 국물까지 싹싹 비우게 만들고, 누룽지는 마무리 디저트처럼 따뜻한 속을 채워줘요. 구수한 향기와 푸짐한 양은 마치 '그 시절 밥상'을 떠올리게 하죠. 고단했던 하루가 밥 한 끼로 위로받는 순간이에요.

🌾 체험: 모내기와 탈곡 체험
<img src="${card3}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
모내기는 논물 속으로 들어가는 순간부터 시작돼요. 맨발로 진흙을 밟으면 발바닥이 간질간질하지만, 땀방울이 이마를 타고 흐를 즈음엔 '살아있다'는 느낌이 퍼지죠. 줄 맞춰 모를 심고, 가을이면 황금 들판에서 벼를 탈곡기에 넣어 '드르륵' 소리 듣는 재미도 쏠쏠해요. 허리 펴며 보는 하늘은 정말 넓고 깨끗해요.`,
  },
  {
    title: "다감가 — 정다감 할머니",
    description: "밥보다 사람이 먼저지",
    image: card4,
    details: `<img src="${card1_1_4}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
- 연세: 80세
- 특징: 온 동네 사정 꿰는 따뜻한 말 한마디 장인
- 대표 메뉴: 나물비빔밥, 미역국

🍚 밥상 설명
<img src="${card1_4}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
계란찜의 부드러움, 새우의 쫄깃함, 구수한 된장국까지… 할매 밥상은 화려하지 않지만 따뜻한 한 끼의 표본이에요. "밥 같이 먹자"는 말 한마디에 뭉클해지고, 뚝뚝 떨어지는 된장국 국물에 마음까지 녹아내려요. 밥상 위 재료들은 전부 장터에서 직접 고른 것들로, 정다감 할매의 '마음'이 그대로 반찬이 돼 있어요.

🥜 체험: 참깨·콩 타작하기
<img src="${card4}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
마당에 돗자리 깔고, 바짝 말린 참깨와 콩을 방망이로 두드리면 '톡톡톡' 경쾌한 소리가 나요. 껍질이 벗겨질 때 나는 고소한 향은 잊을 수 없고, 할매가 들려주는 농사 이야기에 웃음꽃도 함께 터져요. 손놀림 하나하나가 느려도 좋아요. 이 시간만큼은 느리게, 정답게 흐르거든요.`,
  },
  {
    title: "말순가 — 조말순 할머니",
    description: "메뉴는 고정, 맛은 고정불변",
    image: card5,
    details: `<img src="${card1_1_5}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
- 연세: 76세
- 특징: 조미료 없이도 매일 같은 반찬에서 다르게 느껴지는 집밥 장인
- 대표 메뉴: 된장찌개, 계란말이, 깍두기

🍚 밥상 설명
<img src="${card1_5}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
된장찌개, 전, 미역국, 깍두기까지 가지런히 놓인 밥상은 마치 생일상 같아요. 계란말이 한 점에 엄마 손길이 느껴지고, 김에 밥 싸서 입에 넣는 순간 '아, 여기가 집이구나' 싶죠. 매일 같은 반찬인데 왜 또 먹고 싶을까요? 그건 할매 손맛엔 '기억'을 담는 비밀이 있거든요.

👵🏻 체험: 시골 장터 돕기
<img src="${card5}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />
5일장 날, 새벽부터 짐을 싸들고 장터로 나가는 할매의 뒤를 따릅니다. 할매는 마늘과 나물을 펼쳐놓고 "이거는 그냥 드릴게예~" 하며 손님들을 맞이하죠. 가격 흥정도 배우고, 물건 포장도 돕다 보면 어느새 나도 장사꾼. 시골 장터 특유의 왁자지껄함과 인심을 그대로 느낄 수 있어요.`,
  },
];

const Experience = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <div className="page-shadow-wrapper">
      <div className="side-shadow left"></div>
      <div className="side-shadow right"></div>
      <div className="experience-page main-content">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".custom-button-next",
            prevEl: ".custom-button-prev",
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2.5,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Navigation, Autoplay]}
          className="experience-carousel"
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index} className="experience-slide">
              <div
                className="experience-card"
                onClick={() => setSelectedCard(card)}
              >
                <div className="card-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Buttons */}
        <div className="custom-button-prev">‹</div>
        <div className="custom-button-next">›</div>

        {selectedCard && (
          <Modal
            open={true}
            onClose={() => setSelectedCard(null)}
            title={selectedCard.title}
          >
            <div className="experience-modal-content">
              <div className="modal-description">
                <div
                  dangerouslySetInnerHTML={{ __html: selectedCard.details }}
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Experience;
