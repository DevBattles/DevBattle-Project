import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
