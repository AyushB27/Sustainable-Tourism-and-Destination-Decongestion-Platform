import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Shield, 
  Building2, 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  User,
  Sparkles,
  Lock
} from 'lucide-react';
import { useCorridorStore, DEFAULT_CITIZEN_USER } from '../store/useCorridorStore';
import { sessionManager, DEMO_ACCOUNTS } from '../lib/sessionManager';

export const PortalSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    loginUser
  } = useCorridorStore();

  const handleSelectTourist = () => {
    const session = sessionManager.getSession('tourist');
    if (session) {
      loginUser(session.user);
    } else if (currentUser.role !== 'tourist') {
      loginUser(DEFAULT_CITIZEN_USER);
    }
    navigate('/tourist');
  };

  const handleSelectAuthority = () => {
    const session = sessionManager.getSession('authority');
    if (session) {
      loginUser(session.user);
    } else {
      const demo = DEMO_ACCOUNTS.find(d => d.role === 'authority');
      if (demo) loginUser(demo.user);
    }
    navigate('/authority');
  };

  const handleSelectProvider = () => {
    const session = sessionManager.getSession('provider');
    if (session) {
      loginUser(session.user);
    } else {
      const demo = DEMO_ACCOUNTS.find(d => d.role === 'provider');
      if (demo) loginUser(demo.user);
    }
    navigate('/provider');
  };

  const handleSelectDeveloper = () => {
    const session = sessionManager.getSession('developer');
    if (session) {
      loginUser(session.user);
    } else {
      const demo = DEMO_ACCOUNTS.find(d => d.role === 'developer');
      if (demo) loginUser(demo.user);
    }
    navigate('/dev');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <header className="px-6 sm:px-10 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white">
              EcoRoute
            </span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Western Ghats Corridor Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            to="/login"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 font-semibold"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* Hero & Cards */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-6xl mx-auto w-full">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-600/30 text-emerald-300 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Intelligent Tourism & Mobility Decongestion</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Workspace</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Real-time carrying capacity, dynamic corridor diversion, and eco-mobility network. Choose your designated dashboard to begin.
          </p>
        </div>

        {/* 3 Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* Card 1: Traveler */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            onClick={handleSelectTourist}
            className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-3xl border border-slate-800 hover:border-emerald-500/60 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 p-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Compass className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-700/50">
                  Open Public
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-300 transition">
                  Traveler & Citizen
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Explore crowd density, find quieter twin destinations, and earn Green Passes.
                </p>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live carrying capacity & crowd forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Smart trip planner & verified green rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Scenic alternate route recommendations</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Enter Traveler Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Operations & Command */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            onClick={handleSelectAuthority}
            className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/60 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-950/30 transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-400 p-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950/70 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Authorized Desk
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition">
                  Operations & Command
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Monitor live corridor telemetry, apply capacity throttles, and broadcast alerts.
                </p>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Corridor GIS incident command telemetry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dynamic physical capacity overrides</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Automated diversion & policy simulation</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-750 text-amber-300 border border-amber-500/40 shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Access Operations Deck</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Partners & Hospitality */}
          <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            onClick={handleSelectProvider}
            className="group relative bg-slate-900/80 hover:bg-slate-900 rounded-3xl border border-slate-800 hover:border-sky-500/60 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-sky-950/30 transition-all duration-200"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-13 h-13 rounded-2xl bg-sky-950/70 border border-sky-500/40 text-sky-400 p-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-950/70 text-sky-300 border border-sky-700/50 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Partner Login
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-sky-300 transition">
                  Hospitality & Partners
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Manage inventory, publish off-peak vouchers, and redeem Green Passes.
                </p>
              </div>

              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Real-time occupancy & room availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Publish off-peak promotion discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>Green Pass certificate redemptions</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-750 text-sky-300 border border-sky-500/40 shadow-lg shadow-black/40 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Access Partner Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Subordinate Footer */}
      <footer className="border-t border-slate-800/80 py-5 px-6 sm:px-10 text-xs text-slate-500 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 EcoRoute Network. Next-generation sustainable mobility corridor.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSelectDeveloper}
              className="text-slate-500 hover:text-purple-400 transition inline-flex items-center gap-1.5 py-1 px-2 rounded hover:bg-slate-900 font-mono text-[11px]"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer Diagnostics</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
