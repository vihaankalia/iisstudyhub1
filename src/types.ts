export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  createdAt: string;
  learningPace: "slow" | "medium" | "fast";
  weakAreas: string[];
  strengthAreas: string[];
  dailyStreak: number;
  lastQuizDate?: string;
  selectedSubjects: string[];
  diagnosticCompleted?: boolean;
}

export interface ChapterProgress {
  id: string;
  subjectId: string;
  chapterId: string;
  completed: boolean;
  quizAttempts: number;
  highScore: number;
  updatedAt: string;
}

export interface QuizAttemptLog {
  id: string;
  uid: string;
  subjectId: string;
  chapterId: string;
  type: "daily_quiz" | "timed_pyq";
  score: number;
  correctCount: number;
  totalCount: number;
  timeTaken: number; // in seconds
  date: string; // ISO date string
  weakTopicsIdentified: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
