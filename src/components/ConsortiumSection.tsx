import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ConsortiumSection = () => {
  const [startFade, setStartFade] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setStartFade(true);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return (
    <section
      ref={sectionRef}
      id="consorcio-porto-seguro"
      className="relative py-0"
      style={{ backgroundColor: '#f7f9fa' }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 min-h-[400px]">
        {/* Imagem primeiro no mobile, segundo no desktop */}
        <div className="flex-1 h-full relative min-h-[300px] lg:min-h-[400px] order-1 lg:order-2 w-full">
          <img
            src="/06.png"
            alt="Consórcio Porto Seguro"
            className={`w-full h-full object-cover ${startFade ? 'fade-left' : 'pre-fade-left'}`}
            style={{ ['--fade-delay' as any]: '0ms' }}
          />
        </div>

        {/* Botão isolado no mobile entre imagem e texto */}
        <div className="order-2 w-full px-4 md:px-8 text-center block lg:hidden">
          <Link to="/consorcio/simulador">
            <button
              className={`bg-[#cc2c32] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b02429] transition-colors ${startFade ? 'fade-up' : 'pre-fade'}`}
              style={{ ['--fade-delay' as any]: '500ms' }}
            >
              Simule agora o seu Consórcio Porto Seguro
            </button>
          </Link>
        </div>

        {/* Texto por último no mobile, primeiro no desktop */}
        <div className="flex-1 text-left px-4 md:px-8 lg:pr-8 order-3 lg:order-1">
          <h2
            className={`text-3xl md:text-4xl font-light mb-6 mt-8 ${startFade ? 'fade-up' : 'pre-fade'}`}
            style={{ ['--fade-delay' as any]: '0ms' }}
          >
            <span className="text-[#cc2c32]">Consórcio de Automóveis</span>{' '}
            <span className="text-[#21282d]">Porto Seguro</span>
          </h2>
          <div className="space-y-4 text-[#21282d] text-lg font-light leading-relaxed text-justify">
            <p>
              Cansado do financiamento? Seu carro novo sem Juros e sem Entrada!
            </p>
            <p>
              O Consórcio de Automóveis Porto Seguro é a forma mais inteligente de ter o seu veículo (novo ou usado) com a segurança de quem entende de carro.
            </p>
            <p>
              Simule 100% Online e veja como as parcelas são leves e cabem no seu planejamento.
            </p>
          </div>
          {/* Botão visível apenas em telas grandes dentro do bloco de texto */}
          <div className="mt-8 mb-12 text-center hidden lg:block">
            <Link to="/consorcio/simulador">
              <button
                className={`bg-[#cc2c32] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b02429] transition-colors ${startFade ? 'fade-up' : 'pre-fade'}`}
                style={{ ['--fade-delay' as any]: '500ms' }}
              >
                Simule agora o seu Consórcio de Automóveis
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsortiumSection;
