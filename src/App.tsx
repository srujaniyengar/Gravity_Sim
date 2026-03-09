import React, { useState } from 'react';
import { VisAlgo } from './components/VisAlgo';
import { AlgoReference } from './components/AlgoReference';
import {
  Orbit, Github, ExternalLink, BookOpen,
  PanelLeftClose, PanelLeft, ChevronDown,
  HelpCircle, Eye, Lightbulb, FileText, Link as LinkIcon,
} from 'lucide-react';

/* ── Collapsible section ── */
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
}> = ({ title, icon, defaultOpen = false, children, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-3 border-nb-border bg-nb-surface">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-nb-panel/50 transition-colors"
        aria-expanded={open}
      >
        <span className="text-nb-accent">{icon}</span>
        <span className="text-[11px] font-black text-nb-text uppercase tracking-wider flex-1">{title}</span>
        {badge && (
          <span className="text-[9px] font-bold bg-nb-accent text-nb-border px-1.5 py-0.5 border-2 border-nb-border">
            {badge}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-nb-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t-2 border-nb-border/50">{children}</div>}
    </div>
  );
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-nb-bg">
      {/* ──── LEFT SIDEBAR ──── */}
      <aside
        className={`flex-shrink-0 border-r-3 border-nb-border bg-nb-panel flex flex-col transition-all duration-200 ${
          sidebarOpen ? 'w-[340px]' : 'w-0 overflow-hidden'
        }`}
        role="complementary"
        aria-label="Sidebar navigation"
      >
        {/* Brand */}
        <div className="p-4 border-b-3 border-nb-border bg-nb-accent flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-nb-bg border-3 border-nb-border shadow-brutal-sm flex items-center justify-center">
              <Orbit size={22} className="text-nb-accent" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-nb-border leading-none">
                Gravity
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-nb-border/70 mt-0.5">
                Simulation Framework
              </p>
            </div>
          </div>
          <p className="text-[10px] text-nb-border/60 mt-2 leading-snug">
            Interactive comparison of routing algorithms for edge computing environments.
          </p>
        </div>

        {/* Scrollable sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          {/* ── HOW TO USE ── */}
          <Section title="How to Use" icon={<HelpCircle size={14} />} defaultOpen={true} badge="START HERE">
            <div className="space-y-3 text-[11px] text-nb-text-dim leading-relaxed">
              <p className="text-nb-text">
                This simulator runs <strong>two routing algorithms side-by-side</strong> under
                identical traffic conditions so you can directly compare their behavior.
              </p>

              <div className="space-y-2">
                <div className="flex gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 bg-nb-accent text-nb-border font-black text-xs flex items-center justify-center border-2 border-nb-border">
                    1
                  </span>
                  <div>
                    <div className="font-bold text-nb-text">Choose algorithms</div>
                    <div>Use the dropdown on each panel to pick which algorithm to test. Try <strong className="text-nb-accent">P2C</strong> on Panel A and <strong className="text-nb-purple">Gravity</strong> on Panel B.</div>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 bg-nb-accent text-nb-border font-black text-xs flex items-center justify-center border-2 border-nb-border">
                    2
                  </span>
                  <div>
                    <div className="font-bold text-nb-text">Adjust parameters</div>
                    <div>Each panel has its own controls. Crank <strong>Gossip Interval</strong> up to 3–5s to introduce staleness.</div>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 bg-nb-accent text-nb-border font-black text-xs flex items-center justify-center border-2 border-nb-border">
                    3
                  </span>
                  <div>
                    <div className="font-bold text-nb-text">Start both simulations</div>
                    <div>Press <strong className="text-nb-green">▶ START</strong> on each panel. Watch nodes change color and packets flow.</div>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <span className="flex-shrink-0 w-6 h-6 bg-nb-accent text-nb-border font-black text-xs flex items-center justify-center border-2 border-nb-border">
                    4
                  </span>
                  <div>
                    <div className="font-bold text-nb-text">Compare metrics</div>
                    <div>Check <strong>P99 Latency</strong>, <strong>Oscillation</strong>, and <strong>Net Tax</strong> to see which algorithm performs better.</div>
                  </div>
                </div>
              </div>

              <div className="bg-nb-bg border-2 border-nb-border p-2.5 text-[10px]">
                <div className="font-black text-nb-red uppercase text-[9px] mb-1">⚡ Try This</div>
                <div>Set P2C + high gossip interval to trigger the <strong className="text-nb-red">Thundering Herd</strong> effect, where traffic piles onto nodes with stale "free" reports. Then compare with Gravity to see how confidence decay prevents it.</div>
              </div>
            </div>
          </Section>

          {/* ── VISUAL LEGEND ── */}
          <Section title="Visual Legend" icon={<Eye size={14} />} defaultOpen={true}>
            <div className="space-y-3">
              {/* Node states */}
              <div>
                <div className="text-[9px] font-black text-nb-muted uppercase tracking-wider mb-2">Node States</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-nb-green border-2 border-nb-border flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Healthy</div>
                      <div className="text-[10px] text-nb-text-dim">Load is below 85% and data is fresh</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-nb-red border-2 border-nb-border flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Saturated</div>
                      <div className="text-[10px] text-nb-text-dim">Load exceeds 85% — node is overloaded</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-nb-amber border-2 border-nb-border opacity-70 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Stale</div>
                      <div className="text-[10px] text-nb-text-dim">Gossip data is outdated — reported load may be wrong</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map elements */}
              <div>
                <div className="text-[9px] font-black text-nb-muted uppercase tracking-wider mb-2">Map Elements</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-nb-cyan border-2 border-nb-border flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Packet</div>
                      <div className="text-[10px] text-nb-text-dim">A task traveling from source to target node</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-1 border-t-2 border-dashed border-nb-cyan flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Travel Path</div>
                      <div className="text-[10px] text-nb-text-dim">Dashed line showing packet route</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 flex items-center justify-center">
                      <div className="w-full h-[2px] bg-nb-muted" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Mesh Edge</div>
                      <div className="text-[10px] text-nb-text-dim">Nearby nodes that can communicate</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 flex items-center justify-center">
                      <div className="w-4 h-1 bg-gradient-to-r from-nb-green via-nb-amber to-nb-red" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-nb-text">Load Bar</div>
                      <div className="text-[10px] text-nb-text-dim">Small bar above each node showing current load</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── CONTROLS EXPLAINED ── */}
          <Section title="What the Controls Do" icon={<Lightbulb size={14} />} defaultOpen={false}>
            <div className="space-y-3 text-[11px]">
              <div>
                <div className="font-bold text-nb-text">Nodes <span className="text-nb-muted font-normal">(3 – 40)</span></div>
                <div className="text-nb-text-dim text-[10px]">Number of servers in the topology. More nodes = more routing choices. Changing this resets the simulation.</div>
              </div>
              <div>
                <div className="font-bold text-nb-text">Request Rate <span className="text-nb-muted font-normal">(0.5 – 20 rps)</span></div>
                <div className="text-nb-text-dim text-[10px]">How many new tasks are created per second. Higher values stress the system faster.</div>
              </div>
              <div>
                <div className="font-bold text-nb-text">Gossip Interval <span className="text-nb-muted font-normal">(0.1 – 5s)</span></div>
                <div className="text-nb-text-dim text-[10px]">How often nodes broadcast their real load. <strong className="text-nb-amber">High values → stale data</strong> → routers make bad decisions.</div>
              </div>
              <div>
                <div className="font-bold text-nb-text">Paranoia (λ) <span className="text-nb-muted font-normal">(0 – 5)</span></div>
                <div className="text-nb-text-dim text-[10px]">Only affects Gravity. Controls how quickly confidence decays for old data. Higher = more distrustful of stale reports.</div>
              </div>
            </div>
          </Section>

          {/* ── METRICS EXPLAINED ── */}
          <Section title="Understanding Metrics" icon={<FileText size={14} />} defaultOpen={false}>
            <div className="space-y-3 text-[11px]">
              <div className="flex gap-2">
                <div className="w-3 h-3 mt-0.5 bg-nb-cyan border-2 border-nb-border flex-shrink-0" />
                <div>
                  <div className="font-bold text-nb-text">P99 Latency</div>
                  <div className="text-nb-text-dim text-[10px]">99th percentile request latency — the worst 1% of requests. Lower is better. Spikes indicate overloaded nodes.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 mt-0.5 bg-nb-green border-2 border-nb-border flex-shrink-0" />
                <div>
                  <div className="font-bold text-nb-text">Oscillation Rate</div>
                  <div className="text-nb-text-dim text-[10px]">How often node loads "flip-flop" between high and low (0–100%). High oscillation means unstable routing — traffic keeps shifting.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 mt-0.5 bg-nb-purple border-2 border-nb-border flex-shrink-0" />
                <div>
                  <div className="font-bold text-nb-text">Network Tax</div>
                  <div className="text-nb-text-dim text-[10px]">Total distance (in pixels ≈ RTT) traveled by all packets. Lower means the algorithm prefers nearby nodes.</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 mt-0.5 bg-nb-accent border-2 border-nb-border flex-shrink-0" />
                <div>
                  <div className="font-bold text-nb-text">Latency Trend</div>
                  <div className="text-nb-text-dim text-[10px]">A sparkline showing recent latency values over time. Flat = stable, spiky = trouble.</div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── GRAVITY FORMULA ── */}
          <Section title="Gravity Scoring Function" icon={<Orbit size={14} />} defaultOpen={false}>
            <div className="space-y-2">
              <div className="font-mono text-[11px] text-nb-cyan leading-relaxed bg-nb-bg border-2 border-nb-border p-2.5">
                G<sub>i</sub> = (1 − L<sub>i</sub>) · e<sup>−λΔT</sup> / (‖V<sub>src</sub> − V<sub>i</sub>‖<sup>β</sup> + ε)
              </div>
              <div className="space-y-1.5 text-[11px] text-nb-text-dim">
                <div className="flex gap-2">
                  <span className="text-nb-green font-bold w-16 flex-shrink-0">1 − L</span>
                  <span>Available capacity — prefers free nodes</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-nb-amber font-bold w-16 flex-shrink-0">e<sup>−λΔT</sup></span>
                  <span>Confidence decay — penalizes stale gossip data</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-nb-purple font-bold w-16 flex-shrink-0">‖V‖<sup>β</sup></span>
                  <span>Distance penalty — favors nearby nodes (lower RTT)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-nb-muted font-bold w-16 flex-shrink-0">ε</span>
                  <span>Small constant to prevent divide-by-zero (10<sup>−6</sup>)</span>
                </div>
              </div>
            </div>
          </Section>

          {/* ── ALGORITHM REFERENCE ── */}
          <Section title="Algorithm Reference" icon={<BookOpen size={14} />} defaultOpen={false} badge="5 ALGOS">
            <AlgoReference />
          </Section>

          {/* ── RESOURCES ── */}
          <Section title="Resources & Links" icon={<LinkIcon size={14} />} defaultOpen={false}>
            <div className="space-y-2">
              <a
                href="https://github.com/srujaniyengar/Gravity_Sim"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-nb-cyan hover:text-nb-accent font-bold transition-colors py-1"
              >
                <Github size={14} />
                <span className="flex-1">GitHub — Gravity_Sim</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-nb-cyan hover:text-nb-accent font-bold transition-colors py-1"
              >
                <BookOpen size={14} />
                <span className="flex-1">Power of Two Choices — Mitzenmacher</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://dl.acm.org/doi/10.1145/258533.258660"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-nb-cyan hover:text-nb-accent font-bold transition-colors py-1"
              >
                <BookOpen size={14} />
                <span className="flex-1">Consistent Hashing — Karger et al.</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://netflixtechblog.com/netflix-edge-load-balancing-695308b5548c"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-nb-cyan hover:text-nb-accent font-bold transition-colors py-1"
              >
                <BookOpen size={14} />
                <span className="flex-1">Netflix Edge Load Balancing</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://research.google/pubs/pub44824/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[11px] text-nb-cyan hover:text-nb-accent font-bold transition-colors py-1"
              >
                <BookOpen size={14} />
                <span className="flex-1">Google Maglev — Consistent Hashing</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </Section>
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-2.5 border-t-3 border-nb-border text-[9px] text-nb-muted font-bold uppercase tracking-widest text-center flex-shrink-0 bg-nb-bg">
          No Backend · In-Browser · React + Vite + TS
        </div>
      </aside>

      {/* ──── MAIN AREA ──── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b-3 border-nb-border bg-nb-surface flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-brutal px-2 py-1.5 bg-nb-panel text-nb-text-dim"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
          </button>

          <div className="flex-1" />

          <div className="text-[11px] font-black text-nb-text-dim uppercase tracking-widest">
            Dual-Sim Comparison
          </div>

          <div className="flex-1" />

          <a
            href="https://github.com/srujaniyengar/Gravity_Sim"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal px-3 py-1.5 bg-nb-panel text-nb-text-dim flex items-center gap-1.5 text-[10px] font-black"
            aria-label="View source on GitHub"
          >
            <Github size={12} />
            REPO
          </a>
        </div>

        {/* Simulation area */}
        <div className="flex-1 overflow-y-auto p-5">
          <VisAlgo />
        </div>
      </div>
    </div>
  );
};

export default App;
