import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ExternalLink } from 'lucide-react';
import { useCorridorStore } from '../../store/useCorridorStore';

export const AuthorityFooter: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useCorridorStore();

  const handleSignOut = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t-4 border-gov-gold pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Column 1: District Command Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-gov-gold flex items-center justify-center text-xl text-amber-300 font-serif">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  District GIS Emergency Command & Carrying Capacity Cell
                </h3>
                <p className="text-[11px] text-slate-400">
                  Western Ghats Multi-District Disaster & Tourism Coordination Node
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-lg">
              Statutory administrative operations console for District Collectors, Magistrates, and Police Superintendents across Pune, Raigad, and Satara. All capacity overrides and gazette broadcasts are cryptographically logged under SIH26204 audit regulations.
            </p>
          </div>

          {/* Column 2: Administrative Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
              Command Modules
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>
                <Link to="/authority" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>GIS Incident Command Map</span>
                </Link>
              </li>
              <li>
                <Link to="/authority/advisories" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>Gazette Advisory Management</span>
                </Link>
              </li>
              <li>
                <Link to="/authority/policy-simulator" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>Predictive Policy Simulator</span>
                </Link>
              </li>
              <li>
                <Link to="/authority/impact" className="hover:text-amber-300 hover:underline flex items-center gap-1">
                  <span>Post-Incident Impact Review</span>
                </Link>
              </li>
              <li className="pt-1">
                <button
                  onClick={handleSignOut}
                  className="text-rose-400 hover:text-rose-300 hover:underline font-bold flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out of Officer Session</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Officer Credentials */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-gov-gold">
              Session Credentials
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-300">
              <li>Officer: <strong className="text-white">{currentUser.name}</strong></li>
              <li>Jurisdiction: <strong className="text-amber-300">{currentUser.jurisdiction?.value || 'State-wide'}</strong></li>
              <li>Designation: {currentUser.designation || 'District Administrative Officer'}</li>
              <li>Status: <span className="text-emerald-400 font-bold">● Active Authenticated Session</span></li>
              <li className="pt-1">
                <a href="https://tourism.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                  <span>Ministry of Tourism Portal</span> <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Security Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            <p>
              © 2026 Ministry of Tourism & Government of Maharashtra. Restricted Official Access.
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Deployed under Smart India Hackathon SIH26204 • Hosted on NIC Government Secure Node.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">Administrative Guidelines</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Security Audit</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Data Governance Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
