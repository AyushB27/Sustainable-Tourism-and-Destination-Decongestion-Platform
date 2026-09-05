import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Languages, 
  Menu, 
  X, 
  AlertTriangle, 
  UserCheck, 
  Layers
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { Language } from '../../lib/i18n';
import { GlobalSearchBox } from '../common/GlobalSearchBox';

export const TouristNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    advisories,
    language,
    setLanguage
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState<'sm' | 'md' | 'lg'>('md');

  const criticalAdvisories = advisories.filter(a => a.active && (a.severity === 'critical' || a.severity === 'high'));

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

  const touristNavLinks = [
    { to: '/tourist', label: 'Home' },
    { to: '/discover', label: 'Discover Feed' },
    { to: '/plan/new', label: 'Trip Planner' },
    { to: '/trips', label: 'My Trips' },
  ];

  const handleExitPortal = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Top Accessibility & Official Statement Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-3 sm:px-6 py-1.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
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

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Citizen Traveler Pill */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded border border-slate-300 shadow-sm text-xs">
            <UserCheck className="w-3.5 h-3.5 text-gov-green" />
            <span className="font-bold text-slate-800">
              {currentUser.name || 'Citizen Tourist'}
            </span>
          </div>

          {/* Change Portal Button */}
          <button
            onClick={handleExitPortal}
            className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 px-2 py-0.5 rounded text-xs font-semibold border border-slate-300 transition"
            title="Switch to another stakeholder portal"
          >
            <Layers className="w-3 h-3 text-slate-500" />
            <span>Change Portal</span>
          </button>

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
        </div>
      </div>

      {/* 3. Main Brand Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/tourist" className="flex items-center gap-3.5 group shrink-0">
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
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Sustainable Tourism • Western Ghats & Maharashtra Corridor
              </p>
            </div>
          </Link>

          {/* Persistent 3-Tier Global Search Box */}
          <div className="flex-1 max-w-md hidden md:block">
            <GlobalSearchBox variant="nav" placeholder="Search destination, district (e.g. Raigad), or state…" />
          </div>

          {/* Profile Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/account"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-gov-navy text-xs font-bold text-slate-800 transition"
              title="Traveler Profile & Preferences"
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

      {/* 4. Deep Navy Primary Navigation Bar (Tourist Only!) */}
      <nav className="bg-gov-navy text-white shadow-inner hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {touristNavLinks.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/tourist' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 ${
                    isActive
                      ? 'bg-gov-navy-dark text-amber-300 border-gov-gold shadow-sm'
                      : 'text-slate-200 border-transparent hover:bg-gov-navy-light hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 py-1.5 text-xs text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green Highway Corridors Active</span>
          </div>
        </div>
      </nav>

      {/* 5. Contextual Public Safety Notice (Only shown if active critical advisory exists) */}
      {criticalAdvisories.length > 0 && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 sm:px-6 py-2 text-xs text-amber-950 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2.5 max-w-4xl overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              SAFETY ADVISORY
            </span>
            <span className="text-slate-700 font-medium truncate">
              {criticalAdvisories[0].title}: {criticalAdvisories[0].message}
            </span>
          </div>
          <Link
            to={`/spot/${criticalAdvisories[0].destinationId === 'ALL' ? 'LON' : criticalAdvisories[0].destinationId}`}
            className="text-amber-800 hover:text-amber-950 font-bold underline shrink-0 text-[11px]"
          >
            Inspect Spot Status →
          </Link>
        </div>
      )}

      {/* 6. Mobile Navigation Drawer (Tourist Only!) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-navy border-b border-gov-navy-dark px-4 py-4 space-y-3 text-white animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold text-gov-gold uppercase tracking-wider pb-1 border-b border-slate-700 flex items-center justify-between">
            <span>Tourist Navigation</span>
            <button
              onClick={() => { handleExitPortal(); setMobileMenuOpen(false); }}
              className="text-xs text-amber-300 underline font-bold"
            >
              Exit to Portals
            </button>
          </div>

          <div className="space-y-1">
            {touristNavLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-100 transition"
              >
                <span>{item.label}</span>
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

          {/* Emergency Helplines in Drawer */}
          <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
            <span>Tourist Helpline: <strong className="text-white">1363</strong></span>
            <span>Emergency: <strong className="text-rose-400">112</strong></span>
          </div>
        </div>
      )}
    </header>
  );
};
