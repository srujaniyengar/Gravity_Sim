import React from 'react';
import { AlgoReference } from './AlgoReference';
import { ArrowLeft, HelpCircle, Eye, Lightbulb, FileText, Orbit, Link as LinkIcon, ExternalLink, Github, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Reusable documentation section ── */
const DocSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-nb-surface border-4 border-nb-border shadow-brutal mb-6">
    <div className="bg-nb-panel border-b-4 border-nb-border px-5 py-3 flex items-center gap-3">
      <span className="text-nb-accent">{icon}</span>
      <h2 className="text-sm font-black text-nb-text uppercase tracking-wider m-0">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export const TutorialPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-nb-bg flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-4 border-b-4 border-nb-border bg-nb-panel flex-shrink-0">
        <Link
          to="/"
          className="btn-brutal bg-nb-surface p-2 text-nb-text hover:bg-nb-border hover:text-nb-bg transition-colors"
          aria-label="Back to Home"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-3">
          <BookOpen strokeWidth={2.5} className="text-nb-purple" />
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-nb-text m-0">
            Tutorial & Documentation
          </h1>
        </div>
        <div className="flex-1" />
        <Link
          to="/sandbox"
          className="btn-brutal bg-nb-green text-nb-border px-4 py-2 text-xs font-black uppercase tracking-wider"
        >
          Go to Sandbox ⏵
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">

          <DocSection title="How to Use the Sandbox" icon={<HelpCircle size={20} />}>
            <div className="space-y-4 text-sm text-nb-text-dim leading-relaxed">
              <p className="text-nb-text">
                The sandbox runs <strong>two routing algorithms side-by-side</strong> under
                identical traffic conditions so you can immediately see the difference in behavior.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-nb-accent text-nb-border font-black text-sm flex items-center justify-center border-3 border-nb-border shadow-brutal-sm">1</span>
                  <div>
                    <div className="font-bold text-nb-text text-base mb-1">Choose algorithms</div>
                    <div>Use the dropdown on each panel to pick which algorithm to test. A classic test is <strong className="text-nb-accent">P2C</strong> on Panel A vs <strong className="text-nb-purple">Gravity</strong> on Panel B.</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-nb-accent text-nb-border font-black text-sm flex items-center justify-center border-3 border-nb-border shadow-brutal-sm">2</span>
                  <div>
                    <div className="font-bold text-nb-text text-base mb-1">Adjust parameters</div>
                    <div>Try raising the <strong>Gossip Interval</strong> to 3–5 seconds to simulate a network where server load metrics are delayed.</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-nb-accent text-nb-border font-black text-sm flex items-center justify-center border-3 border-nb-border shadow-brutal-sm">3</span>
                  <div>
                    <div className="font-bold text-nb-text text-base mb-1">Drag Nodes</div>
                    <div>You can <strong className="text-nb-text">click and drag nodes</strong> on the map to change the topology and test distance penalties!</div>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-nb-accent text-nb-border font-black text-sm flex items-center justify-center border-3 border-nb-border shadow-brutal-sm">4</span>
                  <div>
                    <div className="font-bold text-nb-text text-base mb-1">Compare metrics</div>
                    <div>Watch <strong>P99 Latency</strong> to see worst-case performance, and <strong>Oscillation</strong> to see if traffic is bouncing back and forth.</div>
                  </div>
                </div>
              </div>

              <div className="bg-nb-bg border-3 border-nb-border p-4 mt-6">
                <div className="font-black text-nb-red uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-nb-red rounded-full animate-pulse" />
                  Try Generating a Thundering Herd
                </div>
                <p>
                  Set Panel A to <strong>Power of Two Choices (P2C)</strong> and push the Gossip Interval to 4 seconds. When the simulation runs, you will see the "Thundering Herd" effect: because routers are using stale data, they all simultaneously think a single node is empty and bombard it with traffic, turning it deeply red (saturated) while other nodes sit idle.
                </p>
              </div>
            </div>
          </DocSection>

          <DocSection title="Visual Legend" icon={<Eye size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Node states */}
              <div>
                <div className="text-xs font-black text-nb-muted uppercase tracking-widest mb-4">Node States</div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-nb-green border-3 border-nb-border shadow-brutal-sm flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Healthy</div>
                      <div className="text-xs text-nb-text-dim mt-1">Load is below 85% and gossip data is fresh. Safe to route to.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-nb-red border-3 border-nb-border shadow-brutal-sm flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Saturated</div>
                      <div className="text-xs text-nb-text-dim mt-1">Load exceeds 85% — node is overloaded. Latency will spike.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-nb-amber border-3 border-nb-border opacity-70 shadow-brutal-sm flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Stale</div>
                      <div className="text-xs text-nb-text-dim mt-1">Gossip data is outdated. The reported load might be a lie.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map elements */}
              <div>
                <div className="text-xs font-black text-nb-muted uppercase tracking-widest mb-4">Map Elements</div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-nb-cyan border-3 border-nb-border shadow-brutal-sm flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Packet</div>
                      <div className="text-xs text-nb-text-dim mt-1">A task traveling from the random source node to the chosen target.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 flex items-center justify-center flex-shrink-0 h-10">
                      <div className="w-8 h-1 border-t-3 border-dashed border-nb-cyan" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Travel Path</div>
                      <div className="text-xs text-nb-text-dim mt-1">Dashed line showing where the packet is going. Long paths mean high RTT.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 flex flex-col justify-end h-10 border-b-2 border-nb-border bg-nb-bg flex-shrink-0 pb-1 items-center">
                      <div className="w-6 h-3 bg-gradient-to-r from-nb-green via-nb-amber to-nb-red" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-nb-text uppercase tracking-widest">Load Bar</div>
                      <div className="text-xs text-nb-text-dim mt-1">The mini-bar hovering above each node, showing exactly how full it is in real-time.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DocSection>

          <DocSection title="What the Controls Do" icon={<Lightbulb size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-nb-bg border-2 border-nb-border p-4">
                <div className="font-bold text-nb-text text-base mb-1">Nodes <span className="text-nb-muted font-normal text-xs ml-2">(3 – 40)</span></div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  Number of servers in the topology network. You can drag them around! Changing this resets the simulation.
                </div>
              </div>
              <div className="bg-nb-bg border-2 border-nb-border p-4">
                <div className="font-bold text-nb-text text-base mb-1">Request Rate <span className="text-nb-muted font-normal text-xs ml-2">(0.5 – 20 rps)</span></div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  How many new tasks are created per second. Higher values stress the system faster and fill up node capacities.
                </div>
              </div>
              <div className="bg-nb-bg border-2 border-nb-border p-4">
                <div className="font-bold text-nb-text text-base mb-1">Gossip Interval <span className="text-nb-muted font-normal text-xs ml-2">(0.1 – 5s)</span></div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  How often nodes broadcast their true load. <strong className="text-nb-amber">High values = stale data</strong>. This is the primary cause of the Thundering Herd.
                </div>
              </div>
              <div className="bg-nb-bg border-2 border-nb-border p-4">
                <div className="font-bold text-nb-text text-base mb-1">Paranoia (λ) <span className="text-nb-muted font-normal text-xs ml-2">(0 – 5)</span></div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  Specific to the Gravity algorithm. Controls how fast confidence decays. High λ means Gravity heavily distrusts old data.
                </div>
              </div>
            </div>
          </DocSection>

          <DocSection title="Understanding the Metrics" icon={<FileText size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-nb-cyan border-2 border-nb-border" />
                  <div className="font-bold text-nb-text uppercase tracking-widest">P99 Latency</div>
                </div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  The latency experienced by the 99th percentile of packets (the slowest 1%). A high P99 means some users are experiencing terrible performance, usually because they were routed to an overloaded node. Lower is better.
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-nb-green border-2 border-nb-border" />
                  <div className="font-bold text-nb-text uppercase tracking-widest">Oscillation</div>
                </div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  Measures how often load shifts violently between nodes (0–100%). High oscillation means traffic is "flip-flopping" constantly, which is highly unstable and typical of algorithms dealing with stale data.
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-nb-purple border-2 border-nb-border" />
                  <div className="font-bold text-nb-text uppercase tracking-widest">Net Tax</div>
                </div>
                <div className="text-nb-text-dim text-xs leading-relaxed">
                  The total physical distance (measured in pixels, representing RTT/ping) traveled by all packets. Topology-aware algorithms minimize this by preferring closer nodes.
                </div>
              </div>
            </div>
          </DocSection>

          <DocSection title="The Gravity Scoring Function" icon={<Orbit size={20} />}>
            <div className="space-y-4">
              <p className="text-sm text-nb-text-dim">
                Gravity computes a score for every node and picks the one with the highest score. It balances available capacity, data freshness, and distance.
              </p>
              <div className="font-mono text-sm md:text-base text-center py-6 text-nb-cyan bg-nb-bg border-3 border-nb-border shadow-brutal-sm overflow-x-auto">
                G<sub>i</sub> = (1 − L<sub>i</sub>) · e<sup>−λΔT</sup> / (‖V<sub>src</sub> − V<sub>i</sub>‖<sup>β</sup> + ε)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-nb-text-dim pt-2">
                <div className="flex gap-4 items-center bg-nb-panel border-2 border-nb-border p-3">
                  <span className="text-nb-green font-black text-lg w-16 text-center">1 − L</span>
                  <span className="text-xs">Capacity. Prefers empty nodes. If Load is 1.0 (full), the score becomes 0.</span>
                </div>
                <div className="flex gap-4 items-center bg-nb-panel border-2 border-nb-border p-3">
                  <span className="text-nb-amber font-black text-lg w-16 text-center">e<sup>−λΔT</sup></span>
                  <span className="text-xs">Confidence decay. As time since last update (ΔT) grows, the score shrinks exponentially.</span>
                </div>
                <div className="flex gap-4 items-center bg-nb-panel border-2 border-nb-border p-3">
                  <span className="text-nb-purple font-black text-lg w-16 text-center">‖V‖<sup>β</sup></span>
                  <span className="text-xs">Distance penalty. Geographically distant nodes get deeply penalized.</span>
                </div>
                <div className="flex gap-4 items-center bg-nb-panel border-2 border-nb-border p-3">
                  <span className="text-nb-text font-black text-lg w-16 text-center">λ, β, ε</span>
                  <span className="text-xs">Tunable parameters for paranoia, distance weighting, and math safety.</span>
                </div>
              </div>
            </div>
          </DocSection>

          <DocSection title="Algorithm deep Dive" icon={<BookOpen size={20} />}>
            <div className="mb-4 text-sm text-nb-text-dim">
              Detailed breakdown of the 5 implemented routing algorithms.
            </div>
            {/* We reuse AlgoReference via a wrapper so we don't have to rewrite it */}
            <div className="not-prose max-w-2xl">
              <AlgoReference />
            </div>
          </DocSection>

          <DocSection title="External Resources" icon={<LinkIcon size={20} />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="https://github.com/srujaniyengar/Gravity_Sim" target="_blank" rel="noopener noreferrer" className="btn-brutal bg-nb-bg border-2 border-nb-border p-4 flex items-center gap-3 text-sm font-bold text-nb-text hover:text-nb-accent transition-colors">
                <Github size={20} className="text-nb-muted" /> Source Code (GitHub) <ExternalLink size={14} className="ml-auto opacity-50" />
              </a>
              <a href="https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf" target="_blank" rel="noopener noreferrer" className="btn-brutal bg-nb-bg border-2 border-nb-border p-4 flex items-center gap-3 text-sm font-bold text-nb-text hover:text-nb-accent transition-colors">
                <FileText size={20} className="text-nb-muted" /> Power of Two Choices Paper <ExternalLink size={14} className="ml-auto opacity-50" />
              </a>
              <a href="https://dl.acm.org/doi/10.1145/258533.258660" target="_blank" rel="noopener noreferrer" className="btn-brutal bg-nb-bg border-2 border-nb-border p-4 flex items-center gap-3 text-sm font-bold text-nb-text hover:text-nb-accent transition-colors">
                <FileText size={20} className="text-nb-muted" /> Consistent Hashing Paper <ExternalLink size={14} className="ml-auto opacity-50" />
              </a>
              <a href="https://netflixtechblog.com/netflix-edge-load-balancing-695308b5548c" target="_blank" rel="noopener noreferrer" className="btn-brutal bg-nb-bg border-2 border-nb-border p-4 flex items-center gap-3 text-sm font-bold text-nb-text hover:text-nb-accent transition-colors">
                <LinkIcon size={20} className="text-nb-muted" /> Netflix Edge Routing Blog <ExternalLink size={14} className="ml-auto opacity-50" />
              </a>
            </div>
          </DocSection>

        </div>
      </div>
    </div>
  );
};
