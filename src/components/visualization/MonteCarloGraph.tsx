"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
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
import { SimulationResult } from '@/lib/econometrics-engine';

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

interface MonteCarloGraphProps {
  simulationData: SimulationResult;
}

export default function MonteCarloGraph({ simulationData }: MonteCarloGraphProps) {
  const { paths, months, medianPath } = simulationData;

  const datasets: any[] = [];

  // Add 50 simulated paths with very light green lines
  paths.forEach((path, idx) => {
    datasets.push({
      label: `Simulasi #${idx + 1}`,
      data: path,
      borderColor: 'rgba(16, 185, 129, 0.06)', // thin light green lines
      borderWidth: 1.2,
      pointRadius: 0,
      tension: 0.2,
      fill: false,
    });
  });

  // Target Boundaries (Corridor of stability)
  datasets.push({
    label: 'Batas Atas Target (4.2%)',
    data: months.map(() => 4.2),
    borderColor: 'rgba(239, 68, 68, 0.7)', // soft red
    borderWidth: 1.5,
    borderDash: [4, 4],
    pointRadius: 0,
    tension: 0,
    fill: false,
  });

  datasets.push({
    label: 'Batas Bawah Target (2.0%)',
    data: months.map(() => 2.0),
    borderColor: 'rgba(239, 68, 68, 0.7)',
    borderWidth: 1.5,
    borderDash: [4, 4],
    pointRadius: 0,
    tension: 0,
    fill: false,
  });

  // Median path in rich Dark Green
  datasets.push({
    label: 'Median Proyeksi Stabilitas',
    data: medianPath,
    borderColor: '#064e3b', // Hijau Tua
    borderWidth: 4,
    pointRadius: 3,
    pointBackgroundColor: '#064e3b',
    tension: 0.15,
    fill: false,
  });

  const data: ChartData<'line'> = {
    labels: months,
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
          usePointStyle: true,
          filter: (item) => {
            return (
              item.text === 'Median Proyeksi Stabilitas' ||
              item.text === 'Batas Atas Target (4.2%)' ||
              item.text === 'Batas Bawah Target (2.0%)'
            );
          }
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
            if (
              context.dataset.label === 'Median Proyeksi Stabilitas' ||
              context.dataset.label?.includes('Batas')
            ) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
            return null;
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
        min: 0,
        max: 8,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 10
          },
          callback: function (value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[350px] p-2">
      <Line data={data} options={options} />
    </div>
  );
}
