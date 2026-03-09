# Gravity Framework Simulation

Note: This project is a simulation and visualization demo. It is not a reusable routing framework or a production load balancer.

A client-side, interactive simulation that demonstrates why **Gravity** (a risk-aware, topology-sensitive routing algorithm) can outperform traditional load balancing in edge computing environments. The app focuses on two key realities of distributed systems at the edge: **network distance (RTT)** and **state staleness** (gossip delay), and shows how they influence tail latency and stability.

## What This Project Demonstrates

The simulation compares routing algorithms under identical traffic conditions and visualizes emergent behaviors, including overload cascades and oscillations.

Key behaviors to observe:

- **Topology sensitivity**: nearby nodes should be preferred when all else is equal.
- **Staleness effects**: if gossip updates are slower than incoming requests, nodes may appear free even when they are not.
- **Thundering Herd (expected under P2C)**: when gossip is infrequent, Power-of-Two choices can repeatedly select nodes with stale low reported load, causing sudden saturation.
- **Gravity mitigation**: Gravity reduces herd effects by discounting stale information via confidence decay.

## Algorithms Included

The simulation includes the following routing strategies:

- Round Robin (RR)
- Power of Two (P2C)
- Consistent Hashing
- Weighted Least Connections (WLC / Least Conn)
- Gravity (risk + topology)

## Gravity Scoring Model

Gravity uses a score per candidate node:

$$
G_i = \frac{(1 - L_i) \cdot e^{-\lambda(T_{now} - T_{last})}}{\|\vec{V}_{local} - \vec{V}_i\|^\beta + \epsilon}
$$

Where:

- `L_i` is the node’s reported load (normalized)
- `T_last` is the node’s last gossip timestamp
- `λ` is the paranoia factor (confidence decay)
- `β` is the distance exponent (default 2)
- `ε` prevents divide-by-zero

## UI Features

- Dual-simulation comparison view (two algorithms side-by-side)
- Controls:
  - Request rate (tasks/sec)
  - Gossip frequency
  - Paranoia factor (λ)
- Real-time analytics (per simulation):
  - P99 latency
  - Oscillation rate
  - Network tax (cumulative distance traveled)
- Code trace panel that highlights routing logic at decision time

## Tech Stack

- React 18+
- Vite + TypeScript
- Tailwind CSS (with JetBrains Mono)
- Framer Motion (packet animations using `AnimatePresence`)
- lucide-react icons
- Charts: SVG graphs or `recharts`

No backend services are used. All simulation logic runs in the browser.

## Project Structure (Recommended)

A typical modular structure:

- `src/hooks/useGravitySim.ts`  
  The simulation engine, world clock, node state machine, and metrics.
- `src/components/VisAlgo.tsx`  
  Dual-sim layout, controls, and dashboards.
- `src/components/TopologyMap.tsx`  
  Node rendering and packet animation layer.
- `src/components/Charts/*`  
  Lightweight charts for latency and oscillation tracking.
- `src/lib/routing/*`  
  Implementations of RR, P2C, Consistent Hashing, WLC, and Gravity.

## Local Development

Prerequisites:

- Node.js 18+ recommended

Install and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Operating Notes and Defaults

Suggested defaults (tunable in UI):

- Distance exponent: `β = 2`
- Epsilon: `ε = 1e-6`
- Node count: 12–20
- Load normalization: 0..1
- Simulation time: based on `performance.now()` or an equivalent internal clock

To intentionally reproduce thundering herd:

1. Select **P2C** in one simulation panel.
2. Set a high request rate.
3. Lower gossip frequency (longer gossip interval).
4. Observe load piling onto nodes that have stale low reported load.

To compare with Gravity:

1. Select **Gravity** in the other panel.
2. Increase `λ` to make the system more distrustful of stale data.
3. Observe reduced saturation spikes and improved tail behavior.

## Contributing

Contributions are welcome, especially in these areas:

- Improved metric definitions (oscillation detection, tail latency estimation)
- More realistic network and processing models
- Visual refinement of topology and packet paths
- Test coverage for routing decisions and scoring

## License

Add a license file if you plan to distribute this project.