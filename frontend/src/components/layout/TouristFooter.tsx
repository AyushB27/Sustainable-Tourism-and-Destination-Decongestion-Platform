import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Layers } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const TouristFooter: React.FC = () => {
  const navigate = useNavigate();
  const { logoutUser } = useCorridorStore();

  const handleExitPortal = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <footer className="bg-gov-navy text-slate-300 text-xs border-t-4 border-gov-gold pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/80">
          {/* Column 1: Ministry Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-gov-gold flex items-center justify-center text-xl text-gov-navy font-serif">
                🏛️
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  EcoRoute Bharat — Sustainable Tourism & Smart Travel Portal
                </h3>
                <p className="text-[11px] text-slate-400">
                  Ministry of Tourism, Govt. of India • Western Ghats & Maharashtra Corridor
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
              An AI-driven carrying capacity and tourist diffusion initiative deployed across the Western Ghats & Maharashtra Corridor in partnership with Maharashtra Tourism Development Corporation (MTDC) & District Disaster Management Authorities.
            </p>
          </div>

          {/* Column 2: Citizen & Tourist Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
              Traveler Navigation
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <Link to="/tourist" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Portal Home</span>
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Algorithmic Discover Feed</span>
                </Link>
              </li>
              <li>
                <Link to="/plan/new" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Smart Trip Planner & Green Pass</span>
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>My Saved Itineraries</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white hover:underline flex items-center gap-1">
                  <span>Traveler Preferences</span>
                </Link>
              </li>
              <li className="pt-1">
                <button
                  onClick={handleExitPortal}
                  className="text-amber-300 hover:text-white hover:underline font-bold flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>Switch Stakeholder Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Helplines & Compliance */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
              Helpline & Support
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>National Tourist Helpline: <strong className="text-white">1363 (24x7 Toll Free)</strong></li>
              <li>National Emergency Response: <strong className="text-rose-400">112</strong></li>
              <li>Right to Information (RTI) Disclosures</li>
              <li>CPGRAMS Citizen Grievance Portal</li>
              <li>
                <a href="https://tourism.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 pt-1">
                  <span>tourism.gov.in</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & NIC Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            <p>
              © 2026 Ministry of Tourism, Government of India. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Designed & Developed under SIH26204 • Hosted by National Informatics Centre (NIC) Node.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Website Policy</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Terms & Conditions</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Web Information Manager</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
