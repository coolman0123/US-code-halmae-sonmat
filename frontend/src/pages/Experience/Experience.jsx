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
import card1 from "../../assets/images/할매의손맛이야기_1.png";
import card2 from "../../assets/images/할매의손맛이야기_2.png";
import card3 from "../../assets/images/할매의손맛이야기_3.png";
import card4 from "../../assets/images/할매의손맛이야기_4.png";
import card5 from "../../assets/images/홈_집사진.jpg";

const cards = [
  {
    title: "할머니의 손맛1",
    description: "말보단 손이 빠른 박봉순 할머니의 하루",
    image: card1,
    details: `📸 박봉순 할머니 (연세: 82세)

"말보단 손이 빠른" 할머니는 하루도 빠짐없이 아침 5시에 일어나 밭일을 하고 밥을 짓습니다.
말수는 적지만 식탁 위엔 언제나 정갈한 7첩 반상이 차려집니다.

대표 메뉴:
- 직접 재배한 콩으로 만든 청국장
- 푹 익은 묵은지를 넣은 묵은지찜

성격 한 줄 요약:
"말 안 해도 다 해놓는 성격이에요. 손이 말해요."

🥢 할매 밥상
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />

된장찌개, 묵은지찜, 나물무침, 제철 나물 등… 정성껏 차린 한 끼를 경험하세요.

🏠 숙소 소개
<img src="${card1}" alt="숙소 사진" style="width: 100%; margin: 10px 0;" />
할머니가 직접 지은 한옥 느낌의 방에서 따뜻한 시골 정취를 느낄 수 있어요.

🧺 일손 돕기 체험
<img src="${card1}" alt="일손 체험" style="width: 100%; margin: 10px 0;" />
감자 캐기, 장 담그기, 땔감 나르기, 김장 담그기 등
할머니의 하루를 함께 경험하며 시골의 삶을 배워보세요.`,
  },
  {
    title: "할머니의 손맛2",
    description: "말보단 손이 빠른 박봉순 할머니의 하루",
    image: card2,
    details: `📸 박봉순 할머니 (연세: 82세)

"말보단 손이 빠른" 할머니는 하루도 빠짐없이 아침 5시에 일어나 밭일을 하고 밥을 짓습니다.
말수는 적지만 식탁 위엔 언제나 정갈한 7첩 반상이 차려집니다.

대표 메뉴:
- 직접 재배한 콩으로 만든 청국장
- 푹 익은 묵은지를 넣은 묵은지찜

성격 한 줄 요약:
"말 안 해도 다 해놓는 성격이에요. 손이 말해요."

🥢 할매 밥상
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />

된장찌개, 묵은지찜, 나물무침, 제철 나물 등… 정성껏 차린 한 끼를 경험하세요.

🏠 숙소 소개
<img src="${card1}" alt="숙소 사진" style="width: 100%; margin: 10px 0;" />
할머니가 직접 지은 한옥 느낌의 방에서 따뜻한 시골 정취를 느낄 수 있어요.

🧺 일손 돕기 체험
<img src="${card1}" alt="일손 체험" style="width: 100%; margin: 10px 0;" />
감자 캐기, 장 담그기, 땔감 나르기, 김장 담그기 등
할머니의 하루를 함께 경험하며 시골의 삶을 배워보세요.`,
  },
  {
    title: "할머니의 손맛3",
    description: "말보단 손이 빠른 박봉순 할머니의 하루",
    image: card3,
    details: `📸 박봉순 할머니 (연세: 82세)

"말보단 손이 빠른" 할머니는 하루도 빠짐없이 아침 5시에 일어나 밭일을 하고 밥을 짓습니다.
말수는 적지만 식탁 위엔 언제나 정갈한 7첩 반상이 차려집니다.

대표 메뉴:
- 직접 재배한 콩으로 만든 청국장
- 푹 익은 묵은지를 넣은 묵은지찜

성격 한 줄 요약:
"말 안 해도 다 해놓는 성격이에요. 손이 말해요."

🥢 할매 밥상
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />

된장찌개, 묵은지찜, 나물무침, 제철 나물 등… 정성껏 차린 한 끼를 경험하세요.

🏠 숙소 소개
<img src="${card1}" alt="숙소 사진" style="width: 100%; margin: 10px 0;" />
할머니가 직접 지은 한옥 느낌의 방에서 따뜻한 시골 정취를 느낄 수 있어요.

🧺 일손 돕기 체험
<img src="${card1}" alt="일손 체험" style="width: 100%; margin: 10px 0;" />
감자 캐기, 장 담그기, 땔감 나르기, 김장 담그기 등
할머니의 하루를 함께 경험하며 시골의 삶을 배워보세요.`,
  },
  {
    title: "할머니의 손맛4",
    description: "말보단 손이 빠른 박봉순 할머니의 하루",
    image: card4,
    details: `📸 박봉순 할머니 (연세: 82세)

"말보단 손이 빠른" 할머니는 하루도 빠짐없이 아침 5시에 일어나 밭일을 하고 밥을 짓습니다.
말수는 적지만 식탁 위엔 언제나 정갈한 7첩 반상이 차려집니다.

대표 메뉴:
- 직접 재배한 콩으로 만든 청국장
- 푹 익은 묵은지를 넣은 묵은지찜

성격 한 줄 요약:
"말 안 해도 다 해놓는 성격이에요. 손이 말해요."

🥢 할매 밥상
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />

된장찌개, 묵은지찜, 나물무침, 제철 나물 등… 정성껏 차린 한 끼를 경험하세요.

🏠 숙소 소개
<img src="${card1}" alt="숙소 사진" style="width: 100%; margin: 10px 0;" />
할머니가 직접 지은 한옥 느낌의 방에서 따뜻한 시골 정취를 느낄 수 있어요.

🧺 일손 돕기 체험
<img src="${card1}" alt="일손 체험" style="width: 100%; margin: 10px 0;" />
감자 캐기, 장 담그기, 땔감 나르기, 김장 담그기 등
할머니의 하루를 함께 경험하며 시골의 삶을 배워보세요.`,
  },
  {
    title: "할머니의 손맛5",
    description: "말보단 손이 빠른 박봉순 할머니의 하루",
    image: card5,
    details: `📸 박봉순 할머니 (연세: 82세)

"말보단 손이 빠른" 할머니는 하루도 빠짐없이 아침 5시에 일어나 밭일을 하고 밥을 짓습니다.
말수는 적지만 식탁 위엔 언제나 정갈한 7첩 반상이 차려집니다.

대표 메뉴:
- 직접 재배한 콩으로 만든 청국장
- 푹 익은 묵은지를 넣은 묵은지찜

성격 한 줄 요약:
"말 안 해도 다 해놓는 성격이에요. 손이 말해요."

🥢 할매 밥상
<img src="${card1}" alt="할매 밥상" style="width: 100%; margin: 10px 0;" />

된장찌개, 묵은지찜, 나물무침, 제철 나물 등… 정성껏 차린 한 끼를 경험하세요.

🏠 숙소 소개
<img src="${card1}" alt="숙소 사진" style="width: 100%; margin: 10px 0;" />
할머니가 직접 지은 한옥 느낌의 방에서 따뜻한 시골 정취를 느낄 수 있어요.

🧺 일손 돕기 체험
<img src="${card1}" alt="일손 체험" style="width: 100%; margin: 10px 0;" />
감자 캐기, 장 담그기, 땔감 나르기, 김장 담그기 등
할머니의 하루를 함께 경험하며 시골의 삶을 배워보세요.`,
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
          <Modal onClose={() => setSelectedCard(null)}>
            <div className="modal-content">
              <h2>{selectedCard.title}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: selectedCard.details }}
                style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Experience;
