import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { RoleBanner } from './RoleBanner';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <RoleBanner />
      <Navbar />

      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};
