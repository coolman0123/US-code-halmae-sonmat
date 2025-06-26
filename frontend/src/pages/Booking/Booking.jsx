import React from 'react';
import './Booking.css';

// 이미지 import
import heroImage from '../../assets/images/상단_메인이미지.png';
import facilityImage from '../../assets/images/예약안내_2.png';
import infoImage from '../../assets/images/예약안내_1.png';

const Booking = () => {
  return (
    <div className="booking-page">
      {/* 상단 히어로 이미지 */}
      <section className="booking-hero">
        <div className="hero-image-container">
          <img src={heroImage} alt="할매의 손맛 예약안내" className="hero-image" />
        </div>
      </section>

      {/* 타이틀 섹션 */}
      <section className="booking-title">
        <div className="container">
          <p className="title-subtitle">정겨운 여행을 만나는 공간</p>
          <h1 className="title-main">예약안내</h1>
        </div>
      </section>

      <main className="booking-main">

        {/* 이용안내 & 요금시설 섹션 */}
        <section className="booking-info-section">
          <div className="info-container">
            <div className="info-image">
              <img src={infoImage} alt="이용안내" />
            </div>
            <div className="info-content">
              <h2 className="info-title">이용안내 & 유의사항</h2>
              <div className="info-text">
                <p>• 숙박요금적용 : (일요일~목요일) *금요일은 별도</p>
                <p>• 주말요금적용 : (토요일, 및 공휴일 전날)</p>
                <p>• 한 끼 식사는 숙박비에 포함된 가격이며, 상황에 따라 약간의 변동이 있을 수 있습니다.</p>
                <p>• 영유아(12개월미만)는 입실 무료입니다. 단, 식사 및 침구는 미제공되오니 참고부탁드립니다.</p>
                <p>또한 영유아 입실 시 적절한 운영으로 미무시는데 불편함이 없으시도록 요청란에 미리 고지해주시기 바랍니다.</p>
                <p>• 아동기준 : 12개월 이상 ~ 13세 이하(인원추가 시 25,000원)</p>
                <p>• 각 객실마다 개별 욕실(변기, 세면대, 샤워기)이 있으며, 샤워용품(샴푸, 트리트먼트, 바디워시)및 핸드워시,</p>
                <p>비누, 치약, 수건이 준비되어 있습니다.</p>
                <p>• TV, 냉장고, 드라이기가 구비되어 있습니다.</p>
                <p>• 식사나 커피는 공용주방에 비치되어 있으며, 개인 텀블러나 물병을 가지고 오시면 이용이 편리합니다.</p>
                <p>• 애완동물은 동반, 입실할 수 없습니다.</p>
                <p>• 가볍게, 마음만 기쁘게 오시면 최선으로 모시겠습니다.</p>
                <p><strong>• 백년이 넘은 집의 경우, 벌레가 나타날 수 있으며 그로 인한 환불은 불가합니다.</strong></p>
                <p><strong>• 의성군은 조용한 시골마을입니다. 동네의 길고양이들이 마당에 자주 놀러옵니다.</strong></p>
                <p><strong>고양이를 무서워하시는 분들은 참고해주세요.</strong></p>
                <p>• 입실시간은 오후 3시부터입니다.</p>
                <p>• 퇴실시간은 오전 11시까지입니다.</p>
                <p>• 객실정리가 끝나시면 할머니께 연락하시어 퇴실점검을 받으시기 바랍니다.</p>
                <p>• 오후 10시 이후의 입실은 사전에 반드시 연락주시기 바랍니다.</p>
                <p>• 집기 파손 시에는 할머니께 알려주시기 바랍니다.</p>
                <p>• 객실 내에는 절대 금연입니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 환불기준 섹션 */}
        <section className="refund-section">
          <div className="refund-container">
            <div className="refund-image">
              <img src={facilityImage} alt="환불기준" />
            </div>
            <div className="refund-content">
              <h2 className="refund-title">환불기준</h2>
              <div className="refund-text">
                <p>올바른 예약문화 정착을 위하여 할매집에서는 예약취소 시 환불기준을 아래와 같이 운영하고 있사오니</p>
                <p>꼭 확인을 하시고 예약해 주시기 바랍니다!</p>
                <p>백년이 넘은 집의 경우, 벌레가 나타날 수 있으며 그로 인한 환불은 불가합니다.</p>
                
                <div className="refund-table">
                  <table>
                    <thead>
                      <tr>
                        <th>이용일로부터</th>
                        <th>7일전</th>
                        <th>6일전</th>
                        <th>5일전</th>
                        <th>4일전</th>
                        <th>3일전</th>
                        <th>2일전</th>
                        <th>1일전</th>
                        <th>당일</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>환불율</td>
                        <td>100%</td>
                        <td>100%</td>
                        <td>80%</td>
                        <td>70%</td>
                        <td>50%</td>
                        <td>30%</td>
                        <td>10%</td>
                        <td>환불불가</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p><strong>※ 예약 취소 시 기본 취소수수료 10% 부과되오니 꼭 신중한 예약 부탁드립니다.</strong></p>
                <p>※ 환불은 입금자 확인 후 예약금이 아닌 전체이용요금에서 위약금을 빼고 입금자 계좌로 보내드립니다.</p>
                <p>※ 예약날짜 변경시 취소나 환불이 불가하니 신중하게 날짜를 변경해 주시기 바랍니다.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Booking;
