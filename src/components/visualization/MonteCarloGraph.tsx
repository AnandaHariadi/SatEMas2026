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

  // Create datasets: 50 thin paths + 1 thick median path + 2 boundary threshold lines
  const datasets: any[] = [];

  // 1. Add 50 simulated paths
  paths.forEach((path, idx) => {
    datasets.push({
      label: `Simulasi #${idx + 1}`,
      data: path,
      borderColor: 'rgba(99, 102, 241, 0.08)', // very thin indigo lines
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.2,
      fill: false,
    });
  });

  // 2. Add Safety Corridor upper boundary (4.2%)
  datasets.push({
    label: 'Batas Atas Target (4.2%)',
    data: months.map(() => 4.2),
    borderColor: 'rgba(239, 68, 68, 0.6)', // red-500
    borderWidth: 1.5,
    borderDash: [4, 4],
    pointRadius: 0,
    tension: 0,
    fill: false,
  });

  // 3. Add Safety Corridor lower boundary (2.0%)
  datasets.push({
    label: 'Batas Bawah Target (2.0%)',
    data: months.map(() => 2.0),
    borderColor: 'rgba(239, 68, 68, 0.6)',
    borderWidth: 1.5,
    borderDash: [4, 4],
    pointRadius: 0,
    tension: 0,
    fill: false,
  });

  // 4. Add Median Path (Thick Emerald line)
  datasets.push({
    label: 'Median Proyeksi Stabilitas',
    data: medianPath,
    borderColor: '#10b981', // emerald-500
    borderWidth: 4,
    pointRadius: 3,
    pointBackgroundColor: '#10b981',
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
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          },
          boxWidth: 15,
          usePointStyle: true,
          // Only show Median and Target labels in legend to keep it clean
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
            // Only show tooltips for the median path or boundaries
            if (
              context.dataset.label === 'Median Proyeksi Stabilitas' ||
              context.dataset.label?.includes('Batas')
            ) {
              return `${context.dataset.label}: ${context.parsed.y}%`;
            }
            return null; // hide tooltip for the 50 faint paths
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
        min: 0,
        max: 8,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
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
