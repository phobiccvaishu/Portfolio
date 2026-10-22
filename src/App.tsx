import React from 'react';
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
  const { activeView } = usePortfolio();

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
