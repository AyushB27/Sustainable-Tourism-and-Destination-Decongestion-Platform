import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProviderNavbar } from './ProviderNavbar';
import { ProviderFooter } from './ProviderFooter';

export const ProviderLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gov-light flex flex-col font-sans text-slate-900 gov-pattern">
      {/* Isolated Provider Nav */}
      <ProviderNavbar />

      {/* Main Outlet for Provider Pages */}
      <main className="flex-1 pb-10">
        <Outlet />
      </main>

      {/* Isolated Provider Footer */}
      <ProviderFooter />
    </div>
  );
};
