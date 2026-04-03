'use client';

export default function BrandMarquee() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marqueeAnim {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeAnim 50s linear infinite;
        }
      `}} />
      <div className="w-full overflow-hidden whitespace-nowrap py-2 md:py-3 bg-black border-y border-white/5 z-10 relative pointer-events-none">
        <div className="animate-marquee-track gap-12 md:gap-100">
          {/* We repeat the array sufficiently to ensure a seamless infinite scroll across ultra-wide monitors */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <span key={i} className="text-white text-xs font-thin md:text-xs tracking-[0.2em] uppercase flex items-center">
              MUMBAI <span className="mx-4 md:mx-6 opacity-30">|</span>
              DELHI <span className="mx-4 md:mx-6 opacity-30">|</span>
              BENGALURU <span className="mx-4 md:mx-6 opacity-30">|</span>
              HYDERABAD <span className="mx-4 md:mx-6 opacity-30">|</span>
              LUCKNOW
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
