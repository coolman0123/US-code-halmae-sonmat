import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-title'>T E L</div>

      <div className='footer-tel'>010-0231-5678</div>

      <div className='footer-text'>
        <p>
          계좌번호 : 국민 2357543645345 (예금주 : 김O연) | 업체명 : 할매의 손맛
          | 대표명 : 최시원 | 관리자 로그인 | 개인정보 취급방침 | 홈페이지 제작
          마늘톤팀
        </p>
      </div>
    </footer>
  );
};

export default Footer;
