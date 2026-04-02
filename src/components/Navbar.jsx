'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const MENU_BG_IMAGE = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80';

const NAV_LINKS = [
  { id: '1', title: 'Home', num: '01', href: '/' },
  { id: '2', title: 'Fleet', num: '02', href: '/fleet' },
  { id: '3', title: 'Vehicle Consignment', num: '03', href: '/vehicleConsignment' }
];

export default function Navbar({ onOpenModal } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const tlRef = useRef(null);
  const overlayRef = useRef(null);
  const leftPaneRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { x: '100%', visibility: 'hidden' });
      gsap.set('.nav-link-text', { y: '110%' });
      gsap.set('.nav-link-num', { opacity: 0, y: -20 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to(overlayRef.current, { x: '0%', visibility: 'visible', duration: 0.15 })
        .from(leftPaneRef.current, { x: -30, opacity: 0, duration: 0.1 }, "-=0.1")
        .to('.nav-link-text', { y: '0%', duration: 0.15, stagger: 0.03 }, "-=0.15")
        .to('.nav-link-num', { opacity: 0.5, y: 0, duration: 0.15, stagger: 0.03 }, "-=0.1");

      tlRef.current = tl;
    });
    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true);
      tlRef.current?.play();
    } else {
      setIsOpen(false);
      tlRef.current?.reverse();
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-[2000] flex items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'h-[75px] text-[#111111]' : 'h-[100px] text-white'}`}>

        {/* Scrolled Background Container with Grain */}
        <div
          className={`absolute inset-0 z-[-1] transition-opacity duration-700 bg-black/95 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* We reuse the global noiseFilter defined in GrainOverlay for identical texture consistency */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.16]" style={{ filter: 'url(#noiseFilter)' }} />
        </div>

        <div className="w-full px-6 md:px-12 flex justify-between items-center mt-1">
          <a href="/" className={`font-headline font-medium tracking-[0.25em] uppercase text-sm transition-all duration-400 hover:text-[#d4af37] active:scale-95 ${isOpen ? '!text-white' : '!text-white'}`}>
            Indian Motor Club
          </a>
          <div
            onClick={toggleMenu}
            className="flex items-center gap-4 cursor-pointer group z-[2000]"
          >
            <span className={`text-[10px] tracking-[0.3em] font-medium transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0 !text-white' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
              CLOSE
            </span>
            <div className={`relative w-[30px] h-[12px] flex flex-col justify-between items-end ${isOpen ? 'open' : ''}`}>
              <div className={`h-[1px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'w-full translate-y-[5.5px] rotate-45 bg-white' : 'w-full bg-white'}`}></div>
              <div className={`h-[1px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'w-full -translate-y-[5.5px] -rotate-45 bg-white' : 'w-[60%] bg-white'}`}></div>
            </div>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-3xl z-[1000] flex items-center justify-center overflow-hidden invisible"
      >
        <div className="absolute inset-0 z-[-1] opacity-15 overflow-hidden pointer-events-none">
          <img
            src={MENU_BG_IMAGE}
            alt="Menu background"
            className="absolute inset-0 w-full h-full object-cover grayscale brightness-75"
          />
        </div>

        <div className="w-full max-w-[1400px] h-full md:h-auto px-6 md:px-12 py-24 md:py-10 flex flex-col md:flex-row items-stretch">

          <div ref={leftPaneRef} className="w-full md:w-[40%] flex flex-col justify-end pb-6 md:pb-10 border-t md:border-t-0 border-r-0 md:border-r border-white/10 mt-6 md:mt-0 pt-6 md:pt-0 order-2 md:order-1">
            <div className="font-headline text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3 md:mb-5 font-medium">Service Reach</div>
            <div className="font-headline text-[11px] md:text-[13px] tracking-[0.15em] uppercase text-white/80 leading-relaxed md:leading-[2.2] mb-8 md:mb-16 font-medium">
              MUMBAI | DELHI | BENGALURU<br />
              HYDERABAD | LUCKNOW
            </div>
            <div className="font-sans text-[10px] md:text-xs text-white/50 leading-relaxed font-medium">
              PRIVATE CLUB INQUIRIES<br />
              concierge@indianmotorclub.com<br />
              +91 999 000 1234
            </div>
          </div>

          <div className="w-full md:w-[60%] flex flex-col justify-center md:pl-[50px] h-auto order-1 md:order-2">
            <ul className="list-none m-0 p-0">
              {NAV_LINKS.map(link => (
                <li key={link.id} className="mb-4 md:mb-6 overflow-hidden h-auto">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.title === 'Inquire') {
                        e.preventDefault();
                        onOpenModal?.();
                      }
                      toggleMenu();
                    }}
                    className="group relative flex items-baseline font-headline text-[10vw] md:text-[4.5vw] leading-[1.1] text-white no-underline opacity-40 hover:opacity-100 md:hover:pl-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] font-medium"
                  >
                    <small className="nav-link-num font-sans text-xs tracking-[0.2em] md:mr-10 mr-4 opacity-50 transition-all duration-600 group-hover:opacity-100 group-hover:-translate-y-[10px] group-hover:text-[#3A5A7A] font-medium">
                      {link.num}
                    </small>
                    <div className="overflow-hidden inline-block py-1">
                      <span className="nav-link-text inline-block transition-transform duration-700">
                        {link.title}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
