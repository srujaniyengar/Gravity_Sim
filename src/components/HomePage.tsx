import React from 'react';
import { Orbit, Play, BookOpen, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-nb-bg flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero */}
        <div className="bg-nb-accent border-4 border-nb-border shadow-brutal p-8 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-nb-bg border-4 border-nb-border shadow-brutal flex items-center justify-center">
              <Orbit size={48} className="text-nb-accent" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none">
            Gravity
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-nb-text mt-2 bg-nb-bg inline-block px-3 py-1 border-2 border-nb-border">
            Edge Routing Simulation Framework
          </p>
        </div>

        {/* Intro Text */}
        <div className="bg-nb-surface border-4 border-nb-border shadow-brutal p-6 text-nb-text-dim text-sm leading-relaxed space-y-4">
          <p>
            Welcome to the Gravity Simulation Framework. This interactive tool demonstrates how different 
            load balancing algorithms perform in edge computing environments where network topology 
            (geographic distance) and gossip staleness (delayed server metrics) severely impact performance.
          </p>
          <p>
            You can compare industry-standard algorithms like <strong className="text-nb-text">Power of Two Choices (P2C)</strong> and <strong className="text-nb-text">Consistent Hashing</strong> against 
            the custom <strong className="text-nb-accent">Gravity Risk-Aware Algorithm</strong> under identical simulated traffic conditions.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/tutorial"
            className="btn-brutal bg-nb-panel border-4 border-nb-border hover:bg-nb-surface
              flex flex-col items-center justify-center p-6 gap-3 transition-colors"
          >
            <BookOpen size={32} className="text-nb-purple" />
            <div className="text-center">
              <div className="text-lg font-black uppercase tracking-wider text-nb-text">Learn</div>
              <div className="text-xs text-nb-text-dim mt-1">Algorithms & Theory</div>
            </div>
          </Link>
          <Link
            to="/sandbox"
            className="btn-brutal bg-nb-green border-4 border-nb-border hover:brightness-110 
              flex flex-col items-center justify-center p-6 gap-3 transition-all"
          >
            <Play size={32} className="text-nb-border" />
            <div className="text-center">
              <div className="text-lg font-black uppercase tracking-wider text-nb-border">Sandbox</div>
              <div className="text-xs font-bold text-nb-border/70 mt-1">Run Simulations</div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-8 pb-4">
          <a
            href="https://github.com/srujaniyengar/Gravity_Sim"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-nb-muted hover:text-nb-text transition-colors"
          >
            <Github size={16} />
            View Source on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
