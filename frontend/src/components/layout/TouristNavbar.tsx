import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Layers, 
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';
import { GlobalSearchBox } from '../common/GlobalSearchBox';

export const TouristNavbar: React.FC = () => {
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    advisories
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const criticalAdvisories = advisories.filter(a => a.active && (a.severity === 'critical' || a.severity === 'high'));

  const navLinks = [
    { to: '/tourist', label: 'Explore', icon: <MapPin className="w-4 h-4" /> },
    { to: '/discover', label: 'Discover', icon: <Compass className="w-4 h-4" /> },
    { to: '/plan/new', label: 'Trip Planner', icon: <Calendar className="w-4 h-4" /> },
    { to: '/trips', label: 'My Trips', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const handleSignOut = () => {
    logoutUser('tourist');
    setProfileDropdownOpen(false);
  };

  const isGuest = !currentUser.isAuthenticated || currentUser.id === 'CITIZEN-GUEST-01';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link to="/tourist" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition">
                  EcoRoute
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Corridor
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Western Ghats Sustainable Tourism
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to || (link.to !== '/tourist' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Center Search Pill for Wide Screens */}
          <div className="hidden lg:block flex-1 max-w-xs xl:max-w-sm">
            <GlobalSearchBox variant="nav" placeholder="Search destinations, passes..." />
          </div>

          {/* Right Action Area: User Session & Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Switch Dashboard Button */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200/70 transition"
              title="Switch to another portal"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Portals</span>
            </Link>

            {/* Profile Dropdown / Sign In */}
            {isGuest ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login?role=tourist"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/30 transition flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1 px-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Popup Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.designation || 'Traveler Account'}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active Session
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Profile & Preferences</span>
                      </Link>
                      <Link
                        to="/trips"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                        <span>My Green Passes</span>
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>Switch Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
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
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Advisory Banner (Only shown when active danger exists) */}
      {criticalAdvisories.length > 0 && (
        <div className="bg-amber-500/10 border-t border-b border-amber-500/30 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 max-w-4xl overflow-hidden truncate">
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Alert
            </span>
            <span className="font-medium truncate">
              {criticalAdvisories[0].title}: {criticalAdvisories[0].message}
            </span>
          </div>
          <Link
            to={`/spot/${criticalAdvisories[0].destinationId === 'ALL' ? 'LON' : criticalAdvisories[0].destinationId}`}
            className="text-amber-800 font-bold hover:underline shrink-0 text-xs"
          >
            Check status →
          </Link>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in slide-in-from-top duration-150 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-slate-600 flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Switch Portal</span>
            </Link>

            {isGuest ? (
              <Link
                to="/login?role=tourist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-emerald-600"
              >
                Sign In →
              </Link>
            ) : (
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="text-xs font-bold text-rose-600"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
