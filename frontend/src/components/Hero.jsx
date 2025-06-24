import React from 'react';
import '../styles/Hero.css';
import heroImage from '../assets/홈_상단사진.png';

const Hero = () => {
  return (
    <section className="hero-section">
      <img src={heroImage} alt="숙소 전경" className="hero-image" />
    </section>
  );
};

export default Hero;
