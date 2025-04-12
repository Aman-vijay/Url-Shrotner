import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">

        <Outlet />
      <Analytics />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
