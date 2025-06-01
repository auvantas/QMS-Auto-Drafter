
import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuestionType, AISuggestion } from '../types';
import { useQms } from '../contexts/QmsContext';
import { geminiService } from '../services/geminiService';
import ModalComponent from './ModalComponent';
import SpinnerComponent from './SpinnerComponent';
import { STRATEGY_VS_PLAN_EXPLANATION } from '../constants';

interface QuestionComponentProps {
  question: Question;
}

// SVG Icons (Heroicons)
const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => ( // Wand/Magic icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25a4.5 4.5 0 00-3.09 3.09L12 20.25l.813-2.846a4.5 4.5 0 003.09-3.09L18.25 12zM12 2.25l.813 2.846a4.5 4.5 0 003.09 3.09L18.25 9l-2.846.813a4.5 4.5 0 00-3.09 3.09L12 15.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L5.25 9l2.846-.813a4.5 4.5 0 003.09-3.09L12 2.25z" />
  </svg>
);

const InformationCircleIconSolid: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
  </svg>
);


// Heuristic to check if the input is more like a plan than a strategy
const PLAN_INDICATIVE_VERBS = ['implement', 'develop', 'launch', 'create', 'initiate', 'roll out', 'build', 'execute', 'manage', 'conduct', 'perform', 'complete', 'deliver', 'set up', 'install', 'organize', 'undertake', 'pursue activities'];
const STRATEGY_INDICATIVE_KEYWORDS = ['strategy', 'strategic', 'vision', 'mission', 'advantage', 'differentiate', 'positioning', 'compete', 'market', 'growth', 'leadership', 'value proposition', 'core focus', 'long-term', 'overall direction'];

function checkIfLikelyPlan(text: string): boolean {
  if (!text || text.trim().length < 30) return false; // Too short to be a list of plans or a developed strategy

  const lowerText = text.toLowerCase();
  let planVerbCount = 0;
  PLAN_INDICATIVE_VERBS.forEach(verb => {
    if (lowerText.includes(verb)) {
      planVerbCount++;
    }
  });

  let strategyKeywordCount = 0;
  STRATEGY_INDICATIVE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      strategyKeywordCount++;
    }
  });
  
  // Simple heuristic: if more plan-like terms and very few strategy terms, or appears to be a list of actions.
  const looksLikeList = (lowerText.match(/[,;.]/g) || []).length >= 2 || (lowerText.match(/\b(and|then|also)\b/g) || []).length >=2;

  if (planVerbCount >= 2 && strategyKeywordCount <= 1) {
    if (looksLikeList || planVerbCount > strategyKeywordCount + 1) return true;
  }
  // If it's very verbose and primarily action-oriented without clear strategic framing
  if (lowerText.length > 150 && planVerbCount >=3 && strategyKeywordCount <=1) return true;


  return false;
}


