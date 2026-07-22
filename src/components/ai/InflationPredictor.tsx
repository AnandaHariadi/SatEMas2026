"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { COMMODITIES } from '@/lib/data';
import { runARIMAForecast, runGARCHForecast, ForecastPoint } from '@/lib/econometrics-engine';
import TimeSeriesChart from '../visualization/TimeSeriesChart';
import AnimatedCounter from '../ui/AnimatedCounter';
import GradientButton from '../ui/GradientButton';
import { Settings, BarChart2, Calendar, ShieldCheck, Cpu, RefreshCw, FileSpreadsheet } from 'lucide-react';

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

  // Run calculation initially and on slider changes
  useEffect(() => {
    calculateForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCommId, modelType, phi, theta, omega, alpha, beta]);

  // Key summary statistics from forecast
  const lastForecastPoint = forecast[forecast.length - 1] || { price: 0, lowerCI: 0, upperCI: 0 };
  const basePrice = selectedComm.currentPrice;
  const pctChange = basePrice > 0 ? ((lastForecastPoint.price - basePrice) / basePrice) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Configuration Panel */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Commodity Select Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Pilih Komoditas Pangan
          </h3>
          <div className="flex flex-col gap-2">
            {COMMODITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCommId(c.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer ${
                  selectedCommId === c.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                    : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                }`}
              >
                <div>
                  <span className="font-bold block">{c.name}</span>
                  <span className="text-[10px] text-slate-500">{c.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold block">Rp {c.currentPrice.toLocaleString('id-ID')}</span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                    c.volatilityRating === 'High' ? 'bg-red-500/10 text-red-400' :
                    c.volatilityRating === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {c.volatilityRating} Vol
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Model Select and Parameters Card */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-400" />
            Parameter Ekonometrika
          </h3>

          {/* Model Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900 mb-6">
            <button
              onClick={() => setModelType('ARIMA')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modelType === 'ARIMA' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ARIMA (1,1,1)
            </button>
            <button
              onClick={() => setModelType('GARCH')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                modelType === 'GARCH' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              GARCH (1,1)
            </button>
          </div>

          {/* Dynamic Parameter Sliders */}
          <div className="flex flex-col gap-5">
            {modelType === 'ARIMA' ? (
              <>
                {/* ARIMA Parameters */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Koefisien AR (Phi: &phi;)</span>
                    <span className="text-indigo-400 font-bold">{phi.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.95" step="0.05" value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Persistensi efek lag harga sebelumnya</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Koefisien MA (Theta: &theta;)</span>
                    <span className="text-indigo-400 font-bold">{theta.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="-0.95" max="-0.05" step="0.05" value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Penyesuaian lag residual error acak</span>
                </div>
              </>
            ) : (
              <>
                {/* GARCH Parameters */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Constant (Omega: &omega;)</span>
                    <span className="text-indigo-400 font-bold">{omega.toFixed(3)}</span>
                  </div>
                  <input
                    type="range" min="0.01" max="0.5" step="0.01" value={omega}
                    onChange={(e) => setOmega(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Varians baseline jangka panjang</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">ARCH Effect (Alpha: &alpha;)</span>
                    <span className="text-indigo-400 font-bold">{alpha.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.05" max="0.30" step="0.01" value={alpha}
                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Sensitivitas kuadrat error shock sebelumnya</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">GARCH Persistence (Beta: &beta;)</span>
                    <span className="text-indigo-400 font-bold">{beta.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.50" max="0.90" step="0.02" value={beta}
                    onChange={(e) => setBeta(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Tingkat kelengketan volatilitas pasar</span>
                </div>
              </>
            )}
            
            <div className="mt-2 border-t border-slate-900 pt-4 flex gap-2">
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
          
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-1">Rata-Rata Harga Des 2026</span>
            <div className="text-xl font-black text-slate-100">
              Rp <AnimatedCounter value={lastForecastPoint.price} />
            </div>
            <span className={`text-[10px] flex items-center gap-1 ${pctChange >= 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {pctChange >= 0 ? 'Proyeksi Naik' : 'Proyeksi Turun'} {Math.abs(pctChange).toFixed(1)}%
            </span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-1">Batas Bawah CI (Optimal)</span>
            <div className="text-xl font-black text-emerald-400">
              Rp <AnimatedCounter value={lastForecastPoint.lowerCI} />
            </div>
            <span className="text-[10px] text-slate-500 block">Probabilitas batas 95%</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block mb-1">Batas Atas CI (Terburuk)</span>
            <div className="text-xl font-black text-red-400">
              Rp <AnimatedCounter value={lastForecastPoint.upperCI} />
            </div>
            <span className="text-[10px] text-slate-500 block">Risiko harga di pasar retail</span>
          </div>

        </div>

        {/* The Forecasting Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex-1 flex flex-col min-h-[380px]">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Grafik Run Time-Series {selectedComm.name} ({modelType})
              </h3>
              <p className="text-[10px] text-slate-500">
                Pita berbayang mewakili 95% confidence intervals dari residual kuadrat
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Predictive Mode</span>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            <TimeSeriesChart commodity={selectedComm} forecast={forecast} showCI={true} />
          </div>
        </div>

        {/* Tabular Data View */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
            <div>
              <h4 className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                Matriks Tabel Proyeksi Bulanan (2026)
              </h4>
            </div>
            <button className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer">
              Ekspor Data CSV
            </button>
          </div>
          
          <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-850 text-slate-500 font-bold">
                  <th className="py-2.5">Bulan</th>
                  <th className="py-2.5 text-right">Rata-Rata Proyeksi</th>
                  <th className="py-2.5 text-right text-emerald-500/80">Batas Bawah CI (95%)</th>
                  <th className="py-2.5 text-right text-red-500/80">Batas Atas CI (95%)</th>
                  <th className="py-2.5 text-right text-slate-500">Volatilitas (&sigma;)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {forecast.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/30">
                    <td className="py-2">{f.month}</td>
                    <td className="py-2 text-right font-bold">Rp {f.price.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-emerald-400/80">Rp {f.lowerCI.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-red-400/80">Rp {f.upperCI.toLocaleString('id-ID')}</td>
                    <td className="py-2 text-right text-slate-500">{f.volatility.toFixed(4)}</td>
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
