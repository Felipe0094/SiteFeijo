
import React, { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [views, setViews] = useState<number | null>(null);
  const [counts, setCounts] = useState<{ home?: number; simulator?: number; simulator_contact_clicks?: number } | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const base = import.meta.env.BASE_URL || '/';
        const raw = window.location.pathname || '/';
        const path = raw.startsWith(base) ? raw.slice(base.length - 1) : raw;
        const metricId = path === '/' ? 'home' : path === '/consorcio/simulador' ? 'simulator' : null;
        if (!metricId) {
          if (active) setViews(null);
          return;
        }

        const today = new Date().toISOString().slice(0, 10);
        const storageKey = `pv:${metricId}:${today}`;
        
        // Use RPC to increment atomically if not visited today
        if (!localStorage.getItem(storageKey)) {
          const { error } = await supabase.rpc('increment_page_view', { page_id: metricId });
          if (!error) {
            localStorage.setItem(storageKey, '1');
          }
        }

        // Fetch current count to display
        const { data } = await supabase
          .from('page_views')
          .select('count')
          .eq('id', metricId)
          .single();
        
        if (active) setViews(data?.count ?? 0);

        const { data: all } = await supabase
          .from('page_views')
          .select('id,count')
          .in('id', ['home', 'simulator', 'simulator_contact_clicks']);
        if (active) {
          const map: { [k: string]: number } = {};
          (all || []).forEach((row: any) => { map[row.id] = row.count; });
          setCounts({
            home: map['home'],
            simulator: map['simulator'],
            simulator_contact_clicks: map['simulator_contact_clicks'],
          });
        }
      } catch {
        if (active) setViews(null);
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return (
    <footer className="bg-[#45484A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img 
              src="/lovable-uploads/8b7fe028-0dc1-4e27-9566-1cc2f01c47dc.png" 
              alt="Feijó Seguros" 
              className="h-12 mb-4"
            />
            <p className="text-gray-300 font-light mb-4">
              Oferecendo as melhores soluções em seguros para sua tranquilidade e segurança.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-light mb-4">Seguros</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro de Automóveis</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro Viagem</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro Residencial</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro de Vida</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro Condomínio</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Seguro Garantia</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Consórcio</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-light mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Início</a></li>
              <li><a href="#services" className="text-gray-300 font-light hover:text-white">Seguros</a></li>
              <li><a href="#about" className="text-gray-300 font-light hover:text-white">Sobre Nós</a></li>
              <li><a href="#contact" className="text-gray-300 font-light hover:text-white">Contato</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-300 font-light hover:text-white">Termos de Uso</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-light mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 font-light">Praça Getúlio Vargas, nº 17 - Sala 102 - Ed. Clóvis Bastos - Centro - Miracema / RJ</li>
              <li className="text-gray-300 font-light">E-mail: feijocorretora@gmail.com</li>
              <li className="text-gray-300 font-light">Fone: (22) 3852 - 0872</li>
              <li className="text-gray-300 font-light">Celular: (22)98852-1503</li>
            
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Feijó Seguros. Todos os direitos reservados.</p>
          {(() => {
            const base = import.meta.env.BASE_URL || '/';
            const raw = typeof window !== 'undefined' ? window.location.pathname : '/';
            const path = raw.startsWith(base) ? raw.slice(base.length - 1) : raw;
            const isHome = path === '/';
            return isHome ? (
              <p className="hidden sm:block text-[10px] text-gray-400 mt-1">Principal: {counts?.home ?? '—'} · Simulador: {counts?.simulator ?? '—'} · Botão: {counts?.simulator_contact_clicks ?? '—'}</p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">Acessos: {views ?? '—'}</p>
            );
          })()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
