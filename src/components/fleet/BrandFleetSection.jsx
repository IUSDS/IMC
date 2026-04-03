'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const BRANDS = [
  {
    name: 'Rolls-Royce',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/rolls-royce.png'
  },
  {
    name: 'BMW',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/bmw.png'
  },
  {
    name: 'Mercedes-Benz',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/mercedes-benz.png'
  },
  {
    name: 'Volvo',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/volvo.png'
  },
  {
    name: 'Land Rover',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/land-rover.png'
  },
  {
    name: 'Lamborghini',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/lamborghini.png'
  }
];

const CARS = [
  // Rolls-Royce
  { brand: 'Rolls-Royce', model: '1939 RR', trim: 'Vintage', price: '$2,500', power: '114 HP', engine: '7.3L V12', img: '/fleet/rollsroyce/1939-1.webp', images: ['/fleet/rollsroyce/1939-1.webp'] },
  { brand: 'Rolls-Royce', model: '2013 RR', trim: 'Chauffeur', price: '$1,800', power: '453 HP', engine: '6.75L V12', img: '/fleet/rollsroyce/2013-1.webp', images: ['/fleet/rollsroyce/2013-1.webp'] },

  // BMW
  { brand: 'BMW', model: 'Z4', trim: 'Roadster', price: '$400', power: '382 HP', engine: '3.0L I6', img: '/fleet/bmw/Z4-1.webp', images: ['/fleet/bmw/Z4-1.webp'] },
  { brand: 'BMW', model: '520i', trim: 'Sedan', price: '$350', power: '208 HP', engine: '2.0L I4', img: '/fleet/bmw/520i-1.webp', images: ['/fleet/bmw/520i-1.webp', '/fleet/bmw/520i-2.webp'] },

  // Mercedes-Benz
  { brand: 'Mercedes-Benz', model: 'G-Wagon', trim: 'G63 AMG', price: '$1,200', power: '577 HP', engine: '4.0L V8 TT', img: '/fleet/mercedes/Gwagon-1.webp', images: ['/fleet/mercedes/Gwagon-1.webp'] },
  { brand: 'Mercedes-Benz', model: 'E-Class', trim: 'Sedan', price: '$500', power: '255 HP', engine: '2.0L I4', img: '/fleet/mercedes/Eclass-1.webp', images: ['/fleet/mercedes/Eclass-1.webp', '/fleet/mercedes/Eclass-2.webp'] },

  // Volvo
  { brand: 'Volvo', model: 'S90', trim: 'Luxury Sedan', price: '$400', power: '295 HP', engine: 'Mild Hybrid', img: '/fleet/volvo/S90-1.webp', images: ['/fleet/volvo/S90-1.webp'] },

  // Land Rover
  { brand: 'Land Rover', model: 'Range Rover', trim: 'HSE', price: '$900', power: '395 HP', engine: '3.0L I6', img: '/fleet/landrover/RangeRover-1.webp', images: ['/fleet/landrover/RangeRover-1.webp'] },

  // Lamborghini
  { brand: 'Lamborghini', model: 'Aventador', trim: 'LP 780-4', price: '$2,500', power: '769 HP', engine: 'V12', img: '/fleet/lamborghini/aventador-1.webp', images: ['/fleet/lamborghini/aventador-1.webp', '/fleet/lamborghini/aventador-2.webp'] }
];

