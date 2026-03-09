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
  hint?: string;
  icon: React.ReactNode;
  onChange: (v: number) => void;
  id: string;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, min, max, step, unit, hint, icon, onChange, id }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[11px] text-nb-text-dim font-bold uppercase tracking-wider cursor-pointer"
      >
        {icon}
        {label}
      </label>
      <span className="font-mono text-nb-accent font-black text-sm" aria-live="polite">
        {value.toFixed(step < 1 ? 1 : 0)}{unit || ''}
      </span>
    </div>
    {hint && <div className="text-[9px] text-nb-muted leading-snug">{hint}</div>}
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full"
      aria-label={`${label}: ${value.toFixed(step < 1 ? 1 : 0)}${unit || ''}`}
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
    <div className="bg-nb-panel border-3 border-nb-border shadow-brutal p-4 space-y-3" role="region" aria-label="Simulation controls">
      <div className="flex items-center gap-2 text-xs font-black text-nb-text uppercase tracking-wider">
        <Sliders size={14} className="text-nb-accent" />
        Controls
      </div>

      <SliderRow
        id="slider-nodes"
        label="Nodes"
        value={config.nodeCount}
        min={3} max={40} step={1}
        hint="Resets simulation when changed"
        icon={<Server size={12} />}
        onChange={v => onNodeCountChange(v)}
      />
      <SliderRow
        id="slider-rps"
        label="Request Rate"
        value={config.requestRate}
        min={0.5} max={20} step={0.5} unit=" rps"
        hint="Tasks created per second"
        icon={<Zap size={12} />}
        onChange={v => update({ requestRate: v })}
      />
      <SliderRow
        id="slider-gossip"
        label="Gossip Interval"
        value={config.gossipInterval}
        min={0.1} max={5} step={0.1} unit="s"
        hint="Higher = more stale data"
        icon={<Radio size={12} />}
        onChange={v => update({ gossipInterval: v })}
      />
      <SliderRow
        id="slider-paranoia"
        label="Paranoia (λ)"
        value={config.paranoia}
        min={0} max={5} step={0.1}
        hint="Gravity only — distrust of old data"
        icon={<ShieldAlert size={12} />}
        onChange={v => update({ paranoia: v })}
      />

      <div className="flex gap-2 pt-2">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="btn-brutal flex-1 py-2.5 bg-nb-green text-nb-border"
            aria-label="Start simulation"
          >
            ▶ START
          </button>
        ) : (
          <button
            onClick={onStop}
            className="btn-brutal flex-1 py-2.5 bg-nb-red text-white"
            aria-label="Pause simulation"
          >
            ⏸ PAUSE
          </button>
        )}
        <button
          onClick={() => onReset()}
          className="btn-brutal px-4 py-2.5 bg-nb-surface text-nb-text-dim"
          aria-label="Reset simulation"
        >
          ↺ RESET
        </button>
      </div>
    </div>
  );
};
