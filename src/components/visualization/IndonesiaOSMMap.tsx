"use client";

import React, { useEffect } from 'react';
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

// Map BPS regions to coords
const MAP_REGIONS = REGIONS.map(r => {
  let coordId = r.id;
  if (r.id === 'nusatenggara') coordId = 'nusatenggaraanalytics';
  else coordId = `${r.id}analytics`;
  
  return {
    ...r,
    coords: REGION_COORDS[coordId] || [-2.5, 118.0]
  };
});

interface IndonesiaOSMMapProps {
  onRegionSelect: (region: RegionalData) => void;
  selectedRegionId?: string;
}

export default function IndonesiaOSMMap({ onRegionSelect, selectedRegionId }: IndonesiaOSMMapProps) {
  
  // Fix for Leaflet default icon markers in Next.js
  useEffect(() => {
    // Delete default icon prototype settings to avoid path resolution issues
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
    <div className="w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative z-10">
      <MapContainer 
        center={[-2.400, 118.000]} 
        zoom={4} 
        scrollWheelZoom={false}
        className="w-full h-[360px]"
        zoomControl={true}
      >
        {/* Minimalist CartoDB Positron Light Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {MAP_REGIONS.map((reg) => {
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
                fillOpacity: 0.6,
                weight: isSelected ? 4 : 2,
                className: 'transition-all duration-300 cursor-pointer animate-pulse'
              }}
              eventHandlers={{
                click: () => onRegionSelect(reg)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
                <div className="text-[10px] font-bold p-1 flex flex-col gap-0.5">
                  <span className="text-slate-800 border-b border-slate-100 pb-0.5">{reg.name}</span>
                  <span className="text-slate-500">Status: <span className="font-extrabold" style={{ color }}>{reg.status}</span></span>
                  <span className="text-slate-600">Beras: Rp {reg.berasPrice.toLocaleString('id-ID')}</span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
