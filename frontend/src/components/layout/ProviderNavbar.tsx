import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Tag, 
  Menu, 
  X, 
  UserCheck, 
  LogOut, 
  Sparkles, 
  Languages 
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import type { Language } from '../../lib/i18n';

export const ProviderNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    destinations,
    promotions,
    language,
    setLanguage
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const operatorSpots = destinations.filter(d => ['LON', 'MAT', 'BHA', 'KAS'].includes(d.id));

  const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { key: 'mr', label: 'Marathi', flag: '🚩' },
  ];

  const providerNavLinks = [
    { to: '/provider', label: 'Operator Console', icon: <Building2 className="w-4 h-4" /> },
    { to: '/provider/listings', label: 'Registered Properties', icon: <Building2 className="w-4 h-4" />, badge: `${operatorSpots.length}` },
  ];

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* 1. National Flag Accent Stripe */}
      <div className="tiranga-bar" />

      {/* 2. Official MTDC Partner Status Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 sm:px-6 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            MTDC ACCREDITED OPERATOR CONSOLE
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Maharashtra Tourism Development Corporation • Hospitality Registry
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Partner Identity Pill */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 shadow-sm text-xs">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {currentUser.name}
            </span>
            <span className="bg-emerald-950 text-emerald-300 text-[9px] font-extrabold px-1.5 rounded uppercase border border-emerald-700">
              Verified Partner
            </span>
          </div>

          {/* Sign Out / Exit to Portal Selector */}
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
        </div>
      </div>

      {/* 3. Main Brand Header */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/provider" className="flex items-center gap-3.5 group shrink-0">
            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 border border-slate-300 rounded-xl shadow-sm group-hover:border-gov-navy transition">
              <div className="w-9 h-9 flex items-center justify-center text-gov-navy font-serif font-black text-base border-2 border-gov-navy rounded-full bg-amber-50">
                🏨
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
                <span className="bg-amber-100 text-amber-950 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Operator Console
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Hospitality, Homestay & Tour Operator Management Console
              </p>
            </div>
          </Link>

          {/* Registration Badge */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Registry ID:</span>
            <strong className="font-mono text-slate-800">MTDC/WL/2026-HOTEL</strong>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gov-navy text-white hover:bg-gov-navy-light focus:outline-none"
              aria-label="Toggle Operator Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Deep Navy Primary Navigation Bar (Provider Only!) */}
      <nav className="bg-gov-navy text-white shadow-inner hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {providerNavLinks.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== '/provider' && location.pathname.startsWith(item.to));
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
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Operator Quick Stats */}
          <div className="flex items-center gap-3 py-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded border border-slate-700">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span><strong>{promotions.length}</strong> Active Vouchers</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-950/90 text-emerald-300 border border-emerald-700 px-3 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong>184</strong> Eco-Pass Guests</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Drawer (Provider Only!) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gov-navy border-b border-gov-navy-dark px-4 py-4 space-y-3 text-white animate-in slide-in-from-top duration-200">
          <div className="text-xs font-bold text-gov-gold uppercase tracking-wider pb-1 border-b border-slate-700 flex items-center justify-between">
            <span>Operator Navigation</span>
            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="text-xs text-rose-300 underline font-bold"
            >
              Sign Out
            </button>
          </div>

          <div className="space-y-1">
            {providerNavLinks.map((item) => (
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
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
