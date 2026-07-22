"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ForecastPoint } from '@/lib/econometrics-engine';
import { CommodityData } from '@/lib/data';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  commodity: CommodityData;
  forecast: ForecastPoint[];
  showCI?: boolean;
}

export default function TimeSeriesChart({
  commodity,
  forecast,
  showCI = true
}: TimeSeriesChartProps) {
  const historicalToShow = commodity.historical.slice(-12);
  
  const labels = [
    ...historicalToShow.map(h => h.month),
    ...forecast.map(f => f.month)
  ];

  const historicalDataPoints = [
    ...historicalToShow.map(h => h.price),
    ...forecast.map(() => null)
  ];

  const lastHistoricalPrice = historicalToShow[historicalToShow.length - 1].price;
  
  const alignedForecast = [
    ...historicalToShow.slice(0, -1).map(() => null),
    lastHistoricalPrice,
    ...forecast.map(f => f.price)
  ];

  const lowerCIData = [
    ...historicalToShow.slice(0, -1).map(() => null),
    lastHistoricalPrice,
    ...forecast.map(f => f.lowerCI)
  ];

  const upperCIData = [
    ...historicalToShow.slice(0, -1).map(() => null),
    lastHistoricalPrice,
    ...forecast.map(f => f.upperCI)
  ];

  const datasets: any[] = [
    {
      label: 'Harga Historis (BPS)',
      data: historicalDataPoints,
      borderColor: '#064e3b', // Hijau Tua
      backgroundColor: 'rgba(6, 78, 59, 0.05)',
      borderWidth: 3,
      tension: 0.3,
      spanGaps: false,
      pointRadius: 4,
      pointBackgroundColor: '#064e3b',
      fill: false,
    },
    {
      label: 'Prediksi Model (ARIMA/GARCH)',
      data: alignedForecast,
      borderColor: '#10b981', // Hijau Muda
      borderWidth: 3,
      borderDash: [5, 5],
      tension: 0.3,
      spanGaps: true,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      fill: false,
    }
  ];

  if (showCI) {
    datasets.push({
      label: 'Batas Atas CI (95%)',
      data: upperCIData,
      borderColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      spanGaps: true,
    });
    datasets.push({
      label: 'Batas Bawah CI (95%)',
      data: lowerCIData,
      borderColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 1,
      pointRadius: 0,
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      fill: '-1',
      spanGaps: true,
    });
  }

  const data: ChartData<'line'> = {
    labels,
    datasets
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#475569',
          font: {
            family: 'Inter',
            size: 11,
            weight: 'bold'
          },
          boxWidth: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(context.parsed.y) + ` per ${commodity.unit}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10
          }
        }
      },
      y: {
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10
          },
          callback: function (value) {
            return 'Rp ' + Number(value).toLocaleString('id-ID');
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] p-2">
      <Line data={data} options={options} />
    </div>
  );
}
