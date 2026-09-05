import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  ShieldAlert, 
  Building2, 
  Code2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useCorridorStore, DEFAULT_CITIZEN_USER } from '../store/useCorridorStore';

export const PortalSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    loginUser, 
    setAuthModalOpen 
  } = useCorridorStore();

  const handleSelectTourist = () => {
    // If not already tourist, set to citizen tourist mode
    if (currentUser.role !== 'tourist') {
      loginUser({
        ...DEFAULT_CITIZEN_USER,
        isAuthenticated: true
      });
    }
    navigate('/tourist');
  };

  const handleSelectAuthority = () => {
    if (currentUser.role === 'authority' && currentUser.isAuthenticated) {
      navigate('/authority');
    } else {
      setAuthModalOpen(true, 'authority');
    }
  };

  const handleSelectProvider = () => {
    if (currentUser.role === 'provider' && currentUser.isAuthenticated) {
      navigate('/provider');
    } else {
      setAuthModalOpen(true, 'provider');
    }
  };

  const handleSelectDeveloper = () => {
    if (currentUser.role === 'developer' && currentUser.isAuthenticated) {
      navigate('/dev');
    } else {
      setAuthModalOpen(true, 'developer');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gov-navy-dark to-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* 1. National Flag Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Top Minimal Accessibility & Identity Bar */}
      <header className="px-4 sm:px-8 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Government of India
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 hidden sm:inline">
            Ministry of Tourism & Maharashtra Tourism (MTDC)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gov-gold bg-gov-gold/10 border border-gov-gold/30 px-2.5 py-0.5 rounded-full">
            SIH26204 Production Prototype
          </span>
        </div>
      </header>

      {/* 3. Main Centerpiece: Portal Selection Hero & Cards */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-6xl mx-auto w-full">
        {/* Emblem & Portal Brand Heading */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10 sm:mb-14 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner mb-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-gov-gold flex items-center justify-center text-xs text-gov-navy font-serif font-black shadow-sm">
              🏛️
            </div>
            <span className="text-xs font-bold text-amber-300 tracking-wide uppercase">
              EcoRoute Bharat Gateway
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-gov-gold to-emerald-400">Stakeholder Portal</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            National Sustainable Tourism & Mobility Decongestion Corridor across the Western Ghats. Choose your designated operational role to proceed into your isolated portal.
          </p>
        </div>

        {/* 3 Primary Role Cards (Large Focal Point) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {/* Card 1: Tourist / Traveler */}
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18 }}
            onClick={handleSelectTourist}
            className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border-2 border-slate-700/80 hover:border-emerald-400/80 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-200"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-emerald-500/20 transition" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner group-hover:border-emerald-400 transition">
                  <Compass className="w-7 h-7 group-hover:rotate-45 transition-transform duration-300" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                  Open Public Access
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition">
                  Tourist / Traveler
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Plan a trip, check live crowd levels, discover quieter destinations.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Real-time crowd DCC metrics & forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Smart trip planner & Green Pass certificates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Discover feed with scenic twin alternatives</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Enter Traveler Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Government Official */}
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18 }}
            onClick={handleSelectAuthority}
            className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border-2 border-slate-700/80 hover:border-gov-gold/80 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-950/30 transition-all duration-200"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-amber-500/20 transition" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-gov-gold/50 text-amber-300 flex items-center justify-center shadow-inner group-hover:border-gov-gold transition">
                  <ShieldAlert className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/50 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  IAS / IPS Credentialed
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition">
                  Government Official
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Monitor destinations, issue advisories, manage district capacity.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-gold shrink-0" />
                  <span>District GIS command map & capacity rings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-gold shrink-0" />
                  <span>Emergency physical capacity override throttles</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-gold shrink-0" />
                  <span>Official Gazette advisory dispatcher & simulator</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gov-navy hover:bg-gov-navy-light text-amber-300 border border-gov-gold/40 shadow-lg shadow-gov-navy/40 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Official Command Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 3: Business / Provider */}
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.18 }}
            onClick={handleSelectProvider}
            className="group relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border-2 border-slate-700/80 hover:border-amber-500/80 p-7 sm:p-8 flex flex-col justify-between cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-orange-950/30 transition-all duration-200"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10 pointer-events-none group-hover:bg-orange-500/20 transition" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-amber-500/40 text-amber-400 flex items-center justify-center shadow-inner group-hover:border-amber-400 transition">
                  <Building2 className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-amber-600/40 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  MTDC Partner
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition">
                  Business / Provider
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Manage your listing, pricing, and promotions.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Live room availability & occupancy reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Publish verified off-peak discount vouchers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Green Pass guest redemption tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition group-hover:gap-3"
              >
                <span>Operator Console Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Note on Role Protection */}
        <p className="text-xs text-slate-400 mt-8 text-center max-w-lg">
          Official and Operator roles require statutory authentication. Fast demo credential profiles for IAS, IPS, and MTDC operators are available in the login dialog.
        </p>
      </main>

      {/* 4. Subordinate Footer with Unobtrusive Developer Link */}
      <footer className="border-t border-slate-800/80 py-6 px-4 sm:px-8 text-xs text-slate-400 bg-slate-950/80">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="font-medium text-slate-400">
              © 2026 Ministry of Tourism, Government of India. All Rights Reserved.
            </p>
            <p className="text-[11px] text-slate-400">
              Designed & Developed under SIH26204 • Hosted on National Informatics Centre (NIC) node.
            </p>
          </div>

          {/* Internal Tooling: Small, unobtrusive developer link */}
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleSelectDeveloper}
              className="text-slate-400 hover:text-cyan-400 transition inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
              title="Internal developer and telemetry diagnostic portal"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Developer Diagnostics</span>
            </button>

            <span className="text-slate-700">|</span>

            <a
              href="https://tourism.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200 transition inline-flex items-center gap-1"
            >
              <span>tourism.gov.in</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
