"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, HelpCircle, GraduationCap, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { runARIMAForecast, runMonteCarloSimulation } from '@/lib/econometrics-engine';
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Halo! Saya SATRISNA Econometric Advisor. Saya di sini untuk membantu Anda menganalisis prediksi inflasi pangan, memahami model ekonometrika ARIMA/GARCH, serta mensimulasikan dampak kebijakan fiskal menuju Indonesia Emas 2045. Ada yang ingin Anda tanyakan?',
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const quickActions = [
    { label: 'Prediksi Beras (ARIMA)', query: 'Tampilkan prediksi beras arima' },
    { label: 'Simulasi Impor 1 Jt Ton', query: 'Simulasikan impor beras 1 juta ton' },
    { label: 'ELI5 Inflasi Cabai', query: 'Jelaskan mengapa harga cabai naik bikin inflasi (ELI5)' },
    { label: 'Mulai Kuis Chat', query: 'Mulai mini kuis chat' }
  ];

  const renderMiniArima = (commodityId: string) => {
    const forecast = runARIMAForecast(commodityId);
    const labels = forecast.map(f => f.month.substring(5));
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
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', font: { size: 8 } } }
      }
    };

    return (
      <div className="w-full h-32 bg-white p-2 rounded-lg border border-slate-200 mt-2">
        <Line data={data} options={options as any} />
      </div>
    );
  };

  const renderMiniMonteCarlo = (importVolume: number) => {
    const sim = runMonteCarloSimulation(40, importVolume, 50, 'Medium');
    const labels = sim.months.map(m => m.substring(5));
    
    const datasets = [
      {
        label: 'Median Path',
        data: sim.medianPath,
        borderColor: '#064e3b',
        borderWidth: 3,
        pointRadius: 2,
        fill: false,
        tension: 0.15
      }
    ];

    for (let i = 0; i < 5; i++) {
      datasets.push({
        label: `Path #${i+1}`,
        data: sim.paths[i],
        borderColor: 'rgba(16, 185, 129, 0.08)',
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
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b', font: { size: 8 } } }
      }
    };

    return (
      <div className="w-full h-32 bg-white p-2 rounded-lg border border-slate-200 mt-2 flex flex-col gap-1">
        <div className="flex justify-between text-[7px] text-slate-500 px-1 font-bold">
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
        targetMsg.miniQuiz = { ...targetMsg.miniQuiz, userSelected: optionIdx };
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
        replyText = 'Berikut proyeksi ARIMA(1,1,1) Beras Premium 12 bulan ke depan (Jan - Des 2026). Tren menunjukkan kenaikan musiman di awal tahun.';
        chartType = 'arima';
      } else if (query.includes('impor') || query.includes('monte carlo') || query.includes('simulasikan')) {
        replyText = 'Hasil simulasi Monte Carlo untuk kuota impor beras 1.0 Juta Ton dengan alokasi Bulog 50% menunjukkan sebaran kestabilan sebagai berikut:';
        chartType = 'montecarlo';
      } else if (query.includes('eli5') || query.includes('jelaskan') || query.includes('anak kecil')) {
        replyText = '👶 *ELI5 (Sederhananya)*:\n\nKalau harga cabai rawit naik, inflasi makanan ikut naik karena hampir semua masakan Indonesia pakai cabai. Karena semua orang butuh beli cabai setiap hari, naiknya harga cabai bikin dompet cepat kosong untuk membeli makanan pokok lainnya. Inilah yang disebut BPS sebagai inflasi volatile food!';
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
        replyText = 'Pertanyaan Anda sangat penting! Koordinasi instrumen fiskal APBN (seperti subsidi pupuk) dan logistik Bulog (SPHP) memiliki tingkat korelasi tertinggi untuk menjaga stabilitas volatile food. Coba tanyakan "Tampilkan prediksi beras arima" atau "Mulai kuis chat"!';
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
    <>
      {/* 1. Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white rounded-full shadow-lg shadow-emerald-800/20 flex items-center justify-center cursor-pointer group transition-all duration-300"
      >
        <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out font-bold text-xs whitespace-nowrap pl-0 group-hover:pl-2">
          Tanya SATRISNA AI
        </span>
      </button>

      {/* 2. Chat Overlay Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[380px] h-[520px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#032215] to-[#064e3b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-bold text-xs block">Official SATRISNA AI Helpdesk</span>
                  <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                    BPS/BI Econometrics Engine
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    <div className={`w-7 h-7 rounded-md shrink-0 flex items-center justify-center border text-xs ${
                      msg.sender === 'user' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#064e3b] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                    }`}>
                      <div className="whitespace-pre-line font-medium">{msg.text}</div>
                      
                      {msg.chartType === 'arima' && renderMiniArima('beras')}
                      {msg.chartType === 'montecarlo' && renderMiniMonteCarlo(1.0)}

                      {/* Mini Quiz */}
                      {msg.miniQuiz && (
                        <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col gap-2">
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" /> Mini Kuis Chat
                          </span>
                          <p className="font-bold text-slate-800 mb-1 leading-snug">{msg.miniQuiz.question}</p>
                          
                          <div className="flex flex-col gap-1.5">
                            {msg.miniQuiz.options.map((opt, oIdx) => {
                              const isSelected = msg.miniQuiz?.userSelected === oIdx;
                              const isCorrect = oIdx === msg.miniQuiz?.correctIndex;
                              const hasSelected = msg.miniQuiz?.userSelected !== undefined;

                              let btnStyle = 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100';
                              if (isSelected) btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                              if (hasSelected) {
                                if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-450 text-emerald-900 font-bold';
                                else if (isSelected) btnStyle = 'bg-red-50 border-red-200 text-red-700 line-through';
                                else btnStyle = 'bg-white border-slate-100 text-slate-400';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  disabled={hasSelected}
                                  onClick={() => handleMiniQuizAnswer(idx, oIdx)}
                                  className={`w-full text-left p-2 rounded border text-[10px] transition-all cursor-pointer ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {msg.miniQuiz.userSelected !== undefined && (
                            <div className="mt-2 text-[10px] text-slate-500 leading-normal border-t border-slate-200 pt-2">
                              <span className="font-bold text-emerald-800 block mb-0.5">Penjelasan:</span>
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
                <div className="flex gap-2.5 self-start max-w-[85%]">
                  <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-250 text-slate-400 text-xs rounded-tl-none shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Suggested Actions */}
            <div className="px-4 py-2 border-t border-slate-200 bg-white">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-1.5">
                <HelpCircle className="w-3 h-3 text-emerald-700" /> Perintah Cepat:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(action.query)}
                    className="text-[9px] bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-350 text-slate-600 hover:text-emerald-800 px-2 py-0.5 rounded transition-all duration-200 cursor-pointer font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan prediksi/impor..."
                className="flex-1 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-emerald-600 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
