export type Verdict = 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';

export interface NewsAnalysis {
  id: string;
  userId: string;
  newsText: string;
  confidenceScore: number;
  verdict: Verdict;
  explanation: string;
  pros: string[];
  cons: string[];
  sourceReliability?: {
    score: number;
    rating: string;
    description: string;
  };
  language?: string;
  timestamp: any; // Firestore Timestamp
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role?: 'admin' | 'user';
  createdAt: any; // Firestore Timestamp
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
