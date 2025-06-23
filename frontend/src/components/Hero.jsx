import React from 'react';
import heroImage from '../assets/홈_상단사진.png';

const Hero = () => {
  return (
    <section>
      <img src={heroImage} alt="숙소 전경" style={{ width: '100%' }} />
    </section>
  );
};

export default Hero;
