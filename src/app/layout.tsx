import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'SATRISNA: Ekonometrika & Simulasi Kebijakan Fiskal Pangan',
  description: 'Integrasi Analitik Digital Berbasis Model Ekonometrika Time-Series dalam Prediksi Inflasi Pangan dan Simulasi Kebijakan Fiskal untuk Stabilitas Ekonomi Nasional Menuju Indonesia Emas 2045.',
  keywords: 'Inflasi Pangan, Ekonometrika, ARIMA, GARCH, Kebijakan Fiskal, Monte Carlo, Bulog, Gemastik 2026',
  authors: [{ name: 'Tim Inovasi Gemastik' }],
  viewport: 'width=device-width, initial-scale=1'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <Navbar />
        {/* Ambient background glows */}
        <div className="relative w-full flex-1 flex flex-col pt-24 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10 relative">
            {children}
          </main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
