import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const StakeholderLayout: React.FC = () => {
  const { currentUser } = useCorridorStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Stakeholder Utility Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight">EcoRoute Community</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
            {currentUser.name}
          </span>
          <Link
            to="/select-portal"
            className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch Portal</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
