---
title: "Gravity Simulation Framework — Agent Brief"
date: "2026-03-09"
---

# Agent Brief: Gravity Simulation Framework

## Role
You are an **Expert Distributed Systems Engineer & Frontend Visualization Architect**.

## Goal
Build a **high-performance, interactive React (Vite + TypeScript) simulation** that demonstrates why **Gravity** (risk-aware, topology-sensitive routing) outperforms traditional load balancing for edge environments.

**Hard constraint:** **No backend.** All simulation logic lives in a custom React hook (e.g., `useGravitySim`).

---

## Deliverables (What you must output)
Produce either:
1. A **single production-ready React component**, or
2. A **modular set of components + hooks** that can be dropped into an existing Vite project.

Include:
- A custom hook: `useGravitySim`
- A UI: dual-sim side-by-side comparison (“VisAlgo”)
- Packets animation using **Framer Motion** (`AnimatePresence`)
- A cyber-industrial dark theme (Tailwind + JetBrains Mono)

---

## Implementation Checklist (Must-follow)
- [ ] **Simulation Core:** `requestAnimationFrame` loop manages the world clock.
- [ ] **Node State Machine:** nodes perform `Workload Processing`, `Load Decay`, `Gossip Broadcasting`.
- [ ] **Topology Map:** 2D coordinates; pixel distance represents RTT.
- [ ] **Staleness Logic:** each node has a `lastSeen/lastGossipTime` timestamp; data becomes stale when **Gossip Interval > Request Rate**.
- [ ] **Visual Language:**
  - Healthy node: **pulse green**
  - Saturated node: **solid red**
  - Stale node: **desaturated/faded amber**
  - Packets: particle-like dots moving along source→target paths

---

## Algorithms to Implement (Comparative Suite)
Implement all of these algorithms as selectable routing strategies:

1. **Round Robin (RR)**: `(i + 1) % N` — O(1)
2. **Power of Two (P2C)**: sample 2 random nodes; pick min load — O(1)
3. **Consistent Hashing**: `hash(taskId) -> ring` — O(log N) (or practical ring lookup)
4. **WLC (Least Connections)**: pick min `active_tasks` — O(N)
5. **Gravity (ours)**: risk + topology — O(N)

### Required Scenario Behavior
- With **P2C + high gossip interval**, the **“Thundering Herd”** effect must be visible (traffic piles onto nodes that *appear* free due to stale load reports).
- With **Gravity**, the herd must be mitigated by **confidence decay** on stale information.

---

## Gravity Scoring Function (Must be exact)
Use the following scoring function:

$$
G_i = \frac{(1 - L_i) \cdot e^{-\lambda(T_{now} - T_{last})}}{\|\vec{V}_{local} - \vec{V}_i\|^\beta + \epsilon}
$$

Where:
- `L_i` = **reported load** (0..1) or normalized load factor
- `T_now` = current sim time
- `T_last` = last gossip time for node i
- `λ` = paranoia factor (slider-controlled)
- `β` = distance exponent (recommend default 2)
- `ε` = small constant to avoid divide-by-zero

Notes:
- **Confidence factor**: `exp(-λ * ΔT)` penalizes stale reports.
- **Distance penalty**: favors nearby nodes to reduce RTT.
- **Load factor**: favors nodes with more capacity.

---

## UI Requirements (“VisAlgo”)
### Dual-Sim Mode
- Render **two independent simulations** side-by-side (or same simulation state with two routing decision tracks), using the **same incoming traffic stream** for fairness.

### Controls (Sliders)
- `Request Rate` (tasks/sec)
- `Gossip Frequency` (interval/time between gossips)
- `Paranoia Factor (λ)`

### Real-Time Analytics Dashboard (per sim)
- **P99 Latency**
- **Oscillation Rate** (load flapping frequency, 0–100%)
- **Network Tax** (cumulative distance traveled by packets)

### Code Trace Panel
- Show a syntax-highlighted block.
- Highlight the routing line:
  - `Score = Availability / Distance^2`
  whenever a routing decision occurs.

---

## Technical Stack (Strict)
- React 18+
- Vite + TypeScript
- Tailwind CSS + JetBrains Mono
- Framer Motion (`AnimatePresence`)
- lucide-react icons
- Charts: SVG graphs or `recharts`

---

## Data Structures (TypeScript)
Use these interfaces (may extend but not break intent):

```ts
interface Node {
  id: string;
  x: number;
  y: number;
  actualLoad: number;      
  reportedLoad: number;     
  lastGossipTime: number; 
}

interface Task {
  id: string;
  sourceId: string;
  targetId: string;
  status: 'travelling' | 'processing' | 'completed';
  startTime: number;
}
```

---

## Final Instruction
Build the **Gravity Simulation App** and ensure the visuals clearly demonstrate:
- why topology-blind methods fail under stale information, and
- how Gravity’s risk-aware scoring improves stability and tail latency.

If you need defaults:
- `β = 2`
- `ε = 1e-6`
- initial node count: 12–20
- normalize loads to 0..1
- use `performance.now()`-style timestamps inside the sim clock