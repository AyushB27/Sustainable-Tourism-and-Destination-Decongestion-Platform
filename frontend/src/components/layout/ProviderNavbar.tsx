import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Tag, 
  Menu, 
  X, 
  LogOut, 
  Sparkles, 
  ChevronDown
} from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const ProviderNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logoutUser,
    destinations,
    promotions
  } = useCorridorStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const operatorSpots = destinations.filter(d => ['LON', 'MAT', 'BHA', 'KAS'].includes(d.id));

  const navLinks = [
    { to: '/provider', label: 'Dashboard', icon: <Building2 className="w-4 h-4" /> },
    { to: '/provider/listings', label: 'Properties & Rooms', icon: <Building2 className="w-4 h-4" />, badge: `${operatorSpots.length}` },
  ];

  const handleSignOut = () => {
    logoutUser('provider');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/provider" className="flex items-center gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-sky-950/40 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-tight">
                  <span className="font-black text-lg tracking-tight text-white group-hover:text-sky-300 transition">
                    EcoRoute
                  </span>
                  <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    Partners
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Hospitality & Merchant Hub
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || (link.to !== '/provider' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-sky-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Tools: Metrics & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 text-slate-300">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>{promotions.length}</strong> Active Vouchers</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-xl">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>184</strong> Eco-Pass Guests</span>
              </div>
            </div>

            {/* Partner Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-750 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 font-black text-xs flex items-center justify-center border border-sky-500/40">
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
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.designation || 'Hospitality Host'}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-bold">Verified Partner Session</span>
                    </div>
                  </div>

                  <div className="pt-1">
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
              className="sm:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-150 shadow-xl">
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
                  <span className="bg-sky-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
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
