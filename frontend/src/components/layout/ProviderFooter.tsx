import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const ProviderFooter: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useCorridorStore();

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t-4 border-amber-400 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-xl text-amber-300 font-serif">
                🏨
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  MTDC Accredited Tourism Operator & Homestay Network
                </h3>
                <p className="text-[11px] text-slate-400">
                  Maharashtra Tourism Development Corporation • Sustainable Hospitality Initiative
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
              Official commercial operator portal for authorized homestay hosts, adventure trek guides, and resort managers across the Western Ghats corridor. Report occupancy and publish verified off-peak discounts to support corridor decongestion.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-amber-400">
              Operator Tools
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <Link to="/provider" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>Operator Console</span>
                </Link>
              </li>
              <li>
                <Link to="/provider/listings" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>Registered Property Listings</span>
                </Link>
              </li>
              <li className="pt-1">
                <button
                  onClick={handleSignOut}
                  className="text-rose-400 hover:text-rose-300 hover:underline font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out of Operator Session</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-amber-400">
              Partner Identity
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>Partner: <strong className="text-white">{currentUser.name}</strong></li>
              <li>Registration: <strong className="text-amber-300 font-mono">MTDC/WL/2026-HOTEL</strong></li>
              <li>Tier: <span className="text-emerald-400 font-bold">Tier 1 Verified Operator</span></li>
              <li className="pt-1">
                <a href="https://mtdc.co.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>MTDC Official Website</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 Maharashtra Tourism Development Corporation (MTDC). Operator Console.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Partner Agreement</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Green Pass Redemption Rules</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
