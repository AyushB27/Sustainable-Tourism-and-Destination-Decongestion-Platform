import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  TrendingDown, 
  Languages, 
  Menu, 
  X, 
  AlertTriangle, 
  UserCheck, 
  LogOut, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  WifiOff, 
  Code2, 
  User 
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { PresetScenario } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';
import type { Language } from '../../lib/i18n';
import { GlobalSearchBox } from './GlobalSearchBox';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    setAuthModalOpen,
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
  const [fontSizeScale, setFontSizeScale] = useState<'sm' | 'md' | 'lg'>('md');

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

  const handleFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSizeScale(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  const mainNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover Feed' },
    { to: '/plan/new', label: 'Trip Planner' },
    { to: '/advisories', label: 'Advisories', badge: activeAdvisoriesCount > 0 ? `${activeAdvisoriesCount}` : undefined },
    { to: '/trips', label: 'My Trips' },
  ];

  const stakeholderNavLinks = [
    { to: '/authority', label: 'District GIS', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: metrics.criticalCount > 0 ? `${metrics.criticalCount}` : undefined },
    { to: '/provider', label: 'Providers', icon: <Building2 className="w-3.5 h-3.5" /> },
    { to: '/dev', label: 'Dev Audit', icon: <Code2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Top Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Top Accessibility & Official Information Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-1.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Government Ownership Statement */}
        <div className="flex items-center gap-2 font-medium">
          <span className="text-gov-navy font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-gov-green" />
            Government of India
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-600 hidden md:inline">
            Ministry of Tourism & Maharashtra Tourism (MTDC)
          </span>
        </div>

        {/* Right: Live Status, Active User Profile & Settings */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Sensor Connection Indicator */}
          <button
            onClick={fetchLiveBackendFeed}
            title="Click to refresh live sensor feed"
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold border transition ${
              liveBackendStatus === 'connected'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : liveBackendStatus === 'syncing'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300'
            }`}
          >
            {liveBackendStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            ) : liveBackendStatus === 'connected' ? (
              <CheckCircle2 className="w-3 h-3 text-gov-green" />
            ) : (
              <WifiOff className="w-3 h-3 text-slate-500" />
            )}
            <span>
              {liveBackendStatus === 'connected'
                ? 'Live Sensors Active'
                : liveBackendStatus === 'syncing'
                ? 'Syncing...'
                : 'Simulator Mode'}
            </span>
          </button>

          {/* Active User Profile Pill */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded border border-slate-300 shadow-sm text-xs">
            <UserCheck className="w-3.5 h-3.5 text-gov-navy" />
            <span className="font-bold text-slate-800 truncate max-w-[140px] sm:max-w-[200px]">
              {currentUser.role === 'tourist' ? 'Citizen Tourist' : currentUser.name}
            </span>
            {currentUser.role !== 'tourist' && (
              <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 rounded uppercase">
                {currentUser.role === 'authority' ? 'Officer' : 'MTDC'}
              </span>
            )}
          </div>

          {/* Portal Switcher / Login */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1 bg-gov-navy hover:bg-gov-navy-light text-amber-300 px-2.5 py-1 rounded text-xs font-bold shadow-sm transition"
            title="Switch stakeholder portal or sign in"
          >
            <Lock className="w-3 h-3" />
            <span>Switch Portal</span>
          </button>

          {currentUser.role !== 'tourist' && (
            <button
              onClick={() => {
                logoutUser();
                navigate('/');
              }}
              title="Sign out to citizen mode"
              className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Text Size Controls */}
          <div className="hidden sm:flex items-center bg-white rounded border border-slate-300 overflow-hidden text-[10px] font-bold">
            <button
              onClick={() => handleFontSize('sm')}
              className={`px-2 py-0.5 hover:bg-slate-100 ${fontSizeScale === 'sm' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Smaller Text"
            >
              A-
            </button>
            <button
              onClick={() => handleFontSize('md')}
              className={`px-2 py-0.5 border-x border-slate-200 hover:bg-slate-100 ${fontSizeScale === 'md' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Default Text Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontSize('lg')}
              className={`px-2 py-0.5 hover:bg-slate-100 ${fontSizeScale === 'lg' ? 'bg-gov-navy text-white' : 'text-slate-700'}`}
              title="Larger Text"
            >
              A+
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-300">
            <Languages className="w-3 h-3 text-gov-navy" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Language Selector"
              className="bg-transparent text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.key} value={l.key}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Baseline Button */}
          <button
            onClick={resetToDefault}
            title="Reset to default corridor state"
            className="flex items-center gap-1 text-slate-500 hover:text-gov-navy px-1.5 py-0.5 rounded hover:bg-slate-200 transition text-xs"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 3. Main Government Portal Brand Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Official Emblem & Portal Title (Links to Home /) */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
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
                <span className="hidden sm:inline bg-gov-green/10 text-gov-green text-[10px] font-bold px-2 py-0.5 rounded border border-gov-green/30 uppercase">
                  Official Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Sustainable Tourism • Western Ghats & Maharashtra Corridor
              </p>
            </div>
          </Link>

          {/* Persistent 3-Tier Global Search Box (§2.1) */}
          <div className="flex-1 max-w-md hidden md:block">
            <GlobalSearchBox variant="nav" placeholder="Search destination, district (e.g. Raigad), or state…" />
          </div>

          {/* Right Campaign Badges & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-gov-navy text-xs font-bold text-slate-800 transition"
              title="View account preferences"
            >
              <User className="w-3.5 h-3.5 text-gov-navy" />
              <span>Profile</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-light focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Deep Navy Primary Navigation Bar */}
      <nav className="bg-gov-navy text-white shadow-inner hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Main Tourist Navigation Tabs (§2) */}
          <div className="flex items-center space-x-1">
            {mainNavLinks.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-3 text-xs sm:text-sm font-semibold transition border-b-2 ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border-gov-gold shadow-sm'
                      : 'text-slate-200 border-transparent hover:bg-gov-navy-light hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <span className="text-slate-600 px-1">|</span>

            {/* Stakeholder Consoles (§5, §6) */}
            {stakeholderNavLinks.map((item) => {
              const isActive = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold transition border-b-2 ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border-gov-gold shadow-sm'
                      : 'text-slate-300 border-transparent hover:bg-gov-navy-light hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Simulation Preset & Cumulative Savings */}
          <div className="flex items-center gap-3 py-1.5">
            <div className="flex items-center gap-2 bg-gov-navy-dark px-3 py-1 rounded border border-slate-700 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-gov-gold shrink-0" />
              <span className="text-slate-300 text-[11px] font-medium hidden xl:inline">Scenario:</span>
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

            <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-700 px-3 py-1 rounded text-xs font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>{divertedTripsCount}</strong> Trips Diverted • {totalCarbonSavedKg.toFixed(0)} kg CO₂ Saved</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Live Public Broadcast Advisory Strip */}
      <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 max-w-4xl overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            LIVE ADVISORY
          </span>
          <span className="text-slate-700 font-medium truncate">
            {metrics.criticalCount > 0
              ? `Western Ghats Corridor Alert: Heavy weekend congestion in Lonavala and Khandala. Diversion schemes active for Matheran and Bhandardara.`
              : `Corridor traffic flow is normal. Green highway corridors are open with zero checkpoint delays.`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
          <span>Active Tourists: <strong className="text-gov-navy">{metrics.totalInflow.toLocaleString()}</strong></span>
          <span>Red Zones: <strong className={metrics.criticalCount > 0 ? 'text-rose-600 font-bold' : 'text-gov-green'}>{metrics.criticalCount} Destinations</strong></span>
        </div>
      </div>

      {/* 6. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-navy border-b border-gov-navy-dark px-4 py-4 space-y-3 text-white animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold text-gov-gold uppercase tracking-wider pb-1 border-b border-slate-700 flex items-center justify-between">
            <span>Navigation Menu</span>
            <button
              onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
              className="text-xs text-amber-300 underline font-bold"
            >
              Switch Role Gateway
            </button>
          </div>
          <div className="space-y-1">
            {mainNavLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-100 transition"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-2 pb-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Stakeholder Consoles
            </div>

            {stakeholderNavLinks.map((item) => (
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

            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-amber-300 transition"
            >
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                <span>My Profile & Preferences</span>
              </div>
            </Link>
          </div>

          {/* Mobile User Profile Section */}
          <div className="p-3 bg-slate-800 rounded-lg text-xs space-y-1">
            <div className="text-slate-400 text-[10px] font-bold uppercase">Active Stakeholder Profile</div>
            <div className="font-bold text-white flex items-center justify-between">
              <span>{currentUser.name}</span>
              {currentUser.role !== 'tourist' && (
                <button
                  onClick={() => { 
                    logoutUser(); 
                    navigate('/');
                    setMobileMenuOpen(false); 
                  }}
                  className="text-rose-400 text-xs hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" /> Sign Out
                </button>
              )}
            </div>
          </div>

          {/* Mobile Scenario Selector */}
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

          {/* Emergency Contacts in Drawer */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
            <span>Helpline: <strong className="text-white">1363</strong></span>
            <span>Emergency: <strong className="text-rose-400">112</strong></span>
            <button
              onClick={resetToDefault}
              className="text-amber-300 underline font-semibold"
            >
              Reset Baseline
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
