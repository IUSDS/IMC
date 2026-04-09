'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero({ onOpenModal }) {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();

      tl.from(textRef.current, {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
      });

      // Background Image Parallax
      gsap.to(imgRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        yPercent: 20,
        ease: "none",
      });

      // Content Layer Parallax (Subtle)
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: -50,
        opacity: 0.8,
        ease: "none",
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[100lvh] w-full flex items-end justify-start overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imgRef}
          src="/images/hero.jpg"
          alt="Cinematic Luxury Automotive"
          className="w-full h-full object-cover scale-110 brightness-75 grayscale-[0.2]"
        />
        {/* Cinematic Gradient Overlays: Top-down for nav, Bottom-up for text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      </div>

      <div ref={contentRef} className="max-w-[1440px] w-full px-8 md:px-16 pb-20 md:pb-24 relative z-10 flex flex-col items-start translate-y-0 text-left">
        <h1 ref={textRef} className="text-[14vw] md:text-[10vw] lg:text-[8vw] font-medium font-headline leading-[0.85] tracking-[-0.04em] text-white uppercase mb-8 md:mb-12">
          MEET OUR <br />
          <span className="text-white/30">FLEET</span>
        </h1>

        <p className="text-xs md:text-base text-white/50 max-w-sm font-body leading-relaxed tracking-tight italic border-l border-white/20 pl-6">
          Curating the world&apos;s most prestigious automotive heritage for India&apos;s elite connoisseurs.
        </p>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 right-8 md:right-16 z-20 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[9px] tracking-[0.4em] uppercase text-white rotate-90 origin-right translate-x-4 mb-10 font-medium">Explore</span>
        <div className="w-[1px] h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </section>
  );
}
