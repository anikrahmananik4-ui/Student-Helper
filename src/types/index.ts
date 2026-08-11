export type ThemeMode = 'light' | 'dark' | 'system';
export type AppLanguage = 'bn' | 'en';

export type ChatMode =
  | 'General'
  | 'Study'
  | 'Writing'
  | 'Coding'
  | 'Business'
  | 'Creative'
  | 'Professional';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  mode: ChatMode;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteItem {
  id: string;
  title: string;
  category: 'Writing' | 'Translation' | 'Chat' | 'Prompts' | 'Study';
  content: string;
  createdAt: string;
  timestamp?: string;
}

export interface UserPreferences {
  name: string;
  language: AppLanguage;
  theme: ThemeMode;
  fontSize: 'small' | 'medium' | 'large';
  preferredWritingStyle: string;
  autoTts: boolean;
  responseLanguage?: string;
  tone?: string;
  formality?: string;
  customInstructions?: string;
}

export interface QuickTool {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  iconName: string;
  route: string;
  category: string;
  badge?: string;
}

export interface WritingCategory {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  iconName: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AdminStats {
  totalRequests: number;
  chatRequests: number;
  writingRequests: number;
  translationRequests: number;
  studyRequests: number;
  documentRequests: number;
  errorCount: number;
}
