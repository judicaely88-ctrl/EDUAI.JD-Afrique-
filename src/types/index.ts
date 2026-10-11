export type SchoolLevel = "Primaire" | "Collège" | "Lycée" | "Supérieur";

export interface AfricanCountry {
  id: string;
  name: string;
  flagEmoji: string;
  code: string;
  capital: string;
  languages: string[];
  educationSystem: string;
  schoolLevels: SchoolLevel[];
  mainExams: string[];
  subjects: string[];
  availableYears: number[];
  verifiedCount: number;
}

export type SubjectCategory =
  | "Mathématiques"
  | "Physique-Chimie"
  | "Sciences de la Vie et de la Terre"
  | "Français"
  | "Philosophie"
  | "Histoire-Géographie"
  | "Anglais"
  | "Informatique"
  | "Économie";

export type ExamStatus = "VERIFIE_OFFICIEL" | "CORRIGE_PEDAGOGIQUE" | "EN_NUMERISATION";

export interface ExamItem {
  id: string;
  title: string;
  countryId: string;
  countryName: string;
  level: SchoolLevel;
  examType: string; // CEPE, BEPC, Baccalauréat Série C, Baccalauréat Série D, etc.
  year: number;
  subject: SubjectCategory;
  statement: string; // Énoncé complet
  hasSolution: boolean;
  status: ExamStatus;
  source: string;
  solution?: ExamSolution;
}

export interface SolutionStep {
  stepNumber: number;
  title: string;
  content: string;
  formulas?: string[];
  calculationLines?: string[];
  resultHighlight?: string;
}

export interface ExamSolution {
  understoodProblem: string;
  givenData: string[];
  toFind: string;
  methodology: string;
  steps: SolutionStep[];
  finalResult: string;
  verification: string;
  commonPitfalls: string[]; // Erreurs fréquentes à éviter
  pedagogicalNote?: string;
}

export interface CourseSheet {
  id: string;
  title: string;
  subject: SubjectCategory;
  level: SchoolLevel;
  countryId?: string;
  chapter: string;
  objectives: string[];
  definitions: { term: string; definition: string }[];
  keyFormulas: { name: string; formula: string; note?: string }[];
  examples: { title: string; problem: string; resolution: string }[];
  commonMistakes: string[];
  summary: string;
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  subject: SubjectCategory;
  level: SchoolLevel;
  question: string;
  mathExpression?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Facile" | "Intermédiaire" | "Difficile" | "Niveau examen";
}

export interface QuizResult {
  quizTitle: string;
  subject: SubjectCategory;
  level: SchoolLevel;
  totalQuestions: number;
  score: number;
  percentage: number;
  date: string;
  userAnswers: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface GeneratedExercise {
  id: string;
  subject: SubjectCategory;
  level: SchoolLevel;
  chapter: string;
  difficulty: "Facile" | "Intermédiaire" | "Difficile" | "Niveau examen";
  statement: string;
  hint: string;
  solution: ExamSolution;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "eduai";
  text: string;
  timestamp: string;
  structuredSolution?: ExamSolution;
  isAiGenerated?: boolean;
  isOfflineFallback?: boolean;
}

export interface RecentItem {
  id: string;
  type: "exam" | "course" | "quiz" | "chat";
  title: string;
  subtitle: string;
  date: string;
  linkTab: string;
  itemId?: string;
}
