import React from 'react';
import { AlgorithmType } from '../lib/types';
import { Code2 } from 'lucide-react';

interface CodeTraceProps {
  algorithm: AlgorithmType;
  lastLog: string | null;
  isRunning: boolean;
}

const ALGORITHM_CODE: Record<AlgorithmType, string[]> = {
  'round-robin': [
    'function roundRobin(nodes, counter) {',
    '  idx = counter % nodes.length;',
    '  target = nodes[idx];',
    '  counter++;',
    '  return target;',
    '}',
  ],
  'power-of-two': [
    'function powerOfTwo(nodes) {',
    '  a = nodes[random()];',
    '  b = nodes[random()];',
    '  target = min(a.load, b.load);',
    '  return target;',
    '}',
  ],
  'consistent-hashing': [
    'function consistentHash(key, ring) {',
    '  h = hash(key);',
    '  idx = binarySearch(ring, h);',
    '  target = ring[idx].node;',
    '  return target;',
    '}',
  ],
  'weighted-least-conn': [
    'function leastConn(nodes) {',
    '  best = nodes[0];',
    '  for (node of nodes) {',
    '    if (node.active < best.active)',
    '      best = node;',
    '  }',
    '  return best;',
    '}',
  ],
  gravity: [
    'function gravity(nodes, source, λ, β) {',
    '  for (node of nodes) {',
    '    avail = (1 - node.load);',
    '    confidence = exp(-λ · ΔT);',
    '    dist = ‖source - node‖^β + ε;',
    '    Score = Availability / Distance^2',
    '  }',
    '  return bestScore(nodes);',
    '}',
  ],
};

const HIGHLIGHT_LINES: Record<AlgorithmType, number> = {
  'round-robin': 2,
  'power-of-two': 3,
  'consistent-hashing': 3,
  'weighted-least-conn': 4,
  gravity: 5,
};

export const CodeTrace: React.FC<CodeTraceProps> = ({ algorithm, lastLog, isRunning }) => {
  const code = ALGORITHM_CODE[algorithm];
  const highlightLine = HIGHLIGHT_LINES[algorithm];

  return (
    <div className="bg-nb-surface border-3 border-nb-border shadow-brutal overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b-3 border-nb-border bg-nb-panel">
        <Code2 size={12} className="text-nb-accent" />
        <span className="text-[10px] text-nb-text-dim font-black uppercase tracking-wider">Code Trace</span>
      </div>

      {/* Code block */}
      <div className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto">
        {code.map((line, i) => {
          const isHighlighted = isRunning && i === highlightLine;
          return (
            <div
              key={i}
              className={`px-2 py-0.5 transition-all duration-100 ${
                isHighlighted
                  ? 'bg-nb-accent text-nb-border font-black border-l-[4px] border-nb-border'
                  : 'text-nb-text-dim border-l-[4px] border-transparent'
              }`}
            >
              <span className="inline-block w-5 text-right mr-3 text-nb-muted select-none font-bold">
                {i + 1}
              </span>
              {line}
            </div>
          );
        })}
      </div>

      {/* Decision log */}
      {lastLog && isRunning && (
        <div className="border-t-3 border-nb-border px-3 py-2 text-[10px] font-mono text-nb-accent font-bold bg-nb-bg whitespace-pre-wrap max-h-16 overflow-y-auto">
          → {lastLog}
        </div>
      )}
    </div>
  );
};
