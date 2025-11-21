export interface CardData {
  title: string;
  content: string;
  tags: string[];
  author: string;
  date: string;
  moodColor: string;
  summary?: string;
}

export interface GeminiResponse {
  title: string;
  refinedContent: string;
  tags: string[];
  moodColor: string;
  authorSuggestion: string;
}

export enum ThemeType {
  MINIMAL = 'minimal',
  DARK = 'dark',
  GRADIENT = 'gradient',
  PAPER = 'paper',
  ELEGANT = 'elegant',
  SUNSET = 'sunset',
  OCEAN = 'ocean',
  BERRY = 'berry'
}

export type Language = 'en' | 'zh';

export const THEMES = [
  { id: ThemeType.MINIMAL, name: 'Minimal White', color: '#ffffff' },
  { id: ThemeType.DARK, name: 'Midnight Dark', color: '#1e293b' },
  { id: ThemeType.PAPER, name: 'Classic Paper', color: '#fdfbf7' },
  { id: ThemeType.GRADIENT, name: 'Soft Aurora', color: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { id: ThemeType.ELEGANT, name: 'Forest Green', color: '#143d28' },
  { id: ThemeType.OCEAN, name: 'Deep Ocean', color: '#0f172a' },
  { id: ThemeType.SUNSET, name: 'Warm Sunset', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: ThemeType.BERRY, name: 'Berry Tart', color: '#4a0404' },
];