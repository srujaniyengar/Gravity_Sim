import React from 'react';
import { SimMetrics } from '../lib/types';
import { Clock, Activity, Route } from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: SimMetrics;
  simTime: number;
}

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  tooltip: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon, accentColor, bgColor, tooltip }) => (
  <div
    className="border-3 border-nb-border shadow-brutal-sm p-3 flex flex-col gap-1 hover-card"
    style={{ backgroundColor: bgColor }}
    title={tooltip}
    role="status"
    aria-label={`${label}: ${value}${unit || ''}`}
  >
    <div className="flex items-center gap-1.5 text-[10px] text-nb-border font-black uppercase tracking-wider">
      {icon}
      {label}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-mono text-xl font-black" style={{ color: accentColor }}>{value}</span>
      {unit && <span className="text-[10px] text-nb-border font-bold">{unit}</span>}
    </div>
  </div>
);

// Sparkline
const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({
  data, color, width = 300, height = 44,
}) => {
  if (data.length < 2) return (
    <div className="flex items-center justify-center text-[10px] text-nb-muted font-bold h-11">
      Waiting for data…
    </div>
  );
  const max = Math.max(...data, 0.01);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="mt-1" role="img" aria-label="Latency trend sparkline">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="bevel" />
      {data.slice(-5).map((v, i) => {
        const idx = data.length - 5 + i;
        if (idx < 0) return null;
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return <rect key={i} x={x - 2} y={y - 2} width={4} height={4} fill={color} stroke="#000" strokeWidth="1" />;
      })}
    </svg>
  );
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ metrics, simTime }) => {
  const latencySamples = metrics.latencyHistory.slice(-60);

  return (
    <div className="space-y-3" role="region" aria-label="Simulation metrics">
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          label="P99 Latency"
          value={metrics.p99Latency.toFixed(2)}
          unit="s"
          icon={<Clock size={10} />}
          accentColor="#1a1a2e"
          bgColor="#22d3ee"
          tooltip="99th percentile latency — the slowest 1% of requests. Lower is better."
        />
        <MetricCard
          label="Oscillation"
          value={metrics.oscillationRate.toFixed(0)}
          unit="%"
          icon={<Activity size={10} />}
          accentColor="#1a1a2e"
          bgColor={metrics.oscillationRate > 50 ? '#f43f5e' : metrics.oscillationRate > 25 ? '#fb923c' : '#4ade80'}
          tooltip="How often loads flip-flop — high means unstable routing. 0% = perfectly stable."
        />
        <MetricCard
          label="Net Tax"
          value={metrics.networkTax > 1000
            ? `${(metrics.networkTax / 1000).toFixed(1)}k`
            : metrics.networkTax.toFixed(0)
          }
          unit="px"
          icon={<Route size={10} />}
          accentColor="#1a1a2e"
          bgColor="#a78bfa"
          tooltip="Total distance packets traveled (px ≈ RTT). Lower means the algorithm prefers nearby nodes."
        />
      </div>

      {/* Sparkline */}
      <div className="bg-nb-surface border-3 border-nb-border shadow-brutal-sm p-3">
        <div className="text-[10px] text-nb-text-dim font-black uppercase tracking-wider mb-1">
          Latency Trend
        </div>
        <Sparkline data={latencySamples} color="#facc15" />
        <div className="flex justify-between text-[9px] text-nb-muted mt-1 font-mono font-bold">
          <span>T−{((latencySamples.length / 3) || 0).toFixed(0)}s</span>
          <span>{simTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
};