const QuestionComponent: React.FC<QuestionComponentProps> = ({ question }) => {
  const { getAnswer, updateAnswer, addAiSuggestion, getIsLoading, setLoading } = useQms();
  const [modalContent, setModalContent] = useState<AISuggestion | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isPotentiallyPlan, setIsPotentiallyPlan] = useState(false);
  const [showPlanStrategyInfo, setShowPlanStrategyInfo] = useState(false);


  const answer = getAnswer(question.id) || '';
  const aiDraftKey = `${question.id}_ai_draft`;
  const aiSearchKey = `${question.id}_ai_search`;
  const aiRefineStrategyKey = `${question.id}_ai_refine_strategy`;

  useEffect(() => {
    if (question.id === '1.1.a') {
      setIsPotentiallyPlan(checkIfLikelyPlan(answer));
    }
  }, [answer, question.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateAnswer(question.id, e.target.value);
  };

  const handleDraftWithAI = async () => {
    if (!question.aiPromptTemplate) return;
    setLoading(aiDraftKey, true);
    const prompt = question.aiPromptTemplate(answer);
    const suggestion = await geminiService.draftContent(prompt);
    addAiSuggestion(aiDraftKey, suggestion);
    setModalContent(suggestion);
    setModalTitle(`AI Draft for: ${question.text.substring(0,30)}...`);
    setLoading(aiDraftKey, false);
  };
  
  const handleRefineToStrategy = async () => {
    if (question.id !== '1.1.a' || !answer) return;
    setLoading(aiRefineStrategyKey, true);
    const prompt = `The user provided the following as their organization's purpose and strategic direction:
"${answer}"

This input might be more of a list of plans or activities rather than a cohesive strategy.
A strategy defines how an organization will achieve a specific competitive outcome and be better than its competitors. It's an integrated set of choices, not just a list of tasks. A plan outlines steps, while a strategy explains *why* those actions lead to a competitive advantage.

Please help the user refine their input into a more strategic statement. Based on their provided text, suggest a concise strategic direction for their organization. Focus on identifying a potential competitive advantage, a core value proposition, or how the organization intends to 'win' or create unique value in its chosen domain. The output should be suitable for an organization's Quality Manual.`;
    
    const suggestion = await geminiService.draftContent(prompt);
    addAiSuggestion(aiRefineStrategyKey, suggestion); // Use a unique key for this suggestion
    setModalContent(suggestion);
    setModalTitle("AI Suggestion: Refining to Strategic Direction");
    setLoading(aiRefineStrategyKey, false);
  };

  const handleSearchWithAI = async () => {
    if (!question.searchQueryTemplate) return;
    setLoading(aiSearchKey, true);
    const query = question.searchQueryTemplate(answer || question.text); // Use answer or question text for query
    const result = await geminiService.searchWithGemini(query);
    addAiSuggestion(aiSearchKey, result);
    setModalContent(result);
    setModalTitle(`AI Search Results for: ${question.text.substring(0,30)}...`);
    setLoading(aiSearchKey, false);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalTitle('');
  };

  const renderInput = () => {
    switch (question.type) {
      case QuestionType.TEXTAREA:
        return (
          <textarea
            id={question.id}
            value={answer}
            onChange={handleInputChange}
            placeholder={question.placeholder || 'Your answer here...'}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-qms-primary focus:border-qms-primary sm:text-sm min-h-[100px]"
            aria-describedby={question.id + "-help"}
          />
        );
      case QuestionType.TEXT:
      default:
        return (
          <input
            type="text"
            id={question.id}
            value={answer}
            onChange={handleInputChange}
            placeholder={question.placeholder || 'Your answer here...'}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-qms-primary focus:border-qms-primary sm:text-sm"
            aria-describedby={question.id + "-help"}
          />
        );
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl mb-6 border border-gray-200">
      <label htmlFor={question.id} className="block text-lg font-semibold text-qms-text-primary">
        {question.text}
      </label>
      {question.helpText && (
        <p id={question.id + "-help"} className="mt-1 text-sm text-qms-text-secondary">{question.helpText}</p>
      )}
      {renderInput()}

      {question.id === '1.1.a' && isPotentiallyPlan && (
        <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
          <div className="flex items-center">
            <InformationCircleIconSolid className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-semibold">
              Your input might be more of a plan than a strategy. 
              <button 
                onClick={() => setShowPlanStrategyInfo(!showPlanStrategyInfo)} 
                className="ml-2 text-amber-600 hover:text-amber-800 underline font-medium"
              >
                {showPlanStrategyInfo ? "Hide" : "Learn why this distinction is important."}
              </button>
            </p>
          </div>
          {showPlanStrategyInfo && (
            <div className="mt-3 prose prose-sm max-w-none text-amber-700 bg-amber-100 p-3 rounded">
              <h4 className="font-semibold text-amber-800">Plan vs. Strategy Explained:</h4>
              <pre className="whitespace-pre-wrap font-sans text-xs">{STRATEGY_VS_PLAN_EXPLANATION}</pre>
            </div>
          )}
           <button
            onClick={handleRefineToStrategy}
            disabled={getIsLoading(aiRefineStrategyKey) || !answer}
            className="mt-3 flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-qms-accent hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-qms-accent transition duration-150 disabled:opacity-50"
          >
            {getIsLoading(aiRefineStrategyKey) ? <SpinnerComponent size="sm" /> : <SparklesIcon className="mr-1.5 h-4 w-4" />}
            Help AI Formulate Strategic Direction
          </button>
        </div>
      )}


      <div className="mt-4 flex flex-wrap gap-3 items-center">
        {question.aiPromptTemplate && (
          <button
            onClick={handleDraftWithAI}
            disabled={getIsLoading(aiDraftKey)}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-qms-accent hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-qms-accent transition duration-150 disabled:opacity-50"
          >
            {getIsLoading(aiDraftKey) ? <SpinnerComponent size="sm" /> : <LightBulbIcon className="mr-2" />}
            AI Draft Assist
          </button>
        )}
        {question.searchQueryTemplate && (
          <button
            onClick={handleSearchWithAI}
            disabled={getIsLoading(aiSearchKey)}
            className="flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-qms-text-primary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-qms-primary transition duration-150 disabled:opacity-50"
          >
            {getIsLoading(aiSearchKey) ? <SpinnerComponent size="sm" /> : <SearchIcon className="mr-2" />}
            AI Search Info
          </button>
        )}
      </div>

      <ModalComponent isOpen={!!modalContent} onClose={closeModal} title={modalTitle}>
        {modalContent && (
          <div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border max-h-[50vh] overflow-y-auto">
              {modalContent.text}
            </p>
            {modalContent.sources && modalContent.sources.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-md text-qms-text-primary">Sources:</h4>
                <ul className="list-disc list-inside mt-1 text-sm text-gray-600 max-h-48 overflow-y-auto">
                  {modalContent.sources.map((source, index) => (
                    source.web && source.web.uri && (
                       <li key={index} className="truncate">
                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-qms-primary hover:underline">
                          {source.web.title || source.web.uri}
                        </a>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4 text-right">
                 <button 
                    onClick={() => { 
                        if((modalTitle.startsWith("AI Draft") || modalTitle.includes("Strategic Direction")) && modalContent?.text) {
                            updateAnswer(question.id, modalContent.text);
                        }
                        closeModal(); 
                    }}
                    className="px-4 py-2 bg-qms-secondary text-white rounded-md hover:bg-emerald-600 transition duration-150 text-sm"
                >
                    {(modalTitle.startsWith("AI Draft") || modalTitle.includes("Strategic Direction")) ? "Use this Draft" : "Okay"}
                </button>
            </div>
          </div>
        )}
      </ModalComponent>
    </div>
  );
};

export default QuestionComponent;
