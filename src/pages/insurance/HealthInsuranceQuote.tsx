
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HealthInsuranceQuoteForm from '@/components/health-insurance/HealthInsuranceQuoteForm';

const HealthInsuranceQuote = () => {
  useEffect(() => {
    // Garante que a página sempre carregue no topo
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 md:px-8">
      <div className="min-h-screen flex flex-col my-4 md:my-8 bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
        <Navbar />
        <main className="flex-grow pt-[56px] md:pt-[64px]">
          <div className="py-8 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-feijo-darkgray mb-6">Cotação de Seguro Saúde</h1>
            <HealthInsuranceQuoteForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HealthInsuranceQuote;
