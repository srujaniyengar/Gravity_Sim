import React, { useState } from 'react';
import { VisAlgo } from './components/VisAlgo';
import { AlgoReference } from './components/AlgoReference';
import { Orbit, Github, ExternalLink, BookOpen, PanelLeftClose, PanelLeft } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-nb-bg">
      {/* ────── LEFT SIDEBAR ────── */}
      <aside
        className={`flex-shrink-0 border-r-3 border-nb-border bg-nb-panel flex flex-col transition-all duration-200 ${
          sidebarOpen ? 'w-[320px]' : 'w-0 overflow-hidden'
        }`}
      >
        {/* Brand block */}
        <div className="p-4 border-b-3 border-nb-border bg-nb-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-nb-bg border-3 border-nb-border shadow-brutal-sm flex items-center justify-center">
              <Orbit size={22} className="text-nb-accent" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-nb-border leading-none">
                Gravity
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-nb-border/70 mt-0.5">
                Simulation Framework
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Formula card */}
          <div className="bg-nb-bg border-3 border-nb-border shadow-brutal-sm p-3">
            <div className="text-[9px] font-black text-nb-accent uppercase tracking-wider mb-1.5">
              Gravity Scoring Function
            </div>
            <div className="font-mono text-[10px] text-nb-cyan leading-relaxed">
              G<sub>i</sub> = (1 − L<sub>i</sub>) · e<sup>−λΔT</sup> / (‖V<sub>src</sub> − V<sub>i</sub>‖<sup>β</sup> + ε)
            </div>
            <div className="mt-2 space-y-0.5 text-[9px] text-nb-text-dim">
              <div><span className="text-nb-green font-bold">1 − L</span> = Available capacity</div>
              <div><span className="text-nb-amber font-bold">e<sup>−λΔT</sup></span> = Confidence decay (staleness)</div>
              <div><span className="text-nb-purple font-bold">‖V‖<sup>β</sup></span> = Distance penalty (RTT)</div>
            </div>
          </div>

          {/* Quick start */}
          <div className="bg-nb-surface border-3 border-nb-border shadow-brutal-sm p-3">
            <div className="text-[9px] font-black text-nb-accent uppercase tracking-wider mb-2">
              Quick Start
            </div>
            <div className="space-y-1.5 text-[10px] text-nb-text-dim leading-snug">
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-nb-accent text-nb-border font-black text-[10px] flex items-center justify-center border-2 border-nb-border">1</span>
                <span>Set Panel <b className="text-nb-accent">A</b> to <b>P2C</b> and Panel <b className="text-nb-purple">B</b> to <b>Gravity</b></span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-nb-accent text-nb-border font-black text-[10px] flex items-center justify-center border-2 border-nb-border">2</span>
                <span>Crank <b>Gossip Interval</b> to 3–5s</span>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-nb-accent text-nb-border font-black text-[10px] flex items-center justify-center border-2 border-nb-border">3</span>
                <span>Start both sims and watch the <b className="text-nb-red">Thundering Herd</b> in A vs stable routing in B</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-nb-surface border-3 border-nb-border shadow-brutal-sm p-3">
            <div className="text-[9px] font-black text-nb-accent uppercase tracking-wider mb-2">
              Visual Legend
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-nb-green border-2 border-nb-border" />
                <span className="text-nb-text-dim font-bold">Healthy Node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-nb-red border-2 border-nb-border" />
                <span className="text-nb-text-dim font-bold">Saturated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-nb-amber border-2 border-nb-border opacity-70" />
                <span className="text-nb-text-dim font-bold">Stale Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-nb-cyan border-2 border-nb-border" />
                <span className="text-nb-text-dim font-bold">Packet</span>
              </div>
            </div>
          </div>

          {/* Algo reference */}
          <AlgoReference />

          {/* Links */}
          <div className="bg-nb-surface border-3 border-nb-border shadow-brutal-sm p-3 space-y-2">
            <div className="text-[9px] font-black text-nb-accent uppercase tracking-wider">
              Resources
            </div>
            <a
              href="https://github.com/srujaniyengar/Gravity_Sim"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-nb-cyan hover:text-nb-accent font-bold transition-colors"
            >
              <Github size={12} /> GitHub — Gravity_Sim
              <ExternalLink size={8} className="ml-auto" />
            </a>
            <a
              href="https://www.eecs.harvard.edu/~michaelm/postscripts/handbook2001.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-nb-cyan hover:text-nb-accent font-bold transition-colors"
            >
              <BookOpen size={12} /> Power of Two Choices (Mitzenmacher)
              <ExternalLink size={8} className="ml-auto" />
            </a>
            <a
              href="https://dl.acm.org/doi/10.1145/258533.258660"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-nb-cyan hover:text-nb-accent font-bold transition-colors"
            >
              <BookOpen size={12} /> Consistent Hashing (Karger '97)
              <ExternalLink size={8} className="ml-auto" />
            </a>
            <a
              href="https://netflixtechblog.com/netflix-edge-load-balancing-695308b5548c"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-nb-cyan hover:text-nb-accent font-bold transition-colors"
            >
              <BookOpen size={12} /> Netflix Edge Load Balancing
              <ExternalLink size={8} className="ml-auto" />
            </a>
          </div>
        </div>

        {/* Sidebar footer */}
        <div className="p-3 border-t-3 border-nb-border text-[8px] text-nb-muted font-bold uppercase tracking-widest text-center">
          No Backend · In-Browser · React + Vite + TS
        </div>
      </aside>

      {/* ────── MAIN AREA ────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b-3 border-nb-border bg-nb-surface flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn-brutal px-2 py-1.5 bg-nb-panel text-nb-text-dim"
          >
            {sidebarOpen ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
          </button>
          <div className="flex-1" />
          <div className="text-[10px] font-black text-nb-text-dim uppercase tracking-widest">
            Dual-Sim Comparison
          </div>
          <div className="flex-1" />
          <a
            href="https://github.com/srujaniyengar/Gravity_Sim"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal px-2 py-1.5 bg-nb-panel text-nb-text-dim flex items-center gap-1.5 text-[10px] font-black"
          >
            <Github size={12} />
            REPO
          </a>
        </div>

        {/* Simulation area */}
        <div className="flex-1 overflow-y-auto p-4">
          <VisAlgo />
        </div>
      </div>
    </div>
  );
};

export default App;
