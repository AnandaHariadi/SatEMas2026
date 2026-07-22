"use client";

import React from 'react';
import InflationPredictor from '@/components/ai/InflationPredictor';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { TrendingUp, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function PredictionPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      
      {/* Header */}
      <SectionWrapper className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Analisis Time-Series ARIMA / GARCH
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan model ekonometrika canggih untuk memprediksi harga komoditas eceran dengan penyesuaian lag error.
          </p>
        </div>
      </SectionWrapper>

      {/* Main Predictor */}
      <SectionWrapper>
        <InflationPredictor />
      </SectionWrapper>

      {/* Econometric Model Guide */}
      <SectionWrapper className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Model ARIMA(p,d,q) - AutoRegressive
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Model ARIMA (AutoRegressive Integrated Moving Average) bekerja dengan cara mengekstraksi dependensi temporal linear dari data masa lalu (AR) dan shock residual (MA) setelah proses stationaritas (Differencing).
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[10px] text-indigo-300 leading-normal">
            Y_t = c + &phi;_1 * Y_t-1 + &theta;_1 * e_t-1 + e_t
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">
            * Sangat optimal untuk komoditas pangan pokok yang fluktuasi harganya relatif terkontrol (misal: Beras Premium, Daging Sapi).
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Model GARCH(1,1) - Conditional Variance
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Model GARCH (Generalized Autoregressive Conditional Heteroskedasticity) dirancang khusus untuk memodelkan varians error yang tidak konstan (heteroskedastisitas) atau fenomena volatility clustering.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[10px] text-emerald-300 leading-normal">
            &sigma;^2_t = &omega; + &alpha;_1 * e^2_t-1 + &beta;_1 * &sigma;^2_t-1
          </div>
          <span className="text-[10px] text-slate-500 mt-3 block">
            * Sangat optimal untuk komoditas hortikultura yang harganya sangat bergejolak akibat faktor musiman cuaca (misal: Cabai Rawit).
          </span>
        </div>

      </SectionWrapper>

    </div>
  );
}
