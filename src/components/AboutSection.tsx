
import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react'; const AboutSection = () => {
  const [startFade, setStartFade] = useState(false);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          setStartFade(true);
          const targets = [15, 2, 20, 3];
          const start = performance.now();
          const duration = 1200;
          const animate = () => {
            const now = performance.now();
            const t = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            const vals = targets.map((target) => Math.floor(target * ease));
            setCounts(vals);
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          obs.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className={`text-2xl md:text-3xl font-light mb-4 text-feijo-darkgray ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '0ms' }}>Sobre a Corretora</h2>
            <p className={`text-feijo-gray font-light mb-6 ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '120ms' }}>
              A Feijó Seguros nasceu para oferecer consultoria em seguros com atendimento humano e personalizado, sempre focada na tranquilidade e segurança de cada cliente.
Com forte presença na nossa região, atuamos com ética e compromisso, indicando as melhores soluções de proteção de acordo com cada perfil e necessidade.
            </p>
            <p className={`text-feijo-gray font-light mb-8 ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '240ms' }}>
             Nossa Missão: Garantir a tranquilidade e a satisfação dos nossos clientes, oferecendo consultoria e serviços de seguros com qualidade, transparência e comprometimento.
            </p>
              <p className={`text-feijo-gray font-light mb-8 ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '360ms' }}>
                Nossa Visão: Ser reconhecida como referência em consultoria de seguros na nossa região, destacando-se pela excelência no atendimento, confiança e proximidade com o cliente.
              </p>
          </div>
            <div className="bg-[#cc2c32] p-1 rounded-lg">
            <div className="bg-white p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-6">
                  <h3 className={`text-3xl md:text-4xl font-bold text-[#cc2c32] ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '0ms' }}>{counts[0]}+</h3>
                  <p className="text-feijo-gray font-light">Anos de experiência</p>
                </div>
                <div className="p-6">
                  <h3 className={`text-3xl md:text-4xl font-bold text-[#cc2c32] ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '120ms' }}>{counts[1]}k+</h3>
                  <p className="text-feijo-gray font-light">Clientes satisfeitos</p>
                </div>
                <div className="p-6">
                  <h3 className={`text-3xl md:text-4xl font-bold text-[#cc2c32] ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '240ms' }}>{counts[2]}+</h3>
                  <p className="text-feijo-gray font-light">Seguradoras parceiras</p>
                </div>
                <div className="p-6">
                  <h3 className={`text-3xl md:text-4xl font-bold text-[#cc2c32] ${startFade ? 'fade-up' : 'pre-fade'}`} style={{ ['--fade-delay' as any]: '360ms' }}>{counts[3]}k+</h3>
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
