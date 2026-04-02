'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import SignatureOfferingsSection from '@/components/home/SignatureOfferingsSection';
import BrandMarquee from '@/components/home/BrandMarquee';
import BookingModal from '@/components/BookingModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function NewHomeContent() {
  const lenis = useLenis();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const introLoaderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Canvas Configuration & Setup
      const canvas = canvasRef.current;
      const context = canvas ? canvas.getContext("2d") : null;
      if (canvas && context) {
        canvas.width = 1920;
        canvas.height = 1080;
      }

      const frameOffset = 0; // Start from frame_0001
      const frameCount = 862;
      const currentFrame = index => (
        `/home/hero-frames/frame_${(index + 1 + frameOffset).toString().padStart(4, '0')}.jpg`
      );

      const images = [];
      const imageSeq = { frame: 0 };

      // Pre-load all frames
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
      }

      function render() {
        if (!context || !canvas) return;
        const img = images[imageSeq.frame];
        if (img && img.complete) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      }

      // Initial render of frame 1
      if (images[0]) {
        if (images[0].complete) render();
        else images[0].onload = render;
      }

      // 2. Intro & Autoplay Animation
      if (lenis) lenis.stop();

      const playIntroOut = () => {
        if (!introLoaderRef.current || introLoaderRef.current.style.display === 'none') return;
        
        const introTl = gsap.timeline({
          onComplete: () => {
            // 3. ScrollTrigger Initialization (after autoplay)
            gsap.fromTo(imageSeq, 
              { frame: 49 },
              {
                frame: frameCount - 1,
                snap: "frame",
                ease: "none",
                scrollTrigger: {
                  trigger: wrapperRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                },
                onUpdate: render
              }
            );

            if (lenis) lenis.start();
            ScrollTrigger.refresh();
          }
        });

        introTl
          .to(introLoaderRef.current, { 
            opacity: 0, 
            duration: 1.5, 
            ease: 'power2.inOut' 
          })
          .set(introLoaderRef.current, { display: 'none' })
          // Autoplay first 50 frames
          .to(imageSeq, {
            frame: 49,
            snap: "frame",
            duration: 2,
            ease: "power1.inOut",
            onUpdate: render
          });
      };

      const videoEl = document.getElementById('intro-video');
if (videoEl) {
  if (videoEl.ended) {
    playIntroOut();
  } else {
    videoEl.onended = playIntroOut;
    videoEl.onerror = playIntroOut;
    // Fallback if autoplay is blocked by the browser
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => playIntroOut());
    }
  }
} else {
  playIntroOut();
}

      // Content Segment Animations
      const segments = document.querySelectorAll('.segment');
      segments.forEach((segment, index) => {
        const elements = segment.querySelectorAll('.heading-main, .heading-secondary, .heading-bold, .subheading, .body-text, .cta-button, .cta-button--glass');
        if (!elements.length) return;

        let animProps = {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: 'power3.out'
        };

        // GSAP to initial state
        gsap.set(elements, { opacity: 0, y: 30 });

        switch (index + 1) {
          case 1:
            animProps.ease = 'power1.inOut';
            animProps.duration = 2;
            break;
          case 3:
            animProps.duration = 2;
            animProps.ease = 'power2.out';
            break;
          case 4:
            gsap.set(elements, { scale: 0.98, opacity: 0, y: 30 });
            animProps.scale = 1;
            animProps.ease = 'power1.out';
            break;
          case 5:
            animProps.duration = 1.8;
            break;
          case 6:
            animProps.ease = 'power1.out';
            break;
        }

        gsap.to(elements, {
          scrollTrigger: {
            trigger: segment,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          ...animProps
        });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [lenis]);

  return (
    <div className="new-home-page" ref={wrapperRef}>
      {/* Intro Loader */}
      <div id="intro-loader" ref={introLoaderRef}>
        <video id="intro-video" muted playsInline autoPlay preload="auto">
          <source src="/video/headlights.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Background Frame Sequence */}
      <div className="video-container">
        <canvas
          id="bg-video"
          ref={canvasRef}
        ></canvas>
        <div className="video-overlay"></div>
      </div>

      {/* Scroll Content */}
      <main id="smooth-wrapper">
        <div id="smooth-content" ref={contentRef}>
          <div className="relative">
            <section className="segment segment-1 pt-[100px]">
              <div className="content-center">
                <h1 className="heading-main">INDIAN MOTOR CLUB</h1>
                <p className="subheading">A signature collection of the world&apos;s most evocative automobiles.</p>
                <div className="flex flex-row gap-4 md:gap-6 mt-10">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="cta-button--glass px-8 py-3.5 text-[10px] tracking-[0.3em] font-medium uppercase transition-all duration-300 hover:bg-[#d4af37]/10 active:scale-95 whitespace-nowrap"
                  >
                    BOOK NOW
                  </button>
                  <a 
                    href="/fleet" 
                    className="cta-button--glass px-8 py-3.5 text-[10px] tracking-[0.3em] font-medium uppercase transition-all duration-300 hover:bg-[#d4af37]/10 active:scale-95 whitespace-nowrap"
                  >
                    EXPLORE FLEET
                  </a>
                </div>
              </div>
            </section>

            <section className="segment segment-2">
              <div className="content-left">
                <h2 className="heading-secondary">THE KINETIC ATELIER</h2>
                <p className="body-text">From the pulsing heart of Mumbai to the heritage corridors of Delhi, our exotic collection redefines the landscape of Indian luxury travel.</p>
              </div>
            </section>

            <section className="segment segment-3">
              <div className="content-right">
                <h2 className="heading-secondary">UNCOMPROMISING STANDARDS</h2>
                <p className="body-text">Every vehicle in our stable undergoes rigorous curation, ensuring the zenith of performance and prestige for our members.</p>
                <a href="/fleet" className="cta-button cta-button--glass">EXPLORE FLEET</a>
              </div>
            </section>

            {/* SEGMENT 4 — FULL REVEAL */}
            <section className="segment segment-4">
              <div className="content-center">
                <h2 className="heading-bold">THE RESERVATION PROTOCOL</h2>
                <p className="body-text">A seamless, white-glove experience from selection to handover.</p>
              </div>
            </section>

            {/* INJECTED COMPONENTS from existing site */}
            <HowItWorksSection />
            <SignatureOfferingsSection />

            <section className="segment segment-5">
              <div className="content-left">
                <h2 className="heading-secondary">THE MEMBERSHIP ENCLAVE</h2>
                <p className="body-text">Access to our global fleet with bespoke concierge management and preferred rates for regional voyages.</p>
              </div>
            </section>

            <section className="segment segment-6">
              <div className="content-center">
                <h2 className="heading-secondary">IGNITE THE ENGINE OF PRESTIGE</h2>
                <button
                  className="cta-button"
                  onClick={() => setIsModalOpen(true)}
                >
                  BOOK NOW
                </button>
              </div>
            </section>

            {/* BrandMarquee sticky at bottom until footer */}
            <div className="sticky bottom-0 z-50 pointer-events-none w-full bg-white text-black">
              <BrandMarquee />
            </div>

          </div>
        </div>
      </main>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
