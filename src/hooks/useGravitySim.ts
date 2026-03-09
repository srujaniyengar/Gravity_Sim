import { useRef, useState, useCallback, useEffect } from 'react';
import {
  SimNode,
  Task,
  SimState,
  SimConfig,
  SimMetrics,
  AlgorithmType,
  DEFAULT_CONFIG,
} from '../lib/types';
import { routeTask } from '../lib/routing';
import { resetRoundRobin } from '../lib/routing/roundRobin';

// ── Helpers ───────────────────────────────────────────────────────

let globalTaskId = 0;
function nextTaskId(): string {
  return `t-${++globalTaskId}`;
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function generateNodes(count: number, width: number, height: number): SimNode[] {
  const nodes: SimNode[] = [];
  const pad = 50;
  const w = width - pad * 2;
  const h = height - pad * 2;

  // Place nodes in a distributed pattern
  const cols = Math.ceil(Math.sqrt(count * (w / h)));
  const rows = Math.ceil(count / cols);

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Add jitter for organic look
    const jitterX = (Math.random() - 0.5) * (w / cols) * 0.5;
    const jitterY = (Math.random() - 0.5) * (h / rows) * 0.5;
    nodes.push({
      id: `N${i}`,
      x: pad + (col + 0.5) * (w / cols) + jitterX,
      y: pad + (row + 0.5) * (h / rows) + jitterY,
      actualLoad: 0,
      reportedLoad: 0,
      lastGossipTime: 0,
      activeTasks: 0,
      capacity: 5 + Math.floor(Math.random() * 4), // 5–8 concurrent tasks
    });
  }
  return nodes;
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil(p * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// ── Hook ──────────────────────────────────────────────────────────

export function useGravitySim(
  algorithm: AlgorithmType,
  mapWidth = 520,
  mapHeight = 360
) {
  const [config, setConfig] = useState<SimConfig>({ ...DEFAULT_CONFIG });
  const [state, setState] = useState<SimState>(() => ({
    nodes: generateNodes(DEFAULT_CONFIG.nodeCount, mapWidth, mapHeight),
    tasks: [],
    metrics: {
      p99Latency: 0,
      oscillationRate: 0,
      networkTax: 0,
      latencyHistory: [],
      loadHistory: [],
    },
    simTime: 0,
    isRunning: false,
    lastDecisionLog: null,
  }));

  const stateRef = useRef(state);
  const configRef = useRef(config);
  const animFrameRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const lastGossipRef = useRef<number>(0);
  const lastLoadSnapshotRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  // Keep refs in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // ── Simulation tick ──
  const tick = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    const prev = lastFrameRef.current || timestamp;
    const rawDt = (timestamp - prev) / 1000;
    const dt = Math.min(rawDt, 0.1); // Cap to avoid spirals
    lastFrameRef.current = timestamp;

    const cfg = configRef.current;
    const s = stateRef.current;
    const simTime = s.simTime + dt;

    // Clone nodes for mutation
    const nodes = s.nodes.map(n => ({ ...n }));
    let tasks = [...s.tasks];
    let decisionLog = s.lastDecisionLog;

    // ── 1. Spawn new tasks ──
    const spawnInterval = 1 / cfg.requestRate;
    if (simTime - lastSpawnRef.current >= spawnInterval) {
      lastSpawnRef.current = simTime;

      // Pick a random source node (edge entry point)
      const sourceIdx = Math.floor(Math.random() * nodes.length);
      const source = nodes[sourceIdx];

      // Route the task
      const taskId = nextTaskId();
      const { targetId, log } = routeTask(algorithm, nodes, source.id, cfg, simTime, taskId);
      const target = nodes.find(n => n.id === targetId)!;
      const dist = distance(source, target);

      tasks.push({
        id: taskId,
        sourceId: source.id,
        targetId,
        status: 'travelling',
        startTime: simTime,
        travelDistance: dist,
        progress: 0,
      });

      decisionLog = log;
    }

    // ── 2. Update tasks ──
    const completedLatencies: number[] = [];
    let networkTaxDelta = 0;

    tasks = tasks
      .map(task => {
        const t = { ...task };
        if (t.status === 'travelling') {
          const travelTime = t.travelDistance / cfg.travelSpeed;
          t.progress = Math.min(1, (simTime - t.startTime) / travelTime);
          if (t.progress >= 1) {
            t.status = 'processing';
            t.arrivalTime = simTime;
            t.progress = 0;
            networkTaxDelta += t.travelDistance;
            // Increment active tasks on the target node
            const node = nodes.find(n => n.id === t.targetId);
            if (node) node.activeTasks++;
          }
        } else if (t.status === 'processing') {
          const tNode = nodes.find(n => n.id === t.targetId);
          // Processing time scales with load
          const loadMultiplier = tNode ? 1 + tNode.actualLoad * 2 : 1;
          const procTime = cfg.processingTime * loadMultiplier;
          t.progress = Math.min(1, (simTime - (t.arrivalTime || t.startTime)) / procTime);
          if (t.progress >= 1) {
            t.status = 'completed';
            t.completionTime = simTime;
            // Record latency
            const latency = simTime - t.startTime;
            completedLatencies.push(latency);
            // Decrement active tasks
            if (tNode) tNode.activeTasks = Math.max(0, tNode.activeTasks - 1);
          }
        }
        return t;
      })
      .filter(t => t.status !== 'completed' || (simTime - (t.completionTime || 0) < 0.3));

    // ── 3. Update node loads ──
    for (const node of nodes) {
      // Actual load = activeTasks / capacity
      node.actualLoad = Math.min(1, node.activeTasks / node.capacity);
    }

    // ── 4. Gossip broadcasting ──
    if (simTime - lastGossipRef.current >= cfg.gossipInterval) {
      lastGossipRef.current = simTime;
      for (const node of nodes) {
        node.reportedLoad = node.actualLoad;
        node.lastGossipTime = simTime;
      }
    }

    // ── 5. Metrics ──
    const metrics = { ...s.metrics };
    // Latency history (keep last 200)
    const allLatencies = [...metrics.latencyHistory, ...completedLatencies].slice(-200);
    metrics.latencyHistory = allLatencies;
    metrics.p99Latency = percentile(allLatencies, 0.99);
    metrics.networkTax += networkTaxDelta;

    // Load history for oscillation detection (sample every 0.5s)
    if (simTime - lastLoadSnapshotRef.current >= 0.5) {
      lastLoadSnapshotRef.current = simTime;
      const loads = nodes.map(n => n.actualLoad);
      const history = [...metrics.loadHistory, { time: simTime, loads }].slice(-40);
      metrics.loadHistory = history;

      // Oscillation: how much loads flip between snapshots
      if (history.length >= 3) {
        let flips = 0;
        let total = 0;
        for (let i = 2; i < history.length; i++) {
          for (let j = 0; j < nodes.length; j++) {
            const prev2 = history[i - 2].loads[j] ?? 0;
            const prev1 = history[i - 1].loads[j] ?? 0;
            const curr = history[i].loads[j] ?? 0;
            const d1 = prev1 - prev2;
            const d2 = curr - prev1;
            // A flip is when the direction reverses significantly
            if (d1 * d2 < -0.01) flips++;
            total++;
          }
        }
        metrics.oscillationRate = total > 0 ? Math.round((flips / total) * 100) : 0;
      }
    }

    const newState: SimState = {
      nodes,
      tasks,
      metrics,
      simTime,
      isRunning: true,
      lastDecisionLog: decisionLog,
    };

    stateRef.current = newState;
    setState(newState);

    animFrameRef.current = requestAnimationFrame(tick);
  }, [algorithm]);

  // ── Controls ──
  const start = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    lastFrameRef.current = 0;
    setState(s => ({ ...s, isRunning: true }));
    animFrameRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    cancelAnimationFrame(animFrameRef.current);
    setState(s => ({ ...s, isRunning: false }));
  }, []);

  const reset = useCallback((nodeCount?: number) => {
    stop();
    resetRoundRobin();
    globalTaskId = 0;
    lastSpawnRef.current = 0;
    lastGossipRef.current = 0;
    lastLoadSnapshotRef.current = 0;
    const count = nodeCount ?? configRef.current.nodeCount;
    setState({
      nodes: generateNodes(count, mapWidth, mapHeight),
      tasks: [],
      metrics: {
        p99Latency: 0,
        oscillationRate: 0,
        networkTax: 0,
        latencyHistory: [],
        loadHistory: [],
      },
      simTime: 0,
      isRunning: false,
      lastDecisionLog: null,
    });
  }, [stop, mapWidth, mapHeight]);

  const setNodeCount = useCallback((count: number) => {
    const clamped = Math.max(3, Math.min(40, count));
    setConfig(c => ({ ...c, nodeCount: clamped }));
    reset(clamped);
  }, [reset]);

  const moveNode = useCallback((nodeId: string, x: number, y: number) => {
    setState(s => ({
      ...s,
      nodes: s.nodes.map(n => n.id === nodeId ? { ...n, x, y } : n),
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      isRunningRef.current = false;
    };
  }, []);

  return {
    state,
    config,
    setConfig,
    setNodeCount,
    moveNode,
    start,
    stop,
    reset,
  };
}
