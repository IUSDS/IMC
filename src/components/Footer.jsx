'use client';

import Link from "next/link";

export default function Footer({ onOpenModal } = {}) {
  return (
    <footer className="relative z-50 bg-black border-t border-white/10 w-full pt-24 pb-12 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 px-8 max-w-[1440px] mx-auto font-body text-sm tracking-wide text-white">
        <div className="col-span-2">
          <div className="text-xl font-medium font-headline tracking-[0.2em] uppercase text-white mb-6">Indian Motor Club</div>
          <p className="text-white mb-8 leading-relaxed max-w-xs font-body">
            India&apos;s premier destination for high-performance automotive excellence and concierge travel experiences.
          </p>
          <div className="flex flex-col gap-3">
            <p className="text-[#d4af37] uppercase text-[10px] tracking-[0.3em] font-medium mb-1">Contact Us</p>
            <a
              href="mailto:hasnaat@iusdigitalsolutions.com"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm group"
            >
              <span className="material-symbols-outlined text-[#d4af37] text-[18px] group-hover:scale-110 transition-transform">mail</span>
              hasnaat@iusdigitalsolutions.com
            </a>
            <a
              href="tel:+918130584114"
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-sm group"
            >
              <span className="material-symbols-outlined text-[#d4af37] text-[18px] group-hover:scale-110 transition-transform">call</span>
              +91 81305 84114
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium text-[#d4af37] uppercase text-[10px] tracking-[0.3em] mb-6">Our Services</h4>
          <Link href="/vehicleConsignment" className="block text-white hover:text-gray-300 transition-colors">Vehicle Consignment Program</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Motor Club Membership</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Rental Membership</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Chauffeur Services</Link>
        </div>
        <div className="space-y-4">
          <h4 className="font-medium text-[#d4af37] uppercase text-[10px] tracking-[0.3em] mb-6">Quick Links</h4>
          <Link href="/" className="block text-white hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/fleet" className="block text-white hover:text-gray-300 transition-colors">Fleet</Link>
        </div>
        {/* <div className="space-y-4">
          <h4 className="font-medium text-[#d4af37] uppercase text-[10px] tracking-[0.3em] mb-6">Company</h4>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Terms of Service</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Cookie Policy</Link>
          <Link href="#" className="block text-white hover:text-gray-300 transition-colors">Press Kit</Link>
        </div> */}
        <div className="col-span-2 md:col-span-1 lg:col-span-1">
          <h4 className="font-medium text-[#d4af37] uppercase text-[10px] tracking-[0.3em] mb-6">HQ</h4>
          <p className="text-white leading-relaxed font-body">
            Mehrauli<br />
            New Delhi 110030
          </p>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white uppercase tracking-widest font-medium">
        <p>© 2025 INDIAN MOTOR CLUB. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <Link href="https://www.instagram.com/indianmotorclub/" className="hover:text-gray-300 transition-colors">Instagram</Link>
          {/* <Link href="#" className="hover:text-gray-300 transition-colors">LinkedIn</Link>
          <Link href="#" className="hover:text-gray-300 transition-colors">Twitter (X)</Link> */}
        </div>
      </div>
    </footer>
  );
}
