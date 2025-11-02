import React from 'react';

const HeroSection = () => {

    return (
        <div className="bg-white relative flex flex-col md:flex-row md:items-center min-h-[380px] md:h-[416px] pt-[36px] md:pt-[64px] md:bg-no-repeat md:bg-right md:bg-contain md:bg-[url('/topo.png')]">
            {/* Imagem full-bleed no topo para mobile (fora do container) */}
            <img
                src="/topo-mobile.png"
                alt="Feijó Seguros"
                className="block md:hidden w-full max-h-[240px] object-contain"
            />

            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-0 relative mt-4 md:mt-0">
                {/* Barra vertical em desktop */}
                <div className="hidden md:block absolute left-4 md:left-50 top-1/2 -translate-y-1/2 w-2 h-[78px] md:h-[208px] bg-[#cc2c32]" />

                {/* Texto abaixo da imagem no mobile e à esquerda no desktop */}
                <div className="text-left flex flex-col justify-start z-10 md:max-w-[55%] md:pl-8">
                    <h1 className="text-2xl md:text-4xl font-light mb-2">
                        <span className="text-[#cc2c32]">FEIJÓ</span> <span className="text-[#21282d]">SEGUROS</span>
                    </h1>
                    <h2 className="text-lg md:text-3xl font-light mb-2 text-[#21282d]">
                        Proteção e segurança para o que importa.
                    </h2>
                    <p className="text-base md:text-lg font-light text-[#cc2c32]">
                        Na Feijó Seguros, oferecemos as melhores soluções em seguros para você, sua família e seu patrimônio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
