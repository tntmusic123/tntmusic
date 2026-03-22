"use client";

import React from "react";

interface PartnersSliderProps {
  logos: string[];
}

export default function PartnersSlider({ logos }: PartnersSliderProps) {
  if (!logos || logos.length === 0) return null;

  // Double the logos for a smooth infinite loop
  const displayLogos = [...logos, ...logos, ...logos];

  return (
    <div className="w-full bg-white py-20 overflow-hidden border-y border-slate-100 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">TNT MUSIC <span className="text-primary italic">PARTNERS</span></h2>
        <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full opacity-60 shadow-sm" />
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="flex animate-scroll whitespace-nowrap py-4">
          {displayLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center min-w-[200px] h-24 mx-8 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
            >
              <img 
                src={logo} 
                alt={`Partner ${index}`} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .group:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
