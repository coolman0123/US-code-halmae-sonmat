import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import IntroSection from '../components/IntroSection';
import InfoLinksSection from '../components/InfoLinksSection';
import CountryLifeSection from '../components/CountryLifeSection';
import LandscapeSection from '../components/LandscapeSection';
import ExperienceCardsSection from '../components/ExperienceCardsSection';
import WarmthSection from '../components/WarmthSection';
import Footer from '../components/Footer';

const MainPage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <IntroSection />
      <InfoLinksSection />
      <CountryLifeSection />
      <LandscapeSection />
      <ExperienceCardsSection />
      <WarmthSection />
      <Footer />
    </div>
  );
};

export default MainPage;
