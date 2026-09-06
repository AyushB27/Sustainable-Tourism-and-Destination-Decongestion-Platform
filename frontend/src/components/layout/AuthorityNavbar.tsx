import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  FileText, 
  Calculator, 
  Award, 
  LogOut, 
  RefreshCw, 
  CheckCircle2, 
  WifiOff, 
  Menu, 
  X, 
  ChevronDown,
  Radio
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { calculateCorridorMetrics } from '../../lib/engine';

export const AuthorityNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    destinations,
    advisories,
    liveBackendStatus,
    fetchLiveBackendFeed
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeAdvisoriesCount = advisories.filter(a => a.active).length;
  const metrics = calculateCorridorMetrics(destinations, activeAdvisoriesCount);

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/authority" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-gov-navy flex items-center justify-center text-amber-300 shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform duration-200">
              <Radio className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-gov-navy transition">
                  EcoRoute
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  Govt HQ
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                District Operations & Incident Command
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Uniform Capsule Track) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-300 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || (link.to !== '/authority' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gov-navy text-white shadow-sm ring-2 ring-gov-navy/20'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                  }`}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400 text-gov-navy' : 'bg-rose-500 text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live Pipeline Indicator */}
            <button
              onClick={fetchLiveBackendFeed}
              title="Sync live telemetry pipeline"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                liveBackendStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : liveBackendStatus === 'syncing'
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {liveBackendStatus === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              ) : liveBackendStatus === 'connected' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{liveBackendStatus === 'connected' ? 'Live Telemetry' : liveBackendStatus === 'syncing' ? 'Syncing...' : 'Sim Feed'}</span>
            </button>


            {/* Officer Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center border border-amber-300">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[130px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.designation || 'District Operations'}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-emerald-700 font-bold">Active Officer Session</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold text-left transition"
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
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Corridor Critical Alert Ticker */}
      {metrics.criticalCount > 0 && (
        <div className="bg-rose-50 border-t border-rose-200 px-4 py-1.5 text-xs text-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-rose-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
              Alert
            </span>
            <span className="truncate font-medium">
              {metrics.criticalCount} red-zone bottleneck hub{metrics.criticalCount > 1 ? 's' : ''} detected. Inflow throttles and deflection advisories available.
            </span>
          </div>
          <span className="text-slate-600 text-[11px] hidden sm:inline font-mono">
            Active Corridor Inflow: <strong className="text-rose-700">{metrics.totalInflow.toLocaleString()}</strong>
          </span>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-150 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
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

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="text-xs font-bold text-rose-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AuthorityNavbar;
