import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Calendar, Briefcase, User } from 'lucide-react';
import { TouristNavbar } from './TouristNavbar';
import { TouristFooter } from './TouristFooter';
import { AiHelplineBot } from '../common/AiHelplineBot';

export const TouristLayout: React.FC = () => {
  const location = useLocation();

  const mobileBottomLinks = [
    { to: '/tourist', label: 'Home', icon: <Compass className="w-4 h-4 mb-0.5" /> },
    { to: '/discover', label: 'Discover', icon: <Sparkles className="w-4 h-4 mb-0.5" /> },
    { to: '/plan/new', label: 'Plan', icon: <Calendar className="w-4 h-4 mb-0.5" /> },
    { to: '/trips', label: 'My Trips', icon: <Briefcase className="w-4 h-4 mb-0.5" /> },
    { to: '/account', label: 'Profile', icon: <User className="w-4 h-4 mb-0.5" /> },
  ];

  return (
    <div className="min-h-screen bg-gov-light flex flex-col font-sans text-slate-900 gov-pattern">
      {/* Isolated Tourist Top Nav */}
      <TouristNavbar />

      {/* 24x7 AI Tourism Helpline Widget */}
      <AiHelplineBot />

      {/* Main Outlet for Tourist Pages */}
      <main className="flex-1 pb-16 lg:pb-10">
        <Outlet />
      </main>

      {/* Isolated Tourist Footer */}
      <TouristFooter />

      {/* Mobile Bottom Navigation (Tourist-Only!) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gov-navy border-t border-slate-700 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {mobileBottomLinks.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/tourist' && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-bold transition ${
                isActive ? 'text-amber-300 bg-slate-800' : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
