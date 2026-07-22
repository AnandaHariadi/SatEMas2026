"use client";

import React, { useState, useEffect } from 'react';
import { runMonteCarloSimulation, evaluatePolicyImpact, SimulationResult } from '@/lib/econometrics-engine';
import MonteCarloGraph from '../visualization/MonteCarloGraph';
import PolicyImpactDiagram from '../visualization/PolicyImpactDiagram';
import AnimatedCounter from '../ui/AnimatedCounter';
import { AlertCircle, Sliders, Activity } from 'lucide-react';

export default function PolicySimulator() {
  const [fertilizerSubsidy, setFertilizerSubsidy] = useState(40);
  const [riceImportVolume, setRiceImportVolume] = useState(0.8);
  const [bulogDistribution, setBulogDistribution] = useState(50);
  const [globalOilVolatility, setGlobalOilVolatility] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  const policyMetrics = evaluatePolicyImpact(fertilizerSubsidy, riceImportVolume, bulogDistribution);

  useEffect(() => {
    const result = runMonteCarloSimulation(
      fertilizerSubsidy,
      riceImportVolume,
      bulogDistribution,
      globalOilVolatility
    );
    setSimResult(result);
  }, [fertilizerSubsidy, riceImportVolume, bulogDistribution, globalOilVolatility]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. Control Sliders */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#064e3b] mb-5 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Sliders className="w-4.5 h-4.5 text-emerald-700" />
            Pengaturan Kebijakan Fiskal
          </h3>

          <div className="flex flex-col gap-6">
            
            {/* Global Shock Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Volatilitas Energi Global (Minyak Mentah)
              </label>
              <select
                value={globalOilVolatility}
                onChange={(e) => setGlobalOilVolatility(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-[#064e3b] transition-colors"
              >
                <option value="Low">Low Volatility (Minyak Terkendali)</option>
                <option value="Medium">Medium Volatility (Fluktuatif Regional)</option>
                <option value="High">High Volatility (Geopolitik Global Shock)</option>
              </select>
              <span className="text-[9px] text-slate-455 mt-1 block">
                Meningkatkan risiko ketidakpastian jalur inflasi BPS
              </span>
            </div>

            {/* Slider 1: Subsidy */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-600">Alokasi Subsidi Pupuk</span>
                <span className="text-emerald-700">+{fertilizerSubsidy}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5" value={fertilizerSubsidy}
                onChange={(e) => setFertilizerSubsidy(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
              <div className="flex justify-between text-[9px] text-slate-450 mt-1">
                <span>Baseline BPS</span>
                <span>Maksimum Fiskal (+12T)</span>
              </div>
            </div>

            {/* Slider 2: Rice Imports */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-600">Kuota Impor Beras CBP</span>
                <span className="text-emerald-700">{riceImportVolume} Juta Ton</span>
              </div>
              <input
                type="range" min="0.0" max="2.5" step="0.1" value={riceImportVolume}
                onChange={(e) => setRiceImportVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
              <div className="flex justify-between text-[9px] text-slate-455 mt-1">
                <span>Swasembada Terbatas</span>
                <span>Batas Impor Maksimum</span>
              </div>
            </div>

            {/* Slider 3: Bulog distribution */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-600">Operasi Pasar Beras SPHP Bulog</span>
                <span className="text-emerald-700">{bulogDistribution}% Kapasitas</span>
              </div>
              <input
                type="range" min="0" max="100" step="5" value={bulogDistribution}
                onChange={(e) => setBulogDistribution(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
              <div className="flex justify-between text-[9px] text-slate-450 mt-1">
                <span>Minimal</span>
                <span>Operasi Penuh (Max Stok)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Warning Indicator */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[#064e3b] mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            Catatan Risiko Keberlanjutan
          </h3>
          <div className="text-xs text-slate-500 leading-relaxed flex flex-col gap-3 font-medium">
            {policyMetrics.budgetDeficitTrillion > 48 ? (
              <div className="p-3 rounded-lg bg-red-550/10 border border-red-200 text-red-700">
                <span className="font-bold block mb-1">Over-Stimulus Fiskal!</span>
                Beban belanja APBN melebihi 48T IDR untuk pangan. Ini dapat menekan rasio defisit fiskal nasional di atas target 3% PDB.
              </div>
            ) : (
              <p>
                Rasio kombinasi kebijakan berada di batas aman fiskal. Anggaran belanja pangan terkontrol dengan stabilitas target yang ideal.
              </p>
            )}
            <p>
              Operasi pasar Bulog yang konstan tanpa impor penyeimbang dapat mendepresiasi stok cadangan beras pemerintah hingga level kritis (di bawah 1 juta ton).
            </p>
          </div>
        </div>

      </div>

      {/* 2. Simulation Results and Monte Carlo Charts */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Real-time KPI Dash */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Inflasi Volatile Food</span>
            <div className="text-xl font-black text-slate-800">
              <AnimatedCounter value={policyMetrics.foodInflationRate} decimals={2} suffix="%" />
            </div>
            <span className="text-[9px] text-slate-400 block font-medium">Baseline target: 2.8%</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Beban APBN Pangan</span>
            <div className="text-xl font-black text-emerald-800">
              Rp <AnimatedCounter value={policyMetrics.budgetDeficitTrillion} decimals={1} suffix="T" />
            </div>
            <span className="text-[9px] text-slate-400 block font-medium">Baseline awal: 32.5T</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Dampak Harga Beras</span>
            <div className="text-xl font-black text-slate-800">
              <AnimatedCounter value={policyMetrics.berasPriceChangePct} suffix="%" />
            </div>
            <span className="text-[9px] text-slate-400 block font-medium">Akumulasi transmisi</span>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Peluang Stabilitas</span>
            <div className="text-xl font-black text-emerald-700">
              {simResult ? <AnimatedCounter value={simResult.stabilityProbability} suffix="%" /> : '-'}
            </div>
            <span className="text-[9px] text-slate-400 block font-medium">Target koridor [2.0% - 4.2%]</span>
          </div>

        </div>

        {/* Monte Carlo Visualizer */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col min-h-[380px]">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-emerald-700" />
                Simulasi Monte Carlo (50 Proyeksi Acak Jalur Inflasi Pangan)
              </h3>
              <p className="text-[10px] text-slate-455">
                Peluang stabilitas didefinisikan sebagai persentase sebaran akhir tahun di koridor 2.0% - 4.2%
              </p>
            </div>
          </div>

          <div className="flex-1 w-full relative">
            {simResult && <MonteCarloGraph simulationData={simResult} />}
          </div>
        </div>

        {/* Policy Transmission Path diagram */}
        <PolicyImpactDiagram
          fertilizerSubsidy={fertilizerSubsidy}
          riceImportVolume={riceImportVolume}
          bulogDistribution={bulogDistribution}
        />

      </div>

    </div>
  );
}
