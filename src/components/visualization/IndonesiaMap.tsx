"use client";

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Info } from 'lucide-react';

export interface RegionalData {
  id: string;
  name: string;
  berasPrice: number;
  cabaiPrice: number;
  supplyLevel: 'Melimpah' | 'Cukup' | 'Defisit';
  inflationRate: number;
  status: 'Aman' | 'Waspada' | 'Darurat';
  color: string;
  hoverColor: string;
}

interface IndonesiaMapProps {
  onRegionSelect: (region: RegionalData) => void;
  selectedRegionId?: string;
}

export const REGIONS: RegionalData[] = [
  { id: 'sumatera', name: 'Sumatera', berasPrice: 15600, cabaiPrice: 61000, supplyLevel: 'Cukup', inflationRate: 3.1, status: 'Waspada', color: 'fill-amber-100 stroke-amber-500 hover:fill-amber-200', hoverColor: 'fill-amber-200' },
  { id: 'jawa', name: 'Jawa', berasPrice: 15100, cabaiPrice: 54000, supplyLevel: 'Melimpah', inflationRate: 2.5, status: 'Aman', color: 'fill-emerald-100 stroke-emerald-500 hover:fill-emerald-200', hoverColor: 'fill-emerald-200' },
  { id: 'kalimantan', name: 'Kalimantan', berasPrice: 16200, cabaiPrice: 68000, supplyLevel: 'Cukup', inflationRate: 3.5, status: 'Waspada', color: 'fill-amber-100 stroke-amber-500 hover:fill-amber-200', hoverColor: 'fill-amber-200' },
  { id: 'sulawesi', name: 'Sulawesi', berasPrice: 15300, cabaiPrice: 58000, supplyLevel: 'Cukup', inflationRate: 2.8, status: 'Aman', color: 'fill-emerald-100 stroke-emerald-500 hover:fill-emerald-200', hoverColor: 'fill-emerald-200' },
  { id: 'nusatenggara', name: 'Bali & Nusa Tenggara', berasPrice: 15800, cabaiPrice: 65000, supplyLevel: 'Cukup', inflationRate: 3.2, status: 'Waspada', color: 'fill-amber-100 stroke-amber-500 hover:fill-amber-200', hoverColor: 'fill-amber-200' },
  { id: 'maluku', name: 'Maluku', berasPrice: 16800, cabaiPrice: 78000, supplyLevel: 'Defisit', inflationRate: 4.8, status: 'Darurat', color: 'fill-red-100 stroke-red-500 hover:fill-red-200', hoverColor: 'fill-red-200' },
  { id: 'papua', name: 'Papua', berasPrice: 17500, cabaiPrice: 82000, supplyLevel: 'Defisit', inflationRate: 5.2, status: 'Darurat', color: 'fill-red-100 stroke-red-500 hover:fill-red-200', hoverColor: 'fill-red-200' }
];

