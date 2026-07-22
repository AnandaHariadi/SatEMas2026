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
  const [points, setPoints] = useState(50); 
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
      setPoints(prev => prev + 25); 
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
    if (scorePct >= 80) return { name: 'Ekonomi Master', color: 'text-emerald-800 border-emerald-250 bg-emerald-50' };
    if (scorePct >= 45) return { name: 'Analis Madya', color: 'text-[#064e3b] border-emerald-150 bg-emerald-50/50' };
    return { name: 'Ekonomi Pemula', color: 'text-amber-800 border-amber-200 bg-amber-50' };
  };

  const renderIllustration = (type?: string) => {
    switch (type) {
      case 'beras':
        return (
          <svg className="w-12 h-12 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          <svg className="w-12 h-12 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" fillOpacity="0.05" />
          </svg>
        );
    }
  };

  // Screen: Active Voucher QR/Barcode popup
  if (activeVoucher) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 p-6 rounded-2xl text-center flex flex-col gap-4 relative shadow-lg"
      >
        <button 
          onClick={() => setActiveVoucher(null)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
          <Check className="w-6 h-6" />
        </div>

        <h3 className="text-sm font-black text-slate-800">Voucher Berhasil Ditukarkan!</h3>
        <p className="text-[10px] text-slate-500 px-3 font-medium">
          Tunjukkan kode/barcode di bawah ini kepada kasir mitra retail untuk klaim sembako gratis Anda.
        </p>

        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2 max-w-[260px] mx-auto shadow-sm">
          <span className="text-[8px] font-black text-[#064e3b] uppercase tracking-widest">{activeVoucher.partner}</span>
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
          <span className="font-mono text-[9px] text-slate-800 font-bold tracking-widest">
            SATRISNA-{activeVoucher.id.toUpperCase()}-8493
          </span>
        </div>

        <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-3">
          Voucher: <span className="text-slate-800 font-bold">{activeVoucher.name}</span>
          <span className="block mt-0.5 font-medium">Berlaku s.d. {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID')}</span>
        </div>

        <GradientButton variant="emerald" onClick={() => setActiveVoucher(null)} className="text-[10px] py-2">
          Kembali ke Kuis
        </GradientButton>
      </motion.div>
    );
  }

  // Screen: Sembako Voucher Store (Tukar Poin)
  if (showVoucherStore) {
    return (
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Tukar Poin Sembako</span>
          </div>
          <button 
            onClick={() => setShowVoucherStore(false)}
            className="p-1 rounded bg-slate-55 hover:bg-slate-100 text-slate-400 hover:text-slate-655 border border-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
          <span className="text-[10px] text-slate-500 font-bold">Saldo Poin Sembako Anda:</span>
          <div className="text-right">
            <span className="text-base font-black text-emerald-800"><AnimatedCounter value={points} /> Poin</span>
            <span className="block text-[8px] text-slate-400 font-medium">Setara Rp {(points * 500).toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {VOUCHERS.map((v) => {
            const canAfford = points >= v.cost;
            return (
              <div key={v.id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex justify-between items-center gap-4">
                <div>
                  <span className="text-[8px] uppercase font-black text-[#064e3b] px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded self-start inline-block mb-1">
                    {v.partner}
                  </span>
                  <h4 className="text-[11px] font-black text-slate-800">{v.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{v.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <button
                    disabled={!canAfford}
                    onClick={() => handleRedeemVoucher(v)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 border-slate-150 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Tukar {v.cost} Poin
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <span className="text-[9px] text-slate-400 leading-normal text-center block font-medium">
          *Penukaran voucher merupakan simulasi CSR ketahanan pangan dengan mitra retail.
        </span>
      </div>
    );
  }

  // Screen: Role Selection
  if (!selectedRole) {
    return (
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-6">
        
        {/* Sembako Wallet Header Widget */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-40 pointer-events-none" />
          <div className="flex items-center gap-2.5 z-10">
            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[#064e3b]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[8px] uppercase tracking-wider text-slate-400 font-bold">Dompet Sembako</span>
              <span className="text-xs font-black text-slate-800 block">SATRISNA Wallet</span>
            </div>
          </div>
          <div className="text-right z-10">
            <span className="text-sm font-extrabold text-emerald-800 block"><AnimatedCounter value={points} /> Poin</span>
            <button 
              onClick={() => setShowVoucherStore(true)}
              className="text-[9px] text-emerald-700 hover:text-emerald-800 font-bold border-b border-dashed border-emerald-500/40 pb-0.5 cursor-pointer"
            >
              Tukar Voucher sembako
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#064e3b] mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-800">Uji Literasi Pangan</h3>
          <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto font-medium">
            Pilih segmen audiens Anda untuk menyesuaikan materi kuis ekonometrika pangan dan intervensi fiskal BPS/BI.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => handleRoleSelect('masyarakat')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/20 hover:border-emerald-350 transition-all text-xs cursor-pointer flex justify-between items-center shadow-sm"
          >
            <div>
              <span className="font-bold text-slate-800 block">Masyarakat Umum</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Analisis ringan seputar bahan pokok sehari-hari.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>

          <button
            onClick={() => handleRoleSelect('umkm')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/20 hover:border-emerald-350 transition-all text-xs cursor-pointer flex justify-between items-center shadow-sm"
          >
            <div>
              <span className="font-bold text-slate-800 block">UMKM Pangan</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Soal operasional bisnis menghadapi volatile food.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>

          <button
            onClick={() => handleRoleSelect('mahasiswa')}
            className="w-full text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50/20 hover:border-emerald-350 transition-all text-xs cursor-pointer flex justify-between items-center shadow-sm"
          >
            <div>
              <span className="font-bold text-slate-800 block">Akademisi / Mahasiswa</span>
              <span className="text-[10px] text-slate-500 mt-0.5 font-medium">Teori ekonometrika ARIMA/GARCH & fiskal APBN.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        </div>
      </div>
    );
  }

  // Screen: Quiz Finished
  if (quizFinished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    const badge = getBadgeAndDescription(finalScore);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-6 text-center"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-black text-slate-800">Evaluasi Selesai!</h3>
          <span className="text-3xl font-black text-slate-800 mt-1">
            <AnimatedCounter value={finalScore} />%
          </span>
          <span className="text-[10px] text-slate-455 mt-1 font-bold">
            Menjawab benar {correctCount} dari {questions.length} Pertanyaan
          </span>
        </div>

        {/* Score and Points Wallet Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-left">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-455 block font-bold">Poin terkumpul</span>
            <span className="text-sm font-extrabold text-emerald-800"><AnimatedCounter value={points} /> Poin</span>
          </div>
          <button 
            onClick={() => setShowVoucherStore(true)}
            className="text-[9px] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg font-bold cursor-pointer"
          >
            Tukar Voucher Sembako
          </button>
        </div>

        <div className={`p-4 rounded-xl border flex flex-col gap-1 items-center ${badge.color}`}>
          <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Peringkat Kompetensi Anda</span>
          <span className="font-black text-slate-855">{badge.name}</span>
        </div>

        <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-600" /> Leaderboard Kelas Terkini
          </span>
          <div className="flex flex-col gap-2.5">
            {LEADERBOARD.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] border-b border-slate-200 pb-1.5 last:border-0 last:pb-0 text-slate-500 font-medium">
                <span className="font-semibold text-slate-700">{idx + 1}. {item.name}</span>
                <span className="text-emerald-800 font-bold">{item.points} Poin ({item.badge})</span>
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

  // Active Question Screen
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-6 relative">
      
      {/* Floating Success Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white font-bold text-[10px] px-4 py-2 rounded-full shadow-md"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Header */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
            <BookOpen className="w-4 h-4 text-emerald-700" /> Segmen {selectedRole.toUpperCase()}
          </span>
          
          <button 
            onClick={() => setShowVoucherStore(true)}
            className="flex items-center gap-1 text-[9px] bg-emerald-50 border border-emerald-250 text-emerald-800 px-2 py-0.5 rounded-full cursor-pointer hover:bg-emerald-100 transition-all font-bold"
          >
            Wallet: {points} Poin
          </button>
        </div>
        
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#064e3b] to-[#10b981]" 
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
          <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider">
            Tipe Soal: {question.type.replace('-', ' ')}
          </span>
          <h4 className="text-xs font-black text-slate-855 leading-relaxed">
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
              let btnClass = 'bg-slate-50 border-slate-205 text-slate-600 hover:border-slate-300 hover:text-slate-800';
              if (selectedOpt === idx) btnClass = 'bg-emerald-50 border-emerald-350 text-emerald-800 font-bold';
              
              if (submitted) {
                if (idx === question.correctAnswerIndex) {
                  btnClass = 'bg-emerald-100 border-emerald-350 text-emerald-900 font-bold';
                } else if (selectedOpt === idx) {
                  btnClass = 'bg-red-50 border-red-200 text-red-700 line-through';
                } else {
                  btnClass = 'bg-white border-slate-100 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={submitted}
                  onClick={() => handleOptionClick(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all flex items-start gap-2.5 cursor-pointer disabled:cursor-default shadow-sm ${btnClass}`}
                >
                  <span className="w-4.5 h-4.5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[9px] shrink-0 font-bold text-slate-800">
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
              let btnClass = 'bg-slate-50 border-slate-205 text-slate-600 hover:border-slate-350 hover:text-slate-800';
              
              if (trueFalseOpt === val) btnClass = 'bg-emerald-50 border-emerald-350 text-emerald-800 font-bold';
              
              if (submitted) {
                const isCorrectVal = (val && question.correctAnswerIndex === 0) || (!val && question.correctAnswerIndex === 1);
                if (isCorrectVal) {
                  btnClass = 'bg-emerald-100 border-emerald-350 text-emerald-900 font-bold';
                } else if (trueFalseOpt === val) {
                  btnClass = 'bg-red-50 border-red-200 text-red-700 line-through';
                } else {
                  btnClass = 'bg-white border-slate-100 text-slate-400';
                }
              }

              return (
                <button
                  key={val ? 'true' : 'false'}
                  disabled={submitted}
                  onClick={() => handleTrueFalseClick(val)}
                  className={`p-4 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer disabled:cursor-default shadow-sm ${btnClass}`}
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
                <span className="text-slate-600">Estimasi Kenaikan Harga Beras:</span>
                <span className="text-[#064e3b]">+{simulationVal}%</span>
              </div>
              <input
                type="range" min="0" max="30" step="1" value={simulationVal}
                disabled={submitted}
                onChange={(e) => setSimulationVal(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#064e3b]"
              />
              <div className="flex justify-between text-[8px] text-slate-400 mt-1 font-bold">
                <span>0% Kestabilan</span>
                <span>30% Krisis Pasokan</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center min-h-[90px] shadow-sm">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div 
                  style={{ transform: `scale(${1 + simulationVal * 0.015})` }} 
                  className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 transition-transform duration-200 shadow-sm"
                >
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[8px] text-slate-455 font-bold">Kenaikan Beras</span>
              </div>

              <div className="flex-1 border-t border-dashed border-slate-300 mx-4 relative">
                <span className="text-[8px] text-slate-600 absolute left-1/2 top-1.5 -translate-x-1/2 font-mono font-bold">
                  +{(simulationVal * 0.4).toFixed(1)}% Inflasi
                </span>
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0">
                <div 
                  style={{ transform: `scale(${Math.max(0.65, 1 - simulationVal * 0.015)})` }} 
                  className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 transition-transform duration-200 shadow-sm"
                >
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-[8px] text-slate-455 font-bold">Daya Beli Rakyat</span>
              </div>
            </div>
            
            <div className="text-[10px] text-slate-455 text-center italic">
              *Geser slider ke target pertanyaan (10%) lalu tekan submit!
            </div>
          </div>
        )}

        {/* MATCHING LISTS */}
        {question.type === 'match' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-400">Kebijakan</span>
                {question.matches?.map((m) => {
                  const isAssigned = !!matchState[m.left];
                  const isSelected = selectedLeftItem === m.left;

                  return (
                    <button
                      key={m.left}
                      disabled={submitted}
                      onClick={() => setSelectedLeftItem(m.left)}
                      className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer shadow-sm ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-350 text-emerald-800 font-bold' 
                          : isAssigned 
                            ? 'bg-slate-50 border-slate-205 text-slate-800 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-550 hover:border-slate-350 hover:text-slate-800'
                      }`}
                    >
                      {m.left}
                      {isAssigned && (
                        <span className="block text-[8px] text-emerald-700 font-mono mt-0.5">
                          &rarr; {matchState[m.left].substring(0, 25)}...
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase font-bold text-slate-400">Dampak Sektoral</span>
                {question.matches?.map((m) => {
                  const isMatched = Object.values(matchState).includes(m.right);
                  return (
                    <button
                      key={m.right}
                      disabled={submitted || !selectedLeftItem || isMatched}
                      onClick={() => handleMatchSelect(selectedLeftItem!, m.right)}
                      className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all cursor-pointer shadow-sm ${
                        isMatched 
                          ? 'bg-slate-100 border-slate-100 text-slate-400 line-through' 
                          : selectedLeftItem 
                            ? 'bg-white border-emerald-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800' 
                            : 'bg-white border-slate-200 text-slate-400'
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
                className="text-[9px] bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-655 px-3 py-1.5 rounded self-end cursor-pointer"
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
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-1 mb-1 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              Penjelasan Akademis:
            </div>
            <p className="text-slate-600 font-medium">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
        <button
          onClick={() => setSelectedRole(null)}
          className="text-[9px] text-slate-400 hover:text-slate-600 cursor-pointer"
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
