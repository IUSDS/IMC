'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { homeData } from './HomeData';

export default function HowItWorksSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Register here — safe for SSR, no double-registration risk
    gsap.registerPlugin(ScrollTrigger);

    const horizontalContainer = containerRef.current;

    const scrollWidth = horizontalContainer.scrollWidth;
    const amountToScroll = scrollWidth - window.innerWidth + 150;

    const ctx = gsap.context(() => {
      gsap.to(horizontalContainer, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          scrub: 1,
          start: "top top",
          end: "+=" + amountToScroll,
          invalidateOnRefresh: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0a0a0a]/10 text-white overflow-hidden z-10 border-t border-white/5 py-0 h-screen">
      <div 
        ref={containerRef} 
        className="flex items-center h-screen pl-6 md:pl-20 lg:pl-32 relative w-max"
      >
        <div className="flex-shrink-0 w-full max-w-sm md:max-w-md lg:max-w-[500px] pr-12 md:pr-24">
          <div className="flex items-center gap-4 mb-6 text-[#d4af37] text-[10px] tracking-[0.3em] uppercase font-medium">
            <span className="w-6 h-6 border border-[#d4af37] rounded-full flex items-center justify-center text-[9px]">2</span>
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            A simple and structured process <br />
            <em className="opacity-60 text-3xl md:text-4xl font-serif italic block mt-2">designed for convenience.</em>
          </h2>
        </div>

        <div className="flex gap-10 pr-6 md:pr-20 items-stretch">
          {homeData.howItWorks.map((step, idx) => {
            const processImages = [
              "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
            ];

            return (
              <div 
                key={idx} 
                className="group flex-none w-[320px] md:w-[360px] p-6 md:p-8 bg-[#111] border border-white/10 flex flex-col justify-start transition-all duration-500 hover:border-[#d4af37] hover:-translate-y-2 hover:bg-[#151515] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <div className="w-full h-40 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500 z-10"/>
                  <img src={processImages[idx]} alt={step.title} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                </div>
                
                <div className="text-[#d4af37] font-serif tracking-[0.3em] text-xs mb-4 opacity-80 group-hover:opacity-100 transition-opacity uppercase">
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <h3 className="text-[18px] tracking-[0.05em] uppercase font-serif mb-4 text-[#d4af37]">
                  {step.title}
                </h3>
                <p className="text-white/60 font-light leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
