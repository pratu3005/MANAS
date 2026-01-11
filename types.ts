
export type MoodType = 'excellent' | 'good' | 'neutral' | 'fair' | 'poor';

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: MoodType;
  stressLevel: number; // From PDF Data Dictionary 3.2
  note: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  preferences?: {
    theme: 'light' | 'dark';
  };
}

export interface DailyQuote {
  text: string;
  author: string;
  date: string;
}
