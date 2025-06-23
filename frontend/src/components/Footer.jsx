import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#F5F5F5',
      padding: '2rem',
      textAlign: 'center',
      borderTop: '1px solid #E0E0E0',
      marginTop: '4rem'
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#333'
      }}>
        T E L
      </div>
      
      <div style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        color: '#333'
      }}>
        010-5517-1521
      </div>
      
      <div style={{
        fontSize: '0.9rem',
        color: '#666',
        lineHeight: '1.6'
      }}>
        <p>계좌번호 : 국민 28770104431749 (예금주 : 김O연) | 업체명 : 할매의 손맛 | 대표명 : 최시원 | 관리자 로그인 | 개인정보 취급방침 | 홈페이지 제작 마늘톤팀</p>
      </div>
    </footer>
  );
};

export default Footer;
