"use client";
import React, { useEffect, useRef } from "react";
import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import "./MainPage.css";

// 이미지 import
import countryHouseImage from "../../assets/images/홈_정겨운시골집.png";
import landscapeImage from "../../assets/images/홈_전경사진.png";
import tableImage from "../../assets/images/홈_따뜻한밥상.png";
import experienceImage from "../../assets/images/홈_특별한체험.png";
import warmthImage from "../../assets/images/홈_삶의온기.png";
import houseImage from "../../assets/images/홈_집사진.jpg";
import grandmaLogo from "../../assets/images/할머니로고.png";

const MainPage = () => {
  const animateRef = useRef(null);

  useEffect(() => {
    if (!animateRef.current) return;

    animateRef.current.style.visibility = "visible";

    const targets = animateRef.current.querySelectorAll(
      "h1.main-title, p.main-subtitle, p.intro-text, .detailed-description p, .detailed-description .signature"
    );

    targets.forEach((el) => {
      const { words } = splitText(el);
      animate(
        words,
        { opacity: [0, 1], y: [20, 0] },
        {
          duration: 1.2,
          delay: stagger(0.04),
          easing: "ease-out",
        }
      );
    });
  }, []);

  return (
    <div className="main-page">
      {/* Hero Section - 메인 이미지 */}
      {/* <section className='hero-section'>
        <div className='hero-image'>
          <img src={topImage} alt='할머니의 손맛' />
        </div>
      </section> */}

      {/* Title Section - 할매의 손맛 */}
      <section
        className="title-section"
        ref={animateRef}
        style={{ visibility: "hidden" }}
      >
        <div className="container">
          <div className="title-icon">
            <img src={grandmaLogo} alt="할머니로고" />
          </div>
          <h1 className="main-title">할매의 손맛</h1>
          <p className="main-subtitle">홈스테이, 따뜻한밥상, 농촌체험</p>

          <p className="intro-text">
            시골 할매 품에서, 따뜻한 밥 한 끼와 진짜 쉼을 드립니다.
          </p>

          <div className="detailed-description">
            <p>잠시 멈추어도 괜찮습니다.</p>
            <p>복잡한 도시와 바쁜 일상에서 벗어나</p>
            <p>시골 할매의 따뜻한 손길이 머무는 작은 집에서</p>
            <p>정겨운 밥 한 끼, 진실 어린 이야기를 나누며</p>
            <p>마음 깊이 쉬어가세요.</p>

            <br />

            <p>직접 기른 채소와 재철 재료로</p>
            <p>정성껏 차려낸 따뜻한 식사,</p>
            <p>포근한 이부자리와 나직한 마당 풍경,</p>
            <p>그리고 고즈넉한 시골의 하루가 당신을 기다립니다.</p>

            <br />

            <p>시골의 하루를 더 깊이 느껴보고 싶다면</p>
            <p>과수원에서 함께 사과를 따고,</p>
            <p>밭에서 허리 한 번 구부리며,</p>
            <p>시골의 손맛과 흙냄새를 가까이서 느낄 수도 있습니다.</p>

            <br />

            <p>좀더 마음도 내려놓고,</p>
            <p>소박한 행복을 다시 떠올릴 수 있는 시간.</p>
            <p>그런 쉼이 필 수 있기를,</p>
            <p>할매가 정성으로 맞이합니다.</p>

            <p className="signature">할매의 맛 올림</p>
          </div>
        </div>
      </section>

      {/* Country Life Section - 큰 회색 박스와 침실 이미지 */}
      <section className="country-life-section">
        <div className="container">
          <div className="content-row">
            <div className="gray-box">
              <p className="box-text">
                바쁜 세상 속 쉼표, 고요한{" "}
                <span className="highlight">시골의 하루</span>
              </p>
            </div>
            <div className="image-content">
              <img src={houseImage} alt="시골집 침실" />
            </div>
          </div>

          <div className="description-section">
            <p className="description-title">
              한 끼의 밥과 따스한 온기로 채우는 여행
            </p>

            <div className="description-details">
              <p>갓 지은 밥과 푸근한 인사로 차려지는 할머니 밥상.</p>
              <p>한 숟갈마다 전해지는 정성과 이야기,</p>
              <p>할머니 손맛이 머무는 식탁에서</p>
              <p>마음까지 포근해지는 여행을 시작해보세요.</p>
            </div>

            <div className="bottom-line"></div>
          </div>
        </div>
      </section>

      {/* Landscape Section - 전경 이미지 */}
      <section className="landscape-section">
        <div className="landscape-container">
          <img src={landscapeImage} alt="전경" />
          <div className="landscape-overlay">
            <p className="overlay-text-1">
              오시는 분들과 함께 소박한 밥 한 끼, 따뜻한 이야기를 나누고
              싶습니다.
            </p>
            <p className="overlay-text-2">
              단순히 머물다 가는 숙소가 아닌, 정이 오가고 마음이 쉬어가는 곳이
              되고자 합니다.
            </p>
            <p className="overlay-text-3">
              할매의 손맛에 오셔서, 시골집의 온기와 함께 잊지 못할 추억을 만들어
              보시는 건 어떨까요..!
            </p>
          </div>
        </div>
      </section>

      {/* Small Gray Box Section - 전경 이미지 바로 아래 */}
      <section className="small-gray-box-section">
        <div className="container">
          <div className="content-row-right">
            <div className="gray-box-small">
              <p className="box-text">
                손끝에 남는 흙냄새처럼,
                <br />
                <span className="highlight">오래 기억될 하루</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Cards Section - 3개 카드 */}
      <section className="experience-cards-section">
        <div className="container">
          <div className="cards-grid">
            <div className="experience-card">
              <div className="card-image">
                <img src={countryHouseImage} alt="정겨운 시골집" />
              </div>
              <div className="card-content">
                <h3>정겨운 시골집</h3>
                <p>정겨운 할머니의 포근한 공간</p>
              </div>
            </div>

            <div className="experience-card">
              <div className="card-image">
                <img src={tableImage} alt="따뜻한 밥상" />
              </div>
              <div className="card-content">
                <h3>따뜻한 밥상</h3>
                <p>
                  할머니의 정성이 담긴 따뜻한 밥상에서 보내는 오순도순 소중한
                  시간
                </p>
              </div>
            </div>

            <div className="experience-card">
              <div className="card-image">
                <img src={experienceImage} alt="특별한 체험" />
              </div>
              <div className="card-content">
                <h3>특별한 체험</h3>
                <p>할머니의 삶 속에 들어가 보아요</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Image Section - 삶의 온기 이미지 */}
      <section className="final-image-section">
        <div className="container">
          <div className="content-row-left">
            <div className="gray-box-small">
              <p className="box-text">
                정이 흐르는 시골집에서 다시 만나는{" "}
                <span className="highlight">삶의 온기</span>
              </p>
            </div>
          </div>
        </div>
        <div className="final-image">
          <img src={warmthImage} alt="삶의 온기" />
        </div>
      </section>
    </div>
  );
};

export default MainPage;
