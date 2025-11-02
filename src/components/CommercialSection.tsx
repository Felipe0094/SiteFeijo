import React from 'react';
import { Link } from 'react-router-dom';

const CommercialSection = () => {

  return (
    <section 
      className="py-0 relative"
      style={{ 
        backgroundColor: '#f7f9fa'
      }}
    >
      
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 min-h-[400px]">
        {/* Texto alinhado à esquerda - ordem 1 em mobile, ordem 1 em desktop */}
        <div className="flex-1 text-left px-4 md:px-8 lg:pr-8 order-1">
          <h2 className="text-3xl md:text-4xl font-light mb-6 mt-8">
            <span className="text-[#cc2c32]">Planos de Saúde</span>{' '}
            <span className="text-[#21282d]">Empresariais</span>
          </h2>
          
          <div className="space-y-4 text-[#21282d] text-lg font-light leading-relaxed text-justify">
            <p>
              Cuide da saúde da sua família e colaboradores com os melhores planos de saúde empresariais do mercado. 
              Na Feijó Seguros, oferecemos soluções personalizadas que garantem tranquilidade e proteção para quem você mais ama.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/seguros/saude/cotacao">
              <button className="bg-[#cc2c32] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#b02429] transition-colors">
                Solicitar Cotação
              </button>
            </Link>
          </div>
        </div>
        
        {/* Imagem comercial - ordem 2 em mobile (abaixo do texto), ordem 2 em desktop (à direita) */}
        <div 
          className="flex-1 h-full relative min-h-[300px] lg:min-h-[400px] order-2 w-full"
          style={{
            backgroundImage: 'url(/comercial.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat'
          }}
        >
        </div>
      </div>
    </section>
  );
};

export default CommercialSection;