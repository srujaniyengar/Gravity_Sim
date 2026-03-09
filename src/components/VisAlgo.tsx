import React, { useState } from 'react';
import { AlgorithmType, ALGORITHM_LABELS } from '../lib/types';
import { useGravitySim } from '../hooks/useGravitySim';
import { TopologyMap } from './TopologyMap';
import { ControlPanel } from './ControlPanel';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CodeTrace } from './CodeTrace';
import { ChevronDown } from 'lucide-react';

interface SimPanelProps {
  algorithm: AlgorithmType;
  onAlgorithmChange: (a: AlgorithmType) => void;
  label: 'A' | 'B';
}

const PANEL_COLORS = {
  A: { bg: '#facc15', text: '#000' },
  B: { bg: '#a78bfa', text: '#000' },
};

const SimPanel: React.FC<SimPanelProps> = ({ algorithm, onAlgorithmChange, label }) => {
  const { state, config, setConfig, setNodeCount, start, stop, reset } = useGravitySim(algorithm);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const colors = PANEL_COLORS[label];

  return (
    <div className="flex flex-col gap-3 flex-1 min-w-0">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 border-3 border-nb-border shadow-brutal-sm flex items-center justify-center text-sm font-black"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {label}
          </div>
          {/* Algorithm selector */}
          <div className="relative">
            <button
              onClick={() => setSelectorOpen(!selectorOpen)}
              className="flex items-center gap-1.5 bg-nb-panel border-3 border-nb-border shadow-brutal-sm
                px-3 py-1.5 text-xs font-black text-nb-text uppercase tracking-wider
                hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal transition-all"
            >
              {ALGORITHM_LABELS[algorithm]}
              <ChevronDown size={12} />
            </button>
            {selectorOpen && (
              <div className="absolute top-full mt-1 left-0 z-50 bg-nb-panel border-3 border-nb-border
                shadow-brutal min-w-[220px]">
                {(Object.keys(ALGORITHM_LABELS) as AlgorithmType[]).map(alg => (
                  <button
                    key={alg}
                    onClick={() => { onAlgorithmChange(alg); setSelectorOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider
                      border-b-2 border-nb-border last:border-b-0 transition-colors
                      ${alg === algorithm ? 'bg-nb-accent text-nb-border' : 'text-nb-text-dim hover:bg-nb-surface'}`}
                  >
                    {ALGORITHM_LABELS[alg]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className="text-[11px] font-mono text-nb-accent font-black bg-nb-surface border-2 border-nb-border px-2 py-0.5">
          T={state.simTime.toFixed(1)}s
        </span>
      </div>

      <div className="w-full overflow-x-auto pb-2 border-3 border-nb-border bg-nb-bg shadow-brutal scrollbar-thin">
        <TopologyMap
          nodes={state.nodes}
          tasks={state.tasks}
          simTime={state.simTime}
          gossipInterval={config.gossipInterval}
        />
      </div>

      <AnalyticsDashboard metrics={state.metrics} simTime={state.simTime} />
      <CodeTrace algorithm={algorithm} lastLog={state.lastDecisionLog} isRunning={state.isRunning} />
      <ControlPanel
        config={config}
        onChange={setConfig}
        onNodeCountChange={setNodeCount}
        isRunning={state.isRunning}
        onStart={start}
        onStop={stop}
        onReset={reset}
      />
    </div>
  );
};

export const VisAlgo: React.FC = () => {
  const [algA, setAlgA] = useState<AlgorithmType>('power-of-two');
  const [algB, setAlgB] = useState<AlgorithmType>('gravity');

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <SimPanel algorithm={algA} onAlgorithmChange={setAlgA} label="A" />
      <div className="w-full lg:w-1 h-1 lg:h-auto bg-nb-border self-stretch flex-shrink-0 my-4 lg:my-0" />
      <SimPanel algorithm={algB} onAlgorithmChange={setAlgB} label="B" />
    </div>
  );
};
