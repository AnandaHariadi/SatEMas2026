"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionalData, REGIONS } from './IndonesiaMap';

// Coords mapping for each region
const REGION_COORDS: Record<string, [number, number]> = {
  sumateraanalytics: [-0.949, 102.270], // Sumatra
  jawaanalytics: [-7.250, 110.150],    // Java
  kalimantananalytics: [-0.000, 113.500], // Kalimantan
  sulawesianalytics: [-1.400, 121.300],   // Sulawesi
  nusatenggaraanalytics: [-8.600, 119.000], // Bali & NT
  malukuanalytics: [-3.200, 129.500],     // Maluku
  papuaanalytics: [-4.000, 138.000]      // Papua
};

const MAP_REGIONS = REGIONS.map(r => {
  let coordId = r.id;
  if (r.id === 'nusatenggara') coordId = 'nusatenggaraanalytics';
  else coordId = `${r.id}analytics`;
  
  return {
    ...r,
    coords: REGION_COORDS[coordId] || [-2.5, 118.0]
  };
});

// Coords for Gudang BULOG Divre (Blue Markers)
const BULOG_MARKERS = [
  { id: "blg1", name: "Divre Bulog Sumatera Utara (Medan)", coords: [3.595, 98.672], capacity: "55,000 Ton" },
  { id: "blg2", name: "Divre Bulog DKI Jakarta & Banten", coords: [-6.175, 106.827], capacity: "120,000 Ton" },
  { id: "blg3", name: "Divre Bulog Kalimantan Selatan (Banjarmasin)", coords: [-3.319, 114.590], capacity: "35,000 Ton" },
  { id: "blg4", name: "Divre Bulog Sulawesi Selatan (Makassar)", coords: [-5.148, 119.432], capacity: "65,000 Ton" },
  { id: "blg5", name: "Divre Bulog Bali & NTB (Denpasar)", coords: [-8.670, 115.213], capacity: "28,000 Ton" },
  { id: "blg6", name: "Divre Bulog Maluku (Ambon)", coords: [-3.655, 128.191], capacity: "18,000 Ton" },
  { id: "blg7", name: "Divre Bulog Papua (Jayapura)", coords: [-2.549, 140.716], capacity: "22,000 Ton" }
];

// Coords for Pasar Tradisional SP2KP (Purple Markers)
const SP2KP_MARKERS = [
  { id: "sp1", name: "Pasar Flamboyan Pontianak", coords: [-0.026, 109.342], city: "Pontianak" },
  { id: "sp2", name: "Pasar Wonokromo Surabaya", coords: [-7.257, 112.752], city: "Surabaya" },
  { id: "sp3", name: "Pasar Bersehati Manado", coords: [1.475, 124.842], city: "Manado" },
  { id: "sp4", name: "Pasar Oeba Kupang", coords: [-10.177, 123.607], city: "Kupang" },
  { id: "sp5", name: "Pasar Bastiong Ternate", coords: [0.789, 127.377], city: "Ternate" },
  { id: "sp6", name: "Pasar Sentral Sorong", coords: [-0.876, 131.269], city: "Sorong" },
  { id: "sp7", name: "Pasar Tradisional Palembang", coords: [-2.976, 104.775], city: "Palembang" }
];

interface IndonesiaOSMMapProps {
  onRegionSelect: (region: RegionalData) => void;
  selectedRegionId?: string;
}