const SPOTLIGHT_DATA = {
  'Rolls-Royce': {
    models: ['1939 RR', '2013 RR'],
    details: {
      '1939 RR': { name: '1939 RR', desc: 'A timeless classic. Experience the vintage elegance and unmatched prestige of a 1939 Rolls-Royce.', power: '114 HP', engine: '7.3L V12', accel: '14.0s', topSpeed: '160 KM/H', img: '/fleet/rollsroyce/1939-1.webp' },
      '2013 RR': { name: '2013 RR', desc: 'Modern luxury refined. The 2013 phantom represents the pinnacle of contemporary chauffeur-driven excellence.', power: '453 HP', engine: '6.75L V12', accel: '5.9s', topSpeed: '240 KM/H', img: '/fleet/rollsroyce/2013-1.webp' }
    }
  },
  'Lamborghini': {
    models: ['Aventador'],
    details: {
      'Aventador': { name: 'Aventador', desc: 'The pure, unadulterated essence of a naturally aspirated V12 engine. Born for the track, unleashed on the street.', power: '769 HP', engine: '6.5L V12', accel: '2.8s', topSpeed: '355 KM/H', img: '/fleet/lamborghini/aventador-1.webp' }
    }
  },
  'BMW': {
    models: ['Z4', '520i'],
    details: {
      'Z4': { name: 'BMW Z4', desc: 'A true roadster experience. Dynamic agility meets open-air freedom and stunning aesthetics.', power: '382 HP', engine: '3.0L I6', accel: '3.9s', topSpeed: '250 KM/H', img: '/fleet/bmw/Z4-1.webp' },
      '520i': { name: 'BMW 520i', desc: 'The quintessential executive sedan combining supreme comfort with incredibly dynamic handling.', power: '208 HP', engine: '2.0L I4', accel: '7.5s', topSpeed: '230 KM/H', img: '/fleet/bmw/520i-1.webp' }
    }
  },
  'Mercedes-Benz': {
    models: ['G-Wagon', 'E-Class'],
    details: {
      'G-Wagon': { name: 'G-Wagon', desc: 'The indispensable conqueror. Instantly recognizable, eternally sophisticated, and unstoppably capable.', power: '577 HP', engine: '4.0L V8 TT', accel: '4.5s', topSpeed: '220 KM/H', img: '/fleet/mercedes/Gwagon-1.webp' },
      'E-Class': { name: 'E-Class', desc: 'A masterclass in intelligence. An icon of innovative safety, performance, and highly sophisticated luxury.', power: '255 HP', engine: '2.0L I4', accel: '6.1s', topSpeed: '210 KM/H', img: '/fleet/mercedes/Eclass-1.webp' }
    }
  },
  'Volvo': {
    models: ['S90'],
    details: {
      'S90': { name: 'Volvo S90', desc: 'Scandinavian sanctuary. The elegant flagship sedan designed meticulously around human comfort and safety.', power: '295 HP', engine: 'Mild Hybrid', accel: '6.2s', topSpeed: '180 KM/H', img: '/fleet/volvo/S90-1.webp' }
    }
  },
  'Land Rover': {
    models: ['Range Rover'],
    details: {
      'Range Rover': { name: 'Range Rover', desc: 'The pinnacle of refined capability. Unmistakable proportions, peerless luxury, and commanding all-terrain ability.', power: '395 HP', engine: '3.0L I6', accel: '5.8s', topSpeed: '242 KM/H', img: '/fleet/landrover/RangeRover-1.webp' }
    }
  }
};

