"use client";

import React, { useState } from 'react';
import { GLOSSARY_DATA } from '@/lib/data';
import { Search, BookOpen, Filter } from 'lucide-react';

export default function GlossaryEconomics() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Ekonometrika', 'Kebijakan Fiskal', 'Makroekonomi'];

  const filteredTerms = GLOSSARY_DATA.filter((item) => {
    const matchesSearch = item.term.toLowerCase().includes(search.toLowerCase()) || 
                          item.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      
      {/* Search and Category Filter Ribbon */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-900">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari istilah ekonomi..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  {item.term}
                </h4>
                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${
                  item.category === 'Ekonometrika' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  item.category === 'Kebijakan Fiskal' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                  'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {item.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-slate-500 text-xs">
            Tidak ada istilah yang cocok dengan kata kunci "{search}"
          </div>
        )}
      </div>

    </div>
  );
}
