
import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  score: number;
  isMentor?: boolean;
}

export interface Answer {
  id: string;
  author: User;
  content: string;
  createdAt: Date | Timestamp;
  isAiSuggestion?: boolean;
  score: number;
  votes: { [key: string]: 'up' | 'down' };
}

export interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  createdAt: Date | Timestamp;
  answers?: Answer[];
  score: number;
  votes: { [key: string]: 'up' | 'down' };
  views: number;
  imageUrl?: string;
}

// Types for writing to Firestore, omitting generated fields
export type QuestionWrite = Omit<Question, 'id' | 'createdAt' | 'answers' | 'score' | 'votes' | 'views'>;
export type AnswerWrite = Omit<Answer, 'id' | 'createdAt' | 'isAiSuggestion' | 'score' | 'votes'>;

export interface AnalyticsData {
  totalQuestions: number;
  totalAnswers: number;
  totalUsers: number;
  totalAiAnswers: number;
  tagCounts: { [key:string]: number };
}
