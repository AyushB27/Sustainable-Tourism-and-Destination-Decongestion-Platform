import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';

export const TouristFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-black text-white text-base tracking-tight">
                EcoRoute
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Intelligent destination decongestion, carrying capacity telemetry, and eco-rewards across the Western Ghats corridor.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Explore Corridor
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/tourist" className="hover:text-emerald-400 transition">Corridor Live Map</Link></li>
              <li><Link to="/discover" className="hover:text-emerald-400 transition">Algorithmic Discover Feed</Link></li>
              <li><Link to="/plan/new" className="hover:text-emerald-400 transition">Smart Trip Planner</Link></li>
              <li><Link to="/trips" className="hover:text-emerald-400 transition">My Saved Trips & Passes</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Key Destinations
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link to="/spot/LON" className="hover:text-emerald-400 transition">Lonavala & Khandala</Link></li>
              <li><Link to="/spot/MAT" className="hover:text-emerald-400 transition">Matheran Eco-Zone</Link></li>
              <li><Link to="/spot/ALB" className="hover:text-emerald-400 transition">Alibaug Coastal Hub</Link></li>
              <li><Link to="/spot/BHA" className="hover:text-emerald-400 transition">Bhandardara Serene</Link></li>
              <li><Link to="/spot/MAH" className="hover:text-emerald-400 transition">Mahabaleshwar Plateau</Link></li>
            </ul>
          </div>

          {/* Sustainable Travel */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Eco-Mobility
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Green Pass Rewards</span>
              </li>
              <li>Dynamic Rerouting Off-Peak</li>
              <li>Live Capacity & Wait Intelligence</li>
              <li className="text-slate-500 pt-1">Corridor Emergency: <strong className="text-slate-300">112</strong></li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 EcoRoute Network. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Sensor API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
