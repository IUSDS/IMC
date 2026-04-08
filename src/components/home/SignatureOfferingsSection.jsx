'use client';

import { homeData } from './HomeData';
import Link from 'next/link';
export default function SignatureOfferingsSection() {
  return (
    <section className="w-full bg-[#050505]/10 py-32 md:py-48 px-6 md:px-20 lg:px-32 z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col">

        <div className="mb-20 md:mb-32 flex flex-col">
          <div className="flex items-center gap-4 mb-6 text-[#d4af37] text-[10px] tracking-[0.3em] uppercase font-medium">
            <span className="w-6 h-6 border border-[#d4af37] rounded-full flex items-center justify-center text-[9px]">3</span>
            Signature Offerings
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[60px] font-light text-white leading-[1.1]">
            Curated experiences designed for <br />
            <em className="opacity-60 text-[38px] md:text-[50px] font-serif italic block mt-2 text-white/50">those who expect more.</em>
          </h2>
        </div>

        <div className="flex flex-col gap-10 mt-10 pb-[20vh]">
          {homeData.signatureOfferings.map((item, idx) => {
            // Create stacking effect sticky values
            const topVal = 100 + (idx * 40);

            // Dynamic premium dark tint mapping
            const bgColors = [
              "bg-[#0a0a0a]",
              "bg-[#111111]",
              "bg-[#151515]",
              "bg-[#1c1c1c]"
            ];
            const bgColor = bgColors[idx % bgColors.length];

            return (
              <div
                key={idx}
                className={`sticky flex flex-col p-10 md:p-20 ${bgColor} border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] origin-top z-10`}
                style={{ top: `${topVal}px` }}
              >
                <div className="flex flex-col gap-6 md:gap-0 max-w-3xl">
                  <h3 className="text-3xl md:text-[32px] font-serif text-white tracking-[0.05em] uppercase mb-6 md:mb-8">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-base md:text-[16px] font-light leading-[1.8] mb-10 md:mb-12">
                    {item.desc}
                  </p>
                  {['Rental Membership', 'Motor Club Membership', 'Chauffeur Services'].includes(item.title) ? (
                    <span className="flex items-center gap-4 w-fit">
                      <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium text-white/70">
                        Coming Soon
                      </span>
                    </span>
                  ) : (
                    <Link href={`/offerings/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="group flex items-center gap-4 w-fit">
                      <span className="uppercase tracking-[0.2em] text-[10px] md:text-xs font-medium text-white group-hover:text-[#d4af37] transition-colors duration-300">
                        Explore {item.title}
                      </span>
                      <span className="w-8 h-[1px] bg-white/30 group-hover:bg-[#d4af37] group-hover:w-12 transition-all duration-300" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
