export type QuestionType = 
  | "mcq" 
  | "assertion-reason" 
  | "vsa" 
  | "sa" 
  | "la" 
  | "case-based" 
  | "source-based" 
  | "map-based";

export type DifficultyLevel = "easy" | "moderate" | "hard";

export type PaperType = 
  | "CBSE Board Examination" 
  | "CBSE Official Sample Paper" 
  | "Approved Administrator Past Paper";

export interface SourceQuestion {
  id: string;
  questionText: string;
  subjectId: string;
  subjectName: string;
  classLevel: string; // "Class 10"
  chapterId: string;
  chapterTitle: string;
  topic: string;
  marks: number;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  paperType: PaperType;
  year: string; // e.g. "2025", "2024", "2023", "2022", "2020"
  session: string; // e.g. "Annual Board Examination 2024", "SQP 2024-25"
  setCode?: string; // e.g. "Set 1 (30/1/1)", "Set 2 (30/2/1)", "Code 041"
  sourceTitle: string; // e.g. "CBSE Class 10 Mathematics Standard Board Exam 2024"
  sourceUrl: string; // Official link / doc reference
  pageNumber?: string | number;
  originalQuestionNumber: string; // e.g. "Q14"
  options?: string[]; // For MCQ & Assertion-Reason
  correctOptionIndex?: number;
  officialSolution?: string; // Official marking scheme / solution
  solutionAvailable: boolean;
  casePassage?: string; // Verbatim text for case-based / competency questions
  diagramDescription?: string; // Description or ASCII/data of original diagram
  isApprovedSource: boolean; // Must be true to be eligible
  sourceDateAdded?: string;
}

export interface PaperSection {
  sectionKey: "A" | "B" | "C" | "D" | "E" | "F";
  sectionTitle: string;
  marksPerQuestion: number;
  instructions: string;
  questions: SourceQuestion[];
  totalSectionMarks: number;
}

export interface VerificationReport {
  isValid: boolean;
  totalMarksRequested: number;
  totalMarksGenerated: number;
  totalMarksMatches: boolean;
  zeroGeneratedQuestions: boolean;
  allSourcesValid: boolean;
  noDuplicateIds: boolean;
  allChaptersMatch: boolean;
  unverifiedCount: number;
  questionCount: number;
  auditLog: string[];
}

export interface GeneratedPaper {
  id: string;
  title: string;
  subjectIds: string[];
  subjectNames: string[];
  subjectCode: string;
  classLevel: string;
  totalMarks: number;
  requestedMarks: number;
  isPartial: boolean;
  timeAllowed: string;
  generalInstructions: string[];
  sections: PaperSection[];
  allQuestions: SourceQuestion[];
  selectedChapterIds: string[];
  selectedChapterTitles: string[];
  difficulty: "easy" | "moderate" | "hard" | "mixed";
  createdAt: string;
  verificationReport: VerificationReport;
}

export interface PaperFilterConfig {
  subjectIds: string[];
  totalMarks: number;
  allowPartial: boolean;
  chapterIds: string[];
  questionTypes: QuestionType[];
  difficulty: "easy" | "moderate" | "hard" | "mixed";
  distributionMode: "standard_cbse" | "adaptive" | "custom";
  customDistribution?: Partial<Record<QuestionType, number>>;
  onlyBoardExams?: boolean;
}
