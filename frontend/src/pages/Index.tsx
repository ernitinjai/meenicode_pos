import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FaqSection from '@/components/FaqSection';
import CtaSection from '@/components/CtaSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-saas-black text-white">
      <Navbar
        isAuthenticated={false}
        onAuthSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
        onSignOut={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      <main>
        <HeroSection />

        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
