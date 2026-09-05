import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Code2, ArrowLeft, Activity } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const DevLayout: React.FC = () => {
  const navigate = useNavigate();
  const { liveBackendStatus } = useCorridorStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Developer Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Developer Diagnostics & Audit Portal</span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700 px-2 py-0.5 rounded">
                INTERNAL ONLY
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Live telemetry pipeline auditor, SQLite database browser & SIH requirements matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backend: <strong className={liveBackendStatus === 'connected' ? 'text-emerald-400' : 'text-amber-400'}>{liveBackendStatus}</strong></span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Portal Selection</span>
          </button>
        </div>
      </header>

      {/* 3. Main Diagnostics Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
