import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimNode, Task } from '../lib/types';

interface TopologyMapProps {
  nodes: SimNode[];
  tasks: Task[];
  simTime: number;
  gossipInterval: number;
  width?: number;
  height?: number;
}

function getNodeColor(node: SimNode, simTime: number, gossipInterval: number) {
  const staleness = simTime - node.lastGossipTime;
  const isStale = staleness > gossipInterval * 1.5;

  if (node.actualLoad > 0.85) return { bg: '#f43f5e', border: '#000', label: 'saturated' };
  if (isStale) return { bg: '#fb923c', border: '#000', label: 'stale' };
  return { bg: '#4ade80', border: '#000', label: 'healthy' };
}

function getPacketPosition(task: Task, nodes: SimNode[]) {
  const source = nodes.find(n => n.id === task.sourceId);
  const target = nodes.find(n => n.id === task.targetId);
  if (!source || !target) return null;

  if (task.status === 'travelling') {
    return {
      x: source.x + (target.x - source.x) * task.progress,
      y: source.y + (target.y - source.y) * task.progress,
    };
  }
  if (task.status === 'processing') {
    return { x: target.x, y: target.y };
  }
  return null;
}

export const TopologyMap: React.FC<TopologyMapProps> = ({
  nodes,
  tasks,
  simTime,
  gossipInterval,
  width = 520,
  height = 360,
}) => {
  const edges = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          lines.push({ x1: nodes[i].x, y1: nodes[i].y, x2: nodes[j].x, y2: nodes[j].y });
        }
      }
    }
    return lines;
  }, [nodes]);

  const travellingTasks = tasks.filter(t => t.status === 'travelling');
  const processingTasks = tasks.filter(t => t.status === 'processing');

  return (
    <div
      className="relative overflow-hidden border-3 border-nb-border shadow-brutal"
      style={{ width, height, background: '#16162e' }}
    >
      {/* Grid */}
      <svg className="absolute inset-0" width={width} height={height}>
        <defs>
          <pattern id="grid-nb" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2a2a4a" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-nb)" />

        {/* Mesh edges */}
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#3a3a5a" strokeWidth="1" />
        ))}

        {/* Travel paths */}
        {travellingTasks.map(task => {
          const source = nodes.find(n => n.id === task.sourceId);
          const target = nodes.find(n => n.id === task.targetId);
          if (!source || !target) return null;
          return (
            <line
              key={`path-${task.id}`}
              x1={source.x} y1={source.y} x2={target.x} y2={target.y}
              stroke="#22d3ee" strokeWidth="2" opacity={0.4}
              strokeDasharray="6 4"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map(node => {
        const color = getNodeColor(node, simTime, gossipInterval);
        const size = 16;
        return (
          <div
            key={node.id}
            className="absolute"
            style={{ left: node.x - size / 2, top: node.y - size / 2, width: size, height: size, zIndex: 10 }}
          >
            {/* Node square */}
            <div
              className="w-full h-full border-2 transition-colors"
              style={{
                backgroundColor: color.bg,
                borderColor: color.border,
                boxShadow: '2px 2px 0px 0px #000',
              }}
            />
            {/* Label */}
            <span
              className="absolute font-mono text-[8px] text-nb-text-dim font-bold whitespace-nowrap pointer-events-none"
              style={{ top: size + 2, left: '50%', transform: 'translateX(-50%)' }}
            >
              {node.id}
            </span>
            {/* Load bar */}
            <div
              className="absolute border border-nb-border pointer-events-none"
              style={{
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 4,
                backgroundColor: '#16162e',
              }}
            >
              <div
                className="h-full"
                style={{
                  width: `${node.actualLoad * 100}%`,
                  backgroundColor: node.actualLoad > 0.85 ? '#fb7185' : node.actualLoad > 0.5 ? '#fb923c' : '#34d399',
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Packets — travelling */}
      <AnimatePresence>
        {travellingTasks.map(task => {
          const pos = getPacketPosition(task, nodes);
          if (!pos) return null;
          return (
            <motion.div
              key={task.id}
              className="absolute pointer-events-none border-2 border-nb-border"
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#22d3ee',
                boxShadow: '2px 2px 0px 0px #000',
                left: pos.x - 4,
                top: pos.y - 4,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.1 }}
            />
          );
        })}
      </AnimatePresence>

      {/* Processing indicator on target */}
      <AnimatePresence>
        {processingTasks.map(task => {
          const target = nodes.find(n => n.id === task.targetId);
          if (!target) return null;
          return (
            <motion.div
              key={`proc-${task.id}`}
              className="absolute pointer-events-none border-2 border-nb-cyan"
              style={{
                width: 24,
                height: 24,
                left: target.x - 12,
                top: target.y - 12,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.6, 0.1], scale: [1, 1.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};
