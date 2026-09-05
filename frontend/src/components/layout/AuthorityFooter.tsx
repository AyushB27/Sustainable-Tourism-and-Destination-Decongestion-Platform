import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Radio } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const AuthorityFooter: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useCorridorStore();

  const handleSignOut = () => {
    logoutUser('authority');
    navigate('/');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800/80">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  EcoRoute Operations & Telemetry Command
                </h3>
                <p className="text-[11px] text-slate-400">
                  Western Ghats Multi-Destination Decongestion Network
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
              Authorized operations console for corridor traffic dispatchers and district disaster response coordinators. Capacity throttles, emergency rerouting algorithms, and advisory broadcasts are live.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-amber-400">
              Operations Tools
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/authority" className="hover:text-amber-300 transition">GIS Command Center</Link></li>
              <li><Link to="/authority/advisories" className="hover:text-amber-300 transition">Advisory Dispatcher</Link></li>
              <li><Link to="/authority/policy-simulator" className="hover:text-amber-300 transition">Policy Simulator</Link></li>
              <li><Link to="/authority/impact" className="hover:text-amber-300 transition">Impact Review</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-amber-400">
              Active Session
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Officer: <strong className="text-white">{currentUser.name}</strong></li>
              <li>Desk: {currentUser.department || 'District Operations'}</li>
              <li className="text-emerald-400 font-semibold">● Session Active</li>
              <li className="pt-2">
                <button
                  onClick={handleSignOut}
                  className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out of Desk</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EcoRoute Network. Authorized Operations Desk.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Telemetry Audit Log</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">API Metrics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
