
import React, { createContext, useState, useCallback, ReactNode, useContext } from 'react';
import { QmsDataContextState, QmsContextType, UserAnswer, AISuggestion } from '../types';

const initialQmsData: QmsDataContextState = {
  answers: {},
  aiSuggestions: {},
  isLoading: {},
  companyName: '',
  companyAbbreviation: '',
  companyAddress: '',
  topManagementName: '',
  topManagementTitle: '',
  qmsRepresentativeName: '',
  qmsRepresentativeTitle: '',
  documentEffectiveDate: 'To be determined', // Default value
};

export const QmsContext = createContext<QmsContextType | undefined>(undefined);

export const QmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [qmsData, setQmsData] = useState<QmsDataContextState>(initialQmsData);

  const updateAnswer = useCallback((questionId: string, answer: UserAnswer) => {
    setQmsData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const addAiSuggestion = useCallback((key: string, suggestion: AISuggestion) => {
    setQmsData(prev => ({
      ...prev,
      aiSuggestions: { ...prev.aiSuggestions, [key]: suggestion },
    }));
  }, []);

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setQmsData(prev => ({
      ...prev,
      isLoading: { ...prev.isLoading, [key]: isLoading },
    }));
  }, []);

  const getAnswer = useCallback((questionId: string): UserAnswer | undefined => {
    return qmsData.answers[questionId];
  }, [qmsData.answers]);

  const getAiSuggestion = useCallback((key: string): AISuggestion | undefined => {
    return qmsData.aiSuggestions[key];
  }, [qmsData.aiSuggestions]);
  
  const getIsLoading = useCallback((key: string): boolean => {
    return !!qmsData.isLoading[key];
  }, [qmsData.isLoading]);

  // Company Info Updaters
  const updateCompanyName = useCallback((name: string) => {
    setQmsData(prev => ({ ...prev, companyName: name }));
  }, []);
  const updateCompanyAbbreviation = useCallback((abbr: string) => {
    setQmsData(prev => ({ ...prev, companyAbbreviation: abbr }));
  }, []);
  const updateCompanyAddress = useCallback((address: string) => {
    setQmsData(prev => ({ ...prev, companyAddress: address }));
  }, []);
  const updateTopManagementName = useCallback((name: string) => {
    setQmsData(prev => ({ ...prev, topManagementName: name }));
  }, []);
  const updateTopManagementTitle = useCallback((title: string) => {
    setQmsData(prev => ({ ...prev, topManagementTitle: title }));
  }, []);
  const updateQmsRepresentativeName = useCallback((name: string) => {
    setQmsData(prev => ({ ...prev, qmsRepresentativeName: name }));
  }, []);
  const updateQmsRepresentativeTitle = useCallback((title: string) => {
    setQmsData(prev => ({ ...prev, qmsRepresentativeTitle: title }));
  }, []);
  const updateDocumentEffectiveDate = useCallback((date: string) => {
    setQmsData(prev => ({ ...prev, documentEffectiveDate: date }));
  }, []);


  return (
    <QmsContext.Provider value={{ 
        ...qmsData, 
        updateAnswer, 
        addAiSuggestion, 
        setLoading,
        getAnswer,
        getAiSuggestion,
        getIsLoading,
        updateCompanyName,
        updateCompanyAbbreviation,
        updateCompanyAddress,
        updateTopManagementName,
        updateTopManagementTitle,
        updateQmsRepresentativeName,
        updateQmsRepresentativeTitle,
        updateDocumentEffectiveDate,
    }}>
      {children}
    </QmsContext.Provider>
  );
};

export const useQms = (): QmsContextType => {
  const context = useContext(QmsContext);
  if (!context) {
    throw new Error('useQms must be used within a QmsProvider');
  }
  return context;
};
