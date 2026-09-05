import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Calculator, 
  TrendingDown, 
  Award, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  WifiOff, 
  Menu, 
  X, 
  Layers,
  ChevronDown,
  Sparkles,
  Radio
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { PresetScenario } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';

export const AuthorityNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    destinations,
    advisories,
    activeScenario,
    applyPresetScenario,
    divertedTripsCount,
    totalCarbonSavedKg,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const metrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

  const scenarioLabels: Record<PresetScenario, string> = {
    monsoon_surge: 'Peak Monsoon Surge (Lonavala Peak)',
    khandala_landslide: 'Rockfall & Hazard Alert (Khandala)',
    normal_balanced: 'Balanced Baseline Flow',
    coastal_rush: 'Coastal Weekend Rush (Alibaug Peak)'
  };

  const navLinks = [
    { to: '/authority', label: 'Command Center', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/authority/advisories', label: 'Advisories', icon: <FileText className="w-4 h-4" />, badge: activeAdvisoriesCount > 0 ? `${activeAdvisoriesCount}` : undefined },
    { to: '/authority/policy-simulator', label: 'Simulator', icon: <Calculator className="w-4 h-4" /> },
    { to: '/authority/impact', label: 'Impact', icon: <Award className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logoutUser('authority');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Telemetry Status */}
          <div className="flex items-center gap-6">
            <Link to="/authority" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform duration-200">
                <Radio className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-black text-lg tracking-tight text-white group-hover:text-amber-300 transition">
                    EcoRoute
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Operations
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Corridor Telemetry & Command
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || (link.to !== '/authority' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-800 text-amber-300 shadow-sm border border-slate-700'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools: Pipeline Sync, Sandbox, KPIs, Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Pipeline Indicator */}
            <button
              onClick={fetchLiveBackendFeed}
              title="Sync live telemetry pipeline"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                liveBackendStatus === 'connected'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                  : liveBackendStatus === 'syncing'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-600/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {liveBackendStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
              ) : liveBackendStatus === 'connected' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-slate-400" />
              )}
              <span>{liveBackendStatus === 'connected' ? 'Live Telemetry' : liveBackendStatus === 'syncing' ? 'Syncing...' : 'Sim Feed'}</span>
            </button>

            {/* Scenario Preset Selector */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={activeScenario}
                onChange={(e) => applyPresetScenario(e.target.value as PresetScenario)}
                aria-label="Scenario"
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {Object.entries(scenarioLabels).map(([key, label]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Telemetry Metrics Pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 px-3 py-1 rounded-xl text-xs font-bold">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>{divertedTripsCount} Diverted • {totalCarbonSavedKg.toFixed(0)} kg CO₂</span>
            </div>

            {/* Officer Profile & Sign Out Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/40">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-white hidden sm:inline max-w-[130px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.designation || 'District Operations'}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-bold">Active Officer Session</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch Portal</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 font-semibold text-left transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Alert Ticker */}
      {metrics.criticalCount > 0 && (
        <div className="bg-rose-950/80 border-t border-rose-900/80 px-4 py-1.5 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
              Alert
            </span>
            <span className="truncate">
              {metrics.criticalCount} red-zone bottlenecks detected. Active rerouting algorithms in effect.
            </span>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Total Monitored Inflow: <strong className="text-white">{metrics.totalInflow.toLocaleString()}</strong>
          </span>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-150 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-2">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-400 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Switch Portal</span>
            </Link>

            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="text-xs font-bold text-rose-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
