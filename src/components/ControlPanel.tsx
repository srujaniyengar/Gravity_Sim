import React from 'react';
import { SimConfig } from '../lib/types';
import { Sliders, Zap, Radio, ShieldAlert, Server } from 'lucide-react';

interface ControlPanelProps {
  config: SimConfig;
  onChange: (config: SimConfig) => void;
  onNodeCountChange: (count: number) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  icon: React.ReactNode;
  onChange: (v: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, min, max, step, unit, icon, onChange }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-nb-text-dim font-bold uppercase tracking-wider">
        {icon}
        {label}
      </span>
      <span className="font-mono text-nb-accent font-black text-sm">
        {value.toFixed(step < 1 ? 1 : 0)}{unit || ''}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full"
    />
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChange,
  onNodeCountChange,
  isRunning,
  onStart,
  onStop,
  onReset,
}) => {
  const update = (patch: Partial<SimConfig>) => onChange({ ...config, ...patch });

  return (
    <div className="bg-nb-panel border-3 border-nb-border shadow-brutal p-4 space-y-4">
      <div className="flex items-center gap-2 text-xs font-black text-nb-text uppercase tracking-wider">
        <Sliders size={14} className="text-nb-accent" />
        Controls
      </div>

      <SliderRow
        label="Nodes"
        value={config.nodeCount}
        min={3} max={40} step={1}
        icon={<Server size={12} />}
        onChange={v => onNodeCountChange(v)}
      />
      <SliderRow
        label="Request Rate"
        value={config.requestRate}
        min={0.5} max={20} step={0.5} unit=" rps"
        icon={<Zap size={12} />}
        onChange={v => update({ requestRate: v })}
      />
      <SliderRow
        label="Gossip Interval"
        value={config.gossipInterval}
        min={0.1} max={5} step={0.1} unit="s"
        icon={<Radio size={12} />}
        onChange={v => update({ gossipInterval: v })}
      />
      <SliderRow
        label="Paranoia (λ)"
        value={config.paranoia}
        min={0} max={5} step={0.1}
        icon={<ShieldAlert size={12} />}
        onChange={v => update({ paranoia: v })}
      />

      <div className="flex gap-2 pt-1">
        {!isRunning ? (
          <button onClick={onStart} className="btn-brutal flex-1 py-2 bg-nb-green text-nb-border">
            ▶ START
          </button>
        ) : (
          <button onClick={onStop} className="btn-brutal flex-1 py-2 bg-nb-red text-white">
            ⏸ PAUSE
          </button>
        )}
        <button onClick={onReset} className="btn-brutal px-4 py-2 bg-nb-surface text-nb-text-dim">
          ↺ RESET
        </button>
      </div>
    </div>
  );
};
