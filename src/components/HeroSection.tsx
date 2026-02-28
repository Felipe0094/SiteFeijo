import React, { useEffect, useState } from 'react';

const HeroSection = () => {
    const [startFade, setStartFade] = useState(false);
    useEffect(() => {
        const baseDelay = 800;
        const id = setTimeout(() => setStartFade(true), baseDelay);
        return () => clearTimeout(id);
    }, []);

    return (
        <div className="bg-white relative flex flex-col md:flex-row md:items-center min-h-[380px] md:h-[416px] pt-[36px] md:pt-[64px]">
            <video
                className="block md:hidden w-full max-h-[240px] object-cover"
                src="/herowebm.webm"
                autoPlay
                muted
                playsInline
                aria-label="Feijó Seguros vídeo hero"
            />

            <video
                className="hidden md:block absolute right-0 top-0 h-full max-h-[416px] object-cover pointer-events-none"
                src="/herowebm.webm"
                autoPlay
                muted
                playsInline
                aria-label="Feijó Seguros vídeo hero"
            />

            <div className="container mx-auto px-4 md:px-8 h-full flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-0 relative mt-4 md:mt-0">
                <div className="hidden md:block absolute left-4 md:left-50 top-1/2 -translate-y-1/2 w-2 h-[78px] md:h-[208px] bg-[#cc2c32]" />

                <div className="text-left flex flex-col justify-start z-10 md:max-w-[55%] md:pl-8">
                    <h1 className={`text-2xl md:text-4xl font-light mb-2 ${startFade ? 'hero-fade-up' : ''}`} style={{ ['--hero-delay' as any]: '0ms' }}>
                        <span className="text-[#cc2c32]">FEIJÓ</span> <span className="text-[#21282d]">SEGUROS</span>
                    </h1>
                    <h2 className={`text-lg md:text-3xl font-light mb-2 text-[#21282d] ${startFade ? 'hero-fade-up' : ''}`} style={{ ['--hero-delay' as any]: '250ms' }}>
                        Proteção e segurança para o que importa.
                    </h2>
                    <p className={`text-base md:text-lg font-light text-[#cc2c32] ${startFade ? 'hero-fade-up' : ''}`} style={{ ['--hero-delay' as any]: '500ms' }}>
                        Na Feijó Seguros, oferecemos as melhores soluções em seguros para você, sua família e seu patrimônio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
