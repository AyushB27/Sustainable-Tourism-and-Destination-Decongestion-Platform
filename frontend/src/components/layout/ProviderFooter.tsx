import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Building2 } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const ProviderFooter: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useCorridorStore();

  const handleSignOut = () => {
    logoutUser('provider');
    navigate('/');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  EcoRoute Partner & Hospitality Hub
                </h3>
                <p className="text-[11px] text-slate-400">
                  Sustainable Accommodations, Homestays & Activity Operators
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
              Manage live inventory, dynamic occupancy throttles, and off-peak green pass voucher redemptions across the Western Ghats corridor.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-sky-400">
              Partner Tools
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/provider" className="hover:text-sky-300 transition">Operator Console</Link></li>
              <li><Link to="/provider/listings" className="hover:text-sky-300 transition">Property & Room Inventory</Link></li>
              <li className="pt-2">
                <button
                  onClick={handleSignOut}
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out of Partner Hub</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-sky-400">
              Active Session
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Partner: <strong className="text-white">{currentUser.name}</strong></li>
              <li>Partner ID: <strong className="text-sky-300 font-mono">ECO-PARTNER-2026</strong></li>
              <li className="text-emerald-400 font-semibold">● Verified Partner Session</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EcoRoute Network. Commercial Partner Program.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer">Partner Terms</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Voucher Settlement Guide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
