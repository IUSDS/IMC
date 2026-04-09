'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import dynamic from 'next/dynamic';

const HowItWorksSection = dynamic(() => import('@/components/home/HowItWorksSection'));
const SignatureOfferingsSection = dynamic(() => import('@/components/home/SignatureOfferingsSection'));
const BrandMarquee = dynamic(() => import('@/components/home/BrandMarquee'));
const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

// ─── Canvas resolution based on device ─────────────────────────────────────
function getCanvasSize() {
  if (typeof window === 'undefined') return { w: 1920, h: 1080 };
  if (window.innerWidth <= 768) return { w: 1080, h: 1920 };
  if (window.innerWidth <= 1280) return { w: 1280, h: 720 };
  return { w: 1920, h: 1080 };
}

// ─── 3-Phase frame URL builder ──────────────────────────────────────────────
const PHASE1_END = 60;   // loaded immediately
const PHASE2_END = 250;  // loaded during idle time

export default function NewHomeContent() {
  const lenis = useLenis();
  const lenisRef = useRef(null);           // keeps lenis accessible inside closures

  const [isModalOpen, setIsModalOpen] = useState(false);

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const introLoaderRef = useRef(null);
  const contentRef = useRef(null);

  // ── Sync lenis ref every render so closures always see the latest value ──
  lenisRef.current = lenis;

  // ── Light effect: pause scroll as soon as lenis is available ────────────
  useEffect(() => {
    if (lenis) lenis.stop();
  }, [lenis]);

  // ── Main animation effect — no lenis dependency ──────────────────────────
  useEffect(() => {
    let killed = false;

    // ── 1. Canvas setup ────────────────────────────────────────────────────
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const FRAME_COUNT = isMobile ? 352 : 788;
    const currentFrame = i => isMobile
      ? `/home/hero-frames-mobile/frame_${(i + 1).toString().padStart(4, '0')}.jpg`
      : `/home/hero-frames/frame_${(i + 1).toString().padStart(4, '0')}.jpg`;

    const canvas = canvasRef.current;
    const context = canvas ? canvas.getContext('2d', { alpha: false }) : null;
    if (canvas && context) {
      const { w, h } = getCanvasSize();
      canvas.width = w;
      canvas.height = h;
    }

    // Shared image bank — pre-allocated so indices are stable
    const images = new Array(FRAME_COUNT).fill(null);
    const imageSeq = { frame: 0 };
    let lastDrawnFrame = -1;

    // ── Render current frame ───────────────────────────────────────────────
    function render() {
      if (!context || !canvas || killed) return;
      const f = Math.round(imageSeq.frame);
      if (f === lastDrawnFrame) return;
      
      const img = images[f];
      if (img && img.complete && img.naturalWidth) {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnFrame = f;
      }
    }

    // ── Load a single frame ────────────────────────────────────────────────
    function loadFrame(index, onLoaded) {
      if (killed) return;
      const img = new Image();
      img.src = currentFrame(index);
      img.decode().then(() => {
        if (killed) return;
        images[index] = img;
        if (onLoaded) onLoaded();
      }).catch(() => {
        if (killed) return;
        images[index] = img; // Fallback
        if (onLoaded) onLoaded();
      });
    }

    // ── Phase 1: Sequential, throttled loading to NOT block the main thread and LCP!
    loadFrame(0, render);                           // frame 0 gets priority cb

    function loadPhase1() {
      let i = 1;
      function loadNextP1() {
        if (killed) return;
        // Batch load frames now that decode is off-thread
        for (let c = 0; c < 3 && i < PHASE1_END && i < FRAME_COUNT; c++) {
          loadFrame(i++);
        }
        if (i < PHASE1_END && i < FRAME_COUNT) {
          setTimeout(loadNextP1, 15);
        } else {
          setTimeout(loadPhase2, 200); // Short delay before Phase 2
        }
      }
      setTimeout(loadNextP1, 100); 
    }
    loadPhase1();

    // ── Phase 2: requestIdleCallback batches ──────────────
    function loadPhase2() {
      let idx = PHASE1_END;

      function processChunk(deadline) {
        let count = 0;
        // Process up to 10 frames per idle chunk
        while (idx < PHASE2_END && idx < FRAME_COUNT && count < 10) {
          if (deadline && deadline.timeRemaining() < 5) break;
          loadFrame(idx++);
          count++;
        }
        if (idx < PHASE2_END && idx < FRAME_COUNT && !killed) {
          scheduleChunk();
        } else {
          loadPhase3();
        }
      }

      function scheduleChunk() {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processChunk, { timeout: 100 });
        } else {
          setTimeout(() => processChunk({ timeRemaining: () => 5 }), 50);
        }
      }

      scheduleChunk();
    }

    // ── Phase 3: frames 250–788 → trickle in the background ───────────────
    function loadPhase3() {
      let idx = PHASE2_END;
      function loadNext() {
        if (killed || idx >= FRAME_COUNT) return;
        // Batch 5 for fast continuous load
        for (let c = 0; c < 5 && idx < FRAME_COUNT; c++) {
          loadFrame(idx++);
        }
        setTimeout(loadNext, 15);
      }
      setTimeout(loadNext, 300);
    }

    // ── 2. Intro + autoplay animation ─────────────────────────────────────
    const playIntroOut = () => {
      if (!introLoaderRef.current || introLoaderRef.current.style.display === 'none') return;

      const introTl = gsap.timeline({
        onComplete: () => {
          // Scroll-driven frame scrub starts from frame 50
          gsap.fromTo(
            imageSeq,
            { frame: 49 },
            {
              frame: FRAME_COUNT - 1,
              snap: 'frame',
              ease: 'none',
              scrollTrigger: {
                trigger: wrapperRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.1, // Ultra-responsive lag-free fast scrolling
              },
              onUpdate: render,
            }
          );

          const l = lenisRef.current;
          if (l) l.start();
          ScrollTrigger.refresh();
        },
      });

      introTl
        .to(introLoaderRef.current, { opacity: 0, duration: 1.5, ease: 'power2.inOut' })
        .set(introLoaderRef.current, { display: 'none' })
        .addLabel('videoEnded')
        // Autoplay first 50 frames
        .to(imageSeq, {
          frame: 49,
          snap: 'frame',
          duration: 2,
          ease: 'power1.inOut',
          onUpdate: render,
        }, 'videoEnded');

      // Animate text specifically after video loader fades out
      const seg1Elements = wrapperRef.current?.querySelectorAll(
        '.segment-1 .heading-main, .segment-1 .subheading, .segment-1 .cta-button--glass'
      );
      if (seg1Elements && seg1Elements.length) {
        introTl.to(seg1Elements, {
          y: 0, opacity: 1, duration: 2, stagger: 0.2, ease: 'power1.inOut'
        }, 'videoEnded');
      }
    };

    // ── 3. Video readiness gate — never hangs the page ────────────────────
    const videoEl = document.getElementById('intro-video');
    let introFired = false;

    function fireIntroOnce() {
      if (introFired || killed) return;
      introFired = true;
      playIntroOut();
    }

    if (!videoEl) {
      // No video element found — skip straight in
      fireIntroOnce();
    } else if (videoEl.ended || videoEl.readyState === 4) {
      // Already fully played / buffered
      fireIntroOnce();
    } else {
      // Hard safety net — always unblock the page after 3 s
      const fallbackTimer = setTimeout(fireIntroOnce, 3000);

      videoEl.addEventListener('ended', () => {
        clearTimeout(fallbackTimer);
        fireIntroOnce();
      }, { once: true });

      videoEl.addEventListener('error', () => {
        clearTimeout(fallbackTimer);
        fireIntroOnce();
      }, { once: true });

      const attemptPlay = () => {
        const p = videoEl.play();
        if (p !== undefined) p.catch(fireIntroOnce);
      };

      if (videoEl.readyState >= 3) {
        // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA — play immediately
        attemptPlay();
      } else {
        // Wait until we have enough data to play without stalling
        videoEl.addEventListener('canplaythrough', () => {
          attemptPlay();
        }, { once: true });
      }
    }

    // ── 4. Segment scroll animations ─────────────────────────────────────
    const ctx = gsap.context(() => {
      const segments = document.querySelectorAll('.segment');
      segments.forEach((segment, index) => {
        const elements = segment.querySelectorAll(
          '.heading-main, .heading-secondary, .heading-bold, .subheading, .body-text, .cta-button, .cta-button--glass'
        );
        if (!elements.length) return;

        let animProps = {
          y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out',
        };

        // Set initial hidden state via JS only (not CSS — avoids invisible text on SSR)
        gsap.set(elements, { opacity: 0, y: 30 });

        if (index === 0) {
          return; // Skip standard ScrollTrigger setup for Segment 1 as it's explicitly choreographed to the intro sequence
        }

        switch (index + 1) {
          case 3: animProps.duration = 2; animProps.ease = 'power2.out'; break;
          case 4:
            gsap.set(elements, { scale: 0.98, opacity: 0, y: 30 });
            animProps.scale = 1; animProps.ease = 'power1.out'; break;
          case 5: animProps.duration = 1.8; break;
          case 6: animProps.ease = 'power1.out'; break;
        }

        gsap.to(elements, {
          scrollTrigger: {
            trigger: segment,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          ...animProps,
        });
      });
    }, wrapperRef);

    return () => {
      killed = true;
      ctx.revert();
    };
  }, []); // ← intentionally empty — lenis handled separately above

  return (
    <div className="new-home-page" ref={wrapperRef}>

      {/* ── Intro Loader ─────────────────────────────────────────────── */}
      <div id="intro-loader" ref={introLoaderRef}>
        <video
          id="intro-video"
          muted
          playsInline
          autoPlay
          preload="auto"
        >
          <source src="/video/headlights.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Background Frame Canvas ───────────────────────────────────── */}
      <div className="video-container">
        <canvas
          id="bg-video"
          ref={canvasRef}
          style={{ willChange: 'transform' }}
        />
        <div className="video-overlay" />
      </div>

      {/* ── Scroll Content ────────────────────────────────────────────── */}
      <main id="smooth-wrapper">
        <div id="smooth-content" ref={contentRef}>
          <div className="relative">

            <section className="segment segment-1 pt-[100px]">
              <div className="content-center">
                <h1 className="heading-main">INDIA&apos;S PREMIER LUXURY CAR RENTAL CLUB</h1>
                <p className="subheading">
                  A signature collection of luxury and vintage automobiles curated precisely for your journey.
                </p>
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
                <h2 className="heading-secondary">INDIA&apos;S FINEST LUXURY &amp; VINTAGE CAR RENTALS</h2>
                <p className="body-text">
                  Spanning top locations like the fast-paced streets of Mumbai and the heritage avenues of Delhi,
                  our collection brings together some of the finest luxury and vintage cars, redefining how India
                  experiences premium travel.
                </p>
              </div>
            </section>

            <section className="segment segment-3">
              <div className="content-right">
                <h2 className="heading-secondary">MAINTAINED TO THE HIGHEST STANDARDS</h2>
                <p className="body-text">
                  Every vehicle in our fleet is carefully maintained and thoroughly checked, ensuring
                  unmatched performance, comfort, and a level of finish that meets the expectations
                  of our discerning members.
                </p>
                <a href="/fleet" className="cta-button cta-button--glass">EXPLORE FLEET</a>
              </div>
            </section>

            <section className="segment segment-4">
              <div className="content-center">
                <h2 className="heading-bold">A SEAMLESS RESERVATION EXPERIENCE</h2>
                <p className="body-text">A refined, white-glove process designed to make your booking smooth and effortless, from selection to final handover.</p>
              </div>
            </section>

            <HowItWorksSection />
            <SignatureOfferingsSection />

            <section className="segment segment-5">
              <div className="content-left">
                <h2 className="heading-secondary">LUXURY THAT TRAVELS WITH YOU</h2>
                <p className="body-text">
                  Enjoy access to our fleet and services across India&apos;s key cities, supported by
                  dedicated assistance and benefits that make every booking seamless.
                </p>
              </div>
            </section>

            <section className="segment segment-6">
              <div className="content-center">
                <h2 className="heading-secondary">DRIVE THE EXTRAORDINARY</h2>
                <button className="cta-button" onClick={() => setIsModalOpen(true)}>
                  BOOK NOW
                </button>
              </div>
            </section>

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
