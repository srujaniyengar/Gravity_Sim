// ── Core simulation types ──────────────────────────────────────────

export interface SimNode {
  id: string;
  x: number;
  y: number;
  actualLoad: number;       // Real-time server load (0..1)
  reportedLoad: number;     // Last load sent via gossip (0..1)
  lastGossipTime: number;   // T_last — simulation timestamp of last gossip
  activeTasks: number;      // Number of tasks currently being processed
  capacity: number;         // Max concurrent tasks
}

export interface Task {
  id: string;
  sourceId: string;
  targetId: string;
  status: 'travelling' | 'processing' | 'completed';
  startTime: number;        // Simulation time when task was created
  arrivalTime?: number;     // Simulation time when task arrived at the target
  completionTime?: number;  // Simulation time when task completed
  travelDistance: number;    // Pixel distance from source to target
  progress: number;         // 0..1 progress for travel/processing animation
}

export type AlgorithmType =
  | 'round-robin'
  | 'power-of-two'
  | 'consistent-hashing'
  | 'weighted-least-conn'
  | 'gravity';

export const ALGORITHM_LABELS: Record<AlgorithmType, string> = {
  'round-robin': 'Round Robin',
  'power-of-two': 'Power of Two (P2C)',
  'consistent-hashing': 'Consistent Hashing',
  'weighted-least-conn': 'Least Connections (WLC)',
  'gravity': 'Gravity',
};

export interface SimMetrics {
  p99Latency: number;
  oscillationRate: number;  // 0..100
  networkTax: number;       // Cumulative distance
  latencyHistory: number[]; // Rolling window of latency samples
  loadHistory: Array<{ time: number; loads: number[] }>; // Rolling load snapshots
}

export interface SimConfig {
  requestRate: number;       // Tasks per second
  gossipInterval: number;    // Seconds between gossip updates
  paranoia: number;          // λ — staleness decay rate
  distanceExponent: number;  // β — distance penalty exponent
  epsilon: number;           // ε — small constant
  nodeCount: number;
  travelSpeed: number;       // Pixels per second for packet travel
  processingTime: number;    // Base seconds to process a task
}

export interface SimState {
  nodes: SimNode[];
  tasks: Task[];
  metrics: SimMetrics;
  simTime: number;          // Current simulation time in seconds
  isRunning: boolean;
  lastDecisionLog: string | null;  // For the code trace panel
}

export const DEFAULT_CONFIG: SimConfig = {
  requestRate: 3,
  gossipInterval: 1.0,
  paranoia: 1.5,
  distanceExponent: 2,
  epsilon: 1e-6,
  nodeCount: 14,
  travelSpeed: 200,
  processingTime: 0.8,
};
