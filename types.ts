
export enum QuestionType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  // MULTIPLE_CHOICE = 'multiple-choice', // Example for future extension
}

export interface Question {
  id: string; // e.g., "1.1.a"
  text: string;
  type: QuestionType;
  // options?: string[]; // For multiple choice
  helpText?: string;
  placeholder?: string;
  aiPromptTemplate?: (userAnswer?: string) => string; // Generates prompt for AI drafting
  searchQueryTemplate?: (userAnswer?: string) => string; // Generates query for web search
}

export interface DocumentDefinition {
  id: string; // e.g., "L1-MAN-001"
  title: string; // e.g., "Quality Manual"
  revision: string; // e.g., "Rev 0"
  // Function to compile document content from answers and AI suggestions
  compileContent: (context: QmsContextType) => string;
}

export interface Section {
  id: string; // e.g., "s1"
  title: string;
  description: string;
  questions: Question[];
  generatesDocuments?: DocumentDefinition[]; // Documents primarily built from this section
}

export type UserAnswer = string;
export interface AISuggestion {
  text: string;
  sources?: Array<{ web?: { uri?: string; title?: string } }>;
}

export interface QmsDataContextState {
  answers: Record<string, UserAnswer>; // question.id -> answer
  aiSuggestions: Record<string, AISuggestion>; // question.id (or other unique key) -> suggestion
  isLoading: Record<string, boolean>; // loading state for specific actions, e.g. questionId_ai

  // Company Information Placeholders
  companyName: string;
  companyAbbreviation: string;
  companyAddress: string;
  topManagementName: string;
  topManagementTitle: string;
  qmsRepresentativeName: string;
  qmsRepresentativeTitle: string;
  documentEffectiveDate: string;
}

export interface QmsContextType extends QmsDataContextState {
  updateAnswer: (questionId: string, answer: UserAnswer) => void;
  addAiSuggestion: (key: string, suggestion: AISuggestion) => void;
  setLoading: (key: string, isLoading: boolean) => void;
  getAnswer: (questionId: string) => UserAnswer | undefined;
  getAiSuggestion: (key: string) => AISuggestion | undefined;
  getIsLoading: (key: string) => boolean;

  // Updaters for Company Information
  updateCompanyName: (name: string) => void;
  updateCompanyAbbreviation: (abbr: string) => void;
  updateCompanyAddress: (address: string) => void;
  updateTopManagementName: (name: string) => void;
  updateTopManagementTitle: (title: string) => void;
  updateQmsRepresentativeName: (name: string) => void;
  updateQmsRepresentativeTitle: (title: string) => void;
  updateDocumentEffectiveDate: (date: string) => void;
}

export type ActiveView = 'dashboard' | 'section' | 'documents' | 'isoInfo' | 'companyInfo';
