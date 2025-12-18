
import React from 'react';
import { Check } from 'lucide-react'; const AboutSection = () => {

  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-light mb-4 text-feijo-darkgray">Sobre a Corretora</h2>
            <p className="text-feijo-gray font-light mb-6">
              A Feijó Seguros nasceu para oferecer consultoria em seguros com atendimento humano e personalizado, sempre focada na tranquilidade e segurança de cada cliente.
Com forte presença na nossa região, atuamos com ética e compromisso, indicando as melhores soluções de proteção de acordo com cada perfil e necessidade.
            </p>
            <p className="text-feijo-gray font-light mb-8">
             Nossa Missão: Garantir a tranquilidade e a satisfação dos nossos clientes, oferecendo consultoria e serviços de seguros com qualidade, transparência e comprometimento.
            </p>
              <p className="text-feijo-gray font-light mb-8">
                Nossa Visão: Ser reconhecida como referência em consultoria de seguros na nossa região, destacando-se pela excelência no atendimento, confiança e proximidade com o cliente.
              </p>
          </div>
            <div className="bg-[#cc2c32] p-1 rounded-lg">
            <div className="bg-white p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#cc2c32]">15+</h3>
                  <p className="text-feijo-gray font-light">Anos de experiência</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#cc2c32]">2k+</h3>
                  <p className="text-feijo-gray font-light">Clientes satisfeitos</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#cc2c32]">20+</h3>
                  <p className="text-feijo-gray font-light">Seguradoras parceiras</p>
                </div>
                <div className="p-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#cc2c32]">3k+</h3>
                  <p className="text-feijo-gray font-light">Apólices gerenciadas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default AboutSection;
