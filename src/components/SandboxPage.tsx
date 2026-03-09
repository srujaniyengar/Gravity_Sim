import React from 'react';
import { VisAlgo } from './VisAlgo';
import { ArrowLeft, Orbit, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SandboxPage: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-nb-bg flex flex-col overflow-hidden">
      {/* Super simple Top Bar */}
      <div className="flex items-center gap-4 px-4 py-3 border-b-4 border-nb-border bg-nb-panel flex-shrink-0">
        <Link
          to="/"
          className="btn-brutal bg-nb-surface p-2 text-nb-text hover:bg-nb-border hover:text-nb-bg flex-shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft size={16} />
        </Link>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nb-bg border-2 border-nb-border shadow-brutal-sm flex items-center justify-center">
            <Orbit size={16} className="text-nb-accent" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight text-nb-border leading-none">
              Gravity Sandbox
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-nb-border/70 mt-0.5">
              Drag nodes to test topology
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <Link
          to="/tutorial"
          className="btn-brutal bg-nb-bg border-3 border-nb-border text-nb-text-dim px-3 py-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <BookOpen size={14} className="text-nb-purple" />
          Tutorial
        </Link>
      </div>

      {/* Main Sandbox Area - completely stripped of clutter */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-nb-bg">
        <div className="h-full min-h-[600px]">
          <VisAlgo />
        </div>
      </div>
    </div>
  );
};
