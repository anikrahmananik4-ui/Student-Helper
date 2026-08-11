import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppLanguage,
  ChatMode,
  Conversation,
  FavoriteItem,
  ThemeMode,
  UserPreferences,
} from '../types';

interface AppContextType {
  activeRoute: string;
  navigate: (route: string) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => string;
  removeFavorite: (id: string) => void;
  isFavorite: (content: string) => boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversationId: (id: string | null) => void;
  createNewChat: (mode?: ChatMode, initialMsg?: string) => Conversation;
  saveConversation: (conv: Conversation) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  clearAllLocalData: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  speakText: (text: string) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  name: '',
  language: 'bn',
  theme: 'system',
  fontSize: 'medium',
  preferredWritingStyle: 'Professional',
  autoTts: false,
  responseLanguage: 'Bengali',
  tone: 'Balanced',
  formality: 'Standard',
  customInstructions: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<string>('/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('banglamate_dark');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('banglamate_prefs');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Favorites
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('banglamate_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('banglamate_conversations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Check Onboarding
  useEffect(() => {
    const hasVisited = localStorage.getItem('banglamate_has_visited');
    if (!hasVisited) {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Theme handling
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('banglamate_dark', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const setIsDarkMode = (dark: boolean) => {
    setIsDarkModeState(dark);
    updatePreferences({ theme: dark ? 'dark' : 'light' });
  };

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('banglamate_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('banglamate_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem('banglamate_conversations', JSON.stringify(conversations));
  }, [conversations]);

  // Keyboard shortcut for Ctrl+K global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (route: string) => {
    setActiveRoute(route);
    setIsSidebarOpen(false); // Close mobile drawer on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updatePreferences = (newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  };

  const addFavorite = (item: Omit<FavoriteItem, 'id' | 'createdAt'>): string => {
    const newItem: FavoriteItem = {
      ...item,
      id: 'fav_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };
    setFavorites((prev) => [newItem, ...prev]);
    return newItem.id;
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const isFavorite = (content: string) => {
    return favorites.some((f) => f.content.trim() === content.trim());
  };

  const createNewChat = (mode: ChatMode = 'General', initialMsg?: string): Conversation => {
    const id = 'chat_' + Date.now();
    const newConv: Conversation = {
      id,
      title: initialMsg ? initialMsg.slice(0, 30) + (initialMsg.length > 30 ? '...' : '') : 'নতুন Chat',
      mode,
      messages: initialMsg
        ? [
            {
              id: 'msg_1',
              role: 'user',
              content: initialMsg,
              timestamp: new Date().toLocaleTimeString('bn-BD', {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConversationId(id);
    return newConv;
  };

  const saveConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...conv, updatedAt: new Date().toISOString() };
        return updated;
      }
      return [conv, ...prev];
    });
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const clearAllLocalData = () => {
    localStorage.removeItem('banglamate_prefs');
    localStorage.removeItem('banglamate_favorites');
    localStorage.removeItem('banglamate_conversations');
    localStorage.removeItem('banglamate_has_visited');
    localStorage.removeItem('banglamate_dark');
    setFavorites([]);
    setConversations([]);
    setPreferences(DEFAULT_PREFERENCES);
    setCurrentConversationId(null);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে ভয়েস স্পিচ সাপোর্ট নেই।');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferences.language === 'en' ? 'en-US' : 'bn-BD';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppContext.Provider
      value={{
        activeRoute,
        navigate,
        preferences,
        updatePreferences,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        conversations,
        currentConversationId,
        setCurrentConversationId,
        createNewChat,
        saveConversation,
        deleteConversation,
        renameConversation,
        clearAllLocalData,
        isSearchOpen,
        setIsSearchOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        isDarkMode,
        setIsDarkMode,
        speakText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
