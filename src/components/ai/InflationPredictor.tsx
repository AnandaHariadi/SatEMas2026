"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { COMMODITIES } from '@/lib/data';
import { runARIMAForecast, runGARCHForecast, ForecastPoint } from '@/lib/econometrics-engine';
import TimeSeriesChart from '../visualization/TimeSeriesChart';
import AnimatedCounter from '../ui/AnimatedCounter';
import GradientButton from '../ui/GradientButton';
import { Settings, BarChart2, Calendar, FileSpreadsheet, RefreshCw } from 'lucide-react';

export default function InflationPredictor() {
  const [selectedCommId, setSelectedCommId] = useState(COMMODITIES[0].id);
  const [modelType, setModelType] = useState<'ARIMA' | 'GARCH'>('ARIMA');
  const [phi, setPhi] = useState(0.75);
  const [theta, setTheta] = useState(-0.35);
  const [omega, setOmega] = useState(0.12);
  const [alpha, setAlpha] = useState(0.18);
  const [beta, setBeta] = useState(0.78);
  
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [isPending, startTransition] = useTransition();

  const selectedComm = COMMODITIES.find(c => c.id === selectedCommId) || COMMODITIES[0];

  const calculateForecast = () => {
    startTransition(() => {
      let results: ForecastPoint[] = [];
      if (modelType === 'ARIMA') {
        results = runARIMAForecast(selectedCommId, phi, theta);
      } else {
        results = runGARCHForecast(selectedCommId, omega, alpha, beta);
      }
      setForecast(results);
    });
  };

  useEffect(() => {
    calculateForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommId, modelType, phi, theta, omega, alpha, beta]);

  const lastForecastPoint = forecast[forecast.length - 1] || { price: 0, lowerCI: 0, upperCI: 0 };
  const basePrice = selectedComm.currentPrice;
  const pctChange = basePrice > 0 ? ((lastForecastPoint.price - basePrice) / basePrice) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Configuration Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Commodity Select Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#064e3b] mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            Pilih Komoditas Pangan
          </h3>
          <div className="flex flex-col gap-2">
            {COMMODITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommId(c.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                  selectedCommId === c.id
                    ? 'bg-emerald-50/50 border-emerald-400 text-slate-800 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <div>
                  <span className="block">{c.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{c.category}</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-850">Rp {c.currentPrice.toLocaleString('id-ID')}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                    c.volatilityRating === 'High' ? 'bg-red-100 text-red-700' :
                    c.volatilityRating === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {c.volatilityRating} Vol
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Model Select Card */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#064e3b] mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Settings className="w-4 h-4 text-emerald-700" />
            Parameter Ekonometrika
          </h3>

          {/* Model Switcher */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 mb-6">
            <button
              onClick={() => setModelType('ARIMA')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modelType === 'ARIMA' ? 'bg-[#064e3b] text-white shadow-sm' : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              ARIMA (1,1,1)
            </button>
            <button
              onClick={() => setModelType('GARCH')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modelType === 'GARCH' ? 'bg-[#064e3b] text-white shadow-sm' : 'text-slate-550 hover:text-slate-800'
              }`}
            >
              GARCH (1,1)
            </button>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-5">
            {modelType === 'ARIMA' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">Koefisien AR (Phi: &phi;)</span>
                    <span className="text-emerald-700">{phi.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.95" step="0.05" value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Persistensi efek lag harga sebelumnya</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">Koefisien MA (Theta: &theta;)</span>
                    <span className="text-emerald-700">{theta.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="-0.95" max="-0.05" step="0.05" value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Penyesuaian lag residual error acak</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">Constant (Omega: &omega;)</span>
                    <span className="text-emerald-700">{omega.toFixed(3)}</span>
                  </div>
                  <input
                    type="range" min="0.01" max="0.5" step="0.01" value={omega}
                    onChange={(e) => setOmega(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Varians baseline jangka panjang</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">ARCH Effect (Alpha: &alpha;)</span>
                    <span className="text-emerald-700">{alpha.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.30" step="0.01" value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Sensitivitas kuadrat error shock sebelumnya</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-600">GARCH Persistence (Beta: &beta;)</span>
                    <span className="text-emerald-700">{beta.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.50" max="0.90" step="0.02" value={beta}
                    onChange={(e) => setBeta(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Tingkat kelengketan volatilitas pasar</span>
                </div>
              </>
            )}
            
            <div className="mt-2 border-t border-slate-100 pt-4 flex gap-2">
              <GradientButton variant="glass" onClick={calculateForecast} className="flex-1 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} /> Sinkron
              </GradientButton>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Visualizations and Prediction Outputs */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Quick Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Rata-Rata Harga Des 2026</span>
            <div className="text-xl font-black text-slate-800">
              Rp <AnimatedCounter value={lastForecastPoint.price} />
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-1 ${pctChange >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {pctChange >= 0 ? 'Proyeksi Naik' : 'Proyeksi Turun'} {Math.abs(pctChange).toFixed(1)}%
            </span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Batas Bawah CI (Optimal)</span>
            <div className="text-xl font-black text-emerald-700">
              Rp <AnimatedCounter value={lastForecastPoint.lowerCI} />
            </div>
            <span className="text-[9px] text-slate-400 block">Batas bawah keamanan pasok BPS</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Batas Atas CI (Terburuk)</span>
            <div className="text-xl font-black text-red-600">
              Rp <AnimatedCounter value={lastForecastPoint.upperCI} />
            </div>
            <span className="text-[9px] text-slate-400 block">Risiko harga konsumen tertinggi</span>
          </div>

        </div>

        {/* TimeSeries Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex-1 flex flex-col min-h-[380px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800">
                Visualisasi Peramalan Time-Series {selectedComm.name} ({modelType})
              </h3>
              <p className="text-[10px] text-slate-455">
                Daerah teduh hijau merepresentasikan interval keyakinan 95% dari bias residual
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[9px] text-emerald-800 uppercase font-black tracking-wider">Predictive Mode Active</span>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <TimeSeriesChart commodity={selectedComm} forecast={forecast} showCI={true} />
          </div>
        </div>

        {/* Tabular Data View */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <h4 className="text-xs uppercase font-black tracking-widest text-[#064e3b] flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              Data Angka Proyeksi Bulanan (Tahun Buku 2026)
            </h4>
            <button className="text-[9px] font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
              Ekspor CSV
            </button>
          </div>
          
          <div className="overflow-x-auto max-h-[180px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold">
                  <th className="py-2.5">Bulan</th>
                  <th className="py-2.5 text-right text-slate-850">Rata-Rata Proyeksi</th>
                  <th className="py-2.5 text-right text-emerald-700">Batas Bawah CI (95%)</th>
                  <th className="py-2.5 text-right text-red-700">Batas Atas CI (95%)</th>
                  <th className="py-2.5 text-right text-slate-400">Volatilitas (&sigma;)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                {forecast.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 font-mono">{f.month}</td>
                    <td className="py-2 text-right font-bold text-slate-800">Rp {f.price.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-emerald-600 font-bold">Rp {f.lowerCI.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-red-500">Rp {f.upperCI.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-slate-400 font-mono">{f.volatility.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
