import React from 'react';
import Link from 'next/link';
import { NEWS_DATA } from '@/lib/data';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { ArrowLeft, Calendar, User, Tag, BookOpen, Globe } from 'lucide-react';
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

  const recommendations = NEWS_DATA.filter((n) => n.slug !== slug);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
      
      {/* 1. Article Content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-[#064e3b] font-bold self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        <SectionWrapper className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col gap-5">
          
          {/* Metadata tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> {news.author}
            </span>
            <span className="hidden sm:inline text-slate-200">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {news.date}
            </span>
            <span className="hidden sm:inline text-slate-200">•</span>
            <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[#064e3b] px-2.5 py-0.5 rounded-full font-bold">
              <Tag className="w-3 h-3 text-emerald-700" /> {news.tag}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-slate-800 leading-snug">
            {news.title}
          </h1>

          {/* Abstract summary */}
          <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed italic font-medium">
            "{news.summary}"
          </p>

          {/* HTML body content */}
          <div 
            className="text-xs sm:text-sm text-slate-600 leading-relaxed flex flex-col gap-4 border-t border-slate-100 pt-5 font-medium"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

        </SectionWrapper>

      </div>

      {/* 2. Sidebar recommendations */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-xs uppercase font-black tracking-widest text-[#064e3b] mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <BookOpen className="w-4.5 h-4.5 text-emerald-700" />
            Rekomendasi Berita Lain
          </h3>

          <div className="flex flex-col gap-4">
            {recommendations.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 text-xs border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <span className="text-[8px] font-black uppercase text-emerald-700 tracking-wider">
                  {item.tag}
                </span>
                <Link 
                  href={`/dashboard/news/${item.slug}`} 
                  className="font-bold text-slate-800 hover:text-emerald-700 transition-colors leading-snug"
                >
                  {item.title}
                </Link>
                <span className="text-[10px] text-slate-400 font-medium mt-1">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
