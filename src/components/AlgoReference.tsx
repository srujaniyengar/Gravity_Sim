import React, { useState } from 'react';
import { AlgorithmType } from '../lib/types';
import { BookOpen, ChevronRight, ExternalLink } from 'lucide-react';

interface AlgoInfo {
  name: string;
  complexity: string;
  industry: string;
  description: string;
  pros: string[];
  cons: string[];
  formula?: string;
  references: { label: string; url: string }[];
}

const ALGO_INFO: Record<AlgorithmType, AlgoInfo> = {
  'round-robin': {
    name: 'Round Robin (RR)',
    complexity: 'O(1)',
    industry: 'Nginx, Kubernetes, HAProxy',
    description:
      'Cycles through servers sequentially: target = nodes[(i + 1) % N]. Each new request goes to the next server in the list, wrapping around. No state or awareness required.',
    pros: [
      'Zero computational overhead',
      'Perfectly even distribution if all nodes are identical',
      'Deterministic and easy to debug',
    ],
    cons: [
      'Topology-blind — ignores network distance / RTT',
      'Load-blind — ignores current server capacity',
      'Uneven under heterogeneous workloads',
    ],
    references: [
      { label: 'Nginx Docs — Round Robin', url: 'https://nginx.org/en/docs/http/load_balancing.html' },
      { label: 'Wikipedia — Round-robin scheduling', url: 'https://en.wikipedia.org/wiki/Round-robin_scheduling' },
    ],
  },
  'power-of-two': {
    name: 'Power of Two Choices (P2C)',
    complexity: 'O(1)',
    industry: 'gRPC, Twitter Finagle, Envoy',
    description:
      'Samples two random nodes and picks the one with lower reported load: target = min(load[rand1], load[rand2]). This "power of two choices" dramatically reduces worst-case load compared to pure random selection.',
    pros: [
      'Avoids worst-case pileups vs random',
      'Constant time, no global state needed',
      'Well-studied theoretical bounds (Mitzenmacher 2001)',
    ],
    cons: [
      'Uses reportedLoad which can be STALE',
      'Thundering Herd: if gossip is slow, many routers see the same "free" node simultaneously',
      'No topology awareness — may route to distant nodes',
    ],
    formula: 'target = min(reportedLoad[random()], reportedLoad[random()])',
    references: [
      { label: 'Mitzenmacher — Power of Two Choices (PDF)', url: 'https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf' },
      { label: 'gRPC Load Balancing', url: 'https://grpc.io/blog/grpc-load-balancing/' },
      { label: 'Envoy P2C Docs', url: 'https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers' },
    ],
  },
  'consistent-hashing': {
    name: 'Consistent Hashing',
    complexity: 'O(log N)',
    industry: 'Akamai CDN, Cassandra, DynamoDB',
    description:
      'Maps both keys and servers onto a hash ring. Each key is routed to the next server clockwise on the ring. Virtual nodes (vnodes) improve distribution. Adding/removing servers only affects neighboring keys.',
    pros: [
      'Excellent data locality and cache hit rates',
      'Minimal key redistribution on topology changes',
      'With vnodes, achieves good balance',
    ],
    cons: [
      'Can create hotspots if hash distribution is uneven',
      'Load-blind — doesn\'t account for current server utilization',
      'Misses opportunities for nearby empty nodes',
    ],
    formula: 'target = ring[binarySearch(ring, hash(key))]',
    references: [
      { label: 'Karger et al. — Consistent Hashing (1997)', url: 'https://dl.acm.org/doi/10.1145/258533.258660' },
      { label: 'Wikipedia — Consistent Hashing', url: 'https://en.wikipedia.org/wiki/Consistent_hashing' },
      { label: 'Cassandra Architecture', url: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html' },
    ],
  },
  'weighted-least-conn': {
    name: 'Weighted Least Connections (WLC)',
    complexity: 'O(N)',
    industry: 'AWS ALB/ELB, LVS, F5 BIG-IP',
    description:
      'Scans all nodes and selects the one with the fewest active connections/tasks: target = argmin(activeTasks). Optionally weighted by server capacity. Reacts to current load in real-time.',
    pros: [
      'Load-aware — naturally balances heterogeneous servers',
      'Handles slow requests well (tracks active, not recent)',
      'Industry standard for L4/L7 load balancers',
    ],
    cons: [
      'O(N) scan on every decision',
      'Slow to react to network jitter — no RTT awareness',
      'Can oscillate under bursty traffic',
    ],
    formula: 'target = argmin(nodes[i].activeTasks / nodes[i].weight)',
    references: [
      { label: 'AWS — ELB Routing Algorithms', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/how-elastic-load-balancing-works.html' },
      { label: 'LVS — Least Connection Scheduling', url: 'http://www.linuxvirtualserver.org/docs/scheduling.html' },
    ],
  },
  gravity: {
    name: 'Gravity (Risk-Aware Routing)',
    complexity: 'O(N)',
    industry: 'Edge Computing, CDN Optimization',
    description:
      'Combines load, staleness, and distance into a unified score. The confidence factor exp(−λ·ΔT) penalizes stale information — if a node hasn\'t gossiped recently, Gravity treats its "free" status as untrustworthy, preventing Thundering Herds. The distance penalty favors nearby nodes, reducing RTT.',
    pros: [
      'Prevents Thundering Herd via confidence decay',
      'Topology-aware — prefers nearby nodes',
      'Tunable paranoia (λ) for different environments',
      'Degrades gracefully under stale information',
    ],
    cons: [
      'Higher computational cost (O(N) scoring)',
      'Requires tuning λ and β parameters',
      'Needs gossip infrastructure for load reports',
    ],
    formula: 'G_i = (1 - L_i) · exp(-λ·ΔT) / (‖V_src - V_i‖^β + ε)',
    references: [
      { label: 'Gravity Sim — GitHub', url: 'https://github.com/srujaniyengar/Gravity_Sim' },
      { label: 'Netflix — Edge Load Balancing', url: 'https://netflixtechblog.com/netflix-edge-load-balancing-695308b5548c' },
      { label: 'Google — Maglev Consistent Hashing', url: 'https://research.google/pubs/pub44824/' },
    ],
  },
};

interface AlgoReferenceProps {
  selectedAlgo?: AlgorithmType;
}

export const AlgoReference: React.FC<AlgoReferenceProps> = ({ selectedAlgo }) => {
  const [expanded, setExpanded] = useState<AlgorithmType | null>(selectedAlgo || 'gravity');

  const algos = Object.keys(ALGO_INFO) as AlgorithmType[];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-black text-nb-text-dim uppercase tracking-wider mb-2">
        <BookOpen size={12} className="text-nb-accent" />
        Algorithm Reference
      </div>

      {algos.map(key => {
        const info = ALGO_INFO[key];
        const isOpen = expanded === key;
        return (
          <div key={key} className="border-2 border-nb-border bg-nb-surface">
            <button
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-3 py-2 text-left
                hover:bg-nb-panel transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-black uppercase ${
                  key === 'gravity' ? 'text-nb-accent' : 'text-nb-text'
                }`}>
                  {info.name}
                </span>
                <span className="text-[9px] font-mono font-bold text-nb-muted bg-nb-bg px-1.5 py-0.5 border border-nb-border">
                  {info.complexity}
                </span>
              </div>
              <ChevronRight
                size={12}
                className={`text-nb-muted transition-transform ${isOpen ? 'rotate-90' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="px-3 pb-3 space-y-2 border-t-2 border-nb-border pt-2">
                <p className="text-[10px] text-nb-text-dim leading-relaxed">
                  {info.description}
                </p>

                {info.formula && (
                  <div className="font-mono text-[10px] text-nb-cyan bg-nb-bg px-2 py-1.5 border-2 border-nb-border">
                    {info.formula}
                  </div>
                )}

                <div className="text-[10px] text-nb-text-dim italic">
                  Used by: {info.industry}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[9px] font-black text-nb-green uppercase mb-1">Pros</div>
                    {info.pros.map((p, i) => (
                      <div key={i} className="text-[9px] text-nb-text-dim leading-snug flex gap-1">
                        <span className="text-nb-green">+</span> {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-nb-red uppercase mb-1">Cons</div>
                    {info.cons.map((c, i) => (
                      <div key={i} className="text-[9px] text-nb-text-dim leading-snug flex gap-1">
                        <span className="text-nb-red">−</span> {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[9px] font-black text-nb-purple uppercase mb-1">References</div>
                  {info.references.map((ref, i) => (
                    <a
                      key={i}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[9px] text-nb-cyan hover:text-nb-accent
                        transition-colors truncate"
                    >
                      <ExternalLink size={8} className="flex-shrink-0" />
                      {ref.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
