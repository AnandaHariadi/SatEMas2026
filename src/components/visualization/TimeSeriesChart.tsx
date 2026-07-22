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

// Register Chart.js components
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
  // Take last 12 months of historical data for compact visual balance
  const historicalToShow = commodity.historical.slice(-12);
  
  const labels = [
    ...historicalToShow.map(h => h.month),
    ...forecast.map(f => f.month)
  ];

  // Align historical prices (with nulls for forecast periods)
  const historicalDataPoints = [
    ...historicalToShow.map(h => h.price),
    ...forecast.map(() => null)
  ];

  // Align forecast prices (with nulls for historical periods, except the very last historical point to connect the line)
  const lastHistoricalPrice = historicalToShow[historicalToShow.length - 1].price;
  
  const forecastDataPoints = [
    ...historicalToShow.map(() => null),
    // Replace the first null with the last historical price to prevent disconnected lines
  ];
  // Re-adjust forecast index connection:
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
      borderColor: '#6366f1', // indigo-500
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 3,
      tension: 0.3,
      spanGaps: false,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
      fill: false,
    },
    {
      label: 'Prediksi Model (ARIMA/GARCH)',
      data: alignedForecast,
      borderColor: '#10b981', // emerald-500
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
    // Upper CI line
    datasets.push({
      label: 'Batas Atas CI (95%)',
      data: upperCIData,
      borderColor: 'rgba(16, 185, 129, 0.15)',
      borderWidth: 1,
      pointRadius: 0,
      fill: false,
      spanGaps: true,
    });
    // Lower CI line with filling from the Upper CI line
    datasets.push({
      label: 'Batas Bawah CI (95%)',
      data: lowerCIData,
      borderColor: 'rgba(16, 185, 129, 0.15)',
      borderWidth: 1,
      pointRadius: 0,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      fill: '-1', // Fill space to upper limit (previous dataset index)
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
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
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
          color: 'rgba(255, 255, 255, 0.03)',
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
          color: 'rgba(255, 255, 255, 0.05)',
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
