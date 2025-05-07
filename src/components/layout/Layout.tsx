import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 pb-16 md:pb-0 px-4 max-w-5xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;