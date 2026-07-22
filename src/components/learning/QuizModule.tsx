"use client";

import React, { useState } from 'react';
import { ROLE_QUIZZES, QuizQuestion, QuestionType } from '@/lib/data';
import GradientButton from '../ui/GradientButton';
import AnimatedCounter from '../ui/AnimatedCounter';
import { 
  HelpCircle, Award, CheckCircle2, AlertCircle, RefreshCw, 
  ArrowRight, Users, BookOpen, Trophy, Sparkles, TrendingUp, 
  DollarSign, ShoppingBag, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voucher {
  id: string;
  name: string;
  cost: number;
  partner: 'Perum Bulog' | 'Indomaret' | 'Alfamart';
  desc: string;
}

export default function QuizModule() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [trueFalseOpt, setTrueFalseOpt] = useState<boolean | null>(null);
  const [simulationVal, setSimulationVal] = useState(0); 
  const [matchState, setMatchState] = useState<Record<string, string>>({}); 
  const [selectedLeftItem, setSelectedLeftItem] = useState<string | null>(null);
  
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Points & Rewards States
  const [points, setPoints] = useState(50); // Start with 50 points for demo convenience
  const [showVoucherStore, setShowVoucherStore] = useState(false);
  const [activeVoucher, setActiveVoucher] = useState<Voucher | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const questions = selectedRole ? ROLE_QUIZZES[selectedRole] : [];
  const question: QuizQuestion | undefined = questions[currentIdx];

  const VOUCHERS: Voucher[] = [
    { id: 'bulog-sphp', name: 'Voucher Sembako Bulog 5Kg', cost: 100, partner: 'Perum Bulog', desc: 'Beras SPHP subsidi Bulog gratis.' },
    { id: 'indomaret-oil', name: 'Potongan Minyak Goreng 2L', cost: 60, partner: 'Indomaret', desc: 'Diskon Rp30.000 Minyak Goreng Kita.' },
    { id: 'alfamart-retail', name: 'Voucher Belanja Pangan Alfamart', cost: 50, partner: 'Alfamart', desc: 'Potongan belanja bahan pokok Rp25.000.' }
  ];

  const LEADERBOARD = [
    { name: 'Dr. Lana Fathia', role: 'Mahasiswa', score: 100, points: 250, badge: 'Ekonomi Master' },
    { name: 'Siti Rahma', role: 'UMKM', score: 100, points: 200, badge: 'Ekonomi Master' },
    { name: 'Ahmad Basri', role: 'Masyarakat', score: 100, points: 150, badge: 'Ekonomi Master' }
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCurrentIdx(0);
    setCorrectCount(0);
    setQuizFinished(false);
    setSelectedOpt(null);
    setTrueFalseOpt(null);
    setSimulationVal(0);
    setMatchState({});
    setSubmitted(false);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setTrueFalseOpt(null);
    setSimulationVal(0);
    setMatchState({});
    setSubmitted(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleOptionClick = (idx: number) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleTrueFalseClick = (val: boolean) => {
    if (submitted) return;
    setTrueFalseOpt(val);
  };

  const handleMatchSelect = (left: string, right: string) => {
    if (submitted) return;
    setMatchState(prev => ({ ...prev, [left]: right }));
    setSelectedLeftItem(null);
  };

  const handleMatchReset = () => {
    if (submitted) return;
    setMatchState({});
  };

  const handleSubmit = () => {
    if (submitted) return;

    let isCorrect = false;

    if (question.type === 'pilihan-ganda') {
      isCorrect = selectedOpt === question.correctAnswerIndex;
    } else if (question.type === 'true-false') {
      isCorrect = (trueFalseOpt === true && question.correctAnswerIndex === 0) ||
                  (trueFalseOpt === false && question.correctAnswerIndex === 1);
    } else if (question.type === 'simulasi') {
      const range = question.simulationCorrectResultRange || [0, 100];
      const simulatedImpact = simulationVal * 0.4;
      isCorrect = simulatedImpact >= range[0] && simulatedImpact <= range[1];
    } else if (question.type === 'match') {
      isCorrect = true;
      question.matches?.forEach(m => {
        if (matchState[m.left] !== m.right) {
          isCorrect = false;
        }
      });
    }

    setSubmitted(true);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setPoints(prev => prev + 25); // Gain 25 points per correct answer
      setNotification('+25 Poin Berhasil Ditambahkan ke Wallet!');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setTrueFalseOpt(null);
    setSimulationVal(0);
    setMatchState({});
    setSubmitted(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (points < voucher.cost) {
      alert('Poin Anda tidak mencukupi untuk menukar voucher ini!');
      return;
    }
    setPoints(prev => prev - voucher.cost);
    setActiveVoucher(voucher);
  };

  const getBadgeAndDescription = (scorePct: number) => {
    if (scorePct >= 80) return { name: 'Ekonomi Master', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (scorePct >= 45) return { name: 'Analis Madya', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5' };
    return { name: 'Ekonomi Pemula', color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' };
  };

  // Helper render food icons
  const renderIllustration = (type?: string) => {
    switch (type) {
      case 'beras':
        return (
          <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M5 12h14M8 7l4-5 4 5M4 17l8 5 8-5" strokeLinecap="round" />
          </svg>
        );
      case 'cabai':
        return (
          <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-1.5-3-2.5-4.5" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg className="w-12 h-12 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.05" />
          </svg>
        );
    }
  };

  // 1. Screen: Active Voucher QR/Barcode popup
  if (activeVoucher) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-6 rounded-2xl border border-slate-800 text-center flex flex-col gap-4 relative"
      >
        <button 
          onClick={() => setActiveVoucher(null)}
          className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-slate-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
          <Check className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-bold text-slate-100">Voucher Berhasil Ditukarkan!</h3>
        <p className="text-[10px] text-slate-400 px-3">
          Tunjukkan kode/barcode di bawah ini kepada kasir mitra retail untuk klaim sembako gratis Anda.
        </p>

        {/* Realistic Barcode Graphic using SVG */}
        <div className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 max-w-[260px] mx-auto">
          <span className="text-[8px] font-bold text-slate-850 uppercase tracking-widest">{activeVoucher.partner}</span>
          <svg className="w-48 h-12 text-slate-900" viewBox="0 0 100 30" fill="currentColor">
            <rect x="0" y="0" width="2" height="30" />
            <rect x="4" y="0" width="1" height="30" />
            <rect x="7" y="0" width="3" height="30" />
            <rect x="12" y="0" width="1" height="30" />
            <rect x="15" y="0" width="2" height="30" />
            <rect x="20" y="0" width="4" height="30" />
            <rect x="26" y="0" width="1" height="30" />
            <rect x="29" y="0" width="3" height="30" />
            <rect x="34" y="0" width="2" height="30" />
            <rect x="38" y="0" width="4" height="30" />
            <rect x="44" y="0" width="1" height="30" />
            <rect x="47" y="0" width="2" height="30" />
            <rect x="51" y="0" width="3" height="30" />
            <rect x="56" y="0" width="1" height="30" />
            <rect x="59" y="0" width="4" height="30" />
            <rect x="65" y="0" width="2" height="30" />
            <rect x="69" y="0" width="1" height="30" />
            <rect x="72" y="0" width="3" height="30" />
            <rect x="77" y="0" width="4" height="30" />
            <rect x="83" y="0" width="2" height="30" />
            <rect x="87" y="0" width="1" height="30" />
            <rect x="90" y="0" width="3" height="30" />
            <rect x="95" y="0" width="2" height="30" />
          </svg>
          <span className="font-mono text-[9px] text-slate-850 font-bold tracking-widest">
            SATRISNA-{activeVoucher.id.toUpperCase()}-8493
          </span>
        </div>

        <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3">
          Voucher: <span className="text-slate-350 font-semibold">{activeVoucher.name}</span>
          <span className="block mt-0.5">Berlaku s.d. {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}</span>
        </div>

        <GradientButton variant="emerald" onClick={() => setActiveVoucher(null)} className="text-[10px] py-2">
          Kembali ke Kuis
        </GradientButton>
      </motion.div>
    );
  }

  // 2. Screen: Sembako Voucher Store (Tukar Poin)
  if (showVoucherStore) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Tukar Poin Sembako</span>
          </div>
          <button 
            onClick={() => setShowVoucherStore(false)}
            className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-500 hover:text-slate-300 border border-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Balance */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center">
          <span className="text-[10px] text-slate-500">Saldo Poin Sembako Anda:</span>
          <div className="text-right">
            <span className="text-lg font-black text-indigo-400"><AnimatedCounter value={points} /> Poin</span>
            <span className="block text-[8px] text-slate-600">Setara Rp {(points * 500).toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Voucher Store items */}
        <div className="flex flex-col gap-3">
          {VOUCHERS.map((v) => {
            const canAfford = points >= v.cost;
            return (
              <div key={v.id} className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/40 flex justify-between items-center gap-4">
                <div>
                  <span className="text-[8px] uppercase font-bold text-indigo-400 px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded self-start inline-block mb-1">
                    {v.partner}
                  </span>
                  <h4 className="text-[11px] font-bold text-slate-200">{v.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{v.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeemVoucher(v)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/35 text-emerald-400'
                        : 'bg-slate-950 border-slate-950 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Tukar {v.cost} Poin
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <span className="text-[9px] text-slate-500 leading-normal text-center block">
          *Penukaran voucher merupakan simulasi CSR ketahanan pangan dengan mitra retail.
        </span>
      </div>
    );
  }

  // 3. Screen: Role Selection
  if (!selectedRole) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-6">
        
        {/* Sembako Wallet Header Widget */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-emerald-500/5 opacity-50 pointer-events-none" />
          <div className="flex items-center gap-2.5 z-10">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-indigo-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Dompet Sembako</span>
              <span className="text-xs font-bold text-slate-250 block">SATRISNA Wallet</span>
            </div>
          </div>
          <div className="text-right z-10">
            <span className="text-sm font-extrabold text-indigo-400 block"><AnimatedCounter value={points} /> Poin</span>
            <button 
              onClick={() => setShowVoucherStore(true)}
              className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold border-b border-dashed border-emerald-500/40 pb-0.5 cursor-pointer"
            >
              Tukar Voucher sembako
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Uji Literasi Pangan</h3>
          <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
            Pilih segmen audiens Anda untuk menyesuaikan materi kuis ekonometrika pangan dan intervensi fiskal BPS/BI.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleRoleSelect('masyarakat')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-indigo-950/20 hover:border-indigo-500/30 transition-all text-xs cursor-pointer flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-slate-200 block">Masyarakat Umum</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Analisis ringan seputar bahan pokok sehari-hari.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={() => handleRoleSelect('umkm')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-indigo-950/20 hover:border-indigo-500/30 transition-all text-xs cursor-pointer flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-slate-200 block">UMKM Pangan</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Soal operasional bisnis menghadapi volatile food.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={() => handleRoleSelect('mahasiswa')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-indigo-950/20 hover:border-indigo-500/30 transition-all text-xs cursor-pointer flex justify-between items-center"
          >
            <div>
              <span className="font-bold text-slate-200 block">Akademisi / Mahasiswa</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Teori ekonometrika ARIMA/GARCH & fiskal APBN.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Screen: Quiz Finished
  if (quizFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const badge = getBadgeAndDescription(finalScore);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-6 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-100">Evaluasi Selesai!</h3>
          <span className="text-3xl font-black text-slate-100 mt-1">
            <AnimatedCounter value={finalScore} />%
          </span>
          <span className="text-[10px] text-slate-500 mt-1">
            Menjawab benar {correctCount} dari {questions.length} Pertanyaan
          </span>
        </div>

        {/* Score and Points Wallet Banner */}
        <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Poin terkumpul</span>
            <span className="text-sm font-bold text-indigo-400"><AnimatedCounter value={points} /> Poin</span>
          </div>
          <button 
            onClick={() => setShowVoucherStore(true)}
            className="text-[9px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
          >
            Tukar Voucher Sembako
          </button>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col gap-1 items-center ${badge.color}`}>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Peringkat Kompetensi Anda</span>
          <span className="font-black text-slate-200">{badge.name}</span>
        </div>

        <div className="text-left bg-slate-950 p-4 rounded-xl border border-slate-900">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Leaderboard Kelas Terkini
          </span>
          <div className="flex flex-col gap-2.5">
            {LEADERBOARD.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] border-b border-slate-900 pb-1.5 last:border-0 last:pb-0 text-slate-400">
                <span className="font-semibold text-slate-300">{idx + 1}. {item.name}</span>
                <span className="text-indigo-400 font-semibold">{item.points} Poin ({item.badge})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <GradientButton variant="glass" onClick={() => setSelectedRole(null)} className="flex-1 text-[10px]">
            Ganti Segmen
          </GradientButton>
          <GradientButton variant="emerald" onClick={handleRestart} className="flex-1 text-[10px]">
            <RefreshCw className="w-3.5 h-3.5" /> Ulangi Kuis
          </GradientButton>
        </div>
      </motion.div>
    );
  }

  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);

  // 5. Screen: Active Question Screen
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-6 relative">
      
      {/* Floating Success Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold text-[10px] px-4 py-2 rounded-full shadow-lg shadow-emerald-500/20"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex flex-col gap-2 border-b border-slate-900 pb-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-indigo-400" /> Segmen {selectedRole.toUpperCase()}
          </span>
          
          {/* Inline wallet score tracker */}
          <button 
            onClick={() => setShowVoucherStore(true)}
            className="flex items-center gap-1 text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full cursor-pointer hover:bg-indigo-500/20 transition-all font-bold"
          >
            Wallet: {points} Poin
          </button>
        </div>
        
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500" 
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Illustration + Question Text */}
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {renderIllustration(question.illustrationType)}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">
            Tipe Soal: {question.type.replace('-', ' ')}
          </span>
          <h4 className="text-xs font-semibold text-slate-200 leading-relaxed">
            {question.question}
          </h4>
        </div>
      </div>

      {/* Input Controls depending on Question Type */}
      <div className="my-2 flex-1">
        
        {/* PILIHAN GANDA */}
        {question.type === 'pilihan-ganda' && (
          <div className="flex flex-col gap-2">
            {question.options?.map((opt, idx) => {
              let btnClass = 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200';
              if (selectedOpt === idx) btnClass = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
              
              if (submitted) {
                if (idx === question.correctAnswerIndex) {
                  btnClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold';
                } else if (selectedOpt === idx) {
                  btnClass = 'bg-red-500/15 border-red-500/40 text-red-300 line-through';
                } else {
                  btnClass = 'bg-slate-950 border-slate-950/40 text-slate-600';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => handleOptionClick(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-[11px] transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  <span className="w-4.5 h-4.5 rounded-md bg-slate-950/60 border border-slate-800 flex items-center justify-center text-[9px] shrink-0 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* TRUE / FALSE */}
        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => {
              const displayLabel = val ? 'True (Benar)' : 'False (Salah)';
              let btnClass = 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200';
              
              if (trueFalseOpt === val) btnClass = 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
              
              if (submitted) {
                const isCorrectVal = (val && question.correctAnswerIndex === 0) || (!val && question.correctAnswerIndex === 1);
                if (isCorrectVal) {
                  btnClass = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold';
                } else if (trueFalseOpt === val) {
                  btnClass = 'bg-red-500/15 border-red-500/40 text-red-300 line-through';
                } else {
                  btnClass = 'bg-slate-950 border-slate-950/40 text-slate-600';
                }
              }

              return (
                <button
                  key={val ? 'true' : 'false'}
                  disabled={submitted}
                  onClick={() => handleTrueFalseClick(val)}
                  className={`p-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer disabled:cursor-default ${btnClass}`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* SIMULASI INTERAKTIF */}
        {question.type === 'simulasi' && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-400">Estimasi Kenaikan Harga Beras:</span>
                <span className="text-indigo-400">+{simulationVal}%</span>
              </div>
              <input
                type="range" min="0" max="30" step="1" value={simulationVal}
                disabled={submitted}
                onChange={(e) => setSimulationVal(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[8px] text-slate-500 mt-1">
                <span>0% Kestabilan</span>
                <span>30% Krisis Pasokan</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 flex justify-between items-center min-h-[90px]">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div 
                  style={{ transform: `scale(${1 + simulationVal * 0.015})` }} 
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 transition-transform duration-200"
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[8px] text-slate-500">Kenaikan Beras</span>
              </div>

              <div className="flex-1 border-t border-dashed border-slate-800 mx-4 relative">
                <span className="text-[8px] text-slate-600 absolute left-1/2 top-1.5 -translate-x-1/2 font-mono">
                  +{(simulationVal * 0.4).toFixed(1)}% Inflasi
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0">
                <div 
                  style={{ transform: `scale(${Math.max(0.65, 1 - simulationVal * 0.015)})` }} 
                  className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 transition-transform duration-200"
                >
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[8px] text-slate-500">Daya Beli Rakyat</span>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-500 text-center italic">
              *Geser slider ke target pertanyaan (10%) lalu tekan submit!
            </div>
          </div>
        )}

        {/* MATCHING LISTS */}
        {question.type === 'match' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-500">Kebijakan</span>
                {question.matches?.map((m) => {
                  const isAssigned = !!matchState[m.left];
                  const isSelected = selectedLeftItem === m.left;

                  return (
                    <button
                      key={m.left}
                      disabled={submitted}
                      onClick={() => setSelectedLeftItem(m.left)}
                      className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300' 
                          : isAssigned 
                            ? 'bg-slate-900/60 border-slate-800 text-slate-300 font-semibold' 
                            : 'bg-slate-900/20 border-slate-900 text-slate-500 hover:border-slate-800'
                      }`}
                    >
                      {m.left}
                      {isAssigned && (
                        <span className="block text-[8px] text-indigo-400 font-mono mt-0.5">
                          &rarr; {matchState[m.left].substring(0, 25)}...
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-500">Dampak Sektoral</span>
                {question.matches?.map((m) => {
                  const isMatched = Object.values(matchState).includes(m.right);
                  return (
                    <button
                      key={m.right}
                      disabled={submitted || !selectedLeftItem || isMatched}
                      onClick={() => handleMatchSelect(selectedLeftItem!, m.right)}
                      className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer ${
                        isMatched 
                          ? 'bg-slate-950 border-slate-950 text-slate-600 line-through' 
                          : selectedLeftItem 
                            ? 'bg-slate-900/50 border-indigo-500/20 text-slate-350 hover:border-indigo-500/40 hover:text-indigo-200' 
                            : 'bg-slate-900/20 border-slate-900 text-slate-500'
                      }`}
                    >
                      {m.right}
                    </button>
                  );
                })}
              </div>
            </div>

            {!submitted && (
              <button 
                onClick={handleMatchReset} 
                className="text-[9px] bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-500 px-3 py-1.5 rounded self-end cursor-pointer"
              >
                Reset Pasangan
              </button>
            )}
          </div>
        )}

      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-3.5 rounded-xl border text-[11px] leading-relaxed ${
              (question.type === 'pilihan-ganda' && selectedOpt === question.correctAnswerIndex) ||
              (question.type === 'true-false' && ((trueFalseOpt === true && question.correctAnswerIndex === 0) || (trueFalseOpt === false && question.correctAnswerIndex === 1))) ||
              (question.type === 'simulasi' && (simulationVal * 0.4 >= (question.simulationCorrectResultRange?.[0] || 0) && simulationVal * 0.4 <= (question.simulationCorrectResultRange?.[1] || 100))) ||
              (question.type === 'match' && question.matches?.every(m => matchState[m.left] === m.right))
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            <div className="flex items-center gap-1 mb-1 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Penjelasan Akademis:
            </div>
            <p className="text-slate-350">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="border-t border-slate-900 pt-4 flex justify-between items-center">
        <button
          onClick={() => setSelectedRole(null)}
          className="text-[9px] text-slate-500 hover:text-slate-400"
        >
          &larr; Kembali ke Segmen
        </button>

        {!submitted ? (
          <GradientButton
            variant="indigo"
            disabled={
              (question.type === 'pilihan-ganda' && selectedOpt === null) ||
              (question.type === 'true-false' && trueFalseOpt === null) ||
              (question.type === 'simulasi' && simulationVal === 0) ||
              (question.type === 'match' && Object.keys(matchState).length < (question.matches?.length || 0))
            }
            onClick={handleSubmit}
            className="text-[10px] py-2 px-4"
          >
            Kirim Jawaban
          </GradientButton>
        ) : (
          <GradientButton variant="emerald" onClick={handleNext} className="text-[10px] py-2 px-4">
            {currentIdx + 1 === questions.length ? 'Lihat Peringkat Skor' : 'Soal Berikutnya'}
            <ArrowRight className="w-3.5 h-3.5" />
          </GradientButton>
        )}
      </div>

    </div>
  );
}
