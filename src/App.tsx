import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Pages
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { WritingPage } from './pages/WritingPage';
import { EmailPage } from './pages/EmailPage';
import { CVPage } from './pages/CVPage';
import { TranslationPage } from './pages/TranslationPage';
import { RewritePage } from './pages/RewritePage';
import { SummarizePage } from './pages/SummarizePage';
import { StudyPage } from './pages/StudyPage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { PromptsPage } from './pages/PromptsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeRoute, isSidebarOpen, setIsSidebarOpen } = useApp();

  const renderPage = () => {
    switch (activeRoute) {
      case '/':
        return <HomePage />;
      case '/chat':
        return <ChatPage />;
      case '/writing':
        return <WritingPage />;
      case '/writing/email':
        return <EmailPage />;
      case '/writing/cv':
        return <CVPage />;
      case '/translation':
        return <TranslationPage />;
      case '/rewrite':
        return <RewritePage />;
      case '/summarize':
        return <SummarizePage />;
      case '/study':
        return <StudyPage />;
      case '/social':
        return <SocialMediaPage />;
      case '/prompts':
        return <PromptsPage />;
      case '/favorites':
        return <FavoritesPage />;
      case '/history':
        return <HistoryPage />;
      case '/settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Backdrop overlay for mobile drawer */}
        {isSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
