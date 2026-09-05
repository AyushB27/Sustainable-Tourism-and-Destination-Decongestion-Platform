import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthorityNavbar } from './AuthorityNavbar';
import { AuthorityFooter } from './AuthorityFooter';

export const AuthorityLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gov-light flex flex-col font-sans text-slate-900 gov-pattern">
      {/* Isolated District GIS Authority Nav */}
      <AuthorityNavbar />

      {/* Main Outlet for Authority Pages */}
      <main className="flex-1 pb-10">
        <Outlet />
      </main>

      {/* Isolated Authority Administrative Footer */}
      <AuthorityFooter />
    </div>
  );
};