export default function IndonesiaOSMMap({ onRegionSelect, selectedRegionId }: IndonesiaOSMMapProps) {
  // Layer checklist states inspired by SITABA Sumatra GIS
  const [layerBulog, setLayerBulog] = useState(true);
  const [layerInflasi, setLayerInflasi] = useState(true);
  const [layerSP2KP, setLayerSP2KP] = useState(true);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const getStatusColor = (status: 'Aman' | 'Waspada' | 'Darurat') => {
    switch (status) {
      case 'Aman': return '#10b981'; // Green
      case 'Waspada': return '#f59e0b'; // Amber
      case 'Darurat': return '#ef4444'; // Red
    }
  };

  return (
    <div className="w-full bg-[#0b0f19] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative z-10 font-sans">
      
      {/* Mapbox Style Top Command Ribbon */}
      <div className="bg-[#0b0f19] border-b border-slate-800 px-5 py-3 flex justify-between items-center text-[10px] text-slate-400 font-mono tracking-wider">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>SISTEM GEOSPASIAL PANGAN AKTIF (CARTODB LIGHT MODULE)</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[9px] text-slate-500 font-bold">
          <span>TAMPILAN: VEKTOR JALAN & BULOG DIVRE</span>
          <span>KOORDINAT: -2.400 / 118.000</span>
        </div>
      </div>

      <div className="relative">
        <MapContainer 
          center={[-2.400, 118.000]} 
          zoom={4} 
          scrollWheelZoom={false}
          className="w-full h-[400px]"
          zoomControl={true}
        >
          {/* Mapbox Positron light style tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {/* Layer 1: Peta Kerawanan Inflasi */}
          {layerInflasi && MAP_REGIONS.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            const color = getStatusColor(reg.status);
            
            return (
              <CircleMarker
                key={reg.id}
                center={reg.coords}
                radius={isSelected ? 18 : 12}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.45,
                  weight: isSelected ? 4 : 2,
                  className: 'transition-all duration-300 cursor-pointer'
                }}
                eventHandlers={{
                  click: () => onRegionSelect(reg)
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
                  <div className="text-[10px] font-bold p-1 flex flex-col gap-0.5">
                    <span className="text-slate-800 border-b border-slate-100 pb-0.5 font-bold">{reg.name}</span>
                    <span className="text-slate-500">Status: <span className="font-extrabold" style={{ color }}>{reg.status}</span></span>
                    <span className="text-slate-700 font-mono">Beras SPHP: Rp {reg.berasPrice.toLocaleString('id-ID')}</span>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

          {/* Layer 2: Gudang Logistik BULOG (Blue circle markers) */}
          {layerBulog && BULOG_MARKERS.map((bulog) => (
            <CircleMarker
              key={bulog.id}
              center={bulog.coords as [number, number]}
              radius={8}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.7,
                weight: 1.5
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.9}>
                <div className="text-[9px] p-1 font-mono flex flex-col gap-0.5">
                  <span className="font-black text-slate-800">[ GUDANG BULOG ]</span>
                  <span className="text-slate-600 font-bold">{bulog.name}</span>
                  <span className="text-blue-700 font-black">Kapasitas: {bulog.capacity}</span>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Layer 3: Pasar Eceran SP2KP (Purple circle markers) */}
          {layerSP2KP && SP2KP_MARKERS.map((pasar) => (
            <CircleMarker
              key={pasar.id}
              center={pasar.coords as [number, number]}
              radius={6}
              pathOptions={{
                color: '#a855f7',
                fillColor: '#a855f7',
                fillOpacity: 0.75,
                weight: 1
              }}
            >
              <Tooltip direction="top" offset={[0, -4]} opacity={0.9}>
                <div className="text-[9px] p-1 font-mono flex flex-col gap-0.5">
                  <span className="font-black text-slate-800">[ PASAR SP2KP ]</span>
                  <span className="text-slate-650 font-bold">{pasar.name}</span>
                  <span className="text-purple-750 font-black">Kota: {pasar.city}</span>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
        
        {/* Floating Layer Selection Panel (Top-Right, inspired by SITABA Sumatra Layer Panel) */}
        <div className="absolute top-4 right-4 bg-[#0b0f19]/90 border border-slate-800 p-3 rounded-lg z-[1000] text-[9px] text-slate-400 font-mono flex flex-col gap-2 shadow-xl backdrop-blur-sm w-44">
          <span className="font-black text-slate-350 border-b border-slate-800 pb-1 uppercase tracking-wider">Layer Peta</span>
          
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
            <input 
              type="checkbox" 
              checked={layerBulog} 
              onChange={() => setLayerBulog(!layerBulog)}
              className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Gudang BULOG Divre
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
            <input 
              type="checkbox" 
              checked={layerInflasi} 
              onChange={() => setLayerInflasi(!layerInflasi)}
              className="rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Kerawanan Inflasi
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
            <input 
              type="checkbox" 
              checked={layerSP2KP} 
              onChange={() => setLayerSP2KP(!layerSP2KP)}
              className="rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-0 w-3 h-3 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Pasar Eceran SP2KP
            </span>
          </label>
        </div>

        {/* Floating Legend box (Bottom-Left, inspired by Legenda block) */}
        <div className="absolute bottom-4 left-4 bg-[#0b0f19]/90 border border-slate-800 p-3 rounded-lg z-[1000] text-[8px] text-slate-400 font-mono flex flex-col gap-1.5 shadow-xl backdrop-blur-sm w-36">
          <span className="font-black text-slate-350 border-b border-slate-800 pb-1 uppercase tracking-wider">Status Kerawanan</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span>Aman (Cukup CBP)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Waspada (Volatilitas)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span>Darurat (Defisit Stok)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
