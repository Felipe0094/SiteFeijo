
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CommercialSection from '../components/CommercialSection';
import InsuranceSection from '../components/InsuranceSection';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 md:px-8">
      <div className="min-h-screen flex flex-col my-4 md:my-8 bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
        <Navbar />
        <main className="flex-grow pt-[6px] md:pt-[30px]">
          <HeroSection />
          <InsuranceSection />
          <CommercialSection />
          <PartnersSection />
          <AboutSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
