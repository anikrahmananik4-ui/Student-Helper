import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from '../common/Footer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { OnboardingModal } from '../common/OnboardingModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <div className="flex flex-1 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <Header onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>

          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenMore={() => setMobileSidebarOpen(true)} />

      {/* Global Modals */}
      <GlobalSearchModal />
      <OnboardingModal />
    </div>
  );
};
