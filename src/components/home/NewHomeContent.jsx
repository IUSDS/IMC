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

// ─── Canvas resolution based on device ─────────────────────────────────────
function getCanvasSize() {
  if (typeof window === 'undefined') return { w: 1920, h: 1080 };
  if (window.innerWidth <= 768) return { w: 960, h: 540 };
  if (window.innerWidth <= 1280) return { w: 1280, h: 720 };
  return { w: 1920, h: 1080 };
}

// ─── 3-Phase frame URL builder ──────────────────────────────────────────────
const FRAME_COUNT = 862;
const PHASE1_END = 60;   // loaded immediately
const PHASE2_END = 250;  // loaded during idle time
const currentFrame = i =>
  `/home/hero-frames/frame_${(i + 1).toString().padStart(4, '0')}.jpg`;

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
    const canvas = canvasRef.current;
    const context = canvas ? canvas.getContext('2d') : null;
    if (canvas && context) {
      const { w, h } = getCanvasSize();
      canvas.width = w;
      canvas.height = h;
    }

    // Shared image bank — pre-allocated so indices are stable
    const images = new Array(FRAME_COUNT).fill(null);
    const imageSeq = { frame: 0 };

    // ── Render current frame ───────────────────────────────────────────────
    function render() {
      if (!context || !canvas || killed) return;
      const img = images[imageSeq.frame];
      if (img && img.complete && img.naturalWidth) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }

    // ── Load a single frame ────────────────────────────────────────────────
    function loadFrame(index, onLoaded) {
      if (killed) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = currentFrame(index);
      images[index] = img;
      if (onLoaded) img.onload = () => { if (!killed) onLoaded(); };
    }

    // ── Phase 1: frames 0–59 → load NOW, render as soon as frame 0 is ready
    loadFrame(0, render);                           // frame 0 gets priority cb
    for (let i = 1; i < PHASE1_END && i < FRAME_COUNT; i++) {
      loadFrame(i);
    }

    // ── Phase 2: frames 60–249 → requestIdleCallback batches ──────────────
    function loadPhase2() {
      let idx = PHASE1_END;

      function processChunk(deadline) {
        while (idx < PHASE2_END && idx < FRAME_COUNT) {
          // Stop if we're almost out of idle time (leave ≥ 5 ms)
          if (deadline && deadline.timeRemaining() < 5) break;
          loadFrame(idx++);
        }
        if (idx < PHASE2_END && idx < FRAME_COUNT && !killed) {
          scheduleChunk();
        } else {
          loadPhase3();
        }
      }

      function scheduleChunk() {
        if (typeof requestIdleCallback !== 'undefined') {
          requestIdleCallback(processChunk, { timeout: 200 });
        } else {
          setTimeout(() => processChunk({ timeRemaining: () => Infinity }), 50);
        }
      }

      scheduleChunk();
    }

    // ── Phase 3: frames 250–862 → trickle in the background ───────────────
    function loadPhase3() {
      let idx = PHASE2_END;
      function loadNext() {
        if (killed || idx >= FRAME_COUNT) return;
        loadFrame(idx++);
        setTimeout(loadNext, 8); // ~120 frame budget — doesn't block main thread
      }
      setTimeout(loadNext, 250); // wait until Phase 2 is well under way
    }

    // Kick Phase 2 off after giving Phase 1 a 400 ms head-start
    setTimeout(loadPhase2, 400);

    // ── 2. Intro + autoplay animation ─────────────────────────────────────
    const playIntroOut = () => {
      if (!introLoaderRef.current || introLoaderRef.current.style.display === 'none') return;

      const introTl = gsap.timeline({
        onComplete: () => {
          let snapPoints = [];

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
                scrub: 2.5,
                onRefresh: (self) => {
                  const maxScroll = self.end - self.start;
                  if (maxScroll <= 0) return;

                  const segments = gsap.utils.toArray('.segment, .how-it-works-section, .signature-offerings-section');
                  const points = [0]; // snap to top

                  segments.forEach(segment => {
                    const rect = segment.getBoundingClientRect();
                    // absolute offset from document top
                    const absoluteTop = rect.top + window.scrollY;
                    const absoluteCenter = absoluteTop + (rect.height / 2);

                    // calculate scrollY required to perfectly center this segment
                    const targetScroll = absoluteCenter - (window.innerHeight / 2);

                    // map this scrollY to the ScrollTrigger's 0-1 progress
                    let progress = (targetScroll - self.start) / maxScroll;

                    points.push(gsap.utils.clamp(0, 1, progress));
                  });

                  points.push(1); // snap to bottom
                  snapPoints = points;
                },
                snap: {
                  snapTo: (progress) => {
                    if (!snapPoints.length) return progress;
                    // Find closest valid progress stop for magnetic effect
                    return snapPoints.reduce((prev, curr) =>
                      Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
                    );
                  },
                  delay: 0.15, // Wait for scroll pause before snapping (prevents scroll hijack)
                  duration: { min: 0.1, max: 0.5 },
                  ease: 'power2.inOut',
                }
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
        // Autoplay first 50 frames
        .to(imageSeq, {
          frame: 49,
          snap: 'frame',
          duration: 2,
          ease: 'power1.inOut',
          onUpdate: render,
        });
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

        switch (index + 1) {
          case 1: animProps.ease = 'power1.inOut'; animProps.duration = 2; break;
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
                <h1 className="heading-main">INDIAN MOTOR CLUB</h1>
                <p className="subheading">
                  A signature collection of the world&apos;s most evocative automobiles.
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
                <h2 className="heading-secondary">THE KINETIC ATELIER</h2>
                <p className="body-text">
                  From the pulsing heart of Mumbai to the heritage corridors of Delhi, our exotic
                  collection redefines the landscape of Indian luxury travel.
                </p>
              </div>
            </section>

            <section className="segment segment-3">
              <div className="content-right">
                <h2 className="heading-secondary">UNCOMPROMISING STANDARDS</h2>
                <p className="body-text">
                  Every vehicle in our stable undergoes rigorous curation, ensuring the zenith of
                  performance and prestige for our members.
                </p>
                <a href="/fleet" className="cta-button cta-button--glass">EXPLORE FLEET</a>
              </div>
            </section>

            <section className="segment segment-4">
              <div className="content-center">
                <h2 className="heading-bold">THE RESERVATION PROTOCOL</h2>
                <p className="body-text">A seamless, white-glove experience from selection to handover.</p>
              </div>
            </section>

            <HowItWorksSection />
            <SignatureOfferingsSection />

            <section className="segment segment-5">
              <div className="content-left">
                <h2 className="heading-secondary">THE MEMBERSHIP ENCLAVE</h2>
                <p className="body-text">
                  Access to our global fleet with bespoke concierge management and preferred rates
                  for regional voyages.
                </p>
              </div>
            </section>

            <section className="segment segment-6">
              <div className="content-center">
                <h2 className="heading-secondary">IGNITE THE ENGINE OF PRESTIGE</h2>
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
