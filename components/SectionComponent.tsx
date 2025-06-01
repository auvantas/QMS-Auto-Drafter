
import React from 'react';
import { Section } from '../types';
import QuestionComponent from './QuestionComponent';

interface SectionComponentProps {
  section: Section;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ section }) => {
  return (
    <div className="animate-fadeIn">
      <header className="mb-8 p-6 bg-gradient-to-r from-qms-primary to-blue-600 text-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">{section.title}</h2>
        <p className="mt-2 text-blue-100">{section.description}</p>
      </header>
      <div>
        {section.questions.map(question => (
          <QuestionComponent key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default SectionComponent;
    