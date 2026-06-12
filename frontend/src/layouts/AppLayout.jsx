import React, { useEffect } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const TITLES = {
  '/': 'URL Shortener — Shorten, Share, Track',
  '/dashboard': 'Dashboard — URL Shortener',
  '/auth': 'Sign in — URL Shortener',
};

const AppLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLES[pathname] || 'URL Shortener';
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-grow">

        <Outlet />
      <Analytics />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
