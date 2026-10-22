import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { ExperienceEducation } from './sections/ExperienceEducation';
import { Credentials } from './sections/Credentials';
import { Contact } from './sections/Contact';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

const MainContent: React.FC = () => {
  const { activeView, setActiveView } = usePortfolio();

  // Synchronize route with browser location (/admin, /admin/login, #admin)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isAdmin = path.startsWith('/admin') || hash.startsWith('#admin') || hash.startsWith('#/admin');

      if (isAdmin && activeView !== 'admin') {
        setActiveView('admin');
      } else if (!isAdmin && (path === '/' || path === '') && activeView === 'admin') {
        setActiveView('portfolio');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [activeView, setActiveView]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="flex-1">
        {activeView === 'portfolio' ? (
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <ExperienceEducation />
            <Credentials />
            <Contact />
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  );
};

export default App;