export default function BrandFleetSection({ onOpenModal }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [currDegree, setCurrDegree] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const gridRef = useRef(null);
  const lastWheelTime = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const itemCount = BRANDS.length;
  const angle = 360 / itemCount;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Grid animations removed to guarantee 100% visibility on all devices
  }, []);

  const handlePrev = () => {
    setCurrDegree(prev => prev + angle);
    setActiveIndex(prev => (prev - 1 + itemCount) % itemCount);
    setSelectedModelIndex(0);
  };

  const handleNext = () => {
    setCurrDegree(prev => prev - angle);
    setActiveIndex(prev => (prev + 1) % itemCount);
    setSelectedModelIndex(0);
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;

    if (diff > 50) {
      handlePrev();
      setStartX(e.clientX);
    } else if (diff < -50) {
      handleNext();
      setStartX(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e) => {
    const now = Date.now();
    // Throttle wheel events so it doesn't spin wildly
    if (now - lastWheelTime.current < 500) return;

    if (e.deltaX > 30 || e.deltaY > 30) {
      handleNext();
      lastWheelTime.current = now;
    } else if (e.deltaX < -30 || e.deltaY < -30) {
      handlePrev();
      lastWheelTime.current = now;
    }
  };

  const getTransform = (index) => {
    let diff = index - activeIndex;
    if (diff > itemCount / 2) diff -= itemCount;
    if (diff < -itemCount / 2) diff += itemCount;

    const rotY = diff * 25;
    const transZ = Math.abs(diff) * -250;
    const scale = Math.max(0.4, 1.4 - Math.abs(diff) * 0.3);
    const opacity = diff === 0 ? 1 : Math.max(0, 0.8 - Math.abs(diff) * 0.25);
    const zIndex = 10 - Math.abs(diff);

    // X displacement calculation to create a sweeping arc across the screen
    const transX = diff * (isMobile ? 120 : 340);

    return {
      transform: `translateX(calc(-50% + ${transX}px)) translateY(-50%) translateZ(${transZ}px) scale(${scale}) rotateY(${rotY}deg)`,
      opacity: opacity,
      zIndex: zIndex,
    };
  };

  // Get dynamic spotlight data based on active brand
  const activeBrandName = BRANDS[activeIndex].name;
  const spotlightData = SPOTLIGHT_DATA[activeBrandName] || SPOTLIGHT_DATA['Rolls-Royce'];
  const currentModels = spotlightData.models;
  const currentModelKey = currentModels[selectedModelIndex] || currentModels[0];
  const currentSpotlight = spotlightData.details[currentModelKey];

  return (
    <>
      <section className="bg-black py-20 px-6 md:px-12 relative overflow-hidden border-t border-white/5">
        {/* Section Header */}
        <div className="max-w-[1440px] mx-auto text-center mb-12 md:mb-16">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-display font-medium block mb-3">Select by House</span>
          <h2 className="text-white font-headline text-2xl md:text-4xl font-medium tracking-tight uppercase">OUR BRANDS</h2>
        </div>

        {/* 3D Brand Carousel */}
        <div className="relative w-full mb-12 md:mb-20">
          <div
            className={`relative h-[240px] md:h-[400px] w-full flex items-center justify-center select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ perspective: '1500px', touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {/* Carousel Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-30 flex justify-between px-2 md:px-8 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="pointer-events-auto h-10 w-10 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous Brand"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="pointer-events-auto h-10 w-10 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#d4af37] hover:text-black transition-all duration-300 backdrop-blur-sm"
                aria-label="Next Brand"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
              {BRANDS.map((brand, index) => {
                const { transform, opacity, zIndex } = getTransform(index);
                const isActive = index === activeIndex;

                return (
                  <button
                    key={brand.name}
                    className="absolute top-1/2 left-1/2 cursor-pointer outline-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto"
                    style={{ transform, opacity, zIndex }}
                    onClick={(e) => {
                      e.stopPropagation();
                      let diff = index - activeIndex;
                      if (diff > itemCount / 2) diff -= itemCount;
                      if (diff < -itemCount / 2) diff += itemCount;
                      setCurrDegree(prev => prev - (diff * angle));
                      setActiveIndex(index);
                      setSelectedModelIndex(0);
                    }}
                  >
                    <div className={`flex flex-col items-center justify-center transition-all duration-500 w-[160px] md:w-[260px] h-[160px] md:h-[260px] ${isActive ? 'grayscale-0' : 'grayscale opacity-30 md:opacity-60 hover:grayscale-0 hover:opacity-100'}`}>
                      <div className="w-full flex items-center justify-center mb-1 md:mb-6 h-28 md:h-44">
                        <img
                          alt={brand.name}
                          className="object-contain drop-shadow-2xl transition-all duration-500 max-h-[100px] md:max-h-[140px] max-w-[120px] md:max-w-[200px]"
                          draggable="false"
                          src={brand.logo}
                        />
                      </div>
                      <span className={`uppercase font-display font-medium tracking-[0.2em] transition-colors duration-500 text-[10px] md:text-xs ${isActive ? 'text-[#d4af37]' : 'text-white/40'}`}>
                        {brand.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Spotlight Model Selector Tabs */}
        <div className="max-w-[1440px] mx-auto mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex bg-white/5 border border-white/10 overflow-hidden min-w-max">
            {currentModels.map((model, idx) => (
              <button
                key={model}
                onClick={() => setSelectedModelIndex(idx)}
                className={`py-4 px-8 md:px-12 text-center font-display text-[9px] md:text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 relative group border-r border-white/10 last:border-r-0 ${selectedModelIndex === idx ? 'text-[#d4af37] bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                <span className="relative z-10">{model}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Layout */}
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center bg-white/[0.02] p-6 md:p-12 border border-white/10">
            <div className="order-2 md:order-1">
              <span className="text-[#d4af37] font-display font-medium uppercase tracking-[0.4em] text-[10px] mb-4 block">
                {activeBrandName} Spotlight
              </span>
              <h3 className="text-white font-headline text-3xl md:text-6xl font-medium tracking-tight mb-6">
                {currentSpotlight.name}
              </h3>
              <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-xl font-body">
                {currentSpotlight.desc}
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10 border-y border-white/10 py-6">
                <div>
                  <span className="text-white/30 text-[10px] uppercase block mb-1 tracking-widest font-display font-medium">Power</span>
                  <span className="text-white font-headline font-medium text-lg md:text-xl">{currentSpotlight.power}</span>
                </div>
                <div>
                  <span className="text-white/30 text-[10px] uppercase block mb-1 tracking-widest font-display font-medium">Engine</span>
                  <span className="text-white font-headline font-medium text-lg md:text-xl">{currentSpotlight.engine}</span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-white/30 text-[10px] uppercase block mb-1 tracking-widest font-display font-medium">0–100</span>
                  <span className="text-white font-headline font-medium text-xl">{currentSpotlight.accel}</span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-white/30 text-[10px] uppercase block mb-1 tracking-widest font-display font-medium">Top Speed</span>
                  <span className="text-white font-headline font-medium text-xl">{currentSpotlight.topSpeed}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenModal(currentSpotlight.name)}
                className="champagne-gradient text-black font-display font-semibold px-10 py-5 tracking-[0.2em] uppercase text-[10px] hover:brightness-110 transition-all duration-300 shadow-xl w-full md:w-auto active:scale-95"
              >
                Reserve This Model
              </button>
            </div>
            <div className="order-1 md:order-2 relative aspect-video md:aspect-[16/9] overflow-hidden">
              <img
                key={currentSpotlight.img}
                alt={currentSpotlight.name}
                className="w-full h-full object-cover"
                src={currentSpotlight.img}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Isolated Section */}
      <section className="bg-[#050505] py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto mb-12 md:mb-16 sticky top-0 md:relative z-20 bg-[#050505]/95 md:bg-transparent py-4 md:py-0 backdrop-blur md:backdrop-blur-none border-b border-white/10 md:border-b-0">
          <span className="text-[#d4af37] font-display font-medium uppercase tracking-[0.4em] text-[10px] mb-2 block text-center">Collection</span>
          <h2 className="text-white font-headline text-2xl md:text-4xl font-medium tracking-tight uppercase text-center">THE PRIVATE COLLECTION</h2>
        </div>

        {/* 3-Column Vehicle Grid (Desktop) / Snap Carousel (Mobile) */}
        <div className="max-w-[1440px] mx-auto flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory hide-scrollbar gap-px bg-white/10 border border-white/10">
          {CARS.map(car => (
            <div
              key={car.model}
              className="min-w-[85vw] md:min-w-0 snap-center group relative bg-[#080808] p-8 md:p-10 overflow-hidden transition-all duration-500 hover:bg-[#0f0f0f] flex flex-col"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-white font-headline text-xl md:text-2xl font-medium mb-1 uppercase tracking-tight">{car.brand} {car.model}</h3>
                  <span className="text-[#d4af37] text-[9px] md:text-[10px] font-display font-medium uppercase tracking-[0.2em]">{car.trim}</span>
                </div>
              </div>

              <div className="relative h-40 md:h-48 mb-8 flex items-center justify-center overflow-hidden">
                <img
                  alt={`${car.brand} ${car.model}`}
                  className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  src={car.img}
                />
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8 mb-10 mt-auto">
                <div>
                  <span className="text-white/25 text-[9px] uppercase block mb-1 tracking-[0.3em] font-display font-medium">Power</span>
                  <span className="text-white font-headline font-medium text-xs md:text-sm uppercase">{car.power}</span>
                </div>
                <div>
                  <span className="text-white/25 text-[9px] uppercase block mb-1 tracking-[0.3em] font-display font-medium">Engine</span>
                  <span className="text-white font-headline font-medium text-xs md:text-sm uppercase">{car.engine}</span>
                </div>
              </div>

              <button
                onClick={() => onOpenModal(`${car.brand} ${car.model}`)}
                className="w-full champagne-gradient text-black py-4 md:py-5 text-[9px] font-display font-semibold tracking-[0.3em] uppercase hover:brightness-110 transition-all duration-300 active:scale-95"
              >
                Reserve This Model
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
