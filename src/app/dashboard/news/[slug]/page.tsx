import React from 'react';
import Link from 'next/link';
import { NEWS_DATA } from '@/lib/data';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { ArrowLeft, Calendar, User, Tag, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetails({ params }: NewsPageProps) {
  const { slug } = await params;
  const news = NEWS_DATA.find((n) => n.slug === slug);

  if (!news) {
    notFound();
  }

  // Get other recommended articles
  const recommendations = NEWS_DATA.filter((n) => n.slug !== slug);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
      
      {/* 1. Article Content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-bold self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <SectionWrapper className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col gap-5">
          
          {/* Metadata tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {news.author}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {news.date}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
              <Tag className="w-3 h-3 text-indigo-400" /> {news.tag}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-slate-100 leading-snug">
            {news.title}
          </h1>

          {/* Abstract summary */}
          <p className="p-4 rounded-xl bg-slate-900 border border-slate-850 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
            "{news.summary}"
          </p>

          {/* HTML body content */}
          <div 
            className="text-xs sm:text-sm text-slate-300 leading-relaxed flex flex-col gap-4 border-t border-slate-900 pt-5"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

        </SectionWrapper>

      </div>

      {/* 2. Sidebar recommendations */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4 flex items-center gap-1.5 border-b border-slate-900 pb-3">
            <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
            Rekomendasi Analitik Lain
          </h3>

          <div className="flex flex-col gap-4">
            {recommendations.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 text-xs border-b border-slate-900 last:border-0 pb-3 last:pb-0">
                <span className="text-[8px] font-black uppercase text-indigo-400 tracking-wider">
                  {item.tag}
                </span>
                <Link 
                  href={`/dashboard/news/${item.slug}`} 
                  className="font-bold text-slate-200 hover:text-indigo-400 transition-colors leading-snug"
                >
                  {item.title}
                </Link>
                <span className="text-[10px] text-slate-500 mt-1">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
