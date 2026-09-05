import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Calculator, 
  TrendingDown, 
  Award, 
  UserCheck, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  WifiOff, 
  Sparkles, 
  Menu, 
  X, 
  RotateCcw,
  Languages,
  AlertTriangle
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { PresetScenario } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';
import type { Language } from '../../lib/i18n';

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
    resetToDefault,
    divertedTripsCount,
    totalCarbonSavedKg,
    language,
    setLanguage,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const metrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

  const scenarioLabels: Record<PresetScenario, string> = {
    monsoon_surge: 'Monsoon Weekend Peak (Lonavala Congested)',
    khandala_landslide: 'Rockfall & Heavy Rain Alert (Khandala)',
    normal_balanced: 'Normal Balanced Corridor Flow',
    coastal_rush: 'Coastal Weekend Rush (Alibaug Peak)'
  };

  const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { key: 'mr', label: 'Marathi', flag: '🚩' },
  ];

  const authorityNavLinks = [
    { to: '/authority', label: 'Command Center', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/authority/advisories', label: 'Gazette Advisories', icon: <FileText className="w-4 h-4" />, badge: activeAdvisoriesCount > 0 ? `${activeAdvisoriesCount}` : undefined },
    { to: '/authority/policy-simulator', label: 'Policy Simulator', icon: <Calculator className="w-4 h-4" /> },
    { to: '/authority/impact', label: 'Impact Review', icon: <Award className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Official Administrative Status & Identity Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 sm:px-6 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-amber-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            OFFICIAL DISTRICT COMMAND HQ
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Western Ghats District Cell • Pune • Raigad • Satara
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Sensor Connection Indicator */}
          <button
            onClick={fetchLiveBackendFeed}
            title="Click to refresh live sensor feed"
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold border transition ${
              liveBackendStatus === 'connected'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : liveBackendStatus === 'syncing'
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {liveBackendStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-300" />
            ) : liveBackendStatus === 'connected' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-slate-400" />
            )}
            <span>
              {liveBackendStatus === 'connected'
                ? 'Live Python Pipeline'
                : liveBackendStatus === 'syncing'
                ? 'Syncing Pipeline...'
                : 'Simulator Mode'}
            </span>
          </button>

          {/* Active Officer Identity Pill */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 shadow-sm text-xs">
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {currentUser.name}
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold px-1.5 rounded uppercase border border-amber-400/30">
              {currentUser.jurisdiction?.value ? `${currentUser.jurisdiction.value}` : 'Official'}
            </span>
          </div>

          {/* Sign Out / Change Portal */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 bg-rose-900/40 hover:bg-rose-900/70 text-rose-300 px-2.5 py-1 rounded text-xs font-bold border border-rose-700/60 shadow-sm transition"
            title="Sign out to portal selection screen"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <Languages className="w-3 h-3 text-amber-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Language Selector"
              className="bg-transparent text-xs text-slate-200 font-bold focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.key} value={l.key} className="bg-slate-900 text-white">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Baseline Button */}
          <button
            onClick={resetToDefault}
            title="Reset to default corridor baseline state"
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 px-1.5 py-0.5 rounded hover:bg-slate-800 transition text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3. Main Brand Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/authority" className="flex items-center gap-3.5 group shrink-0">
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-300 rounded-xl shadow-sm group-hover:border-gov-navy transition">
              <div className="w-9 h-9 flex items-center justify-center text-gov-navy font-serif font-black text-base border-2 border-gov-navy rounded-full bg-amber-50">
                🏛️
              </div>
              <span className="text-[7px] font-bold text-slate-600 uppercase tracking-tighter mt-0.5">
                SATYAMEVA JAYATE
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-gov-navy tracking-tight leading-tight group-hover:text-gov-navy-light transition">
                  EcoRoute Bharat
                </span>
                <span className="bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  District GIS Command
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                District Disaster Management & Traffic Regulation Console
              </p>
            </div>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-light focus:outline-none"
              aria-label="Toggle Command Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Deep Navy Primary Navigation Bar (Authority Only!) */}
      <nav className="bg-gov-navy text-white shadow-inner hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {authorityNavLinks.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/authority' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border-gov-gold shadow-sm'
                      : 'text-slate-200 border-transparent hover:bg-gov-navy-light hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Simulation Preset & Cumulative Government Savings */}
          <div className="flex items-center gap-3 py-1.5">
            {/* Simulation Scenario Selector (Official Sandbox Tool) */}
            <div className="flex items-center gap-2 bg-gov-navy-dark px-3 py-1 rounded border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-gov-gold shrink-0" />
              <span className="text-slate-300 text-[11px] font-medium hidden xl:inline">Scenario Sandbox:</span>
              <select
                value={activeScenario}
                onChange={(e) => applyPresetScenario(e.target.value as PresetScenario)}
                aria-label="Corridor Simulation Scenario"
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {Object.entries(scenarioLabels).map(([key, label]) => (
                  <option key={key} value={key} className="bg-gov-navy text-white">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Government KPI Ticker */}
            <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-700 px-3 py-1 rounded text-xs font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>{divertedTripsCount}</strong> Diverted • {totalCarbonSavedKg.toFixed(0)} kg CO₂ Saved</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Live Authority Public Broadcast Advisory Strip */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 max-w-4xl overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            CORRIDOR STATUS
          </span>
          <span className="text-slate-700 font-medium truncate">
            {metrics.criticalCount > 0
              ? `Active Congestion Alert: Lonavala/Khandala choke points active. Automated deflection algorithms active.`
              : `Corridor traffic flow is normal across all district checkpoints.`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>Monitored Inflow: <strong className="text-gov-navy">{metrics.totalInflow.toLocaleString()}</strong></span>
          <span>Red Zones: <strong className={metrics.criticalCount > 0 ? 'text-rose-600 font-bold' : 'text-gov-green'}>{metrics.criticalCount} Destinations</strong></span>
        </div>
      </div>

      {/* 6. Mobile Navigation Drawer (Authority Only!) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-navy border-b border-gov-navy-dark px-4 py-4 space-y-3 text-white animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold text-gov-gold uppercase tracking-wider pb-1 border-b border-slate-700 flex items-center justify-between">
            <span>District GIS Command Navigation</span>
            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="text-xs text-rose-300 underline font-bold"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-1">
            {authorityNavLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-100 transition"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Scenario Sandbox Selector in Drawer */}
          <div className="pt-2 border-t border-slate-700 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              Simulation Scenario:
            </label>
            <select
              value={activeScenario}
              onChange={(e) => {
                applyPresetScenario(e.target.value as PresetScenario);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-lg p-2.5 font-medium"
            >
              {Object.entries(scenarioLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  );
};