export default function IndonesiaMap({ onRegionSelect, selectedRegionId }: IndonesiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const getStatusIcon = (status: 'Aman' | 'Waspada' | 'Darurat') => {
    switch (status) {
      case 'Aman': return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
      case 'Waspada': return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      case 'Darurat': return <XCircle className="w-4 h-4 text-red-700" />;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-emerald-700" />
          Klik pulau di peta untuk melihat detail kerawanan pangan lokal
        </span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-[10px] text-emerald-800"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Aman</span>
          <span className="flex items-center gap-1 text-[10px] text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-500" /> Waspada</span>
          <span className="flex items-center gap-1 text-[10px] text-red-700"><span className="w-2 h-2 rounded-full bg-red-500" /> Darurat</span>
        </div>
      </div>

      {/* SVG Indonesia Map wrapper */}
      <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden flex justify-center items-center shadow-sm">
        <svg 
          className="w-full max-w-[700px] h-[280px]" 
          viewBox="0 0 1000 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. Sumatera island chain */}
          <g 
            onClick={() => onRegionSelect(REGIONS[0])}
            onMouseEnter={() => setHoveredRegion('sumatera')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M100 120 L180 200 L210 250 L180 280 L140 230 L80 180 Z" 
              className={`${selectedRegionId === 'sumatera' ? 'fill-amber-300 stroke-amber-600' : hoveredRegion === 'sumatera' ? REGIONS[0].hoverColor : REGIONS[0].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="110" y="210" className="fill-slate-700 font-bold text-xs pointer-events-none">Sumatera</text>
          </g>

          {/* 2. Jawa island chain */}
          <g 
            onClick={() => onRegionSelect(REGIONS[1])}
            onMouseEnter={() => setHoveredRegion('jawa')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M210 290 L260 290 L340 310 L410 320 L400 330 L310 320 L210 300 Z" 
              className={`${selectedRegionId === 'jawa' ? 'fill-emerald-300 stroke-emerald-600' : hoveredRegion === 'jawa' ? REGIONS[1].hoverColor : REGIONS[1].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="290" y="335" className="fill-slate-700 font-bold text-xs pointer-events-none">Jawa</text>
          </g>

          {/* 3. Kalimantan island chain */}
          <g 
            onClick={() => onRegionSelect(REGIONS[2])}
            onMouseEnter={() => setHoveredRegion('kalimantan')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M280 140 L380 120 L420 180 L400 240 L340 250 L280 200 Z" 
              className={`${selectedRegionId === 'kalimantan' ? 'fill-amber-300 stroke-amber-600' : hoveredRegion === 'kalimantan' ? REGIONS[2].hoverColor : REGIONS[2].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="310" y="190" className="fill-slate-700 font-bold text-xs pointer-events-none">Kalimantan</text>
          </g>

          {/* 4. Sulawesi island chain */}
          <g 
            onClick={() => onRegionSelect(REGIONS[3])}
            onMouseEnter={() => setHoveredRegion('sulawesi')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M470 160 L540 160 L540 180 L490 200 L530 250 L470 230 L450 190 Z" 
              className={`${selectedRegionId === 'sulawesi' ? 'fill-emerald-300 stroke-emerald-600' : hoveredRegion === 'sulawesi' ? REGIONS[3].hoverColor : REGIONS[3].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="470" y="210" className="fill-slate-700 font-bold text-xs pointer-events-none">Sulawesi</text>
          </g>

          {/* 5. Bali & Nusa Tenggara island chain */}
          <g 
            onClick={() => onRegionSelect(REGIONS[4])}
            onMouseEnter={() => setHoveredRegion('nusatenggara')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M430 325 L490 325 L550 330 L540 338 L480 335 L430 332 Z" 
              className={`${selectedRegionId === 'nusatenggara' ? 'fill-amber-300 stroke-amber-600' : hoveredRegion === 'nusatenggara' ? REGIONS[4].hoverColor : REGIONS[4].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="450" y="355" className="fill-slate-700 font-bold text-[10px] pointer-events-none">Bali & Nusa Tenggara</text>
          </g>

          {/* 6. Maluku island group */}
          <g 
            onClick={() => onRegionSelect(REGIONS[5])}
            onMouseEnter={() => setHoveredRegion('maluku')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M570 170 L620 160 L640 220 L580 230 Z" 
              className={`${selectedRegionId === 'maluku' ? 'fill-red-300 stroke-red-600' : hoveredRegion === 'maluku' ? REGIONS[5].hoverColor : REGIONS[5].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="585" y="195" className="fill-slate-700 font-bold text-[10px] pointer-events-none">Maluku</text>
          </g>

          {/* 7. Papua island */}
          <g 
            onClick={() => onRegionSelect(REGIONS[6])}
            onMouseEnter={() => setHoveredRegion('papua')}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer transition-all duration-200"
          >
            <path 
              d="M660 180 L760 170 L830 200 L830 280 L740 270 L660 210 Z" 
              className={`${selectedRegionId === 'papua' ? 'fill-red-300 stroke-red-600' : hoveredRegion === 'papua' ? REGIONS[6].hoverColor : REGIONS[6].color} transition-colors`}
              strokeWidth="2"
            />
            <text x="730" y="225" className="fill-slate-700 font-bold text-xs pointer-events-none">Papua</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
