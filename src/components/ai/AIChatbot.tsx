"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, GraduationCap, Play, HelpCircle as HelpIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runARIMAForecast, runMonteCarloSimulation, SimulationResult } from '@/lib/econometrics-engine';
import { COMMODITIES } from '@/lib/data';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  chartType?: 'arima' | 'montecarlo';
  chartData?: any;
  miniQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    userSelected?: number;
    explanation: string;
  };
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Halo! Saya SATRISNA Econometric Advisor. Saya di sini untuk membantu Anda menganalisis prediksi inflasi pangan, memahami model ekonometrika ARIMA/GARCH, serta mensimulasikan dampak kebijakan fiskal menuju Indonesia Emas 2045. Ada yang ingin Anda diskusikan?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    { label: 'Prediksi Beras (ARIMA)', query: 'Tampilkan prediksi beras arima' },
    { label: 'Simulasi Impor 1 Jt Ton', query: 'Simulasikan impor beras 1 juta ton' },
    { label: 'ELI5 Inflasi Cabai', query: 'Jelaskan mengapa harga cabai naik bikin inflasi (ELI5)' },
    { label: 'Mulai Mini Kuis Chat', query: 'Mulai mini kuis chat' }
  ];

  // Helper: renders a compact ARIMA line chart inside the chat bubble
  const renderMiniArima = (commodityId: string) => {
    const forecast = runARIMAForecast(commodityId);
    const labels = forecast.map(f => f.month.substring(5)); // show "MM" format
    const prices = forecast.map(f => f.price);
    
    const data = {
      labels,
      datasets: [
        {
          label: 'Proyeksi ARIMA',
          data: prices,
          borderColor: '#10b981',
          borderWidth: 2,
          borderDash: [3, 3],
          pointRadius: 2,
          fill: false,
          tension: 0.2
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 8 } } }
      }
    };

    return (
      <div className="w-full h-36 bg-slate-950 p-2 rounded-xl border border-slate-900 mt-2">
        <Line data={data} options={options as any} />
      </div>
    );
  };

  // Helper: renders a compact Monte Carlo chart inside the chat bubble
  const renderMiniMonteCarlo = (importVolume: number) => {
    // Run simulation for the given import volume
    const sim = runMonteCarloSimulation(40, importVolume, 50, 'Medium');
    const labels = sim.months.map(m => m.substring(5));
    
    const datasets = [
      {
        label: 'Median Path',
        data: sim.medianPath,
        borderColor: '#10b981',
        borderWidth: 3,
        pointRadius: 2,
        fill: false,
        tension: 0.15
      }
    ];

    // Add 8 paths to keep chart lightweight inside chat
    for (let i = 0; i < 8; i++) {
      datasets.push({
        label: `Path #${i+1}`,
        data: sim.paths[i],
        borderColor: 'rgba(99, 102, 241, 0.12)',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
        tension: 0.2
      } as any);
    }

    const data = { labels, datasets };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 8 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 8 } } }
      }
    };

    return (
      <div className="w-full h-36 bg-slate-950 p-2 rounded-xl border border-slate-900 mt-2 flex flex-col gap-1">
        <div className="flex justify-between text-[8px] text-slate-500 px-1">
          <span>Stabilitas: {sim.stabilityProbability}%</span>
          <span>APBN: Rp {sim.averageBudgetCost.toFixed(1)}T</span>
        </div>
        <div className="flex-1 min-h-0">
          <Line data={data} options={options as any} />
        </div>
      </div>
    );
  };

  const handleMiniQuizAnswer = (messageIdx: number, optionIdx: number) => {
    setMessages(prev => {
      const updated = [...prev];
      const targetMsg = updated[messageIdx];
      if (targetMsg && targetMsg.miniQuiz) {
        targetMsg.miniQuiz = {
          ...targetMsg.miniQuiz,
          userSelected: optionIdx
        };
      }
      return updated;
    });
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let chartType: 'arima' | 'montecarlo' | undefined = undefined;
      let miniQuiz: any = undefined;

      const query = textToSend.toLowerCase();

      if (query.includes('prediksi') && (query.includes('beras') || query.includes('arima'))) {
        replyText = 'Berikut adalah grafik peramalan ARIMA(1,1,1) untuk Beras Premium selama 12 bulan ke depan (Januari 2026 - Desember 2026). Tren menunjukkan kenaikan perlahan dipicu inflasi musiman awal tahun.';
        chartType = 'arima';
      } else if (query.includes('impor') || query.includes('monte carlo') || query.includes('simulasikan')) {
        replyText = 'Berdasarkan simulasi Monte Carlo (kombinasi subsidi pupuk 40%, Bulog 50%, dan kuota impor beras 1.0 Juta Ton), probabilitas stabilitas pangan berada pada koridor aman dengan visualisasi jalur acak di bawah ini:';
        chartType = 'montecarlo';
      } else if (query.includes('eli5') || query.includes('jelaskan') || query.includes('anak kecil')) {
        replyText = '👶 *ELI5 (Sederhananya)*:\n\nKalau harga cabai rawit naik, inflasi makanan ikut naik karena hampir semua masakan Indonesia pakai cabai. Karena semua orang butuh beli cabai setiap hari, naiknya harga cabai bikin dompet ibu-ibu cepat kosong untuk membeli makanan pokok lainnya. Inilah yang disebut BPS sebagai inflasi volatile food!';
      } else if (query.includes('kuis') || query.includes('quiz') || query.includes('mulai')) {
        replyText = 'Ayo uji pemahaman Anda lewat kuis chat mini ini! Silakan pilih jawaban Anda pada panel interaktif di bawah:';
        miniQuiz = {
          question: 'Jika pemerintah menaikkan anggaran subsidi pupuk sektor pertanian sebesar 40%, apa dampak utamanya terhadap harga beras premium?',
          options: [
            'Menurunkan biaya produksi tani sehingga harga beras turun di pasar retail.',
            'Memicu kelangkaan beras akibat petani berhenti memproduksi padi.',
            'Menaikkan inflasi pangan umum di atas 10% yoy secara mendadak.'
          ],
          correctIndex: 0,
          explanation: 'Subsidi pupuk memotong Harga Pokok Produksi (HPP) input tani, sehingga menurunkan harga panen beras eceran.'
        };
      } else {
        replyText = 'Pertanyaan Anda sangat penting! Dari perspektif sistem keputusan pendukung (DSS) SATRISNA, koordinasi instrumen fiskal APBN (seperti subsidi pupuk) dan logistik Bulog (SPHP) memiliki tingkat korelasi tertinggi untuk menjaga stabilitas volatile food di kisaran target 2.0% - 4.2%. Coba tanyakan "Tampilkan prediksi beras arima" atau "Mulai mini kuis chat"!';
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: replyText,
        timestamp: new Date(),
        chartType,
        miniQuiz
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[520px] rounded-2xl glass-panel overflow-hidden border border-slate-800">
      
      {/* Chat header */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-100 block">Asisten SATRISNA AI</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              ARIMA/GARCH Engine Online
            </span>
          </div>
        </div>
        <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
      </div>

      {/* Messages viewport */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-950/20">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                msg.sender === 'user' 
                  ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-900/80 text-slate-200 rounded-tl-none border border-slate-800'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                
                {/* Visual outputs rendered directly inline */}
                {msg.chartType === 'arima' && renderMiniArima('beras')}
                {msg.chartType === 'montecarlo' && renderMiniMonteCarlo(1.0)}

                {/* Inline Mini Quiz Render */}
                {msg.miniQuiz && (
                  <div className="mt-3 bg-slate-950/80 p-3 rounded-lg border border-slate-850 flex flex-col gap-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> Mini Kuis Chat
                    </span>
                    <p className="font-semibold text-slate-200 mb-1">{msg.miniQuiz.question}</p>
                    
                    <div className="flex flex-col gap-1.5">
                      {msg.miniQuiz.options.map((opt, oIdx) => {
                        const isSelected = msg.miniQuiz?.userSelected === oIdx;
                        const isCorrect = oIdx === msg.miniQuiz?.correctIndex;
                        const hasSelected = msg.miniQuiz?.userSelected !== undefined;

                        let btnStyle = 'bg-slate-900 border-slate-850 text-slate-450 hover:bg-slate-850';
                        if (isSelected) btnStyle = 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300';
                        if (hasSelected) {
                          if (isCorrect) btnStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300';
                          else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500/40 text-red-300 line-through';
                          else btnStyle = 'bg-slate-900/50 border-slate-900/50 text-slate-600';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={hasSelected}
                            onClick={() => handleMiniQuizAnswer(idx, oIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {msg.miniQuiz.userSelected !== undefined && (
                      <div className="mt-2 text-[10px] text-slate-400 leading-normal border-t border-slate-900 pt-2">
                        <span className="font-bold text-emerald-400 block mb-0.5">Penjelasan:</span>
                        {msg.miniQuiz.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex gap-3 self-start max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-xs rounded-tl-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Actions */}
      <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/40">
        <span className="text-[10px] text-slate-500 flex items-center gap-1 mb-1.5">
          <HelpIcon className="w-3.5 h-3.5 text-indigo-400" /> Coba Perintah Pintar:
        </span>
        <div className="flex flex-wrap gap-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.query)}
              className="text-[9px] bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/30 text-slate-450 hover:text-indigo-300 px-2 py-1 rounded-md text-left transition-all duration-200 cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-slate-900/60 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan prediksi beras arima atau minta mini kuis..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
